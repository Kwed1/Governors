from datetime import timedelta, datetime
from logging import Logger
from typing import Optional
from uuid import UUID

from fastapi import HTTPException, Depends
from jose import jwt, JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from config.database import get_db
from config.logger import LoggerSetup
from entities.missions.friend import Friend
from entities.user_data.user_coin import UserData
from exceptions.custom_exception import CustomException
from identity.models.user import User
from config.configuration import oauth2_scheme, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from identity.services.token_service import TokenService
from schemas.identity.token_dto import TokenDto


app_logger = LoggerSetup.prepare()

class IdentityService:
    def __init__(self, db: AsyncSession = Depends(get_db),
                 token_service: TokenService = Depends()):
        self.db = db
        self.token_service = token_service

    async def authorized_user(self, token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: int = payload.get("user_id")
            username: str = payload.get("sub")
            if user_id is None or username is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
        user = await self._get_user_by_telegram_id_async(telegram_id=int(user_id))
        if user is None:
            raise credentials_exception
        return user.id

    async def get_user_id_async(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: int = payload.get("user_id")

            user = await self._get_user_by_telegram_id_async(user_id)
            return user.id
        except Exception as ex:
            print(ex.args)

    async def sing_in_async(self, username: str, user_id: int):
        user = await self._get_user_by_telegram_id_async(telegram_id=user_id)
        if not user:
            user = await self._create_user(user_id, username)
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.token_service.create_access_token(
            data={"sub": user.username, "user_id": user.telegram_id, "role": user.role}, expires_delta=access_token_expires
        )
        return TokenDto(token=access_token)

    async def _user_exist(self, telegram_id: int) -> bool:
        user = await self._get_user_by_telegram_id_async(telegram_id=telegram_id)
        return user is not None

    async def _create_user(self, telegram_id: int, username: str) -> User:
        async with self.db as session:
            try:
                role = 'user'
                user = User(telegram_id=telegram_id, username=username, role=role)
                session.add(user)
                await session.flush()
                await session.refresh(user)

                coin = 0
                user_friend = (
                    await self.db.execute(select(Friend).where(Friend.friend_id == telegram_id))).scalars().first()
                if user_friend is not None:
                    coin = user_friend.bonus

                user_data = UserData(user_id=user.id, coin=coin, last_visit=datetime.utcnow(),
                                 current_language="en", lvl=1, coin_per_hour=0)
                session.add(user_data)
                await session.flush()
                await session.refresh(user_data)

                await session.commit()
                await session.refresh(user)
                return user
            except Exception as ex:
                await session.rollback()
                app_logger.error(f"Error creating user: {ex}", exc_info=True)

        raise CustomException("Try to authorize later")

    async def _get_user_by_telegram_id_async(self, telegram_id: int):
        user = (await self.db.execute(select(User).filter(User.telegram_id == telegram_id))).scalar_one_or_none()
        return user


async def get_identity_service(db: AsyncSession = Depends(get_db),
                               token_service: TokenService = Depends()) -> IdentityService:
    return IdentityService(db=db, token_service=token_service)


async def authorized_user(token: str = Depends(oauth2_scheme),
                          service: IdentityService = Depends(get_identity_service)) -> bool:
    return await service.authorized_user(token)
