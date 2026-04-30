import bcrypt
from fastapi import HTTPException
from app.database import users_collection
from app.dependencies import create_access_token


async def register_user(name: str, email: str, password: str, role: str = "manager") -> dict:
    """Create a new user account."""
    existing = await users_collection.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    if role not in ("manager", "admin"):
        raise HTTPException(status_code=400, detail="Role must be 'manager' or 'admin'")

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    result = await users_collection.insert_one(
        {
            "name": name,
            "email": email,
            "password": hashed,
            "role": role,
        }
    )
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}


async def login_user(email: str, password: str) -> dict:
    """Authenticate user and return a token response."""
    db_user = await users_collection.find_one({"email": email})

    if not db_user or not bcrypt.checkpw(password.encode("utf-8"), db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": str(db_user["_id"])})

    return {
        "access_token": token,
        "role": db_user["role"],
        "name": db_user["name"],
        "email": db_user["email"],
    }


async def update_user_settings(user_id: str, name: str | None, password: str | None) -> dict:
    """Update a user's display name and/or password."""
    from bson import ObjectId

    update_fields: dict = {}
    if name:
        update_fields["name"] = name
    if password:
        update_fields["password"] = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    if not update_fields:
        return {"message": "No changes provided"}

    await users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
    return {"message": "Settings updated successfully"}


async def delete_user_account(user_id: str) -> dict:
    """Delete a user account permanently."""
    from bson import ObjectId
    from app.database import predictions_collection

    await predictions_collection.delete_many({"user_id": user_id})
    await users_collection.delete_one({"_id": ObjectId(user_id)})
    return {"message": "Account deleted successfully"}
