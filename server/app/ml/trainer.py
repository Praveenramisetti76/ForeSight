"""
trainer.py
----------
Trains multiple ML classifiers on the risk dataset,
picks the best by test accuracy, and saves it.

Models: Logistic Regression, Decision Tree, Random Forest,
        Gradient Boosting, XGBoost, SVM, KNN, Naive Bayes.

Adapted from Dataset/train_models.py for use as a FastAPI service.
"""

import os
import warnings
import time
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB

from app.config import DATASET_PATH, BEST_MODEL_PATH, MODEL_DIR

warnings.filterwarnings("ignore")

# Optional XGBoost
try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    print("[WARN] XGBoost not installed -- skipping. (pip install xgboost)")

RANDOM_STATE = 42

# Module-level cache for training results (served to admin panel)
_training_results: dict = {}


# ─────────────────────────────────────────────────────────────────────────────
# 1. LOAD & PREPROCESS
# ─────────────────────────────────────────────────────────────────────────────

def load_and_preprocess(path: str):
    """
    Returns X, y, feature_cols, target LabelEncoder,
    and the dict of categorical encoders.
    """
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} rows from '{path}'")
    print(f"Class distribution:\n{df['Risk Level'].value_counts()}\n")

    cat_cols = ["Project Type", "Methodology Used", "Team Experience"]
    encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le

    target_le = LabelEncoder()
    y = target_le.fit_transform(df["Risk Level"])

    feature_cols = [
        "Project Type", "Team Size", "Budget ($k)", "Duration (months)",
        "Stakeholder Count", "Methodology Used", "Team Experience"
    ]
    X = df[feature_cols].values

    return X, y, feature_cols, target_le, encoders


# ─────────────────────────────────────────────────────────────────────────────
# 2. MODEL REGISTRY
# ─────────────────────────────────────────────────────────────────────────────

def build_model_registry() -> dict:
    models = {
        "Logistic Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=1000, random_state=RANDOM_STATE))
        ]),
        "Decision Tree": Pipeline([
            ("scaler", "passthrough"),
            ("clf", DecisionTreeClassifier(max_depth=10, random_state=RANDOM_STATE))
        ]),
        "Random Forest": Pipeline([
            ("scaler", "passthrough"),
            ("clf", RandomForestClassifier(n_estimators=200, max_depth=12,
                                           random_state=RANDOM_STATE, n_jobs=-1))
        ]),
        "Gradient Boosting": Pipeline([
            ("scaler", "passthrough"),
            ("clf", GradientBoostingClassifier(n_estimators=200, learning_rate=0.1,
                                               max_depth=5, random_state=RANDOM_STATE))
        ]),
        "SVM": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", SVC(kernel="rbf", C=1.0, gamma="scale",
                        random_state=RANDOM_STATE, probability=True))
        ]),
        "KNN": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", KNeighborsClassifier(n_neighbors=7, metric="euclidean"))
        ]),
        "Naive Bayes": Pipeline([
            ("scaler", "passthrough"),
            ("clf", GaussianNB())
        ]),
    }

    if XGBOOST_AVAILABLE:
        models["XGBoost"] = Pipeline([
            ("scaler", "passthrough"),
            ("clf", XGBClassifier(n_estimators=200, learning_rate=0.1,
                                   max_depth=5, use_label_encoder=False,
                                   eval_metric="mlogloss",
                                   random_state=RANDOM_STATE))
        ])

    return models


# ─────────────────────────────────────────────────────────────────────────────
# 3. TRAIN & EVALUATE
# ─────────────────────────────────────────────────────────────────────────────

