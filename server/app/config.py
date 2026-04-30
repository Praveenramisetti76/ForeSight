import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from server root
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path)

# ── MongoDB ──
MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME: str = "risk_tool_db"

# ── Admin seed ──
ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@foresight.com")
ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "12345678")
ADMIN_NAME: str = os.getenv("ADMIN_NAME", "Admin")

# ── Paths ──
BASE_DIR = Path(__file__).resolve().parent.parent          # server/
DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "saved_models"
DATASET_PATH = DATA_DIR / "risk_dataset.csv"
BEST_MODEL_PATH = MODEL_DIR / "best_model.pkl"
