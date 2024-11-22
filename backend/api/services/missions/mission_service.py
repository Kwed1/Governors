import asyncio
import datetime
import time
import uuid
from uuid import UUID

import requests
from fastapi import Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from config.database import get_db
from entities.missions.friend import Friend
from entities.missions.mission import Mission
from entities.missions.referal import Referal
from entities.missions.user_mission import UserMission
from entities.user_data.user_coin import UserData
from exceptions.custom_exception import CustomException
from identity.models.user import User
from schemas.friends.friend import FriendDto, FriendPagedDto, InviteFriendDto
from schemas.missions.mission_dto import CreateMissionDto, UserMissionDto, MissionDto, MissionPageDto

BOT_TOKEN = '7209062896:AAFmzffzGmTB0x3g-88ZRjOi-M9GvCjqr5s'


def _check_telegram(user_id: int, channel_id: int) -> bool:
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getChatMember"
    params = {
        'chat_id': channel_id,
        'user_id': user_id
    }

    response = requests.get(url, params=params)
    data = response.json()
    return data['ok']


class MissionService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db

    async def add_async(self, user_id: UUID, dto: CreateMissionDto):
        self.db.add(Mission(
            reward=dto.reward,
            name=dto.name,
            icon=dto.icon_type,
            type=dto.type,
            link=dto.link,
            chat_id=dto.tg_channel_id
        ))
        await self.db.commit()

    async def remove_async(self, user_id: UUID, id: UUID):
        mission = (await self.db.execute(select(Mission).filter(Mission.id == id))).scalar_one_or_none()
        if not mission:
            raise CustomException("Mission not found")

        if mission.type == "Welcome":
            raise CustomException("Cannot remove welcome mission")

        await self.db.delete(mission)
        await self.db.commit()

    async def get_friends_async(self, user_id: UUID, skip: int, take: int):
        friends_query = select(Friend).offset(skip).limit(take)
        friends_result = await self.db.execute(friends_query)
        friends = friends_result.scalars().all()

        transactions_dto = [
            FriendDto(
                user_name=friend.user_name,
                user_id=friend.user_id,
                friend_id=friend.friend_id,
                date_added=friend.date_added,
                bonus=friend.bonus
            )
            for friend in friends
        ]

        total_items_query = select(func.count(Friend.id))
        total_items_result = await self.db.execute(total_items_query)
        total_items = total_items_result.scalar()

        return FriendPagedDto(data=transactions_dto, total=total_items)

    async def add_new_referal_async(self, dto: InviteFriendDto):
        if dto.inviter_id == dto.user_id:
            raise CustomException("The same user cannot be referal")

        result = await self.db.execute(
            select(Friend).where(Friend.friend_id == dto.user_id)
        )
        friends = result.scalars().all()

        if len(friends) > 0:
            raise CustomException("Friends already added")

        user = (await self.db.execute(select(User).filter(User.telegram_id == dto.inviter_id))).scalar_one_or_none()
        if user is None:
            raise CustomException("User not found")

        user_data = (await self.db.execute(select(UserData).filter(UserData.user_id == user.id))).scalar_one_or_none()
        if user_data is None:
            raise CustomException("User not found")
        user_data.coin += 500 if dto.is_premium else 100

        user_mission = (
            await self.db.execute(select(UserMission).filter(UserMission.user_id == user.id))).scalars().all()

        friends_mission_exits = False
        for x in user_mission:
            mission = (await self.db.execute(select(Mission).filter(Mission.id == x.mission_id))).scalar_one_or_none()
            if mission is None:
                continue

            if mission.type == 'Friend':
                friends_mission_exits = True
                if x.status != 'Success':
                    x.status = 'Completed'

        if friends_mission_exits is False:
            mission = (await self.db.execute(select(Mission).filter(Mission.type == "Friend"))).scalar_one_or_none()
            if mission is not None:
                user_mission_friends = UserMission(id=uuid.uuid4(), user_id=user.id, mission_id=mission.id, status="Completed")
                self.db.add(user_mission_friends)
                await self.db.commit()
                await self.db.refresh(user_mission_friends)


        friend = Friend(user_id=dto.inviter_id,
                        friend_id=dto.user_id,
                        bonus=0,
                        date_added=datetime.datetime.now(),
                        user_name=dto.user_name)
        friend.bonus += 500 if dto.is_premium else 100

        self.db.add(friend)
        self.db.add(Referal(user_id=dto.inviter_id, referal_id=dto.user_id, date_added=datetime.datetime.now()))
        await self.db.commit()

    async def get_user_missions(self, x_user_id: UUID) -> UserMissionDto:
        missions = (await self.db.execute(select(Mission))).scalars().all()
        user_missions = (
            await self.db.execute(select(UserMission).filter(UserMission.user_id == x_user_id))).scalars().all()

        result = []

        for mission in missions:
            mission_dto = UserMissionDto(id=mission.id,
                                         name=mission.name,
                                         reward=mission.reward,
                                         link=mission.link,
                                         tg_id=mission.chat_id,
                                         icon_type=mission.icon,
                                         status="Open")
            for user_mission in user_missions:
                if user_mission.mission_id == mission.id:
                    mission_dto.status = user_mission.status
                    continue

            result.append(mission_dto)

        return result

    async def get_friends_async(self, x_user_id: UUID, skip: int, take: int):
        user = (await self.db.execute(select(User).filter(User.id == x_user_id))).scalar_one_or_none()
        friends_query = select(Friend).filter(Friend.user_id == user.telegram_id).offset(skip).limit(take)
        friends_result = await self.db.execute(friends_query)
        friends = friends_result.scalars().all()

        transactions_dto = [
            FriendDto(
                user_name=friend.user_name,
                date_added=friend.date_added,
                bonus=friend.bonus,
            )
            for friend in friends
        ]

        friends_paged_dto = FriendPagedDto(data=[], total=0, user_inviter="")
        user_inviter = (
            await self.db.execute(select(Friend).filter(Friend.friend_id == user.telegram_id))).scalars().first()
        if user_inviter:
            inviter = (
                await self.db.execute(select(User).filter(User.telegram_id == user_inviter.user_id))).scalars().first()
            friends_paged_dto.user_inviter = inviter.username

        total_items_query = select(func.count(Friend.id)).filter(Friend.user_id == user.telegram_id)
        total_items_result = await self.db.execute(total_items_query)
        total_items = total_items_result.scalar()

        friends_paged_dto.data = transactions_dto
        friends_paged_dto.total = total_items
        return friends_paged_dto

    async def get_async(self, user_id: UUID):
        transactions_query = select(Mission)
        transactions_result = await self.db.execute(transactions_query)
        transactions = transactions_result.scalars().all()

        transactions_dto = [
            MissionDto(
                id=transaction.id,
                name=transaction.name,
                type=transaction.type,
                reward=transaction.reward,
                link=transaction.link,
                icon_type=transaction.icon,
            )
            for transaction in transactions
            if transaction.type != "Welcome" and transaction.type != "Friend" and transaction.type != "Boost"
        ]

        total_items_query = select(func.count(Mission.id))
        total_items_result = await self.db.execute(total_items_query)
        total_items = total_items_result.scalar()

        return MissionPageDto(data=transactions_dto, total=total_items)

    async def claim_async(self, user_id: UUID, id: UUID):
        mission = (await self.db.execute(select(Mission).filter(Mission.id == id))).scalar_one_or_none()
        if not mission:
            raise CustomException("Mission not found")

        user = (await self.db.execute(select(User).filter(User.id == user_id))).scalar_one_or_none()
        if user is None:
            raise CustomException("User not found")

        user_data = (await self.db.execute(select(UserData).filter(UserData.user_id == user_id))).scalar_one_or_none()
        if user_data is None:
            raise CustomException("User not found")

        user_mission = (
            await self.db.execute(select(UserMission).filter(UserMission.user_id == user_id,
                                                             UserMission.mission_id == mission.id))).scalars().first()
        if user_mission.status != "Verified":
            raise CustomException("Invalid mission status")
        user_mission.status = "Completed"
        user_data.coin += mission.reward
        # inviter = (await self.db.execute(select(Friend).filter(Friend.friend_id == user.telegram_id))).scalars().first()
        # if inviter is not None and inviter is not []:
        #     inviter_user = (
        #         await self.db.execute(select(User).filter(User.telegram_id == inviter.user_id))).scalars().first()

        await self.db.commit()
        pass

    async def check_async(self, user_id: UUID, id: UUID):
        mission = (await self.db.execute(select(Mission).filter(Mission.id == id))).scalar_one_or_none()
        if not mission:
            raise CustomException("Mission not found")

        user = (await self.db.execute(select(User).filter(User.id == user_id))).scalar_one_or_none()
        user_mission = (await self.db.execute(select(UserMission).filter(UserMission.mission_id == mission.id,
                                                                         UserMission.user_id == user_id))).scalar_one_or_none()

        if mission.type == "Telegram":
            url_chat_id = f'https://api.telegram.org/bot{BOT_TOKEN}/getChat?chat_id={mission.chat_id}'
            response = requests.get(url_chat_id)
            data = response.json()

            if data['ok']:
                chat_id = data['result']['id']
                result = _check_telegram(user.telegram_id, chat_id)
                if not result:
                    user_mission.status = "Open"
                    await self.db.commit()
                    raise CustomException(f"User not followed to group with ID {chat_id}")


        if user_mission is None:
            user_mission = UserMission(id=uuid.uuid4(), user_id=user_id, mission_id=mission.id, status="Verified")
            self.db.add(user_mission)
            await self.db.commit()
            await self.db.refresh(user_mission)
        user_mission.status = "Verified"
        await self.db.commit()

    async def navigate_async(self, user_id: UUID, id: UUID):
        mission = (await self.db.execute(select(Mission).filter(Mission.id == id))).scalar_one_or_none()
        if not mission:
            raise CustomException("Mission not found")

        user = (await self.db.execute(select(User).filter(User.id == user_id))).scalar_one_or_none()
        user_mission = (await self.db.execute(select(UserMission).filter(UserMission.mission_id == mission.id,
                                                                         UserMission.user_id == user_id))).scalar_one_or_none()
        if not user_mission:
            user_mission = UserMission(id=uuid.uuid4(), user_id=user_id, mission_id=mission.id, status="Execution")
            self.db.add(user_mission)
            await self.db.commit()
            await self.db.refresh(user_mission)
        else:
            user_mission.status = "Execution"
            await self.db.commit()
        return
