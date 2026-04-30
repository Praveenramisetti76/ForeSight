"""
train_models.py
----------------
Trains multiple ML classifiers on the Product Risk dataset,
prints a comparison table, and saves the best model.

Models evaluated:
  1. Logistic Regression
  2. Decision Tree
  3. Random Forest
  4. Gradient Boosting (sklearn)
  5. XGBoost
  6. Support Vector Machine (SVM)
  7. K-Nearest Neighbours (KNN)
  8. Naive Bayes

Run:
  python train_models.py
"""

import os
import warnings
import time
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection     import train_test_split, cross_val_score
from sklearn.preprocessing       import LabelEncoder, StandardScaler
from sklearn.pipeline            import Pipeline
from sklearn.metrics             import (accuracy_score, classification_report,
                                         confusion_matrix)

from sklearn.linear_model        import LogisticRegression
from sklearn.tree                import DecisionTreeClassifier
from sklearn.ensemble            import (RandomForestClassifier,
                                         GradientBoostingClassifier)
from sklearn.svm                 import SVC
from sklearn.neighbors           import KNeighborsClassifier
from sklearn.naive_bayes         import GaussianNB

warnings.filterwarnings("ignore")

# ── Optional XGBoost ──────────────────────────────────────────────────────────
try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    print("⚠️  XGBoost not installed — skipping. (pip install xgboost)")

DATASET_PATH  = "risk_dataset.csv"
MODEL_DIR     = "saved_models"
BEST_MODEL_PATH = os.path.join(MODEL_DIR, "best_model.pkl")
RANDOM_STATE  = 42


# ─────────────────────────────────────────────────────────────────────────────
# 1. LOAD & PREPROCESS
# ─────────────────────────────────────────────────────────────────────────────

def load_and_preprocess(path: str):
    """
    Returns X (encoded features), y (encoded labels),
    feature names, and the label encoder for y.
    """
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} rows from '{path}'")
    print(f"Class distribution:\n{df['Risk Level'].value_counts()}\n")

    # ── Encode categorical columns ──
    cat_cols = ["Project Type", "Methodology Used", "Team Experience"]
    encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le

    # ── Target ──
    target_le = LabelEncoder()
    y = target_le.fit_transform(df["Risk Level"])   # Low=0, Medium=1, High=2 (sorted)

    feature_cols = [
        "Project Type", "Team Size", "Budget ($k)", "Duration (months)",
        "Stakeholder Count", "Methodology Used", "Team Experience"
    ]
    X = df[feature_cols].values

    return X, y, feature_cols, target_le


# ─────────────────────────────────────────────────────────────────────────────
# 2. MODEL REGISTRY
# ─────────────────────────────────────────────────────────────────────────────

def build_model_registry(use_scaler: bool = True) -> dict:
    """
    Returns dict of {name: sklearn Pipeline}.
    SVM, LR, KNN benefit from scaling; tree-based models don't need it
    but it doesn't hurt to include a scaler in the pipeline.
    """
    scaler = StandardScaler()

    models = {
        "Logistic Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("clf",    LogisticRegression(max_iter=1000, random_state=RANDOM_STATE))
        ]),
        "Decision Tree": Pipeline([
            ("scaler", "passthrough"),
            ("clf",    DecisionTreeClassifier(max_depth=10, random_state=RANDOM_STATE))
        ]),
        "Random Forest": Pipeline([
            ("scaler", "passthrough"),
            ("clf",    RandomForestClassifier(n_estimators=200, max_depth=12,
                                               random_state=RANDOM_STATE, n_jobs=-1))
        ]),
        "Gradient Boosting": Pipeline([
            ("scaler", "passthrough"),
            ("clf",    GradientBoostingClassifier(n_estimators=200, learning_rate=0.1,
                                                   max_depth=5, random_state=RANDOM_STATE))
        ]),
        "SVM": Pipeline([
            ("scaler", StandardScaler()),
            ("clf",    SVC(kernel="rbf", C=1.0, gamma="scale",
                           random_state=RANDOM_STATE, probability=True))
        ]),
        "KNN": Pipeline([
            ("scaler", StandardScaler()),
            ("clf",    KNeighborsClassifier(n_neighbors=7, metric="euclidean"))
        ]),
        "Naive Bayes": Pipeline([
            ("scaler", "passthrough"),
            ("clf",    GaussianNB())
        ]),
    }

    if XGBOOST_AVAILABLE:
        models["XGBoost"] = Pipeline([
            ("scaler", "passthrough"),
            ("clf",    XGBClassifier(n_estimators=200, learning_rate=0.1,
                                      max_depth=5, use_label_encoder=False,
                                      eval_metric="mlogloss",
                                      random_state=RANDOM_STATE))
        ])

    return models


# ─────────────────────────────────────────────────────────────────────────────
# 3. TRAIN & EVALUATE
# ─────────────────────────────────────────────────────────────────────────────

