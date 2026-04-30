import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI, DB_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME

client = AsyncIOMotorClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
db = client[DB_NAME]

users_collection = db["users"]
predictions_collection = db["predictions"]


async def seed_admin():
    await users_collection.drop()
    await predictions_collection.drop()

    await users_collection.create_index("email", unique=True)

    hashed = bcrypt.hashpw(ADMIN_PASSWORD.encode("utf-8"), bcrypt.gensalt())

    await users_collection.insert_one(
        {
            "name": ADMIN_NAME,
            "email": ADMIN_EMAIL,
            "password": hashed,
            "role": "admin",
        }
    )
    print(f"[OK] Admin user seeded: {ADMIN_EMAIL}")
