import uuid

from fastapi import APIRouter, Depends, Request, HTTPException

from identity.decorators.authorize_route import authorized
from schemas.missions.mission_dto import CreateMissionDto
from services.missions.mission_service import MissionService

router = APIRouter()

@router.post('/add-mission')
@authorized
async def add_mission(request: Request, dto: CreateMissionDto, service: MissionService = Depends()):
    user_id = request.state.login_id
    return await service.add_async(user_id, dto)


@router.post('/remove-mission')
@authorized
async def add_mission(request: Request, id: uuid.UUID, service: MissionService = Depends()):
    user_id = request.state.login_id
    return await service.remove_async(user_id, id)


@router.get('/get-missions')
@authorized
async def get_admin_mission(request: Request, service: MissionService = Depends()):
    user_id = request.state.login_id
    return await service.get_async(user_id)


@router.get('/get-user-missions')
@authorized
async def get_missions(request: Request, service: MissionService = Depends()):
    user_id = request.state.login_id
    return await service.get_user_missions(x_user_id=user_id)


@router.post('/navigate')
@authorized
async def verify_async(request: Request, id: uuid.UUID, service: MissionService = Depends()):
    user_id = request.state.login_id
    return await service.navigate_async(user_id, id)


@router.post('/check')
@authorized
async def claim_reward_async(request: Request, id: uuid.UUID, service: MissionService = Depends()):
    user_id = request.state.login_id
    return await service.check_async(user_id, id)

 
@router.post('/claim')
@authorized
async def done_async(request: Request, id: uuid.UUID, service: MissionService = Depends()):
    user_id = request.state.login_id
    return await service.claim_async(user_id, id)
