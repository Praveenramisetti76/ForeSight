from pathlib import Path
import pandas as pd
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model.pkl"

def predict(duration: int, budget: float, team_size: int) -> dict:
    clf = joblib.load(MODEL_PATH)
    features = pd.DataFrame([[duration, budget, team_size]], columns=["duration", "budget", "team_size"])
    prediction = clf.predict(features)[0]
    probabilities = clf.predict_proba(features)[0]
    confidence = float(max(probabilities))
    return {"risk_level": prediction, "risk_score": round(confidence, 4)}
