from fastapi import APIRouter, Depends, UploadFile, File
from models import RiskRules, DatasetInfo
from database import risk_rules_collection
from auth import require_admin
from ml.train import train_model, DATA_PATH
import pandas as pd

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...), current_user: dict = Depends(require_admin)):
    contents = await file.read()
    with open(DATA_PATH, "wb") as f:
        f.write(contents)
    train_model(force=True)
    return {"message": "Dataset uploaded and model retrained successfully"}

@router.put("/risk-rules")
async def update_risk_rules(rules: RiskRules, current_user: dict = Depends(require_admin)):
    await risk_rules_collection.delete_many({})
    await risk_rules_collection.insert_one(
        {
            "low_threshold": rules.low_threshold,
            "high_threshold": rules.high_threshold,
        }
    )
    return {"message": "Risk rules updated successfully"}

@router.get("/dataset-info")
async def get_dataset_info(current_user: dict = Depends(require_admin)):
    df = pd.read_csv(DATA_PATH)
    return DatasetInfo(row_count=len(df), columns=list(df.columns))
