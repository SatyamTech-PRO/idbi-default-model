"""
FastAPI service for the Default Prediction Model.

Run: uvicorn main:app --reload --port 8000
Then POST to /predict with a loan's details, get back:
  - probability_of_default
  - risk_band (Low/Medium/High) -- consistent across all loan types
  - top_reasons (SHAP-based explanation)

This is the layer your Next.js frontend (same pattern as Max Healthcare)
would call.
"""

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import shap
import os
import sqlite3
import hashlib

app = FastAPI(title="IDBI Default Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "users.db")

@app.on_event("startup")
def startup_event():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            employee_id TEXT PRIMARY KEY,
            password_hash TEXT
        )
    ''')
    conn.commit()
    conn.close()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "default_model.pkl")
_bundle = None
_explainer = None

RISK_BANDS = [(0.0, 0.15, "Low"), (0.15, 0.40, "Medium"), (0.40, 1.01, "High")]


def risk_band(p: float) -> str:
    for lo, hi, label in RISK_BANDS:
        if lo <= p < hi:
            return label
    return "Unknown"


def get_model():
    global _bundle, _explainer
    if _bundle is None:
        _bundle = joblib.load(MODEL_PATH)
        _explainer = shap.TreeExplainer(_bundle["model"])
    return _bundle, _explainer


class LoanInput(BaseModel):
    age: float
    annual_income: float
    loan_amount: float
    credit_score: float
    months_employed: float
    num_credit_lines: float
    interest_rate: float
    term: float
    debt_to_income: float
    income_to_loan_ratio: float
    has_mortgage_flag: int
    has_dependents_flag: int
    has_cosigner_flag: int
    loan_segment: str
    education: str
    employment_type: str
    marital_status: str


@app.get("/health")
def health():
    return {"status": "ok"}

class LoginRequest(BaseModel):
    employee_id: str
    password: str

@app.post("/auth/login")
def auth_login(req: LoginRequest, response: Response):
    pwd_hash = hashlib.sha256(req.password.encode()).hexdigest()
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    c.execute("SELECT password_hash FROM users WHERE employee_id = ?", (req.employee_id,))
    row = c.fetchone()
    
    if row is None:
        c.execute("INSERT INTO users (employee_id, password_hash) VALUES (?, ?)", (req.employee_id, pwd_hash))
        conn.commit()
        conn.close()
        return {"success": True, "message": "Account created"}
    
    conn.close()
    
    stored_hash = row[0]
    if stored_hash == pwd_hash:
        return {"success": True, "message": "Login successful"}
    else:
        response.status_code = 401
        return {"success": False, "message": "Incorrect password for this Employee ID"}


@app.post("/predict")
def predict(loan: LoanInput):
    bundle, explainer = get_model()
    model, features, cat_cols = bundle["model"], bundle["features"], bundle["cat_cols"]

    row = pd.DataFrame([loan.dict()])
    for c in cat_cols:
        row[c] = row[c].astype("category")
    row = row[features]

    proba = float(model.predict_proba(row)[:, 1][0])
    shap_values = explainer.shap_values(row)
    sv = shap_values[1] if isinstance(shap_values, list) else shap_values
    row_shap = pd.Series(sv[0], index=features).sort_values(key=abs, ascending=False)
    top3 = row_shap.head(3)
    reasons = [
        {"feature": feat, "impact": round(float(val), 4)} for feat, val in top3.items()
    ]

    return {
        "probability_of_default": round(proba, 4),
        "risk_band": risk_band(proba),
        "top_reasons": reasons,
        "loan_segment": loan.loan_segment,
    }