def train_and_evaluate(models: dict, X_train, X_test, y_train, y_test,
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
        test_acc  = accuracy_score(y_test,  pipeline.predict(X_test))

        # 5-fold cross-validation on training set
        cv_scores = cross_val_score(pipeline, X_train, y_train,
                                    cv=5, scoring="accuracy", n_jobs=-1)

        print(f"{name:<25} {train_acc:>10.4f} {test_acc:>10.4f} "
              f"{cv_scores.mean():>10.4f} {elapsed:>9.2f}s")

        results.append({
            "name":       name,
            "pipeline":   pipeline,
            "train_acc":  train_acc,
            "test_acc":   test_acc,
            "cv_mean":    cv_scores.mean(),
            "cv_std":     cv_scores.std(),
            "elapsed":    elapsed,
        })

    print("=" * 70)
    return results


# ─────────────────────────────────────────────────────────────────────────────
# 4. BEST MODEL — DETAILED REPORT
# ─────────────────────────────────────────────────────────────────────────────

def report_best(best: dict, X_test, y_test, label_names: list):
    print(f"\n🏆  Best Model: {best['name']}")
    print(f"    Test Accuracy : {best['test_acc']:.4f}")
    print(f"    CV Mean±Std   : {best['cv_mean']:.4f} ± {best['cv_std']:.4f}")

    y_pred = best["pipeline"].predict(X_test)

    print("\n── Classification Report ──")
    print(classification_report(y_test, y_pred, target_names=label_names))

    print("── Confusion Matrix (rows=Actual, cols=Predicted) ──")
    cm = confusion_matrix(y_test, y_pred)
    cm_df = pd.DataFrame(cm,
                         index=[f"Actual {l}"    for l in label_names],
                         columns=[f"Pred {l}"    for l in label_names])
    print(cm_df)


# ─────────────────────────────────────────────────────────────────────────────
# 5. SAVE BEST MODEL
# ─────────────────────────────────────────────────────────────────────────────

def save_best_model(best: dict, target_le: LabelEncoder,
                    feature_cols: list, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    payload = {
        "model_name":   best["name"],
        "pipeline":     best["pipeline"],
        "label_encoder": target_le,
        "feature_cols": feature_cols,
        "test_accuracy": best["test_acc"],
        "cv_mean":       best["cv_mean"],
    }
    joblib.dump(payload, output_path)
    print(f"\n✅  Best model saved → {output_path}")


# ─────────────────────────────────────────────────────────────────────────────
# 6. INFERENCE DEMO  (how to reload & use the saved model)
# ─────────────────────────────────────────────────────────────────────────────

def inference_demo(model_path: str):
    """Load saved model and predict on a sample project."""
    payload = joblib.load(model_path)
    pipeline   = payload["pipeline"]
    label_enc  = payload["label_encoder"]
    feat_cols  = payload["feature_cols"]

    print("\n── Inference Demo ─────────────────────────────────────────────")
    print(f"Loaded model : {payload['model_name']}")
    print(f"Test accuracy: {payload['test_accuracy']:.4f}")

    # Example: a large ERP project with a junior waterfall team
    sample = pd.DataFrame([{
        "Project Type":      7,   # already encoded; see note below
        "Team Size":         20,
        "Budget ($k)":       800,
        "Duration (months)": 24,
        "Stakeholder Count": 15,
        "Methodology Used":  4,   # Waterfall
        "Team Experience":   0,   # Junior
    }])

    proba  = pipeline.predict_proba(sample[feat_cols])[0]
    pred   = pipeline.predict(sample[feat_cols])[0]
    labels = label_enc.classes_

    print("\nSample project features:")
    for k, v in sample.iloc[0].items():
        print(f"  {k}: {v}")

    print(f"\nPredicted Risk Level : {labels[pred]}")
    print("Class Probabilities  :")
    for label, p in zip(labels, proba):
        bar = "█" * int(p * 30)
        print(f"  {label:<8} {p:.3f}  {bar}")
    print("────────────────────────────────────────────────────────────────")


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # ── Step 1: Load data ──
    X, y, feature_cols, target_le = load_and_preprocess(DATASET_PATH)
    label_names = list(target_le.classes_)   # ['High', 'Low', 'Medium'] (sorted)

    # ── Step 2: Split ──
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )
    print(f"Train: {len(X_train)} samples  |  Test: {len(X_test)} samples\n")

    # ── Step 3: Train all models ──
    models  = build_model_registry()
    results = train_and_evaluate(models, X_train, X_test,
                                  y_train, y_test, label_names)

    # ── Step 4: Pick best by test accuracy ──
    best = max(results, key=lambda r: r["test_acc"])

    # ── Step 5: Detailed report ──
    report_best(best, X_test, y_test, label_names)

    # ── Step 6: Save best model ──
    save_best_model(best, target_le, feature_cols, BEST_MODEL_PATH)

    # ── Step 7: Reload & demo ──
    inference_demo(BEST_MODEL_PATH)
