import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI, DB_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME

# ── Motor client & collections ──
client = AsyncIOMotorClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
db = client[DB_NAME]

users_collection = db["users"]
predictions_collection = db["predictions"]


async def seed_admin():
    """
    Drop all collections and seed the built-in admin user.
    Called once during application startup.
    """
    # Clear old data
    await users_collection.drop()
    await predictions_collection.drop()

    # Create unique index on email
    await users_collection.create_index("email", unique=True)

    # Hash admin password
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
