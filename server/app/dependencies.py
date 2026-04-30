from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId
from app.database import users_collection

security = HTTPBearer()


def create_access_token(data: dict) -> str:
    """Simple token = user's MongoDB ObjectId string."""
    return data["user_id"]


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Resolve Bearer token to a user document."""
    token = credentials.credentials
    try:
        user = await users_collection.find_one({"_id": ObjectId(token)})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "role": user["role"],
            "name": user["name"],
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Ensure the authenticated user has the admin role."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
