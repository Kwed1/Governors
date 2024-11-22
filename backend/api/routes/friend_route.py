from fastapi import Depends, APIRouter, Request

from identity.decorators.authorize_route import authorized
from schemas.friends.friend import InviteFriendDto
from services.missions.mission_service import MissionService

router = APIRouter()

@router.post('/new-referal')
async def add_new_referal(inviter_id: int, user_id: int, user_name: str, is_premium: bool, service: MissionService = Depends()):
    return await service.add_new_referal_async(InviteFriendDto(inviter_id=inviter_id, user_id=user_id, user_name=user_name, is_premium=is_premium))


@router.get('/get-friends')
@authorized
async def get_friends_async(request: Request, skip: int, take: int, service: MissionService = Depends()):
    user_id = request.state.login_id
    return await service.get_friends_async(x_user_id=user_id, skip=skip, take=take)


