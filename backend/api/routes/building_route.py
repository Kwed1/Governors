import uuid

from fastapi import APIRouter, Depends, Request

from identity.decorators.authorize_route import authorized
from services.buildings.building_service import BuildingService

router = APIRouter()

@router.post('/buy')
@authorized
async def buy_async(building_id: uuid.UUID, request: Request, service: BuildingService = Depends()):
    user_id = request.state.login_id
    return await service.buy_async(user_id=user_id, building_id=building_id)

@router.get('/')
@authorized
async def get_async(request: Request, service: BuildingService = Depends()):
    user_id = request.state.login_id
    return await service.get_async(user_id=user_id)
