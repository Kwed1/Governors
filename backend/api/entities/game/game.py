from enum import Enum

from sqlalchemy import DateTime, Column, Integer, Enum as SQLEnum, Double

from entities.base_entity import BaseEntity


class GameType(Enum):
    Online = 1
    Offline = 2

class Game(BaseEntity):
    __tablename__ = 'game'

    type = Column(SQLEnum(GameType))
    start_at = Column(DateTime(timezone=True))
    end_at = Column(DateTime(timezone=True), nullable=True)
    place = Column(Integer)
    geolocation_x = Column(Double, nullable=True)
    geolocation_y = Column(Double, nullable=True)

