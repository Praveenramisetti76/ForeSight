from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    project_type: str
    duration: int = Field(..., gt=0)
    budget: float = Field(..., gt=0)
    team_size: int = Field(..., gt=0)
    stakeholder_count: int = Field(..., gt=0)
    methodology: str
    team_experience: str


class PredictionResponse(BaseModel):
    project_id: str
    project_type: str
    duration: int
    budget: float
    team_size: int
    stakeholder_count: int
    methodology: str
    team_experience: str
    risk_level: str
    risk_score: float
    timestamp: str
