import uuid
from uuid import UUID

from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from config.database import get_db
from entities.builidngs.building import Building
from entities.builidngs.user_building import UserBuilding
from entities.missions.friend import Friend
from entities.user_data.user_coin import UserData
from exceptions.custom_exception import CustomException
from identity.models.user import User
from schemas.buildings.building_dto import BuildingDto

class GetBuildingDto(BaseModel):
    total_friends: int
    data: list[BuildingDto]

class BuildingService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db

    async def buy_async(self, user_id: UUID, building_id: UUID):
        result = await self.db.execute(
            select(Building)
            .options(
                joinedload(Building.prices),
                joinedload(Building.revenues)
            )
            .where(Building.id == building_id)
        )
        building = result.unique().scalars().one_or_none()
        if building is None:
            raise CustomException("Building information not found")

        user_coin = (await self.db.execute(select(UserData).where(UserData.user_id == user_id))).scalars().first()
        if user_coin is None:
            raise CustomException("User coin information not found")

        user_building = (await self.db.execute(select(UserBuilding).where(UserBuilding.user_id == user_id,
                                                                          UserBuilding.building_id == building_id))).scalars().first()
        if user_building is None:
            user_building = await self._create_user_build(user_id=user_id, build_id=building_id)

        await self.db.refresh(building)
        await self.db.refresh(user_coin)
        await self.db.refresh(user_building)

        if len(building.prices) - 1 < user_building.lvl:
            raise CustomException("Increase max lvl")
        sorted_prices = sorted(building.prices, key=lambda price: price.amount)
        sorted_revenues = sorted(building.revenues, key=lambda revenue: revenue.total)

        next_price = sorted_prices[user_building.lvl].amount

        if user_coin.coin < next_price:
            raise CustomException("Not enough coins")

        user_coin.coin -= next_price

        if user_building.lvl > 0:
            last_revenue = sorted_revenues[user_building.lvl - 1].total
            user_coin.coin_per_hour -= last_revenue

        next_revenue = sorted_revenues[user_building.lvl].total
        user_coin.coin_per_hour += next_revenue

        user_building.lvl += 1
        await self.db.commit()

    async def get_async(self, user_id: UUID) -> GetBuildingDto:
        user = (await self.db.execute(select(User).where(User.id == user_id))).scalars().one_or_none()
        building_dtos = []

        result = await self.db.execute(
            select(Building)
            .options(joinedload(Building.prices), joinedload(Building.revenues))
        )

        buildings = result.unique().scalars().all()

        for build in buildings:
            user_build = (await self.db.execute(
                select(UserBuilding).where(UserBuilding.building_id == build.id, UserBuilding.user_id == user_id)
            )).scalars().first()

            if user_build is None:
                user_build = UserBuilding(user_id=uuid.UUID, lvl=0, building_id=build.id)

            sorted_prices = sorted(build.prices, key=lambda price: price.amount)
            sorted_revenues = sorted(build.revenues, key=lambda revenue: revenue.total)

            price = sorted_prices[0].amount
            revenue = 0
            friends_to_up = sorted_prices[0].lvl_to_up
            rank = sorted_prices[0].open_from
            next_lvl_price = sorted_revenues[0].total
            if 0 < user_build.lvl < len(build.prices):
                price = sorted_prices[user_build.lvl].amount
                revenue = sorted_revenues[user_build.lvl - 1].total
                friends_to_up = sorted_prices[user_build.lvl].lvl_to_up
                rank = sorted_prices[user_build.lvl].open_from
                next_lvl_price = sorted_revenues[user_build.lvl].total
            elif len(build.prices) == user_build.lvl:
                price = sorted_prices[len(build.prices) - 1].amount
                revenue = sorted_revenues[len(build.revenues) - 1].total
                friends_to_up = sorted_prices[len(build.prices) - 1].lvl_to_up
                rank = sorted_prices[len(build.prices) - 1].open_from

            building_dto = BuildingDto(
                id=build.id,
                next_lvl_price=next_lvl_price,
                lvl=user_build.lvl,
                price=price,
                name=build.name,
                per_hour=revenue,
                state=build.state,
                friend_to_lvl_up=friends_to_up,
                rank_need_to_buy=rank
            )

            building_dtos.append(building_dto)

        result = select(func.count()).select_from(Friend).where(Friend.user_id == user.telegram_id)
        result = await self.db.execute(result)
        count = result.scalar()
        return GetBuildingDto(
            data=building_dtos,
            total_friends=count
        )

    async def _create_user_build(self, user_id, build_id):
        user_building = (await self.db.execute(select(UserBuilding).where(UserBuilding.user_id == user_id,
                                                                          UserBuilding.building_id == build_id))).scalars().first()
        if user_building is not None:
            return user_building

        user_build = UserBuilding(user_id=user_id, lvl=0, building_id=build_id)
        self.db.add(user_build)
        await self.db.commit()
        await self.db.refresh(user_build)

        return user_build
