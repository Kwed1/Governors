from datetime import datetime
from typing import List

from pydantic import BaseModel


class InviteFriendDto(BaseModel):
    inviter_id: int
    user_id: int
    user_name: str
    is_premium: bool


class FriendDto(BaseModel):
    user_name: str
    date_added: datetime
    bonus: float


class FriendPagedDto(BaseModel):
    data: List[FriendDto]
    total: int
    user_inviter: str

class ReferalDto(BaseModel):
    user_id: int
    referal_id: int
    date_added: datetime

class ReferalPagedDto(BaseModel):
    data: List[ReferalDto]
    total: int
