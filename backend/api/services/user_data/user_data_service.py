import datetime
from typing import Optional

from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy import UUID, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from config.database import get_db
from entities.missions.friend import Friend
from entities.user_data.user_coin import UserData, UserStatus
from exceptions.custom_exception import CustomException
from identity.models.user import User
from schemas.identity.user_data_dtp import UserDataDto

class Price(BaseModel):
    price: float
    discount: float
    name: str
    bonus: str

class LvlData(BaseModel):
    lvl: int
    locations: int
    reward: float
    claim: int
    open_at: Optional[int] = None

class UserDataService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db

    async def get_lvl_data(self):
        return [
            LvlData(lvl=1, reward=100, claim=3, locations=0),
            LvlData(lvl=2, reward=130, claim=3, locations=1, open_at=1),
            LvlData(lvl=3, reward=150, claim=4, locations=5, open_at=5),
            LvlData(lvl=4, reward=170, claim=4, locations=10, open_at=10),
            LvlData(lvl=5, reward=200, claim=5, locations=20, open_at=20),
            LvlData(lvl=6, reward=250, claim=6, locations=30, open_at=30),
            LvlData(lvl=7, reward=300, claim=6, locations=40, open_at=40),
            LvlData(lvl=8, reward=350, claim=7, locations=50, open_at=50),
            LvlData(lvl=9, reward=400, claim=8, locations=70, open_at=70),
            LvlData(lvl=10, reward=500, claim=10, locations=80, open_at=80),
        ]

    async def change_language(self, culture: str, user_id: UUID):
        user_data = (await self.db.execute(select(UserData).where(UserData.user_id == user_id))).scalar_one_or_none()
        if user_data is None:
            raise CustomException("Data not found")

        self._validate_language(culture=culture)
        user_data.current_language = culture
        await self.db.commit()
        await self.db.refresh(user_data)

    async def delete_account_async(self, user_id: UUID):
        user_data = (await self.db.execute(select(UserData).where(UserData.user_id == user_id))).scalar_one_or_none()
        if user_data is None:
            raise CustomException("Data not found")

        user = (await self.db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
        if user is None:
            raise CustomException("User not found")

        # time_now = datetime.datetime.utcnow()
        #
        # user.deleted = True
        # user.delete_date = time_now
        #
        # user_data.deleted = True
        # user_data.delete_date = time_now not in scope

        await self.db.delete(user_data)
        await self.db.delete(user)

        await self.db.commit()

    async def get_data_async(self, user_id: UUID):
        user = (await self.db.execute(
            select(User).where(User.id ==user_id).options(
                selectinload(User.data)
            )
        )).scalar_one_or_none()
        if user is None:
            raise CustomException("Data not found")

        time_now = datetime.datetime.utcnow()

        total_hour = (time_now - user.data.last_visit).total_seconds() / 3600
        last_checked_friends = ((time_now - user.data.last_checked_friends_reward).total_seconds() /
                                3600)

        if last_checked_friends > 24:
            await self._calculate_coin(user)
            user.data.last_checked_friends_reward = time_now

        if total_hour > 5:
            total_hour = 5
        user.data.coin += total_hour * user.data.coin_per_hour
        user.data.last_visit = time_now

        # if user.data.coin > 5000:
        #     user.lvl = 2
        # elif user.data.coin > 25000:
        #     user.lvl = 3
        # elif user.data.coin > 100000:
        #     user.lvl = 4
        # elif user.data.coin > 1000000:
        #     user.lvl = 5
        # elif user.data.coin > 2000000:
        #     user.lvl = 6
        # elif user.data.coin > 10000000:
        #     user.lvl = 7
        # elif user.data.coin > 50000000:
        #     user.lvl = 8

        schema = UserDataDto(lvl=user.data.lvl,
                           status=user.data.status,
                           diamonds=user.data.diamonds,
                           current_coin=float(user.data.coin),
                           coin_per_hour=user.data.coin_per_hour,
                           language=user.data.current_language)
        await self.db.commit()

        return schema

    async def _calculate_coin(self, user: User):
        friends = (await self.db.execute(
            select(Friend).where(Friend.user_id == user.telegram_id)
            )).scalars().all()

        for friend in friends:

            user = (await self.db.execute(
                select(User).where(User.telegram_id == friend.friend_id).options(
                    selectinload(
                        User.data
                    )
                )
            )).scalar_one_or_none()

            if user is None:
                continue

            difference = user.data.current_coin - friend.last_claim
            if difference < 0:
                continue

            difference = difference * 0.1
            friend.bonus += difference
            friend.last_claim = user.data.current_coin
            user.data.current_coin += difference
            await self.db.commit()

    async def upgrade_status(self, user_id: id, total_amount: float):
        user = (await self.db.execute(
            select(User)
            .where(User.telegram_id == user_id)
            .options(
                selectinload(User.data)
            )
        )).scalar_one_or_none()

        if total_amount < 1.50:
            user.data.status = UserStatus.BRONZE
        elif 4 < total_amount < 7:
            user.data.status = UserStatus.SILVER
        elif 9 < total_amount < 11:
            user.data.status = UserStatus.GOLD
        elif 49 < total_amount < 51:
            user.data.status = UserStatus.DIAMOND

        await self.db.commit()

    async def get_donate_price(self, user_id: UUID):
        user = (await self.db.execute(
            select(User)
            .where(User.id == user_id)
            .options(
                selectinload(User.data)
            )
        )).scalar_one_or_none()
        if not user.data:
            raise CustomException("Data not found")

        copy_prices: list[Price] = [
            Price(
                price=50, name='Diamond', discount=0,
                bonus='Unlock 15 more buildings / 35%+GT per loc / 10 Virtual pickup per 24h / Remove building level up limit / All diamonds 2x'
                ),
            Price(
                price=10, name='Gold', discount=0,
                bonus='Unlock 15 more buildings  / 25%+GT per loc / 5 Virtual pickup per 24h / Remove building level up limit'
                ),
            Price(
                price=5, name='Silver', discount=0,
                bonus='Unlock 10 more buildings / 15%+GT per loc / 3 Virtual pickup per 24h / Remove building level up limit'
                ),
            Price(
                price=1, name='Bronze', discount=0,
                bonus='Unlock 5 more buildings / 5%+GT per loc / 1 Virtual pickup per 24h'
                ),
        ]
        if user.data.status is None:
            return copy_prices
        elif user.data.status == UserStatus.BRONZE:
            for x in copy_prices:
                if x.name == 'Diamond':
                    x.discount = 2
                elif x.name == 'Gold':
                    x.discount = 10
                elif x.name == 'Silver':
                    x.discount = 20
        elif user.data.status == UserStatus.SILVER:
            for x in copy_prices:
                if x.name == 'Gold':
                    x.discount = 50
                elif x.name == 'Diamond':
                    x.discount = 10
        elif user.data.status == UserStatus.GOLD:
            for x in copy_prices:
                if x.name == 'Diamond':
                    x.discount = 20

        return copy_prices

    def _validate_language(self, culture: str):
        valid_cultures = {"en", "ru", "id"}
        if culture not in valid_cultures:
            raise CustomException("Invalid culture language")
    async def _check_user_lvl(self, user: User):
        pass
