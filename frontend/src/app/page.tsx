"use client";

import React, { useState } from "react";
import LoanForm from "@/components/LoanForm";
import PredictionResult from "@/components/PredictionResult";
import LoginCard from "@/components/LoginCard";
import { predictDefault } from "@/lib/api";
import { LoanInput, PredictionResponse } from "@/types/loan";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<PredictionResponse | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const handleLogin  = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (data: LoanInput) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await predictDefault(data);
      setResult(res);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Login gate ──
  if (!isLoggedIn) {
    return <LoginCard onLogin={handleLogin} />;
  }

  return (
    <div className="page-wrapper">

      {/* ══════════════════════════════════════
          HEADER — Tier 1: white wordmark bar
          ══════════════════════════════════════ */}
      <div className="header-topbar">
        <div className="container">
          <div className="header-topbar-inner">
            {/* Wordmark */}
            <div>
              <div className="wordmark">
                <span className="wordmark-idbi">IDBI</span>
                <span className="wordmark-bank">Bank</span>
              </div>
              <span className="wordmark-tagline">Aao Sochein Bada</span>
            </div>

            <div className="header-divider" />

            <span className="header-app-name">Credit Risk Engine</span>

            <div className="header-live-badge">
              <span className="header-live-dot" />
              Live
            </div>

            <button
              id="logout-btn"
              className="btn-logout"
              onClick={handleLogout}
              title="Sign out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          HEADER — Tier 2: green nav strip
          ══════════════════════════════════════ */}
      <div className="header-navstrip">
        <div className="container">
          <div className="header-navstrip-inner">
            <span className="navstrip-crumb">Home</span>
            <span className="navstrip-sep">›</span>
            <span className="navstrip-crumb">Credit &amp; Risk</span>
            <span className="navstrip-sep">›</span>
            <span className="navstrip-current">Loan Default Prediction</span>
            <span className="navstrip-right">Powered by LightGBM + SHAP</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════ */}
      <main className="main-content">
        <div className="container">
          <div className="page-grid">

            {/* ── Left column: Form ── */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon">📋</div>
                <div>
                  <div className="card-title">Loan Application Details</div>
                  <div className="card-subtitle">
                    Fill in all fields to run the risk assessment
                  </div>
                </div>
              </div>
              <LoanForm onSubmit={handleSubmit} loading={loading} />
            </div>

            {/* ── Right column: Result + Info ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Error alert */}
              {error && (
                <div className="alert alert-error" role="alert">
                  <span className="alert-icon">⚠️</span>
                  <div>
                    <strong>Request Failed</strong>
                    <div style={{ marginTop: 4, fontSize: 12 }}>{error}</div>
                    <div style={{ marginTop: 6, fontSize: 11, opacity: 0.75 }}>
                      Ensure the FastAPI backend is running at{" "}
                      <code>http://localhost:8000</code>
                    </div>
                  </div>
                </div>
              )}

              {/* Result or empty state */}
              {result ? (
                <PredictionResult result={result} />
              ) : (
                !error && (
                  <div className="card">
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <div className="empty-title">Awaiting Assessment</div>
                      <div className="empty-desc">
                        Complete the loan application form and click{" "}
                        <em>Run Risk Assessment</em> to view the prediction.
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* How it works */}
              <div className="info-card">
                <div className="info-card-title">
                  <span>ℹ️</span> How It Works
                </div>
                <p style={{ lineHeight: 1.65 }}>
                  The model is a LightGBM classifier trained on IDBI loan
                  performance data. SHAP values identify which applicant
                  features most influenced the prediction.
                </p>
                <div className="risk-legend">
                  {[
                    { label: "Low Risk",    color: "#16A34A", range: "0 – 15%" },
                    { label: "Medium Risk", color: "#D97706", range: "15 – 40%" },
                    { label: "High Risk",   color: "#DC2626", range: "40%+"    },
                  ].map((b) => (
                    <div className="risk-legend-item" key={b.label}>
                      <span
                        className="risk-legend-dot"
                        style={{ background: b.color }}
                      />
                      <span className="risk-legend-label">{b.label}</span>
                      <span className="risk-legend-range">{b.range}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer className="site-footer">
        <div className="container">
          © IDBI Bank Ltd. · Credit Risk Engine · For internal use only ·
          Model outputs are indicative and non-binding
        </div>
      </footer>

    </div>
  );
}
