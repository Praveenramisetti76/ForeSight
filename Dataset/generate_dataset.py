"""
generate_dataset.py
--------------------
Synthetic dataset generator for AI-based Product Risk Prediction.

Why 3000 rows?
  - Enough for meaningful train/test splits (80/20 → 600 test samples)
  - Each class (Low/Medium/High) gets ~1000 samples → avoids class imbalance issues
  - Small enough to run fast on any laptop without GPU
"""

import numpy as np
import pandas as pd
import random

# ── Reproducibility ──────────────────────────────────────────────────────────
SEED = 42
np.random.seed(SEED)
random.seed(SEED)

N_ROWS = 15000

# ── Category pools ────────────────────────────────────────────────────────────
PROJECT_TYPES = [
    "Web Application",
    "Mobile App",
    "ERP Implementation",
    "Data Analytics Platform",
    "Cloud Migration",
    "IoT Development",
    "E-Commerce Platform",
    "CRM System",
    "Cybersecurity Solution",
    "AI / ML Project",
]

METHODOLOGIES = ["Waterfall", "Agile", "Hybrid", "Scrum", "Kanban"]
EXPERIENCES    = ["Junior", "Mixed", "Senior"]

# ── Risk weights per categorical feature ──────────────────────────────────────
# Higher value → more risk points contributed

PROJECT_RISK = {
    "Web Application":         1,
    "Mobile App":              1,
    "E-Commerce Platform":     2,
    "CRM System":              2,
    "Data Analytics Platform": 2,
    "Kanban":                  1,          # placeholder; used below for methodology
    "Cloud Migration":         3,
    "ERP Implementation":      4,
    "IoT Development":         4,
    "Cybersecurity Solution":  4,
    "AI / ML Project":         5,
}

METHODOLOGY_RISK = {
    "Scrum":      0,
    "Agile":      1,
    "Kanban":     1,
    "Hybrid":     2,
    "Waterfall":  4,
}

EXPERIENCE_RISK = {
    "Senior": 0,
    "Mixed":  2,
    "Junior": 4,
}


def compute_risk_score(row: dict) -> float:
    """
    Deterministic base score (0–20 range) from all features.
    Gaussian noise is added later so the boundary isn't perfectly sharp.
    """
    score = 0.0

    # Project type (0-5)
    score += PROJECT_RISK.get(row["Project Type"], 2)

    # Team size  – extremes are risky
    ts = row["Team Size"]
    if ts <= 3:
        score += 3        # too small → bottleneck risk
    elif ts <= 8:
        score += 0
    elif ts <= 15:
        score += 1
    else:
        score += 3        # too large → coordination risk

    # Budget in $k – higher budget projects carry more exposure
    budget = row["Budget ($k)"]
    if budget < 50:
        score += 0
    elif budget < 200:
        score += 1
    elif budget < 500:
        score += 2
    else:
        score += 4

    # Duration – longer → more risk
    dur = row["Duration (months)"]
    if dur <= 3:
        score += 0
    elif dur <= 9:
        score += 1
    elif dur <= 18:
        score += 2
    else:
        score += 4

    # Stakeholder count – more stakeholders → alignment risk
    sc = row["Stakeholder Count"]
    if sc <= 3:
        score += 0
    elif sc <= 7:
        score += 1
    elif sc <= 12:
        score += 2
    else:
        score += 3

    # Methodology (0-4)
    score += METHODOLOGY_RISK[row["Methodology Used"]]

    # Experience (0-4)
    score += EXPERIENCE_RISK[row["Team Experience"]]

    return score


def score_to_risk(score: float) -> str:
    """Map numeric score to Low / Medium / High label."""
    if score < 8:
        return "Low"
    elif score < 14:
        return "Medium"
    else:
        return "High"


def generate_dataset(n: int = N_ROWS) -> pd.DataFrame:
    rows = []
    for _ in range(n):
        project_type = random.choice(PROJECT_TYPES)
        methodology  = random.choice(METHODOLOGIES)
        experience   = random.choice(EXPERIENCES)

        team_size        = int(np.random.choice(range(2, 30), p=_team_size_probs()))
        budget           = int(np.random.lognormal(mean=5.0, sigma=0.9))   # $k
        budget           = max(10, min(budget, 2000))                       # clip to [10k, 2M]
        duration         = int(np.random.choice(range(1, 37)))              # 1-36 months
        stakeholder_count = int(np.clip(np.random.poisson(lam=6), 1, 20))

        row = {
            "Project Type":       project_type,
            "Team Size":          team_size,
            "Budget ($k)":        budget,
            "Duration (months)":  duration,
            "Stakeholder Count":  stakeholder_count,
            "Methodology Used":   methodology,
            "Team Experience":    experience,
        }

        base_score = compute_risk_score(row)
        noise      = np.random.normal(0, 0.5)           # realistic boundary blur
        final_score = base_score + noise

        row["Risk Level"] = score_to_risk(final_score)
        rows.append(row)

    df = pd.DataFrame(rows)
    return df


def _team_size_probs():
    """Biased toward small-to-mid teams (2-15), tail for large (16-29)."""
    weights = np.array(
        [5, 8, 10, 12, 12, 10, 8, 6, 5, 4, 4, 3, 3, 2, 2,   # 2-16
         1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]           # 17-30 (29 items total)
    , dtype=float)
    # range(2,30) → 28 values; trim weights to 28
    weights = weights[:28]
    weights /= weights.sum()
    return weights


if __name__ == "__main__":
    print(f"Generating {N_ROWS} rows …")
    df = generate_dataset(N_ROWS)

    # ── Quick sanity checks ──
    print("\n── Class Distribution ──")
    print(df["Risk Level"].value_counts())
    print(f"\n── Sample (5 rows) ──")
    print(df.head())
    print(f"\nShape: {df.shape}")

    df.to_csv("risk_dataset.csv", index=False)
    print("\n✅  Saved → risk_dataset.csv")
