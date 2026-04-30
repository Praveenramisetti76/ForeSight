from fastapi import APIRouter, Depends
from app.schemas.project import PredictionRequest
from app.services import project_service
from app.dependencies import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/predict")
async def predict_risk(
    req: PredictionRequest,
    current_user: dict = Depends(get_current_user),
):
    return await project_service.run_prediction(
        user_id=current_user["user_id"],
        data=req.model_dump(),
    )


@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    return await project_service.get_user_history(user_id=current_user["user_id"])
