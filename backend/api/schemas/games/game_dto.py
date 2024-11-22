import datetime
from uuid import UUID

from pydantic import BaseModel


class GameDto(BaseModel):
    id: UUID
    name: str
    participants: str
    start: datetime.datetime
    end: str