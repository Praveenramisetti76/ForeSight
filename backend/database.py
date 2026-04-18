import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_URI)
db = client["risk_tool_db"]

users_collection = db["users"]
results_collection = db["results"]
risk_rules_collection = db["risk_rules"]