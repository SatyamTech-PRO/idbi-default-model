"""
Step 3: Build the "common interpretation framework" -- this is the piece
that turns a black-box score into something a bank officer can act on,
and it's the part of the problem statement most teams will skip.

For every prediction we output:
  - a probability of default
  - a risk band (Low / Medium / High) -- consistent across ALL loan segments
  - the top 3 reasons driving that score (via SHAP)

USAGE: python 03_explain.py
"""

import pandas as pd
import joblib
import shap

MODEL_PATH = "../models/default_model.pkl"
DATA_PATH = "../data/processed.csv"

# Thresholds are illustrative -- tune these against your validation set
RISK_BANDS = [(0.0, 0.15, "Low"), (0.15, 0.40, "Medium"), (0.40, 1.01, "High")]


def risk_band(p):
    for lo, hi, label in RISK_BANDS:
        if lo <= p < hi:
            return label
    return "Unknown"


def explain_batch(n=10):
    bundle = joblib.load(MODEL_PATH)
    model, features = bundle["model"], bundle["features"]

    df = pd.read_csv(DATA_PATH)
    for c in bundle["cat_cols"]:
        df[c] = df[c].astype("category")

    sample = df[features].sample(n, random_state=1)
    proba = model.predict_proba(sample)[:, 1]

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(sample)
    # LightGBM binary classifier: shap_values may be a list [class0, class1]
    sv = shap_values[1] if isinstance(shap_values, list) else shap_values

    results = []
    for i in range(n):
        row_shap = pd.Series(sv[i], index=features).sort_values(key=abs, ascending=False)
        top3 = row_shap.head(3)
        reasons = [
            f"{feat} ({'+' if val > 0 else ''}{val:.3f})" for feat, val in top3.items()
        ]
        results.append({
            "probability_of_default": round(float(proba[i]), 4),
            "risk_band": risk_band(proba[i]),
            "top_reasons": reasons,
            "loan_segment": sample.iloc[i]["loan_segment"],
        })

    out = pd.DataFrame(results)
    print(out.to_string(index=False))
    return out


if __name__ == "__main__":
    explain_batch()
