from sqlalchemy import UUID, Column, Integer

from entities.base_entity import BaseEntity


class UserBuilding(BaseEntity):
    __tablename__ = 'user_building'

    user_id = Column(UUID)
    lvl = Column(Integer)
    building_id = Column(UUID)
