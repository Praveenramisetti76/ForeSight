from pydantic import BaseModel, Field
from typing import List

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

class PredictionRequest(BaseModel):
    duration: int = Field(..., gt=0)
    budget: float = Field(..., gt=0)
    team_size: int = Field(..., gt=0, le=500)

class PredictionResponse(BaseModel):
    project_id: str
    duration: int
    budget: float
    team_size: int
    risk_level: str
    risk_score: float
    timestamp: str

class RiskRules(BaseModel):
    low_threshold: float
    high_threshold: float

class DatasetInfo(BaseModel):
    row_count: int
    columns: List[str]