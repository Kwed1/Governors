from datetime import datetime
from typing import List

from pydantic import BaseModel

from entities.game.game import GameType


class GamesRewardDto(BaseModel):
    from_place: int
    to_place: int
    reward: float


class CreateOnlineGameDto(BaseModel):
    start_at: datetime
    place: int
    rewards: List[GamesRewardDto]

class CreateOfflineGameDto(BaseModel):
    start_at: datetime
    place: int
    rewards: List[GamesRewardDto]
    geolocation_x: float
    geolocation_y: float

