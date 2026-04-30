from datetime import datetime, timezone
from app.database import predictions_collection
from app.ml.predictor import predict


async def run_prediction(user_id: str, data: dict) -> dict:
    result = predict(
        project_type=data["project_type"],
        team_size=data["team_size"],
        budget=data["budget"],
        duration=data["duration"],
        stakeholder_count=data["stakeholder_count"],
        methodology=data["methodology"],
        team_experience=data["team_experience"],
    )

    timestamp = datetime.now(timezone.utc)

    doc = {
        "user_id": user_id,
        "project_type": data["project_type"],
        "team_size": data["team_size"],
        "budget": data["budget"],
        "duration": data["duration"],
        "stakeholder_count": data["stakeholder_count"],
        "methodology": data["methodology"],
        "team_experience": data["team_experience"],
        "risk_level": result["risk_level"],
        "risk_score": result["risk_score"],
        "timestamp": timestamp,
    }

    inserted = await predictions_collection.insert_one(doc)

    return {
        "project_id": str(inserted.inserted_id),
        "project_type": data["project_type"],
        "duration": data["duration"],
        "budget": data["budget"],
        "team_size": data["team_size"],
        "stakeholder_count": data["stakeholder_count"],
        "methodology": data["methodology"],
        "team_experience": data["team_experience"],
        "risk_level": result["risk_level"],
        "risk_score": result["risk_score"],
        "timestamp": timestamp.isoformat(),
    }


async def get_user_history(user_id: str) -> list:
    cursor = predictions_collection.find({"user_id": user_id}).sort("timestamp", -1)
    results = []
    async for doc in cursor:
        results.append(
            {
                "project_id": str(doc["_id"]),
                "project_type": doc["project_type"],
                "duration": doc["duration"],
                "budget": doc["budget"],
                "team_size": doc["team_size"],
                "stakeholder_count": doc.get("stakeholder_count", 0),
                "methodology": doc.get("methodology", "-"),
                "team_experience": doc.get("team_experience", "-"),
                "risk_level": doc["risk_level"],
                "risk_score": doc["risk_score"],
                "timestamp": doc["timestamp"].isoformat(),
            }
        )
    return results
