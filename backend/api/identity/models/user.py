from sqlalchemy import (
    Column, String, Integer, BigInteger, Boolean, DateTime, ForeignKey, UUID,
    Double
)
from sqlalchemy.orm import relationship

from entities.base_entity import BaseEntity


class User(BaseEntity):
    __tablename__ = "users"

    username = Column(String)
    telegram_id = Column(BigInteger, unique=True)
    role = Column(String)
    deleted = Column(Boolean, default=False)
    delete_date = Column(DateTime, nullable=True)

    points = relationship("UserPoint", back_populates="user")
    data = relationship("UserData", back_populates="user", uselist=False)

class UserPoint(BaseEntity):
    __tablename__ = "user_points"

    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    latitude = Column(Double, nullable=False)
    longitude = Column(Double, nullable=False)
    claimed = Column(Boolean, default=False)
    reward = Column(Double, nullable=False, default=100)
    diamond_reward = Column(Double, nullable=False, default=1)
    user = relationship("User", back_populates="points")