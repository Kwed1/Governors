from sqlalchemy import Column, Integer, Double, DateTime, String, UUID, Boolean, BigInteger

from entities.base_entity import BaseEntity


class Mission(BaseEntity):
    __tablename__ = "missions"

    reward = Column(Double)
    name = Column(String)
    icon = Column(String)
    type = Column(String)
    link = Column(String)
    chat_id = Column(BigInteger)

