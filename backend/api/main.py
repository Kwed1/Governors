from fastapi import FastAPI

from starlette.middleware.cors import CORSMiddleware
from config.database import init_db
from exceptions.exception_middleware import ErrorHandlingMiddleware
from identity.middlewares.add_authorization import authenticate_request
from routes import mission_route, friend_route, game_route, identity_route, building_route
from routes.websockets_route import setup_websocket_routes
from services.games.game_service import start_scheduler

app = FastAPI()

app.include_router(identity_route.router, prefix="/identity", tags=["identity"])
app.include_router(building_route.router, prefix="/building", tags=["building"])
app.include_router(mission_route.router, prefix="/mission", tags=["mission"])
app.include_router(friend_route.router, prefix="/friend", tags=["friend"])
app.include_router(game_route.router, prefix="/game", tags=["game"])

origins = ["*"]

start_scheduler()

app.middleware("http")(authenticate_request)

app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
setup_websocket_routes(app)


@app.on_event("startup")
async def startup_app():
    await init_db()
    openapi_schema = app.openapi()
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
