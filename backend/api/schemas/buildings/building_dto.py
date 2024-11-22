from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class BuildingDto(BaseModel):
    id: UUID
    lvl: int
    price: float
    next_lvl_price: float
    name: str
    per_hour: float
    state: str
    friend_to_lvl_up: int
    rank_need_to_buy: Optional[str] = None
