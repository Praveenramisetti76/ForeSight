from fastapi import APIRouter, Depends, UploadFile, File
from app.services import admin_service
from app.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/upload-dataset")
async def upload_dataset(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_admin),
):
    contents = await file.read()
    return await admin_service.upload_and_retrain(contents)


@router.get("/model-info")
async def model_info(current_user: dict = Depends(require_admin)):
    return await admin_service.get_model_metrics()


@router.get("/dataset-info")
async def dataset_info(current_user: dict = Depends(require_admin)):
    return await admin_service.get_dataset_info()
