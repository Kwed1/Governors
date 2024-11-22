import datetime
from logging import Logger
from uuid import UUID

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import Depends
from geopy import Point
from geopy.distance import distance
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from config.database import get_db, to_utc
from entities.game.game import Game, GameType
from entities.game.game_reward import GameReward
from entities.game.user_game import UserGame
from exceptions.custom_exception import CustomException
from routes.websockets_route import send_message_online_async, send_message_offline_async
from schemas.games.create_game_dto import CreateOnlineGameDto, CreateOfflineGameDto
from schemas.games.game_dto import GameDto

scheduler = AsyncIOScheduler()

def start_scheduler():
    scheduler.start()


class GameService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db

    async def get_async(self):
        games = (await self.db.execute(select(Game))).scalars().all()
        game_dtos = []

        try:

            for game in games:
                stmt = select(func.count()).select_from(UserGame).where(UserGame.game_id == game.id)
                result = await self.db.execute(stmt)
                user_count = result.scalar_one()
                end_game = game.end_at
                start_at = to_utc(game.start_at)
                if end_game is None and start_at > to_utc(datetime.datetime.utcnow()):
                    end_game = 'Schedule'
                elif end_game is None and start_at <= to_utc(datetime.datetime.utcnow()):
                    end_game = 'Live'
                else:
                    end_game = str(end_game)
                game_type = GameType(game.type)
                game_dto = GameDto(
                    name=game_type.name,
                    id=game.id,
                    participants=f'{user_count}/{game.place}',
                    start=start_at,
                    end=end_game
                )
                game_dtos.append(game_dto)

            return game_dtos
        except Exception as e:
            print(e.args)

    async def delete_async(self, game_id: UUID):
        game = (await self.db.execute(select(Game).where(Game.id == game_id))).scalar_one_or_none()
        if game is None:
            raise CustomException("Game not found")

        if game.start_at < to_utc(datetime.datetime.utcnow()) and game.end_at is None:
            raise CustomException("Cannot remove game, because its already stated")

        await self.db.delete(game)
        await self.db.commit()

    async def add_online_async(self, dto: CreateOnlineGameDto):
        if len(dto.rewards) < 1:
            raise CustomException("Must be min. one rewards range")

        async with self.db.begin() as session:
            try:
                start_at = to_utc(dto.start_at - datetime.timedelta(hours=7))

                game = Game(start_at=start_at,
                            type=GameType.Online,
                            place=dto.place)

                session.session.add(game)
                await session.session.flush()
                await session.session.refresh(game)

                for game_reward in dto.rewards:
                    game_reward = GameReward(game_id=game.id,
                                             from_place=game_reward.from_place,
                                             to_place=game_reward.to_place,
                                             reward=game_reward.reward)
                    session.session.add(game_reward)
                    await session.session.flush()
                scheduler.add_job(self._start_async, 'date', run_date=start_at, args=[game.id])
                await session.session.commit()
            except Exception as ex:
                await session.rollback()
                Logger.error(ex)

    async def add_offline_async(self, dto: CreateOfflineGameDto):
        if len(dto.rewards) < 1:
            raise CustomException("Must be min. one rewards range")

        async with self.db.begin() as session:
            try:
                start_at = to_utc(dto.start_at - datetime.timedelta(hours=7))

                game = Game(start_at=start_at,
                            type=GameType.Offline,
                            place=dto.place,
                            geolocation_x=dto.geolocation_x,
                            geolocation_y=dto.geolocation_y)

                session.session.add(game)
                await session.session.flush()
                await session.session.refresh(game)

                for game_reward in dto.rewards:
                    game_reward = GameReward(game_id=game.id,
                                             from_place=game_reward.from_place,
                                             to_place=game_reward.to_place,
                                             reward=game_reward.reward)
                    session.session.add(game_reward)
                    await session.session.flush()

                scheduler.add_job(self._start_async, 'date', run_date=start_at, args=[game.id])
                await session.session.commit()
            except Exception as ex:
                await session.rollback()
                Logger.error(ex)

    async def _start_async(self, game_id: UUID):
        current_game = (await self.db.execute(select(Game).where(Game.id == game_id))).scalar_one_or_none()
        if current_game is None:
            Logger.error(f"Game not found {game_id}")
            raise CustomException("Game not found")

        games = (await self.db.execute(select(Game))).scalars().all()
        for game in games:
            if (game.id != game_id
                    and game.start_at < to_utc(datetime.datetime.utcnow())
                    and game.end_at is None
                    and game.type == GameType.Online
                    and current_game.type == GameType.Online):
                game.end_at = to_utc(datetime.datetime.utcnow())
        await self.db.commit()
        await self.db.refresh(current_game)

        if current_game.type == GameType.Online:
            await send_message_online_async({"state": "run"})
        else:
            await send_message_offline_async({"claimed": True})
