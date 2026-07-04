"use client";

import React, { useState } from "react";
import { loginAuth } from "@/lib/api";

interface Props {
  onLogin: () => void;
}

export default function LoginCard({ onLogin }: Props) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword]     = useState("");
  const [touched, setTouched]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setLoginError(null);
    
    if (employeeId.trim() && password.trim()) {
      setLoading(true);
      try {
        const result = await loginAuth(employeeId.trim(), password.trim());
        if (result.success) {
          onLogin();
        } else {
          setLoginError(result.message);
        }
      } catch (err) {
        setLoginError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred. Is the backend running?"
        );
      } finally {
        setLoading(false);
      }
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

        {loginError && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: 16 }}>
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Login Failed</strong>
              <div style={{ marginTop: 4, fontSize: 12 }}>{loginError}</div>
            </div>
          </div>
        )}

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
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
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
