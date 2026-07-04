"use client";

import React, { useState } from "react";

interface Props {
  onLogin: () => void;
}

export default function LoginCard({ onLogin }: Props) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword]     = useState("");
  const [touched, setTouched]       = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    // Demo gate: any non-empty input is accepted
    if (employeeId.trim() && password.trim()) {
      onLogin();
    }
  };

  const idError  = touched && !employeeId.trim();
  const pwdError = touched && !password.trim();

  return (
    <div className="login-bg">
      <div className="login-card">

        {/* ── Brand block ── */}
        <div className="login-brand">
          <div className="login-logo-mark">
            <span className="login-logo-i">I</span>
          </div>
          <div className="wordmark" style={{ justifyContent: "center" }}>
            <span className="wordmark-idbi">IDBI</span>
            <span className="wordmark-bank">Bank</span>
          </div>
          <div className="login-app-subtitle">Credit Risk Engine</div>
        </div>

        {/* ── Divider ── */}
        <div className="login-divider" />

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field-group">
            <label className="login-label" htmlFor="employee-id">
              Employee ID
            </label>
            <input
              id="employee-id"
              className={`form-input login-input${idError ? " input-error" : ""}`}
              type="text"
              placeholder="e.g. IDBI-04821"
              autoComplete="username"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            {idError && (
              <span className="login-field-error">Employee ID is required</span>
            )}
          </div>

          <div className="login-field-group">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={`form-input login-input${pwdError ? " input-error" : ""}`}
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {pwdError && (
              <span className="login-field-error">Password is required</span>
            )}
          </div>

          <button
            id="sign-in-btn"
            type="submit"
            className="btn-signin"
          >
            Sign In
          </button>
        </form>

        {/* ── Footer note ── */}
        <p className="login-note">
          Authorised personnel only. For internal risk assessment use.
        </p>
      </div>
    </div>
  );
}
