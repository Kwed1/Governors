from sqlalchemy import Column, DateTime, UUID, Integer, BigInteger

from entities.base_entity import BaseEntity


class Referal(BaseEntity):
    __tablename__ = "referals"

    user_id = Column(BigInteger)
    referal_id = Column(BigInteger)
    date_added = Column(DateTime)
