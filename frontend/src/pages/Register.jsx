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
  .nav-back-btn {
    padding: 7px 16px;
    background: rgba(99,102,241,0.07);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 8px;
    color: #a5b4fc;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
  }
  .nav-back-btn:hover {
    background: rgba(99,102,241,0.14);
    border-color: rgba(99,102,241,0.4);
  }
 
  .reg-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #060810;
    font-family: 'DM Mono', monospace;
    position: relative;
    overflow: hidden;
  }
 
  .reg-root::before {
    content: '';
    position: fixed;
    top: -15%;
    left: -10%;
    width: 560px;
    height: 560px;
    background: radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 70%);
    pointer-events: none;
  }
  .reg-root::after {
    content: '';
    position: fixed;
    bottom: -10%;
    right: -8%;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
 
  .reg-card {
    position: relative;
    z-index: 1;
    width: 460px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 48px 44px 44px;
    overflow: hidden;
  }
 
  .reg-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(20,184,166,0.4), transparent);
  }
 
  .reg-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6366f1;
    margin-bottom: 10px;
    font-weight: 500;
  }
 
  .reg-title {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: #f0f1f6;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 36px;
  }
 
  .fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 0;
  }
 
  .field-wrap { display: flex; flex-direction: column; }
  .field-wrap.full { grid-column: 1 / -1; }
 
  .field-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4b5563;
    margin-bottom: 8px;
  }
 
  .reg-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 13px 15px;
    color: #e8eaf0;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .reg-input::placeholder { color: #374151; }
  .reg-input:focus {
    border-color: rgba(99,102,241,0.45);
    background: rgba(99,102,241,0.04);
  }
 
  /* Role toggle */
  .role-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
 
  .role-btn {
    padding: 13px 0;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #6b7280;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: center;
    letter-spacing: 0.04em;
  }
  .role-btn:hover {
    border-color: rgba(99,102,241,0.3);
    color: #a5b4fc;
    background: rgba(99,102,241,0.04);
  }
  .role-btn.active {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.1);
    color: #a5b4fc;
  }
  .role-btn .role-icon {
    display: block;
    font-size: 18px;
    margin-bottom: 4px;
  }
 
  .divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 24px 0;
  }
 
  .reg-btn {
    width: 100%;
    padding: 15px;
    background: #6366f1;
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.04em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: opacity 0.2s ease, transform 0.15s ease;
  }
  .reg-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .reg-btn:active { transform: translateY(0); }
  .reg-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }
 
  .toast {
    margin-bottom: 20px;
    border-radius: 10px;
    padding: 11px 15px;
    font-size: 12px;
    letter-spacing: 0.03em;
  }
  .toast.success {
    background: rgba(20,184,166,0.08);
    border: 1px solid rgba(20,184,166,0.25);
    color: #2dd4bf;
  }
  .toast.error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171;
  }
 
  .reg-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 11px;
    color: #374151;
    letter-spacing: 0.05em;
  }
  .reg-footer a {
    color: #6366f1;
    text-decoration: none;
    cursor: pointer;
  }
  .reg-footer a:hover { text-decoration: underline; }
`;
 
export default function Register() {
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "student",
  });
  const [toast, setToast] = useState(null);
 
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      showToast("success", "Account created successfully. Redirecting…");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast("error", "Registration failed. Please try again.");
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
        <button className="nav-back-btn" onClick={() => navigate("/")}>← Sign In</button>
      </nav>
      <div className="reg-root">
        <div className="reg-card">
          <p className="reg-eyebrow">Academic Portal</p>
          <h2 className="reg-title">Create Account</h2>
 
          {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
 
          <form onSubmit={handleSubmit}>
            <div className="fields-grid">
 
              <div className="field-wrap full">
                <span className="field-label">Full Name</span>
                <input
                  placeholder="John Doe"
                  className="reg-input"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
 
              <div className="field-wrap full">
                <span className="field-label">Email Address</span>
                <input
                  placeholder="you@university.edu"
                  className="reg-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
 
              <div className="field-wrap full">
                <span className="field-label">Password</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="reg-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
 
              <div className="field-wrap full">
                <span className="field-label">I am a…</span>
                <div className="role-toggle">
                  <button
                    type="button"
                    className={`role-btn${form.role === "student" ? " active" : ""}`}
                    onClick={() => setForm({ ...form, role: "student" })}
                  >
                    <span className="role-icon">🎓</span>
                    Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn${form.role === "teacher" ? " active" : ""}`}
                    onClick={() => setForm({ ...form, role: "teacher" })}
                  >
                    <span className="role-icon">📋</span>
                    Teacher
                  </button>
                </div>
              </div>
 
            </div>
 
            <div className="divider" />
 
            <button type="submit" className="reg-btn">
              Create Account →
            </button>
          </form>
 
          <p className="reg-footer">
            Already have an account?{" "}
            <a onClick={() => navigate("/")}>Sign in</a>
          </p>
        </div>
      </div>
    </>
  );
}