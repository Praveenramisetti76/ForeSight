from app.config import DATASET_PATH
from app.ml.trainer import train_all_models, get_training_results
import pandas as pd


async def upload_and_retrain(file_bytes: bytes) -> dict:
    """Save uploaded CSV and retrain all models."""
    with open(DATASET_PATH, "wb") as f:
        f.write(file_bytes)

    train_all_models(force=True)
    return {"message": "Dataset uploaded and model retrained successfully!"}


async def get_model_metrics() -> dict:
    """Return the stored training metrics for the admin panel."""
    return get_training_results()


async def get_dataset_info() -> dict:
    """Return basic info about the current dataset."""
    df = pd.read_csv(DATASET_PATH)
    return {"row_count": len(df), "columns": list(df.columns)}
