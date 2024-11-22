from typing import Optional

from pydantic import BaseModel


class UserDataDto(BaseModel):
    lvl: int
    current_coin: float
    coin_per_hour: float
    language: str
    status: Optional[str] = None
    diamonds: int
