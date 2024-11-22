from sqlalchemy import Column, UUID

from entities.base_entity import BaseEntity


class UserGame(BaseEntity):
    __tablename__ = 'user_game'

    user_id = Column(UUID)
    game_id = Column(UUID)
