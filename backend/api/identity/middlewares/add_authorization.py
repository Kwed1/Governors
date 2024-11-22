from fastapi import HTTPException, Request, Depends
from fastapi.security import OAuth2PasswordBearer
from starlette import status

from config.configuration import oauth2_scheme
from config.database import get_db
from exceptions.custom_exception import CustomException
from identity.services.identity_service import IdentityService
from identity.services.token_service import TokenService

async def authenticate_request(request: Request, call_next):
    excluded_prefixes = ["/identity/upgrade-status", "/identity/sign-in", "/friend/new-referal",
                         "/docs", "/openapi.json",
                         "/ws" ]

    if not any(request.url.path.startswith(prefix) for prefix in excluded_prefixes):
        token = await oauth2_scheme(request)
        if token is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        async for db in get_db():
            identity_service = IdentityService(db=db, token_service=TokenService())
            try:
                user_id = await identity_service.authorized_user(token)
                request.state.login_id = user_id
            except HTTPException as ex:
                raise CustomException(error_code=status.HTTP_401_UNAUTHORIZED, message="Unauthorized")

    response = await call_next(request)
    return response
