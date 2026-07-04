"""
Step 1: Load raw data and build features.

DATASET: kaggle.com/datasets/nikhil1e9/loan-default
Columns: LoanID, Age, Income, LoanAmount, CreditScore, MonthsEmployed,
NumCreditLines, InterestRate, LoanTerm, DTIRatio, Education, EmploymentType,
MaritalStatus, HasMortgage, HasDependents, LoanPurpose, HasCoSigner, Default

USAGE:
1. Place the CSV at data/raw_loans.csv
2. Run: python 01_preprocess.py

IMPORTANT HONESTY NOTE for your pitch:
This dataset is purely structured (no free-text fields like loan
descriptions or employment titles). To still satisfy the "structured AND
unstructured data" requirement in the problem statement, we DERIVE a
synthetic loan-note text field from the structured fields (see
build_synthetic_text below) and extract text-based features from it.

Be upfront about this in your pitch: "We demonstrate the pipeline's
capacity to ingest unstructured text (e.g. GST filing remarks, bank
statement narrations, complaint logs) using a derived text layer; in a
production deployment this would be replaced by real free-text bank data."
This is an honest, defensible statement of extensibility -- don't claim
you used real unstructured bank data when you didn't.
"""

import pandas as pd
import numpy as np

RAW_PATH = "../data/raw_loans.csv"
OUT_PATH = "../data/processed.csv"

RENAME = {
    "LoanID": "loan_id",
    "Age": "age",
    "Income": "annual_income",
    "LoanAmount": "loan_amount",
    "CreditScore": "credit_score",
    "MonthsEmployed": "months_employed",
    "NumCreditLines": "num_credit_lines",
    "InterestRate": "interest_rate",
    "LoanTerm": "term",
    "DTIRatio": "debt_to_income",
    "Education": "education",
    "EmploymentType": "employment_type",
    "MaritalStatus": "marital_status",
    "HasMortgage": "has_mortgage",
    "HasDependents": "has_dependents",
    "LoanPurpose": "loan_purpose",
    "HasCoSigner": "has_cosigner",
    "Default": "default",
}


def load_raw(path=RAW_PATH):
    df = pd.read_csv(path)
    df = df.rename(columns=RENAME)
    return df


def build_loan_segment(df):
    """
    LoanPurpose values here are already coarse categories
    (Auto, Business, Education, Home, Other). Map 'Business' to an
    MSME-like segment since that's the closest analog to Track 04's
    MSME framing.
    """
    mapping = {
        "Business": "MSME",
        "Auto": "Auto",
        "Home": "Mortgage-linked",
        "Education": "Personal",
        "Other": "Personal",
    }
    df["loan_segment"] = df["loan_purpose"].map(mapping).fillna("Other")
    return df


def build_synthetic_text(df):
    """
    Generates a short free-text 'loan_note' per row from structured fields,
    e.g. "45yo, Full-time, Married, 2 credit lines, purpose: Business".
    This stands in for real unstructured bank data (see module docstring).
    """
    df["loan_note"] = (
        df["age"].astype(str) + "yo, "
        + df["employment_type"] + ", "
        + df["marital_status"] + ", "
        + df["num_credit_lines"].astype(str) + " credit lines, purpose: "
        + df["loan_purpose"]
    )
    return df


def engineer_features(df):
    df["income_to_loan_ratio"] = df["annual_income"] / (df["loan_amount"] + 1)
    df["has_mortgage_flag"] = (df["has_mortgage"] == "Yes").astype(int)
    df["has_dependents_flag"] = (df["has_dependents"] == "Yes").astype(int)
    df["has_cosigner_flag"] = (df["has_cosigner"] == "Yes").astype(int)
    return df


def main():
    df = load_raw()
    df = build_loan_segment(df)
    df = build_synthetic_text(df)
    df = engineer_features(df)
    df.to_csv(OUT_PATH, index=False)
    print(f"Processed {len(df)} rows -> {OUT_PATH}")
    print(f"Default rate: {df['default'].mean():.2%}")
    print(df["loan_segment"].value_counts())


if __name__ == "__main__":
    main()
