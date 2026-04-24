import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import "./AuthModal.css";

export default function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const saveUserToFirestore = async (user, name) => {
    await setDoc(doc(db, "users", user.uid), {
      name: name || user.displayName || user.email.split("@")[0],
      email: user.email,
      photo: user.photoURL || "",
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true });
  };

  const persist = (user, name) => {
    const userData = {
      name: name || user.displayName || user.email.split("@")[0],
      email: user.email,
      picture: user.photoURL || "",
      uid: user.uid,
    };
    localStorage.setItem("forecast_user", JSON.stringify(userData));
    onAuth(userData);
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: form.name });
        await saveUserToFirestore(cred.user, form.name);
        persist(cred.user, form.name);
      } else {
        const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
        await saveUserToFirestore(cred.user);
        persist(cred.user);
      }
    } catch (e) {
      const msg = {
        "auth/email-already-in-use": "Email already registered.",
        "auth/wrong-password": "Incorrect password.",
        "auth/user-not-found": "No account found with this email.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/invalid-credential": "Invalid email or password.",
      };
      setError(msg[e.code] || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user);
      persist(result.user);
    } catch (e) {
      setError("Google sign-in failed. Try again.");
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
            <div>Live weather for any location</div>
            <div>Charts and ML forecasts</div>
            <div>AI-powered precautions</div>
            <div>Downloadable PDF reports</div>
          </div>
        </div>

        <div className="auth-right">
          <button className="auth-close" onClick={onClose}>✕</button>
          <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="auth-sub">{mode === "login" ? "Sign in to your account" : "Start for free"}</p>

          <div className="google-btn-wrap">
            <button className="google-signin-btn" onClick={handleGoogle} disabled={loading}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={18} />
              Continue with Google
            </button>
          </div>

          <div className="auth-divider"><span>or continue with email</span></div>

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
