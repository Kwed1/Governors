from datetime import datetime
from logging import Logger
from uuid import UUID

from fastapi import Depends
from sqlalchemy import func, select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from config.database import get_db, to_utc
from entities.game.game import Game, GameType
from entities.game.game_reward import GameReward
from entities.game.user_game import UserGame
from entities.user_data.user_coin import UserData
from exceptions.custom_exception import CustomException
from services.user_game.user_game_service import UserGameService


class UserGameOnlineService(UserGameService):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db

    async def get_games_needing_update(self):
        query = select(Game).where(Game.end_at.is_(None))
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_current_user_count_async(self, user_id: UUID):
        current_time = to_utc(datetime.utcnow())
        stmt = select(Game).where(Game.start_at <= current_time, Game.end_at.is_(None), Game.type == GameType.Online).order_by(
            Game.start_at).limit(1)
        result = await self.db.execute(stmt)
        closest_game = result.scalars().first()
        if closest_game is None:
            return {"state": "idle"}

        count_query = select(func.count()).select_from(UserGame).where(UserGame.game_id == closest_game.id)
        result = await self.db.execute(count_query)
        total_count = result.scalar()
        if closest_game.place <= total_count:
            return {"state": "idle"}

        place = total_count
        game_reward = (
            await self.db.execute(
                select(GameReward)
                .where(
                    GameReward.game_id == closest_game.id,
                    GameReward.to_place >= place,
                    GameReward.from_place <= place
                )
            )
        ).scalar_one_or_none()

        exists_query = select(UserGame).where(
            UserGame.user_id == user_id, UserGame.game_id == closest_game.id
        ).exists()

        result = await self.db.execute(select(exists_query))
        exists = result.scalar()

        return {"placeCount": total_count, "total": closest_game.place, "game_reward": -1 if exists else game_reward.reward}

    async def get_status_async(self, user_id: UUID):
        current_time = to_utc(datetime.utcnow())  # todo to utc
        stmt = select(Game).where(Game.start_at <= current_time, Game.end_at.is_(None),
                                  Game.type == GameType.Online
                                  ).order_by(
            Game.start_at).limit(1)
        result = await self.db.execute(stmt)
        closest_game = result.scalars().first()
        if closest_game is None:
            return {"state": "idle"}

        # exists_query = select(UserGame).where( todo --> client resigned from this
        #     UserGame.user_id == user_id, UserGame.game_id == closest_game.id
        # ).exists()
        #
        # result = await self.db.execute(select(exists_query))
        # exists = result.scalar()

        # if exists:
        #     return {"state": "idle"}

        return {"state": "run"}

    async def claim_reward_async(self, user_id: UUID) -> bool:
        try:
            current_time = to_utc(datetime.utcnow())

            stmt = (
                select(Game)
                .where(
                    Game.start_at <= current_time,
                    Game.end_at.is_(None),
                    Game.type == GameType.Online
                )
                .order_by(Game.start_at)
                .limit(1)
            )
            result = await self.db.execute(stmt)
            closest_game = result.scalars().first()

            if closest_game is None:
                return False

            query = (
                select(UserGame)
                .where(UserGame.user_id == user_id, UserGame.game_id == closest_game.id)
            )
            result = await self.db.execute(query)
            user_game = result.scalars().first()

            if user_game:
                return False

            count_query = (
                select(func.count())
                .select_from(UserGame)
                .where(UserGame.game_id == closest_game.id)
            )
            result = await self.db.execute(count_query)
            total_count = result.scalars().first()

            user_data = (
                await self.db.execute(
                    select(UserData)
                    .where(UserData.user_id == user_id)
                )
            ).scalars().first()

            if user_data is None:
                return False

            place = total_count
            game_reward = (
                await self.db.execute(
                    select(GameReward)
                    .where(
                        GameReward.game_id == closest_game.id,
                        GameReward.to_place >= place,
                        GameReward.from_place <= place
                    )
                )
            ).scalars().first()

            if game_reward is None:
                return False

            user_data.coin += game_reward.reward
            user_game = UserGame(user_id=user_id, game_id=closest_game.id)
            self.db.add(user_game)
            await self.db.commit()
            await self.db.refresh(user_game)
            await self.db.refresh(closest_game)

            place = place + 1
            if place >= closest_game.place:
                closest_game.end_at = current_time
                self.db.add(closest_game)
                await self.db.commit()
                await self.db.refresh(closest_game)

            return True
        except Exception as ex:
            return False
