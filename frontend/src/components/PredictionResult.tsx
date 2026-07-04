"use client";

import React from "react";
import { PredictionResponse } from "@/types/loan";

function featureLabel(key: string): string {
  const map: Record<string, string> = {
    credit_score:         "Credit Score",
    annual_income:        "Annual Income",
    debt_to_income:       "Debt-to-Income Ratio",
    loan_amount:          "Loan Amount",
    income_to_loan_ratio: "Income-to-Loan Ratio",
    interest_rate:        "Interest Rate",
    months_employed:      "Months Employed",
    num_credit_lines:     "No. of Credit Lines",
    term:                 "Loan Term",
    age:                  "Applicant Age",
    has_mortgage_flag:    "Has Mortgage",
    has_dependents_flag:  "Has Dependents",
    has_cosigner_flag:    "Has Co-signer",
    loan_segment:         "Loan Segment",
    education:            "Education",
    employment_type:      "Employment Type",
    marital_status:       "Marital Status",
  };
  return map[key] ?? key.replace(/_/g, " ");
}

function featureDescription(_key: string, impact: number): string {
  if (impact > 0) return "Increases default risk";
  if (impact < 0) return "Reduces default risk";
  return "Neutral factor";
}

/* Band-specific colours for the probability value */
const BAND_COLORS: Record<"low" | "medium" | "high", string> = {
  low:    "#16A34A",
  medium: "#D97706",
  high:   "#DC2626",
};

interface Props {
  result: PredictionResponse;
}

export default function PredictionResult({ result }: Props) {
  const { probability_of_default, risk_band, top_reasons, loan_segment } = result;
  const pct  = (probability_of_default * 100).toFixed(1);
  const band = risk_band.toLowerCase() as "low" | "medium" | "high";

  return (
    <div className="card result-card">

      {/* ── Card header ── */}
      <div className="card-header">
        <div className="card-header-icon">📊</div>
        <div>
          <div className="card-title">Assessment Result</div>
          <div className="card-subtitle">ML model prediction with SHAP explanations</div>
        </div>
      </div>

      <div className="card-body">

        {/* ── Probability display ── */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            className="prob-value"
            style={{ color: BAND_COLORS[band] }}
          >
            {pct}%
          </div>
          <div className="prob-label">Probability of Default</div>

          <div className="progress-track">
            <div
              className={`progress-fill ${band}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "var(--text-muted)",
              marginTop: 5,
              padding: "0 2px",
            }}
          >
            <span>0%</span>
            <span>Low · 0–15%</span>
            <span>Med · 15–40%</span>
            <span>High · 40%+</span>
            <span>100%</span>
          </div>
        </div>

        {/* ── Risk band pill ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
          <div className={`risk-badge ${band}`}>
            <span className="risk-dot" />
            {risk_band} Risk
          </div>
        </div>

        <div className="card-divider" />

        {/* ── Top contributing factors label ── */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--green)",
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            marginBottom: 10,
            paddingBottom: 7,
            borderBottom: "2px solid var(--green-muted)",
          }}
        >
          Top Contributing Factors
        </div>

        {/* ── Reason rows ── */}
        {top_reasons.map((r, i) => (
          <div className="reason-row" key={r.feature}>
            <div className="reason-rank">#{i + 1}</div>
            <div className="reason-feature">
              {featureLabel(r.feature)}
              <span>{featureDescription(r.feature, r.impact)}</span>
            </div>
            <div className={`reason-impact ${r.impact >= 0 ? "pos" : "neg"}`}>
              {r.impact >= 0 ? "+" : ""}
              {r.impact.toFixed(4)}
            </div>
          </div>
        ))}

        {/* ── Meta row ── */}
        <div className="meta-row">
          <span>
            Segment:{" "}
            <strong style={{ color: "var(--text-primary)" }}>{loan_segment}</strong>
          </span>
          <span className="meta-chip">LightGBM + SHAP</span>
        </div>

      </div>
    </div>
  );
}
