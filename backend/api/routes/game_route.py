from uuid import UUID

from fastapi import Depends, APIRouter, Request
from geopy.distance import distance
from geopy.point import Point
from pydantic import BaseModel

from identity.decorators.authorize_route import authorized
from schemas.friends.friend import InviteFriendDto
from schemas.games.create_game_dto import CreateOnlineGameDto, CreateOfflineGameDto
from services.games.game_service import GameService
from services.missions.mission_service import MissionService
from services.user_game.user_game_offline_service import UserGameOfflineService, UserCoordinates

router = APIRouter()


@router.get('/get-points')
async def get_points(request: Request, service: UserGameOfflineService =Depends()):
    return await service.get_points(user_id=request.state.login_id)

@router.post("/generate-points")
async def generate_points(user_coords: UserCoordinates, request: Request, service: UserGameOfflineService =Depends()):
    return await service.generate_points(user_coords, user_id=request.state.login_id)

@router.post('/claim/{point_id}')
async def claim(point_id: UUID, request: Request, service: UserGameOfflineService = Depends()):
    return await service.claim(point_id=point_id, user_id=request.state.login_id)

@router.post('/online')
@authorized
async def add_game_async(dto: CreateOnlineGameDto, service: GameService = Depends()):
    return await service.add_online_async(dto)

@router.delete('/')
async def remove_game_async(game_id: UUID, service: GameService = Depends()):
    return await service.delete_async(game_id=game_id)

@router.post('/offline')
@authorized
async def add_game_async(dto: CreateOfflineGameDto, service: GameService = Depends()):
    return await service.add_offline_async(dto)

@router.get('/')
@authorized
async def get_async(service: GameService = Depends()):
    return await service.get_async()
