from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from models import PredictionRequest
from database import results_collection, risk_rules_collection
from auth import get_current_user
from ml.predict import predict

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/predict")
async def predict_risk(
    req: PredictionRequest, current_user: dict = Depends(get_current_user)
):
    result = predict(req.duration, req.budget, req.team_size)

    # Check for admin risk rules overrides
    rules = await risk_rules_collection.find_one({})
    if rules:
        score = result["risk_score"]
        if score < rules["low_threshold"]:
            result["risk_level"] = "Low"
        elif score > rules["high_threshold"]:
            result["risk_level"] = "High"
        else:
            result["risk_level"] = "Medium"

    timestamp = datetime.now(timezone.utc)
    doc = {
        "user_id": current_user["user_id"],
        "duration": req.duration,
        "budget": req.budget,
        "team_size": req.team_size,
        "risk_level": result["risk_level"],
        "risk_score": result["risk_score"],
        "timestamp": timestamp,
    }

    inserted = await results_collection.insert_one(doc)

    return {
        "project_id": str(inserted.inserted_id),
        "duration": req.duration,
        "budget": req.budget,
        "team_size": req.team_size,
        "risk_level": result["risk_level"],
        "risk_score": result["risk_score"],
        "timestamp": timestamp.isoformat(),
    }


@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    cursor = results_collection.find({"user_id": current_user["user_id"]}).sort(
        "timestamp", -1
    )
    results = []
    async for doc in cursor:
        results.append(
            {
                "project_id": str(doc["_id"]),
                "duration": doc["duration"],
                "budget": doc["budget"],
                "team_size": doc["team_size"],
                "risk_level": doc["risk_level"],
                "risk_score": doc["risk_score"],
                "timestamp": doc["timestamp"].isoformat(),
            }
        )
    return results
