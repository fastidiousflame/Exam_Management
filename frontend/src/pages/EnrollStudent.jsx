import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  /* 🟢 CRITICAL: Resetting default browser margins to remove the white border */
  html, body {
    margin: 0;
    padding: 0;
    background: #060810;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

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
    background: linear-gradient(90deg, transparent, rgba(45,212,191,0.4), rgba(99,102,241,0.3), transparent);
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
    background: linear-gradient(90deg, #f0f1f6, #2dd4bf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .nav-page-tag {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #2dd4bf;
    font-family: 'DM Mono', monospace;
    opacity: 0.6;
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

  .enroll-root {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #060810;
    font-family: 'DM Mono', monospace;
    padding: 80px 20px 20px;
    box-sizing: border-box;
  }

  /* Ambient glow behind the card */
  .enroll-root::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .enroll-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 450px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 40px;
    color: #f0f1f6;
    backdrop-filter: blur(10px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }

  .enroll-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 30px;
    text-align: left;
    background: linear-gradient(90deg, #fff, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .enroll-field { margin-bottom: 24px; }
  
  .enroll-label {
    font-size: 10px;
    text-transform: uppercase;
    color: #4b5563;
    margin-bottom: 10px;
    display: block;
    letter-spacing: 0.15em;
    font-weight: 600;
  }

  .enroll-select {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 14px;
    border-radius: 12px;
    color: #e8eaf0;
    font-family: 'DM Mono', monospace;
    outline: none;
    appearance: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .enroll-select:focus {
    border-color: #6366f1;
    background: rgba(255,255,255,0.08);
  }
  
  .enroll-select option { 
    background: #0f172a; 
    color: white;
    padding: 10px;
  }

  .enroll-btn {
    width: 100%;
    padding: 16px;
    background: #6366f1;
    border: none;
    border-radius: 12px;
    color: white;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.2s ease;
  }
  
  .enroll-btn:hover:not(:disabled) { 
    background: #4f46e5; 
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(99,102,241,0.2);
  }

  .enroll-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .back-link {
    display: block;
    text-align: center;
    margin-top: 24px;
    font-size: 11px;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
  }
  .back-link:hover { color: #6366f1; }
`;

export default function EnrollStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ student_id: "", course_id: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Fetch all students to link IDs with Emails
    axios.get("http://localhost:5000/api/teacher/students", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStudents(res.data))
    .catch(err => console.error("Error fetching students", err));

    // Fetch available subjects
    axios.get("http://localhost:5000/api/teacher/courses", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCourses(res.data))
    .catch(err => console.error("Error fetching courses", err));
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!form.student_id || !form.course_id) {
        alert("Please select both a student and a course.");
        return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/teacher/enroll", {
        student_id: Number(form.student_id),
        course_id: Number(form.course_id),
        academic_year: "2026"
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("Registration Successful: Student added to course roster.");
      navigate("/teacher"); 
    } catch (err) {
      alert("Enrollment Error: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enroll-root">
      <style>{style}</style>
      <nav className="scholaris-nav">
        <div className="nav-brand">
          <div className="nav-brand-icon">🎓</div>
          <span className="nav-brand-name">Scholaris</span>
        </div>
        <div className="nav-right">
          <span className="nav-page-tag">Enrollment</span>
          <button className="nav-back-btn" onClick={() => navigate("/teacher")}>← Teacher Panel</button>
        </div>
      </nav>
      <div className="enroll-card">
        <h2 className="enroll-title">Course<br/>Enrollment</h2>
        
        <form onSubmit={handleEnroll}>
          <div className="enroll-field">
            <label className="enroll-label">Identify Student (Email & ID)</label>
            <select 
              className="enroll-select"
              value={form.student_id}
              onChange={(e) => setForm({...form, student_id: e.target.value})}
              required
            >
              <option value="">-- Select Student --</option>
              {students.map(s => (
                <option key={s.STUDENT_ID} value={s.STUDENT_ID}>
                  {s.EMAIL} (ID: {s.STUDENT_ID})
                </option>
              ))}
            </select>
          </div>

          <div className="enroll-field">
            <label className="enroll-label">Select Curriculum / Subject</label>
            <select 
              className="enroll-select"
              value={form.course_id}
              onChange={(e) => setForm({...form, course_id: e.target.value})}
              required
            >
              <option value="">-- Select Subject --</option>
              {courses.map(c => (
                <option key={c.COURSE_ID} value={c.COURSE_ID}>
                  {c.COURSE_NAME}
                </option>
              ))}
            </select>
          </div>

          <button className="enroll-btn" type="submit" disabled={loading}>
            {loading ? "Processing Database..." : "Confirm Enrollment →"}
          </button>
        </form>

        <span className="back-link" onClick={() => navigate("/teacher")}>
          ← Return to Teacher Panel
        </span>
      </div>
    </div>
  );
}