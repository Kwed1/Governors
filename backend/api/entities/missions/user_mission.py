from sqlalchemy import String, Column, Integer, UUID

from entities.base_entity import BaseEntity


class UserMission(BaseEntity):
    __tablename__ = "user_missions"

    user_id = Column(UUID)
    mission_id = Column(UUID)
    status = Column(String)
