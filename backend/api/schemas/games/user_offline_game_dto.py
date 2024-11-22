import datetime
from uuid import UUID

from pydantic import BaseModel


class UserOfflineGameDto(BaseModel):
    id: str
    game_reward: float
    place_count: int
    total: int
    geolocation_x: float
    geolocation_y: float
    start_at: str
