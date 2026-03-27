import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
 
  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── NAVBAR ── */
  .scholaris-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    background: rgba(6,8,16,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .scholaris-nav::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(20,184,166,0.3), transparent);
  }
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .nav-brand-icon {
    width: 30px; height: 30px;
    background: linear-gradient(135deg, #6366f1, #2dd4bf);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }
  .nav-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(90deg, #f0f1f6, #a5b4fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .nav-tagline {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4b5563;
    font-family: 'DM Mono', monospace;
  }
 
  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #060810;
    font-family: 'DM Mono', monospace;
    position: relative;
    overflow: hidden;
  }
 
  /* Ambient blobs */
  .login-root::before {
    content: '';
    position: fixed;
    top: -15%;
    left: -10%;
    width: 560px;
    height: 560px;
    background: radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%);
    pointer-events: none;
  }
  .login-root::after {
    content: '';
    position: fixed;
    bottom: -10%;
    right: -8%;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
 
  .login-card {
    position: relative;
    z-index: 1;
    width: 420px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 48px 44px 44px;
    overflow: hidden;
  }
 
  /* Top shimmer line */
  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
  }
 
  .login-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6366f1;
    margin-bottom: 10px;
    font-weight: 500;
  }
 
  .login-title {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: #f0f1f6;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 36px;
  }
 
  .field-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4b5563;
    margin-bottom: 8px;
    display: block;
  }
 
  .field-wrap {
    margin-bottom: 20px;
  }
 
  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 14px 16px;
    color: #e8eaf0;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .login-input::placeholder { color: #374151; }
  .login-input:focus {
    border-color: rgba(99,102,241,0.45);
    background: rgba(99,102,241,0.04);
  }
 
  .login-btn {
    width: 100%;
    margin-top: 12px;
    padding: 15px;
    background: #6366f1;
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: opacity 0.2s ease, transform 0.15s ease;
  }
  .login-btn:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  .login-btn:active {
    transform: translateY(0);
  }
  .login-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
    pointer-events: none;
  }
 
  .login-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 11px;
    color: #374151;
    letter-spacing: 0.05em;
  }
 
  .error-msg {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    color: #f87171;
    font-size: 12px;
    padding: 10px 14px;
    margin-bottom: 20px;
    letter-spacing: 0.03em;
  }
`;
 
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
 
      const user = res.data.user;
 
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
 
      if (user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/dashboard");
      }
 
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };
 
  return (
    <>
      <style>{style}</style>
      <nav className="scholaris-nav">
        <div className="nav-brand">
          <div className="nav-brand-icon">🎓</div>
          <span className="nav-brand-name">Scholaris</span>
        </div>
        <span className="nav-tagline">Academic Management System</span>
      </nav>
      <div className="login-root">
        <div className="login-card">
          <p className="login-eyebrow">Academic Portal</p>
          <h2 className="login-title">Sign In</h2>
 
          {error && <div className="error-msg">{error}</div>}
 
          <form onSubmit={handleSubmit}>
            <div className="field-wrap">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                placeholder="you@university.edu"
                className="login-input"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
 
            <div className="field-wrap">
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="login-input"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
 
            <button type="submit" className="login-btn">
              Continue →
            </button>
          </form>
 
          <p className="login-footer">Academic Management System · v2.0</p>

          <p className="login-footer" style={{ marginTop: "10px" }}>
  Don't have an account?{" "}
  <span
    style={{ color: "#6366f1", cursor: "pointer" }}
    onClick={() => navigate("/register")}
  >
    Register
  </span>
</p>
        </div>
      </div>
    </>
  );
}