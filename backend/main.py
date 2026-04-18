from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import auth as auth_routes
from routes import projects as project_routes
from routes import admin as admin_routes
from ml.train import train_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    train_model()
    yield

app = FastAPI(title="ForeSight - AI Risk Prediction Tool", lifespan=lifespan)

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