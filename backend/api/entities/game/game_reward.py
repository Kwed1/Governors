from sqlalchemy import UUID, Column, Integer, Double

from entities.base_entity import BaseEntity


class GameReward(BaseEntity):
    __tablename__ = 'game_reward'

    game_id = Column(UUID)
    from_place = Column(Integer)
    to_place = Column(Integer)
    reward = Column(Double)
    diamond_reward = Column(Double)
