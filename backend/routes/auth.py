from fastapi import APIRouter, HTTPException
from models import UserRegister, UserLogin, TokenResponse
from database import users_collection
import bcrypt
from auth import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
async def register(user: UserRegister):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    if user.role not in ("manager", "admin"):
        raise HTTPException(status_code=400, detail="Role must be 'manager' or 'admin'")
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    result = await users_collection.insert_one(
        {
            "name": user.name,
            "email": user.email,
            "password": hashed,
            "role": user.role,
        }
    )
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}

@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(
        {
            "user_id": str(db_user["_id"]),
            "email": db_user["email"],
            "role": db_user["role"],
            "name": db_user["name"],
        }
    )
    return TokenResponse(access_token=token, role=db_user["role"], name=db_user["name"])