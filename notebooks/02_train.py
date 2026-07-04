"""
Step 2: Train the default-prediction model.

Trains a single LightGBM model but includes `loan_segment` as a categorical
feature -- so the model can learn segment-specific patterns, which directly
answers the "apply suitable analytical methods for different loan types and
borrower profiles" requirement, without the complexity of maintaining N
separate models.

USAGE: python 02_train.py
"""

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score, classification_report
import lightgbm as lgb

DATA_PATH = "../data/processed.csv"
MODEL_PATH = "../models/default_model.pkl"

FEATURES = [
    "age", "annual_income", "loan_amount", "credit_score",
    "months_employed", "num_credit_lines", "interest_rate", "term",
    "debt_to_income", "income_to_loan_ratio",
    "has_mortgage_flag", "has_dependents_flag", "has_cosigner_flag",
    "loan_segment", "education", "employment_type", "marital_status",
]
TARGET = "default"


def load_data():
    df = pd.read_csv(DATA_PATH)
    cat_cols = ["loan_segment", "education", "employment_type", "marital_status"]
    for c in cat_cols:
        df[c] = df[c].astype("category")
    return df, cat_cols


def train():
    df, cat_cols = load_data()
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = lgb.LGBMClassifier(
        n_estimators=300,
        learning_rate=0.05,
        num_leaves=31,
        class_weight="balanced",  # defaults are usually the minority class
        random_state=42,
    )
    model.fit(
        X_train, y_train,
        categorical_feature=cat_cols,
        eval_set=[(X_test, y_test)],
        eval_metric="auc",
        callbacks=[lgb.early_stopping(20), lgb.log_evaluation(20)],
    )

    proba = model.predict_proba(X_test)[:, 1]
    preds = (proba > 0.5).astype(int)

    auc = roc_auc_score(y_test, proba)
    acc = accuracy_score(y_test, preds)

    print(f"\nAUC:      {auc:.4f}")
    print(f"Accuracy: {acc:.4f}")
    print(classification_report(y_test, preds))

    joblib.dump({"model": model, "features": FEATURES, "cat_cols": cat_cols}, MODEL_PATH)
    print(f"Saved model -> {MODEL_PATH}")

    # Per-segment breakdown -- useful evidence for "consistent, comparable
    # outputs across all MSME loans" in your pitch
    X_test_copy = X_test.copy()
    X_test_copy["proba"] = proba
    X_test_copy["actual"] = y_test
    print("\nPer-segment AUC:")
    for seg in X_test_copy["loan_segment"].unique():
        mask = X_test_copy["loan_segment"] == seg
        if mask.sum() > 20 and X_test_copy.loc[mask, "actual"].nunique() > 1:
            seg_auc = roc_auc_score(
                X_test_copy.loc[mask, "actual"], X_test_copy.loc[mask, "proba"]
            )
            print(f"  {seg}: {seg_auc:.4f} (n={mask.sum()})")


if __name__ == "__main__":
    train()
