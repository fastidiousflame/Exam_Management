import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #060810; }

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
  .nav-logout {
    padding: 7px 16px;
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.18);
    border-radius: 8px;
    color: #f87171;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
  }
  .nav-logout:hover {
    background: rgba(239,68,68,0.14);
    border-color: rgba(239,68,68,0.35);
  }

  .teacher-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #060810;
    font-family: 'DM Mono', monospace;
    position: relative;
    padding: 80px 20px 20px;
  }

  .teacher-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 500px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 40px;
    color: #f0f1f6;
  }

  .teacher-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #2dd4bf;
    margin-bottom: 8px;
  }

  .teacher-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 24px;
  }

  .enroll-nav-btn {
    width: 100%;
    padding: 12px;
    background: rgba(45, 212, 191, 0.05);
    border: 1px dashed rgba(45, 212, 191, 0.3);
    border-radius: 12px;
    color: #2dd4bf;
    cursor: pointer;
    margin-bottom: 24px;
    font-family: 'Syne', sans-serif;
    transition: all 0.2s;
  }
  .enroll-nav-btn:hover { background: rgba(45, 212, 191, 0.1); }

  .fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .field-wrap { display: flex; flex-direction: column; margin-bottom: 16px; }
  .field-wrap.full { grid-column: 1 / -1; }

  .field-label {
    font-size: 10px;
    text-transform: uppercase;
    color: #4b5563;
    margin-bottom: 6px;
    letter-spacing: 0.1em;
  }

  .teacher-input, .teacher-select {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 12px;
    border-radius: 10px;
    color: #e8eaf0;
    font-family: 'DM Mono', monospace;
    outline: none;
    transition: border-color 0.2s;
  }
  
  .teacher-select option { background: #111827; color: white; }
  .teacher-input:focus, .teacher-select:focus { border-color: #2dd4bf; }

  .grade-options { display: flex; gap: 8px; margin-top: 10px; }
  .grade-btn {
    flex: 1;
    padding: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #6b7280;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
  }
  .grade-btn.selected { border-color: #2dd4bf; color: #2dd4bf; background: rgba(45, 212, 191, 0.1); }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background: #2dd4bf;
    border: none;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    margin-top: 20px;
    cursor: pointer;
    color: #060810;
    transition: transform 0.1s;
  }
  .submit-btn:active { transform: scale(0.98); }
`;

export default function Teacher() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [form, setForm] = useState({ student_id: "", exam_id: "", marks: "", grade: "" });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/teacher/courses", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCourses(res.data))
    .catch(err => console.error("Course fetch error", err));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    const token = localStorage.getItem("token");
    
    // Fetch Enrolled Students for this course
    axios.get(`http://localhost:5000/api/teacher/students/${selectedCourse}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStudents(res.data));

    // Fetch Exams for this course
    axios.get(`http://localhost:5000/api/teacher/exams/${selectedCourse}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setExams(res.data));
  }, [selectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if(!form.student_id || !form.exam_id || !form.grade) {
        alert("Please fill all fields");
        return;
    }
    try {
      await axios.post("http://localhost:5000/api/grades", {
        student_id: Number(form.student_id),
        exam_id: Number(form.exam_id),
        marks_obtained: Number(form.marks),
        grade_letter: form.grade
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Grade Saved Successfully!");
    } catch (err) { alert("Error saving grade: " + err.message); }
  };

  return (
    <div className="teacher-root">
      <style>{style}</style>
      <nav className="scholaris-nav">
        <div className="nav-brand">
          <div className="nav-brand-icon">🎓</div>
          <span className="nav-brand-name">Scholaris</span>
        </div>
        <div className="nav-right">
          <span className="nav-page-tag">Teacher Panel</span>
          <button className="nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="teacher-card">
        <p className="teacher-eyebrow">Academic Portal</p>
        <h2 className="teacher-title">Teacher Panel</h2>

        <button className="enroll-nav-btn" onClick={() => navigate("/enroll")}>
          ➕ Enroll New Student
        </button>

        <form onSubmit={handleSubmit}>
          <div className="field-wrap full">
            <span className="field-label">Subject</span>
            <select 
              className="teacher-select"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setForm({...form, student_id: "", exam_id: ""});
              }}
            >
              <option value="">Select Subject</option>
              {courses.map(c => (
                <option key={c.COURSE_ID} value={c.COURSE_ID}>{c.COURSE_NAME}</option>
              ))}
            </select>
          </div>

          <div className="fields-grid">
            <div className="field-wrap">
              <span className="field-label">Student</span>
              <select 
                className="teacher-select"
                value={form.student_id}
                disabled={!selectedCourse}
                onChange={(e) => setForm({...form, student_id: e.target.value})}
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s.STUDENT_ID} value={s.STUDENT_ID}>
                    {s.EMAIL} (ID: {s.STUDENT_ID})
                  </option>
                ))}
              </select>
            </div>
            <div className="field-wrap">
              <span className="field-label">Exam</span>
              <select 
                className="teacher-select"
                value={form.exam_id}
                disabled={!selectedCourse}
                onChange={(e) => setForm({...form, exam_id: e.target.value})}
              >
                <option value="">Select Exam</option>
                {exams.map(ex => (
                  <option key={ex.EXAM_ID} value={ex.EXAM_ID}>{ex.EXAM_NAME}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-wrap full">
            <span className="field-label">Marks</span>
            <input 
              className="teacher-input" 
              type="number" 
              placeholder="0-100"
              value={form.marks} 
              onChange={(e) => setForm({...form, marks: e.target.value})} 
            />
          </div>

          <div className="field-wrap full">
            <span className="field-label">Grade Letter</span>
            <div className="grade-options">
              {["O", "A+", "A", "B", "C", "F"].map(g => (
                <button 
                  key={g} 
                  type="button" 
                  className={`grade-btn ${form.grade === g ? 'selected' : ''}`}
                  onClick={() => setForm({...form, grade: g})}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">Submit Grade →</button>
        </form>
      </div>
    </div>
  );
}