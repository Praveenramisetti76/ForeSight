from pathlib import Path
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model.pkl"
DATA_PATH = BASE_DIR / "sample_data.csv"

def train_model(force: bool = False):
    if MODEL_PATH.exists() and not force:
        return
    df = pd.read_csv(DATA_PATH)
    X = df[["duration", "budget", "team_size"]]
    y = df["risk_level"]
    clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    clf.fit(X, y)
    joblib.dump(clf, MODEL_PATH)