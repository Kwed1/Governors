import datetime
from typing import AsyncGenerator

from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import Query

from entities.base_entity import BaseEntity
from entities.builidngs.building import Building, Price, Revenue
from entities.missions.friend import Friend
from entities.missions.mission import Mission
from entities.user_data.user_coin import UserData, UserStatus
from identity.models.user import User

#SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://governors-admin:dBOo6UrxMICO@95.216.217.47:5432
# /governors"
SQLALCHEMY_DATABASE_URL = 'postgresql+asyncpg://postgres@95.169.201.222:5461/postgres'
#SQLALCHEMY_DATABASE_URL = 'postgresql+asyncpg://neondb_owner:fYFEMs4CkUr0@ep-long-bar-a513nllb
# .us-east-2.aws.neon.tech:5432/neondb'
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=200,
    max_overflow=100,
    pool_timeout=30, 
    pool_recycle=1800, 
)


class FilteredQuery(Query):
    def filter_deleted(self):
        return self.filter(User.deleted == False, UserData.deleted == False)


SessionLocal = async_sessionmaker(bind=engine)
 
friend = 0
async def create_buildings_and_related_data(session: AsyncSession):
    buildings_data = [
        # East District
        {"name": "Garden", "levels": 10, "state": "East",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "Park", "levels": 10, "state": "East",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "Theme Park", "levels": 10, "state": "East",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},
        {"name": "Yoga Garden", "levels": 10, "state": "East",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "Sauna", "levels": 10, "state": "East",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "Community Pool", "levels": 10, "state": "East",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},
        {"name": "General Store", "levels": 10, "state": "East",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "Shopping Center", "levels": 10, "state": "East",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "Mall", "levels": 10, "state": "East",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},
        {"name": "Library", "levels": 10, "state": "East",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "Museum", "levels": 10, "state": "East",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "Opera", "levels": 10, "state": "East",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},
        {"name": "Bus Station", "levels": 10, "state": "East",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "Metro", "levels": 10, "state": "East",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "Airport", "levels": 10, "state": "East",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},
        # West District
        {"name": "Firewatch Tower", "levels": 10, "state": "West",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "Fire House", "levels": 10, "state": "West",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "Fire Station", "levels": 10, "state": "West",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},
        {"name": "Ambulance", "levels": 10, "state": "West",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "Medical Clinic", "levels": 10, "state": "West",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "Hospital", "levels": 10, "state": "West",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},
        {"name": "Police Station", "levels": 10, "state": "West",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "Police Department", "levels": 10, "state": "West",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "GIS (Governors Intelligence Service)", "levels": 10, "state": "West",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},
        {"name": "School", "levels": 10, "state": "West",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "College", "levels": 10, "state": "West",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "University", "levels": 10, "state": "West",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},
        {"name": "Radio Station", "levels": 10, "state": "West",
         "prices": [100, 200, 400, 600, 1000, 2000, 3000, 6000, 8000, 10000],
         "revenues": [1, 2, 4, 6, 10, 15, 20, 30, 40, 50], "status": None},
        {"name": "Newspaper", "levels": 10, "state": "West",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [2, 3, 5, 7, 10, 15, 30, 40, 50, 70], "status": None,
         "referrals": {1: 1, 6: 5}},
        {"name": "TV Station", "levels": 10, "state": "West",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [3, 4, 6, 8, 10, 20, 30, 50, 70, 100], "status": None,
         "referrals": {1: 3, 6: 7}},

        # Downtown
        {"name": "Currency Exchange", "levels": 10, "state": "Downtown",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [3, 4, 6, 8, 13, 25, 48, 70, 100, 130], "status": UserStatus.BRONZE},
        {"name": "Bank", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [4, 5, 8, 11, 14, 30, 80, 130, 200, 300], "status": UserStatus.SILVER},
        {"name": "Stock Exchange", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [6, 8, 12, 16, 20, 50, 100, 160, 250, 400], "status": UserStatus.GOLD},
        {"name": "Tennis Court", "levels": 10, "state": "Downtown",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [3, 4, 6, 8, 13, 25, 48, 70, 100, 130], "status": UserStatus.BRONZE},
        {"name": "Basketball Arena", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [4, 5, 8, 11, 14, 30, 80, 150, 200, 300], "status": UserStatus.SILVER},
        {"name": "Stadium", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [6, 8, 12, 16, 20, 50, 100, 160, 250, 400], "status": UserStatus.GOLD},
        {"name": "Oil Power Plant", "levels": 10, "state": "Downtown",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [3, 4, 6, 8, 13, 25, 48, 70, 100, 130], "status": UserStatus.BRONZE},
        {"name": "Solar Power Plant", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [4, 5, 8, 11, 14, 30, 80, 150, 200, 300], "status": UserStatus.SILVER},
        {"name": "Nuclear Power Plant", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [6, 8, 12, 16, 20, 50, 100, 160, 250, 400], "status": UserStatus.GOLD},
        {"name": "Hostel", "levels": 10, "state": "Downtown",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [3, 4, 6, 8, 13, 25, 48, 70, 100, 130], "status": UserStatus.BRONZE},
        {"name": "Plaza Hotel", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [4, 5, 8, 11, 14, 30, 80, 150, 200, 300], "status": UserStatus.SILVER},
        {"name": "Grand Resort", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [6, 8, 12, 16, 20, 50, 100, 160, 250, 400], "status": UserStatus.GOLD},
        {"name": "Local Bingo Club", "levels": 10, "state": "Downtown",
         "prices": [200, 300, 500, 700, 1000, 2200, 5000, 8000, 12000, 16000],
         "revenues": [3, 4, 6, 8, 13, 25, 48, 70, 100, 130], "status": UserStatus.BRONZE},
        {"name": "Poker Club", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [4, 5, 8, 11, 14, 30, 80, 150, 200, 300], "status": UserStatus.SILVER},
        {"name": "Casino", "levels": 10, "state": "Downtown",
         "prices": [300, 400, 600, 800, 1000, 3000, 8000, 14000, 20000, 30000],
         "revenues": [6, 8, 12, 16, 20, 50, 100, 160, 250, 400], "status": UserStatus.GOLD},
    ]

    for building_data in buildings_data:
        building = Building(name=building_data["name"], state=building_data["state"])
        session.add(building)
        await session.flush()

        for lvl, (price, revenue) in enumerate(zip(building_data["prices"], building_data["revenues"]), start=1):
            lvl_to_up = None
            if "referrals" in building_data and lvl in building_data["referrals"]:
                lvl_to_up = building_data["referrals"][lvl]

            price_entry = Price(
                lvl_to_up=lvl_to_up,
                open_from=building_data.get("status"),
                amount=int(price),
                building_id=building.id,
            )
            session.add(price_entry)

            revenue_entry = Revenue(
                total=int(revenue),
                building_id=building.id,
            )
            session.add(revenue_entry)

    await session.commit()

def to_utc(dt):
    if dt.tzinfo is None:
        return dt.replace(tzinfo=datetime.timezone.utc)
    return dt.astimezone(datetime.timezone.utc)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(BaseEntity.metadata.create_all)

    async with SessionLocal() as session:
        #await create_buildings_and_related_data(session=session)
        mission = (await session.execute(select(Mission))).scalars().first()
        if not mission:
            fiend_mission = Mission(reward=500.0, name="Invite your first friend", icon="Friend", type="Friend",
                                    link="", chat_id=0)
            session.add(fiend_mission)
        await session.commit()


async def get_db():
    async with engine.begin() as conn:
        await conn.run_sync(BaseEntity.metadata.create_all)

    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()
