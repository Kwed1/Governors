from sqlalchemy import Column, Integer, Double, DateTime, String, UUID, BigInteger

from entities.base_entity import BaseEntity


class Friend(BaseEntity):
    __tablename__ = "friends"

    user_id = Column(BigInteger)
    user_name = Column(String)
    friend_id = Column(BigInteger)
    date_added = Column(DateTime)
    bonus = Column(Double)
    last_claim = Column(Double)

