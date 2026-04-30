import pandas as pd
import joblib
from app.config import BEST_MODEL_PATH


def predict(
    project_type: str,
    team_size: int,
    budget: float,
    duration: int,
    stakeholder_count: int,
    methodology: str,
    team_experience: str,
) -> dict:
    payload = joblib.load(BEST_MODEL_PATH)
    pipeline = payload["pipeline"]
    label_enc = payload["label_encoder"]
    cat_encoders = payload["cat_encoders"]
    feat_cols = payload["feature_cols"]

    # Encode categorical values using stored LabelEncoders
    def _safe_encode(encoder, value: str) -> int:
        try:
            return int(encoder.transform([value])[0])
        except ValueError:
            return 0

    encoded_project_type = _safe_encode(cat_encoders["Project Type"], project_type)
    encoded_methodology = _safe_encode(cat_encoders["Methodology Used"], methodology)
    encoded_experience = _safe_encode(cat_encoders["Team Experience"], team_experience)

    sample = pd.DataFrame([{
        "Project Type": encoded_project_type,
        "Team Size": team_size,
        "Budget ($k)": budget,
        "Duration (months)": duration,
        "Stakeholder Count": stakeholder_count,
        "Methodology Used": encoded_methodology,
        "Team Experience": encoded_experience,
    }])

    proba = pipeline.predict_proba(sample[feat_cols])[0]
    pred_idx = pipeline.predict(sample[feat_cols])[0]
    labels = label_enc.classes_

    risk_level = labels[pred_idx]
    confidence = float(max(proba))

    return {
        "risk_level": risk_level,
        "risk_score": round(confidence, 4),
    }