def _train_and_evaluate(models: dict, X_train, X_test, y_train, y_test,
                        label_names: list) -> list:
    results = []

    print("=" * 70)
    print(f"{'Model':<25} {'Train Acc':>10} {'Test Acc':>10} {'CV Mean':>10} {'Time(s)':>9}")
    print("=" * 70)

    for name, pipeline in models.items():
        t0 = time.time()
        pipeline.fit(X_train, y_train)
        elapsed = time.time() - t0

        train_acc = accuracy_score(y_train, pipeline.predict(X_train))
        test_acc = accuracy_score(y_test, pipeline.predict(X_test))

        cv_scores = cross_val_score(pipeline, X_train, y_train,
                                    cv=5, scoring="accuracy", n_jobs=-1)

        print(f"{name:<25} {train_acc:>10.4f} {test_acc:>10.4f} "
              f"{cv_scores.mean():>10.4f} {elapsed:>9.2f}s")

        results.append({
            "name": name,
            "pipeline": pipeline,
            "train_acc": train_acc,
            "test_acc": test_acc,
            "cv_mean": cv_scores.mean(),
            "cv_std": cv_scores.std(),
            "elapsed": elapsed,
        })

    print("=" * 70)
    return results


# ─────────────────────────────────────────────────────────────────────────────
# 4. PUBLIC API
# ─────────────────────────────────────────────────────────────────────────────

def train_all_models(force: bool = False):
    """
    Train all models, pick best, save to disk.
    Called at startup and when admin uploads new data.
    """
    global _training_results

    if BEST_MODEL_PATH.exists() and not force:
        print(f"[OK] Model already exists at {BEST_MODEL_PATH}, skipping training.")
        # Load cached results if available
        try:
            payload = joblib.load(BEST_MODEL_PATH)
            _training_results = payload.get("metrics", {})
        except Exception:
            pass
        return

    print("\n[INFO] Training all models...")
    X, y, feature_cols, target_le, cat_encoders = load_and_preprocess(str(DATASET_PATH))
    label_names = list(target_le.classes_)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )
    print(f"Train: {len(X_train)} samples  |  Test: {len(X_test)} samples\n")

    models = build_model_registry()
    results = _train_and_evaluate(models, X_train, X_test, y_train, y_test, label_names)

    # Pick best by test accuracy
    best = max(results, key=lambda r: r["test_acc"])

    print(f"\n[BEST] Best Model: {best['name']}")
    print(f"    Test Accuracy : {best['test_acc']:.4f}")
    print(f"    CV Mean±Std   : {best['cv_mean']:.4f} ± {best['cv_std']:.4f}")

    # Classification report for admin panel
    y_pred = best["pipeline"].predict(X_test)
    report = classification_report(y_test, y_pred, target_names=label_names, output_dict=True)
    cm = confusion_matrix(y_test, y_pred).tolist()

    # Build a comparison table for all models
    comparison = []
    for r in results:
        comparison.append({
            "name": r["name"],
            "train_acc": round(r["train_acc"], 4),
            "test_acc": round(r["test_acc"], 4),
            "cv_mean": round(r["cv_mean"], 4),
            "cv_std": round(r["cv_std"], 4),
            "elapsed": round(r["elapsed"], 2),
        })

    metrics = {
        "best_model": best["name"],
        "test_accuracy": round(best["test_acc"], 4),
        "cv_mean": round(best["cv_mean"], 4),
        "cv_std": round(best["cv_std"], 4),
        "classification_report": report,
        "confusion_matrix": cm,
        "label_names": label_names,
        "comparison": comparison,
    }

    _training_results = metrics

    # Save everything needed for inference
    os.makedirs(MODEL_DIR, exist_ok=True)
    payload = {
        "model_name": best["name"],
        "pipeline": best["pipeline"],
        "label_encoder": target_le,
        "cat_encoders": cat_encoders,
        "feature_cols": feature_cols,
        "test_accuracy": best["test_acc"],
        "cv_mean": best["cv_mean"],
        "metrics": metrics,
    }
    joblib.dump(payload, BEST_MODEL_PATH)
    print(f"\n[OK] Best model saved -> {BEST_MODEL_PATH}")


def get_training_results() -> dict:
    """Return the cached training metrics for the admin panel."""
    global _training_results
    if not _training_results and BEST_MODEL_PATH.exists():
        try:
            payload = joblib.load(BEST_MODEL_PATH)
            _training_results = payload.get("metrics", {})
        except Exception:
            pass
    return _training_results
