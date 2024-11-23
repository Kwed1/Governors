import uuid
from datetime import datetime
from logging import Logger
from uuid import UUID

from fastapi import Depends
from geopy import Point
from geopy.distance import distance
from pydantic import BaseModel
from pydantic.v1.schema import schema
from sqlalchemy import select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from config.database import get_db, to_utc
from entities.game.game import Game, GameType
from entities.game.game_reward import GameReward
from entities.game.user_game import UserGame
from entities.user_data.user_coin import UserStatus, UserData
from exceptions.custom_exception import CustomException
from identity.models.user import User, UserPoint
from schemas.games.user_offline_game_dto import UserOfflineGameDto


class PointSchema(BaseModel):
    latitude: float
    longitude: float
    reward: float
    diamond_reward: float
    id: UUID


class GetPointsSchema(BaseModel):
    claimed_count: int
    generate_chance: int
    claimed_need_to_reward: int
    generate_max_chanced: int
    virtual_picks: int
    reward: float
    max_virtual_picks: float
    points: list[PointSchema]


class UserCoordinates(BaseModel):
    latitude: float
    longitude: float


class UserGameOfflineService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db

    async def _get_user(self, user_id: UUID) -> User:
        """Получить пользователя с точками и данными."""
        user = (await self.db.execute(
            select(User)
            .where(User.id == user_id)
            .options(
                selectinload(User.points),
                selectinload(User.data)
            )
        )).scalar_one_or_none()

        if not user:
            raise CustomException('User not found')
        return user

    @staticmethod
    def _get_generate_chance_count(lvl: int, status: UserStatus) -> int:
        """Получить количество доступных для генерации точек."""
        if lvl < 6:
            return 1
        elif lvl == 6 or lvl == 7:
            return 2
        elif lvl == 8 or lvl == 9:
            return 3
        elif lvl == 10:
            return 4

        return 1

    @staticmethod
    def _get_generate_locations_count(lvl: int, status: UserStatus) -> int:
        """Получить количество доступных для генерации точек."""
        if lvl < 6:
            return 5
        elif lvl == 6 or lvl == 7:
            return 6
        elif lvl == 8 or lvl == 9:
            return 10
        elif lvl == 10:
            return 15

        return 5

    @staticmethod
    def _get_virtual_picks_count(status: UserStatus) -> int:
        """Получить количество виртуальных сборов."""
        if status == UserStatus.BRONZE:
            return 1
        elif status == UserStatus.SILVER:
            return 3
        elif status == UserStatus.GOLD:
            return 5
        elif status == UserStatus.DIAMOND:
            return 10
        return 0

    @staticmethod
    def _claim_count(lvl:int ) -> int:
        if lvl == 1 or lvl == 2:
           return 3
        elif lvl == 3 or lvl == 4:
            return 4
        elif lvl == 5:
            return 5
        elif lvl == 6:
            return 6
        elif lvl == 7:
            return 6
        elif lvl == 8:
            return 7
        elif lvl == 9:
            return 8
        elif lvl == 10:
            return 10

    @staticmethod
    def _get_reward(lvl: int) -> int:
        if lvl == 1:
            return 100
        elif lvl == 2:
            return 120
        elif lvl == 3:
            return 150
        elif lvl == 4:
            return 170
        elif lvl == 5:
            return 200
        elif lvl == 6:
            return 250
        elif lvl == 7:
            return 300
        elif lvl == 8:
            return 350
        elif lvl == 9:
            return 400
        elif lvl == 10:
            return 500

        return 100

    async def get_points(self, user_id: UUID) -> GetPointsSchema:
        user = await self._get_user(user_id)
        generate_max_change = UserGameOfflineService._get_generate_chance_count(
            user.data.lvl, user.data.status)
        generate_chance = self._calculate_generate_chance(user, generate_max_change)
        claimed_count = sum(1 for point in user.points if point.claimed)
        claim_count = self._claim_count(user.data.lvl)

        schema = [PointSchema.model_validate(point, from_attributes=True) for point in user.points if not point.claimed]
        return GetPointsSchema(
            reward=self._get_reward(user.data.lvl),
            points=schema,
            claimed_count=claimed_count if claimed_count <= claim_count else claim_count,
            claimed_need_to_reward=claim_count,
            generate_chance=generate_chance,
            generate_max_chanced=generate_max_change,
            virtual_picks=UserGameOfflineService._get_virtual_picks_count(user.data.status),
            max_virtual_picks=UserGameOfflineService._get_virtual_picks_count(user.data.status)
        )

    def _calculate_generate_chance(self, user: User, max_count: int) -> int:
        """Вычислить шанс генерации новых точек."""
        if user.data.last_generate is None:
            return UserGameOfflineService._get_generate_chance_count(user.data.lvl,
                                                                     user.data.status)
        if (datetime.utcnow() - user.data.last_generate).total_seconds() / 3600 > 24:
            return UserGameOfflineService._get_generate_chance_count(user.data.lvl,
                                                                     user.data.status)
        res = max_count - user.data.generate_count
        if res < 0:
            res = 0
        return res

    async def generate_points(self, user_coords: UserCoordinates, user_id: UUID) -> GetPointsSchema:
        user = await self._get_user(user_id)

        if user.data.last_generate is not None and (
                datetime.utcnow() - user.data.last_generate).total_seconds() > 24 * 3600:
            user.data.generate_count = 0

        generate_max_chanced = UserGameOfflineService._get_generate_chance_count(
            user.data.lvl, user.data.status)
        if user.data.generate_count > generate_max_chanced:
            raise CustomException('Cannot generate points')

        await self.db.execute(delete(UserPoint).where(UserPoint.user_id == user.id))
        max_count = UserGameOfflineService._get_generate_locations_count(
            user.data.lvl, user.data.status)
        base_point = Point(user_coords.latitude, user_coords.longitude)

        user_points = self._generate_user_points(
            user_id=user.id,
            base_point=base_point,
            max_count=max_count,
            reward=self._get_reward(user.data.lvl)
            )

        self.db.add_all(user_points)
        user.data.generate_count += 1
        user.data.last_generate = datetime.utcnow()
        user.data.virtual_pick_count = UserGameOfflineService._get_virtual_picks_count(user.data.status)

        reward= self._get_reward(user.data.lvl)
        claim_count = self._claim_count(user.data.lvl)
        await self.db.commit()
        await self.db.refresh(user)

        claimed_count=sum(1 for point in user.points if point.claimed)
        schema = [PointSchema.model_validate(point, from_attributes=True) for point in user_points if not point.claimed]
        return GetPointsSchema(
            reward=reward,
            points=schema,
            claimed_need_to_reward=claim_count,
            claimed_count=claimed_count if claimed_count <= claim_count else claim_count,
            generate_max_chanced=generate_max_chanced,
            generate_chance=generate_max_chanced - user.data.generate_count,
            virtual_picks=user.data.virtual_pick_count,
            max_virtual_picks=UserGameOfflineService._get_virtual_picks_count(user.data.status)
        )

    def _generate_user_points(self, user_id: UUID, reward: float, base_point: Point,
                              max_count:int) -> list[UserPoint]:
        user_points = []
        for i in range(min(5, max_count)):
            angle = 72 * i
            new_point = distance(meters=500).destination(point=base_point, bearing=angle)
            user_points.append(
                UserPoint(
                    reward=reward,
                    user_id=user_id,
                    latitude=new_point.latitude,
                    longitude=new_point.longitude
                    )
                )

        for i in range(5, max_count):
            found_point = False
            attempts = 0
            max_attempts = 36

            while not found_point and attempts < max_attempts:
                base_for_new_point = user_points[(i - 5) % len(user_points)]
                base_point_geo = Point(base_for_new_point.latitude, base_for_new_point.longitude)
                angle = 10 * attempts
                new_point_candidate = distance(meters=500).destination(point=base_point_geo, bearing=angle)

                min_distance_from_other_points = min(
                    distance(Point(p.latitude, p.longitude), new_point_candidate).meters
                    for p in user_points
                )

                distance_from_user = distance(base_point, new_point_candidate).meters

                if min_distance_from_other_points >= 500 and distance_from_user >= 500:
                    found_point = True
                    user_points.append(UserPoint(
                        reward=reward,
                        user_id=user_id,
                        latitude=new_point_candidate.latitude,
                        longitude=new_point_candidate.longitude,
                    ))
                attempts += 1

            if not found_point:
                raise CustomException(f"Failed to generate point {i + 1} due to constraints")

        return user_points

    async def claim(self, point_id: UUID, user_id: UUID) -> GetPointsSchema:
        user = await self._get_user(user_id)

        total_claimed = 0
        for x in user.points:
            if x.claimed:
                total_claimed += 1

        if total_claimed > self._claim_count(user.data.lvl):
            raise CustomException("Cannot claim now")

        user.data.coin += self._get_reward(user.data.lvl)
        user.data.diamonds += 1
        for point in user.points:
            if point.id == point_id:
                point.claimed = True
                break
        else:
            raise CustomException("Point not found")
        user.data.total_claimed += 1
        if user.data.total_claimed == 1:
            user.data.lvl = 2
        elif user.data.total_claimed == 5:
            user.data.lvl = 3
        elif user.data.total_claimed == 10:
            user.data.lvl = 4
        elif user.data.total_claimed == 20:
            user.data.lvl = 5
        elif user.data.total_claimed == 30 and self.has_access(user.data.status, UserStatus.BRONZE):
            user.data.lvl = 6
        elif user.data.total_claimed == 40 and self.has_access(user.data.status, UserStatus.BRONZE):
            user.data.lvl = 7
        elif user.data.total_claimed == 50 and self.has_access(user.data.status, UserStatus.SILVER):
            user.data.lvl = 8
        elif user.data.total_claimed == 70 and self.has_access(user.data.status, UserStatus.SILVER):
            user.data.lvl = 9
        elif user.data.total_claimed == 80 and self.has_access(user.data.status, UserStatus.GOLD):
            user.data.lvl = 10


        point_schema = self._build_points_schema(user)
        await self.db.commit()
        return point_schema

    @staticmethod
    def has_access(status: UserStatus, required: UserStatus):
        if required is None:
            return True

        if status is None and required is None:
            return True

        if ((status == UserStatus.BRONZE or status == UserStatus.SILVER or status == UserStatus.GOLD
             or status == UserStatus.DIAMOND) and required == UserStatus.BRONZE):
            return True

        if (required == UserStatus.SILVER and status == UserStatus.GOLD or status ==
                UserStatus.DIAMOND or status == UserStatus.SILVER):
            return True

        if required == UserStatus.GOLD and status == UserStatus.GOLD or status == UserStatus.DIAMOND:
            return True

        if required == UserStatus.DIAMOND and status == UserStatus.DIAMOND:
            return True

        return False

    async def virtual_claim(self, point_id: UUID, user_id: UUID) -> GetPointsSchema:
        user = await self._get_user(user_id)

        if user.data.virtual_pick_count >= UserGameOfflineService._get_virtual_picks_count(user.data.status):
            raise CustomException('Cannot claim virtual picks')

        user.data.virtual_pick_count += 1
        return await self.claim(point_id=point_id, user_id=user_id)

    def _build_points_schema(self, user: User) -> GetPointsSchema:
        reward = self._get_reward(user.data.lvl)
        claimed_count = sum(1 for point in user.points if point.claimed)
        generate_max_chanced = UserGameOfflineService._get_generate_chance_count(
            user.data.lvl, user.data.status)
        schema = [PointSchema.model_validate(point, from_attributes=True) for point in user.points if not point.claimed]
        generate_chance = self._calculate_generate_chance(user, generate_max_chanced)
        claim_count = self._claim_count(user.data.lvl)


        return GetPointsSchema(
            reward=reward,
            points=schema,
            claimed_need_to_reward=claim_count,
            claimed_count=claimed_count if claimed_count <= claim_count else claim_count,
            generate_chance=generate_chance,
            generate_max_chanced=generate_max_chanced,
            virtual_picks=user.data.virtual_pick_count,
            max_virtual_picks=UserGameOfflineService._get_virtual_picks_count(user.data.status)
        )
    #region not-in-scope
    async def get_current_games(self, user_id: UUID):
        current_time = to_utc(datetime.utcnow())
        stmt = select(Game).where(Game.start_at <= current_time, Game.end_at.is_(None),
                                  Game.type == GameType.Offline
                                  )
        result = await self.db.execute(stmt)
        games = result.scalars().all()

        games_dto = []
        for game in games:
            count_query = select(func.count()).select_from(UserGame).where(UserGame.game_id == game.id)
            result = await self.db.execute(count_query)
            total_count = result.scalar()
            if game.place <= total_count:
                continue

            place = total_count
            game_reward = (
                await self.db.execute(
                    select(GameReward)
                    .where(
                        GameReward.game_id == game.id,
                        GameReward.to_place >= place,
                        GameReward.from_place <= place
                    )
                )
            ).scalar_one_or_none()

            exists_query = select(UserGame).where(
                UserGame.user_id == user_id, UserGame.game_id == game.id
            ).exists()

            result = await self.db.execute(select(exists_query))
            exists = result.scalar()

            game_dto = UserOfflineGameDto(
                id=str(game.id),
                game_reward=-1 if exists else -1 if game_reward is None else game_reward.reward,
                place_count=place,
                total=game.place,
                geolocation_x=game.geolocation_x,
                geolocation_y=game.geolocation_y,
                start_at=str(game.start_at))

            games_dto.append(game_dto)

        return [game.dict() for game in games_dto]

    async def get_status_async(self, user_id: UUID):
        current_time = to_utc(datetime.utcnow())  # todo to utc
        stmt = select(Game).where(
            Game.start_at <= current_time,
            Game.end_at.is_(None),
            Game.type == GameType.Offline
        ).order_by(Game.start_at).limit(1)
        result = await self.db.execute(stmt)
        closest_game = result.scalars().first()
        if closest_game is None:
            return {"state": "idle"}

        exists_query = select(UserGame).where(
            UserGame.user_id == user_id, UserGame.game_id == closest_game.id
        ).exists()

        result = await self.db.execute(select(exists_query))
        exists = result.scalar()

        if exists:
            return {"state": "idle"}

        return {"state": "run"}

    async def claim_reward_async(self, user_id: UUID, game_id: UUID):
        try:
            current_time = to_utc(datetime.utcnow())

            stmt = (
                select(Game)
                .where(
                    Game.id == game_id,
                    Game.start_at <= current_time,
                    Game.end_at.is_(None),
                    Game.type == GameType.Offline
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
            total_count = result.scalar()

            user_data = (
                await self.db.execute(
                    select(UserData)
                    .where(UserData.user_id == user_id)
                )
            ).scalar_one_or_none()

            if user_data is None:
                raise CustomException("User data not found")

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

            if game_reward is None:
                raise CustomException("Game reward not found")

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

        except Exception as ex:
            Logger.log(ex.args)
            print(ex.args)
            return False

        return True
    #endregion

