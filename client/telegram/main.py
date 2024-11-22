import asyncio

from aiogram.filters import Command
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
import requests
import uvicorn
from aiogram import Bot, Dispatcher, types, F
from aiogram.methods import CreateInvoiceLink
from aiogram.types import (
    InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, LabeledPrice,
    PreCheckoutQuery
)
from pydantic import BaseModel
from starlette.responses import JSONResponse

API_TOKEN = '7750391479:AAHLGygt5eb5wStbxMZu6q2sYoikddYb3Pc'
WEB_APP = 'https://tgmochispa.devmainops.store/'
API_URL = 'https://tgmochapi.devmainops.store'#todo
bot = Bot(token=API_TOKEN)
dp = Dispatcher()
app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
welcome_text = """
Hello! Welcome to Governors Game 🏛️

You are now the governor of a vast, undeveloped city.
What kind of city will it become? The choice is yours.  
Earn coins by physically visiting marked locations on the map or by participating in online games that appear randomly.  
In the online game, quick reactions are key—tap first to earn the most coins, with diminishing rewards for those who join later.  
Invest in key infrastructure, develop your city’s unique strategy for growth, and watch it flourish.  
Don’t forget to invite your friends to join the game; together, you can expand your influence even further!
"""

how_to_earn_text = """
How to play Governors Game⚡️

🌍 Explore and Earn
Earn coins by traveling to designated locations on the map or by participating in limited-time online games. Be quick—those who TAP first earn more coins!

🏗️ Build and Upgrade  
Use your earned coins to construct and upgrade buildings, increasing your city’s revenue over time.

👥 Friends  
Invite friends to join the game and receive bonuses when they succeed. Help them grow, and you’ll both earn more rewards.

🪙 Token Distribution  
At the end of the season, Governor Tokens will be distributed to players based on the total amount of coins they’ve earned throughout the game. Stay updated on the exact dates through our announcements!
"""


async def send_welcome_async(message: types.Message):
    x = message.text

    if x.startswith('/start'):
        parts = x.split()
        inviter_id = parts[1] if len(parts) > 1 and parts[1].isdigit() else None

    if inviter_id:
        try:
            is_premium = message.from_user.is_premium is not None and message.from_user.is_premium == True
            response = requests.post(
                f'{API_URL}/friend/new-referal?inviter_id={inviter_id}&user_id={message.from_user.id}&user_name={message.from_user.username}&is_premium={is_premium}'
            )
            res = response.text
        except Exception as ex:
            print(ex.args)
    button_start = InlineKeyboardButton(text="Start🚀", web_app=WebAppInfo(url=WEB_APP))
    info = InlineKeyboardButton(text="How to play Governors Game⚡️", callback_data="how_to_earn")
    keyboard = InlineKeyboardMarkup(inline_keyboard=[[button_start], [info]])
    await bot.send_message(
        message.from_user.id, text=welcome_text, parse_mode='HTML', reply_markup=keyboard
        )


class DonateModel(BaseModel):
    description: str
    amount: int


@dp.pre_checkout_query()
async def pre_checkout_query(event: PreCheckoutQuery) -> None:
    await event.answer(True)


@app.post('/donate')
async def donate(schema: DonateModel) -> JSONResponse:
    invoice_link = await bot(
        CreateInvoiceLink(
            title='Governors',
            description=schema.description,
            payload='donate',
            currency='XTR',
            prices=[LabeledPrice(label='XTR', amount=schema.amount)],
        )
    )

    return JSONResponse({'invoice_link': invoice_link})


@dp.message(F.successful_payment)
async def successful_payment(message: types.Message) -> None:
    payment_info = message.successful_payment
    total_amount = payment_info.total_amount
    requests.post(
        f'{API_URL}/identity/upgrade-status?total_amount={total_amount}&user_id={message.from_user.id}'
    )


@dp.message(Command('start'))
async def start(message: types.Message):
    await send_welcome_async(message)


@dp.callback_query(F.data)
async def process_callback(callback_query: types.CallbackQuery):
    if callback_query.data == "how_to_earn":
        button_start = InlineKeyboardButton(text="Start🚀", web_app=WebAppInfo(url=WEB_APP))
        keyboard = InlineKeyboardMarkup(inline_keyboard=[[button_start]])
        await bot.send_message(
            callback_query.from_user.id, text=how_to_earn_text, parse_mode='HTML',
            reply_markup=keyboard
            )


async def run_bot():
    await dp.start_polling(bot)


async def on_startup():
    print('start')
    config = uvicorn.Config(app, host="0.0.0.0", port=8555)
    server = uvicorn.Server(config)
    task = asyncio.create_task(server.serve())
    print('done')


async def main():
    await asyncio.gather(run_bot(), on_startup())


if __name__ == "__main__":
    asyncio.run(main())
