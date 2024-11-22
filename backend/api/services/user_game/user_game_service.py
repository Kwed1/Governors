from abc import ABC, abstractmethod
from uuid import UUID


class UserGameService(ABC):

    @abstractmethod
    async def get_status_async(self, user_id: UUID):
        raise NotImplementedError

    @abstractmethod
    async def claim_reward_async(self, user_id: UUID, game_id: UUID):
        raise NotImplementedError
