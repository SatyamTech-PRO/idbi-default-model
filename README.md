# IDBI Innovate 2026 — Track 04: Default Prediction Model

## What this is
A default-prediction pipeline that estimates probability of default 12
months in advance, using structured + unstructured loan data, with a
per-segment aware model and a consistent risk-band + reason-code output
across all loan types.

## Setup

```bash
pip install -r requirements.txt
```

## Step-by-step

1. **Get the data.** Download from Kaggle:
   https://www.kaggle.com/datasets/wordsforthewise/lending-club
   Place the CSV as `data/raw_loans.csv`.
   (Fallback if LendingClub is too messy: `nikhil1e9/loan-default`, 255k
   rows, cleaner but purely structured — you'll need to adapt
   `01_preprocess.py`'s column mapping.)

2. **Preprocess:**
   ```bash
   cd notebooks
   python 01_preprocess.py
   ```

3. **Train:**
   ```bash
   python 02_train.py
   ```
   This prints overall AUC/accuracy AND per-loan-segment AUC — screenshot
   this for your pitch deck, it directly answers "consistent, comparable
   outputs across segments."

4. **Check explainability:**
   ```bash
   python 03_explain.py
   ```

5. **Run the API:**
   ```bash
   cd ../app
   uvicorn main:app --reload --port 8000
   ```
   Test with:
   ```bash
   curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d '{
     "loan_amount": 10000, "term": 36, "interest_rate": 12.5,
     "installment": 330, "annual_income": 55000, "debt_to_income": 18.2,
     "delinquencies_2yrs": 0, "open_credit_lines": 8, "public_records": 0,
     "revolving_utilization": 45.0, "total_credit_lines": 20,
     "income_to_loan_ratio": 5.5, "has_employment_title": 1,
     "loan_segment": "MSME", "grade": "B", "home_ownership": "RENT",
     "employment_length": "5 years"
   }'
   ```

## Next steps (not yet built)
- [ ] Next.js frontend calling `/predict` 
- [ ] Compare your final AUC/accuracy against the stated 16-22% baseline
      explicitly in your pitch deck
- [ ] 1-slide diagram: Data -> Segment-aware Model -> Risk Band + Reasons
- [ ] Have a clear, honest answer ready for "how would this connect to real
      GST/UPI/bank data" even though you're using LendingClub as a stand-in


