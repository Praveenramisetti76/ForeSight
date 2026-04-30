from pydantic import BaseModel


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "manager"


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str
    email: str
