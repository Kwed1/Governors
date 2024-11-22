from enum import Enum
from typing import List
from uuid import UUID

from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.websockets import WebSocket, WebSocketDisconnect

from config.database import get_db
from config.logger import LoggerSetup
from entities.game.game import GameType
from exceptions.custom_exception import CustomException
from identity.services.identity_service import IdentityService
from services.user_game.user_game_offline_service import UserGameOfflineService
from services.user_game.user_game_online_service import UserGameOnlineService

online_clients: List[WebSocket] = []
offline_clients: List[WebSocket] = []

app_logger = LoggerSetup.prepare()


class WebsocketType(Enum):
    Online = 1,
    Offline = 2


async def send_message_online_async(message):
    for client in online_clients[:]:
        try:
            await client.send_json(message)
        except WebSocketDisconnect:
            online_clients.remove(client)


async def send_message_offline_async(message):
    for client in offline_clients[:]:
        try:
            await client.send_json(message)
        except WebSocketDisconnect:
            offline_clients.remove(client)


async def online_websocket_endpoint(websocket: WebSocket, token: str, db: AsyncSession = Depends(get_db)):
    user_id = await init_socket(websocket=websocket, token=token, type=WebsocketType.Online, db=db)
    user_game_service = UserGameOnlineService(db)

    try:
        while True:
            data = await websocket.receive_json()
            if data['type'] == 'onlineGame':
                res = await user_game_service.claim_reward_async(user_id=user_id)
                if not res:
                    return
                await send_message_online_async({"claimed": True})
            elif data['type'] == 'getStatus':
                res = await user_game_service.get_status_async(user_id=user_id)
                await websocket.send_json(res)

            elif data['type'] == 'getInitialData':
                res = await user_game_service.get_current_user_count_async(user_id=user_id)
                await websocket.send_json(res)

    except WebSocketDisconnect as ex:
        app_logger.error(ex)
        online_clients.remove(websocket)
    except Exception as e:
        app_logger.error(e)


async def offline_websocket_endpoint(websocket: WebSocket, token: str, db: AsyncSession = Depends(get_db)):
    user_id = await init_socket(websocket=websocket, token=token, type=WebsocketType.Offline, db=db)
    user_game_service = UserGameOfflineService(db)

    try:
        while True:
            data = await websocket.receive_json()
            if isinstance(data['type'], str) and data['type'].startswith('offlineGame/'):
                game_id_str = data['type'].split('offlineGame/')[1]
                try:
                    game_id = UUID(game_id_str)
                    res = await user_game_service.claim_reward_async(user_id=user_id, game_id=game_id)
                    if not res:
                        return
                    await send_message_offline_async({"claimed": True})
                except ValueError:
                    return
            elif data['type'] == 'getInitialData':
                res = await user_game_service.get_current_games(user_id=user_id)
                await websocket.send_json(res)


    except WebSocketDisconnect as ex:
        app_logger.error(ex)
        offline_clients.remove(websocket)
    except Exception as e:
        app_logger.error(e)


async def init_socket(websocket: WebSocket, token: str, type: WebsocketType,
                      db: AsyncSession = Depends(get_db)) -> UUID:
    await websocket.accept()
    if type == WebsocketType.Offline:
        offline_clients.append(websocket)
    elif type == WebsocketType.Online:
        online_clients.append(websocket)

    identity_service = IdentityService(db)

    user_id = await identity_service.get_user_id_async(token)

    if not user_id:
        await websocket.close()
        online_clients.remove(websocket)
        offline_clients.remove(websocket)
        raise CustomException("Not authorized", 401)

    return user_id


def setup_websocket_routes(app: FastAPI):
    app.websocket("/online_ws")(online_websocket_endpoint)
    app.websocket("/offline_ws")(offline_websocket_endpoint)
