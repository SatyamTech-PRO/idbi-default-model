"use client";

import React, { useState, useCallback } from "react";
import { LoanInput } from "@/types/loan";

/* ---- option lists ---- */
const LOAN_SEGMENTS = ["MSME", "Auto", "Mortgage-linked", "Personal", "Other"] as const;
const EDUCATIONS    = ["Bachelors", "Masters", "High School", "PhD"] as const;
const EMP_TYPES     = ["Full-time", "Part-time", "Self-employed", "Unemployed"] as const;
const MARITAL       = ["Single", "Married", "Divorced"] as const;

const DEFAULT_VALUES: LoanInput = {
  age: 35,
  annual_income: 600000,
  loan_amount: 500000,
  credit_score: 680,
  months_employed: 36,
  num_credit_lines: 3,
  interest_rate: 10.5,
  term: 60,
  debt_to_income: 0.35,
  income_to_loan_ratio: 1.2,
  has_mortgage_flag: 0,
  has_dependents_flag: 0,
  has_cosigner_flag: 0,
  loan_segment: "Personal",
  education: "Bachelors",
  employment_type: "Full-time",
  marital_status: "Single",
};

interface Props {
  onSubmit: (data: LoanInput) => void;
  loading: boolean;
}

export default function LoanForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<LoanInput>(DEFAULT_VALUES);

  const setNum = useCallback(
    (key: keyof LoanInput) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: parseFloat(e.target.value) || 0 })),
    []
  );

  const setStr = useCallback(
    (key: keyof LoanInput) =>
      (e: React.ChangeEvent<HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    []
  );

  const toggleFlag = useCallback(
    (key: "has_mortgage_flag" | "has_dependents_flag" | "has_cosigner_flag") =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.checked ? 1 : 0 })),
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 0 }}>

        {/* ---- Applicant details ---- */}
        <div className="form-section-label">Applicant Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Age (years)</label>
            <input
              id="age"
              className="form-input"
              type="number"
              min={18}
              max={80}
              step={1}
              value={form.age}
              onChange={setNum("age")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Annual Income (₹)</label>
            <input
              id="annual_income"
              className="form-input"
              type="number"
              min={0}
              step={1000}
              value={form.annual_income}
              onChange={setNum("annual_income")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Months Employed</label>
            <input
              id="months_employed"
              className="form-input"
              type="number"
              min={0}
              step={1}
              value={form.months_employed}
              onChange={setNum("months_employed")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Credit Score</label>
            <input
              id="credit_score"
              className="form-input"
              type="number"
              min={300}
              max={900}
              step={1}
              value={form.credit_score}
              onChange={setNum("credit_score")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Num. Credit Lines</label>
            <input
              id="num_credit_lines"
              className="form-input"
              type="number"
              min={0}
              step={1}
              value={form.num_credit_lines}
              onChange={setNum("num_credit_lines")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Debt-to-Income Ratio</label>
            <input
              id="debt_to_income"
              className="form-input"
              type="number"
              min={0}
              max={2}
              step={0.01}
              value={form.debt_to_income}
              onChange={setNum("debt_to_income")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Income-to-Loan Ratio</label>
            <input
              id="income_to_loan_ratio"
              className="form-input"
              type="number"
              min={0}
              step={0.01}
              value={form.income_to_loan_ratio}
              onChange={setNum("income_to_loan_ratio")}
              required
            />
          </div>
        </div>

        {/* ---- Loan details ---- */}
        <div className="form-section-label" style={{ marginTop: 20 }}>Loan Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Loan Amount (₹)</label>
            <input
              id="loan_amount"
              className="form-input"
              type="number"
              min={0}
              step={1000}
              value={form.loan_amount}
              onChange={setNum("loan_amount")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Interest Rate (%)</label>
            <input
              id="interest_rate"
              className="form-input"
              type="number"
              min={0}
              max={50}
              step={0.1}
              value={form.interest_rate}
              onChange={setNum("interest_rate")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Term (months)</label>
            <input
              id="term"
              className="form-input"
              type="number"
              min={1}
              step={1}
              value={form.term}
              onChange={setNum("term")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Loan Segment</label>
            <select
              id="loan_segment"
              className="form-select"
              value={form.loan_segment}
              onChange={setStr("loan_segment")}
              required
            >
              {LOAN_SEGMENTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ---- Demographics ---- */}
        <div className="form-section-label" style={{ marginTop: 20 }}>Demographics &amp; Profile</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Education</label>
            <select
              id="education"
              className="form-select"
              value={form.education}
              onChange={setStr("education")}
              required
            >
              {EDUCATIONS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select
              id="employment_type"
              className="form-select"
              value={form.employment_type}
              onChange={setStr("employment_type")}
              required
            >
              {EMP_TYPES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Marital Status</label>
            <select
              id="marital_status"
              className="form-select"
              value={form.marital_status}
              onChange={setStr("marital_status")}
              required
            >
              {MARITAL.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ---- Flags ---- */}
        <div className="form-section-label" style={{ marginTop: 20 }}>Applicant Flags</div>
        <div className="checkbox-grid">
          <label className="checkbox-item">
            <input
              id="has_mortgage_flag"
              type="checkbox"
              checked={form.has_mortgage_flag === 1}
              onChange={toggleFlag("has_mortgage_flag")}
            />
            <span className="checkbox-label">Has Mortgage</span>
          </label>
          <label className="checkbox-item">
            <input
              id="has_dependents_flag"
              type="checkbox"
              checked={form.has_dependents_flag === 1}
              onChange={toggleFlag("has_dependents_flag")}
            />
            <span className="checkbox-label">Has Dependents</span>
          </label>
          <label className="checkbox-item">
            <input
              id="has_cosigner_flag"
              type="checkbox"
              checked={form.has_cosigner_flag === 1}
              onChange={toggleFlag("has_cosigner_flag")}
            />
            <span className="checkbox-label">Has Co-signer</span>
          </label>
        </div>

        <button
          id="submit-prediction"
          type="submit"
          className="btn-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" />
              Analysing…
            </>
          ) : (
            "Run Risk Assessment"
          )}
        </button>
      </div>
    </form>
  );
}
