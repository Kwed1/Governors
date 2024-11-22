from sqlalchemy import Column, String, Integer, ForeignKey, UUID, Enum
from sqlalchemy.orm import relationship

from entities.base_entity import BaseEntity
from entities.user_data.user_coin import UserStatus


class Building(BaseEntity):
    __tablename__ = "building"

    name = Column(String, nullable=False)
    state = Column(String, nullable=False)
    prices = relationship('Price', back_populates='building', cascade='all, delete-orphan')
    revenues = relationship('Revenue', back_populates='building', cascade='all, delete-orphan')

class Price(BaseEntity):
    __tablename__ = 'price'

    lvl_to_up = Column(Integer, nullable=False, default=0)
    open_from = Column(Enum(UserStatus), nullable=True)
    amount = Column(Integer, nullable=False)
    building_id = Column(UUID(as_uuid=True), ForeignKey('building.id'), nullable=False)
    building = relationship('Building', back_populates='prices')

class Revenue(BaseEntity):
    __tablename__ = 'revenue'

    total = Column(Integer, nullable=False)
    building_id = Column(UUID(as_uuid=True), ForeignKey('building.id'), nullable=False)
    building = relationship('Building', back_populates='revenues')

