import React, { useState } from "react";
import axios from "axios";
import "./AuthModal.css";

const API = "http://localhost:8000";

export default function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res = await axios.post(`${API}${endpoint}`, payload);
      localStorage.setItem("forecast_token", res.data.token);
      localStorage.setItem("forecast_user", JSON.stringify({ name: res.data.name, email: res.data.email }));
      onAuth({ name: res.data.name, email: res.data.email });
      onClose();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <div className="auth-left">
          <div className="auth-brand">FORECAST<span>.AI</span></div>
          <p>Your personal weather intelligence platform. Know what's coming before it arrives.</p>
          <div className="auth-features">
            <div>☁ Live weather for any location</div>
            <div>📊 Charts & ML forecasts</div>
            <div>🤖 AI-powered precautions</div>
          </div>
        </div>

        <div className="auth-right">
          <button className="auth-close" onClick={onClose}>✕</button>
          <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="auth-sub">{mode === "login" ? "Sign in to your account" : "Start for free, no credit card needed"}</p>

          <form onSubmit={submit}>
            {mode === "register" && (
              <div className="auth-field">
                <label>Full Name</label>
                <input name="name" type="text" placeholder="Your name" value={form.name} onChange={handle} required />
              </div>
            )}
            <div className="auth-field">
              <label>Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            {mode === "login" ? (
              <>Don't have an account? <span onClick={() => { setMode("register"); setError(""); }}>Sign up</span></>
            ) : (
              <>Already have an account? <span onClick={() => { setMode("login"); setError(""); }}>Sign in</span></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
