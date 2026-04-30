from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import seed_admin
from app.ml.trainer import train_all_models
from app.routes import auth as auth_routes
from app.routes import projects as project_routes
from app.routes import admin as admin_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await seed_admin()
    except Exception as e:
        print(f"[WARN] MongoDB seed failed (is the cluster running?): {e}")
    train_all_models()
    yield


app = FastAPI(title="ForeSight — AI Risk Prediction Tool", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(project_routes.router)
app.include_router(admin_routes.router)


@app.get("/")
async def root():
    return {"message": "ForeSight API is running"}
