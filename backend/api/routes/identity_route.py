from fastapi import APIRouter, Depends, Request
from entities.user_data.user_coin import UserStatus
from identity.decorators.authorize_route import authorized
from identity.services.identity_service import IdentityService
from schemas.identity.token_dto import TokenDto
from services.user_data.user_data_service import UserDataService

router = APIRouter()

@router.get("/get-prices")
async def get_prices(request: Request, service: UserDataService = Depends()):
    return await service.get_donate_price(request.state.login_id)


@router.post('/upgrade-status')
async def upgrade_status(
        total_amount: float,
        user_id: int,
        request: Request, service: UserDataService = Depends()
):
    return await service.upgrade_status(user_id=user_id, total_amount=total_amount)

@router.post("/sign-in/", response_model=TokenDto)
async def sign_in_async(user_id: int, username: str, service: IdentityService = Depends()):
    return await service.sing_in_async(user_id=user_id, username=username)

@router.get("/get-data")
async def get_user_data_async(request: Request, service: UserDataService = Depends()):
    user_id = request.state.login_id
    return await service.get_data_async(user_id=user_id)

@router.get("/lvl-data")
async def lvl_data(request: Request, service: UserDataService = Depends()):
    return await service.get_lvl_data()

@router.patch("/change_language")
async def modify_culture(culture: str, request: Request, service: UserDataService = Depends()):
    user_id = request.state.login_id
    return await service.change_language(culture=culture,user_id=user_id)

@router.delete("/delete-account")
@authorized
async def delete_account_async(request: Request, service: UserDataService = Depends()):
    user_id = request.state.login_id
    return await service.delete_account_async(user_id=user_id)
