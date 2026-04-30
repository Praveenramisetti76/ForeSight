from fastapi import APIRouter, Depends
from app.schemas.auth import UserRegister, UserLogin, TokenResponse
from app.services import auth_service
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
async def register(user: UserRegister):
    return await auth_service.register_user(
        name=user.name,
        email=user.email,
        password=user.password,
        role=user.role,
    )


@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    return await auth_service.login_user(
        email=user.email,
        password=user.password,
    )


@router.put("/settings")
async def update_settings(data: dict, current_user: dict = Depends(get_current_user)):
    return await auth_service.update_user_settings(
        user_id=current_user["user_id"],
        name=data.get("name"),
        password=data.get("password"),
    )


@router.delete("/account")
async def delete_account(current_user: dict = Depends(get_current_user)):
    return await auth_service.delete_user_account(user_id=current_user["user_id"])
