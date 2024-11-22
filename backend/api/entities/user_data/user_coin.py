from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, UUID, String, Boolean, Double, ForeignKey, Enum, Integer
from sqlalchemy.orm import relationship

from entities.base_entity import BaseEntity

class UserStatus(str, PyEnum):
    DIAMOND = 'diamond'
    GOLD = 'gold'
    SILVER = 'silver'
    BRONZE = 'bronze'

class UserData(BaseEntity):
    __tablename__ = 'user-data'

    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(UserStatus), nullable=True)
    diamonds = Column(Integer, default=0)
    coin = Column(Double)
    coin_per_hour = Column(Double)
    last_visit = Column(DateTime)
    current_language = Column(String)
    lvl = Column(Double, default=1)
    deleted = Column(Boolean, default=False)
    delete_date = Column(DateTime, nullable=True)

    total_claimed = Column(Integer, default=0)

    last_checked_friends_reward = Column(DateTime, default=datetime.utcnow)

    last_generate = Column(DateTime, nullable=True)
    virtual_pick_count = Column(Integer, nullable=False, default=0)
    generate_count = Column(Integer, nullable=False, default=0)
    user = relationship("User", back_populates="data")

