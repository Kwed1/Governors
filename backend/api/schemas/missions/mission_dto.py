from typing import List
from uuid import UUID

from pydantic import BaseModel


class CreateMissionDto(BaseModel):
    name: str
    type: str
    reward: float
    link: str
    icon_type: str
    tg_channel_id: int


class MissionDto(BaseModel):
    id: UUID
    name: str
    type: str
    reward: float
    link: str
    icon_type: str

class MissionPageDto(BaseModel):
    data: List[MissionDto]
    total: int


class UserMissionDto(BaseModel):
    id: UUID
    name: str
    reward: float
    link: str
    icon_type: str
    status: str
    tg_id: int



