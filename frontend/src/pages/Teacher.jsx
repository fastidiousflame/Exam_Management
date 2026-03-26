import { useState, useEffect } from "react";
import axios from "axios";


const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .teacher-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #060810;
    font-family: 'DM Mono', monospace;
    position: relative;
    overflow: hidden;
  }

  .teacher-root::before {
    content: '';
    position: fixed;
    top: -15%;
    right: -10%;
    width: 560px;
    height: 560px;
    background: radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .teacher-root::after {
    content: '';
    position: fixed;
    bottom: -10%;
    left: -8%;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%);
    pointer-events: none;
  }

  .teacher-card {
    position: relative;
    z-index: 1;
    width: 480px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 48px 44px 44px;
    overflow: visible;
  }

  .teacher-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(20,184,166,0.5), transparent);
    border-radius: 24px 24px 0 0;
  }

  .teacher-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #2dd4bf;
    margin-bottom: 10px;
    font-weight: 500;
  }

  .teacher-title {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: #f0f1f6;
    letter-spacing: -0.03em;
    margin-bottom: 36px;
  }

  .fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .field-wrap { display: flex; flex-direction: column; position: relative; }
  .field-wrap.full { grid-column: 1 / -1; }

  .field-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4b5563;
    margin-bottom: 8px;
  }

  .teacher-input {
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
  .teacher-input:focus {
    border-color: rgba(20,184,166,0.4);
    background: rgba(20,184,166,0.03);
  }

  /* ── Custom Dropdown ── */
  .dropdown-wrapper {
    position: relative;
    width: 100%;
  }

  .dropdown-trigger {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 13px 15px;
    color: #e8eaf0;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.2s ease, background 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .dropdown-trigger:hover,
  .dropdown-trigger.open {
    border-color: rgba(20,184,166,0.4);
    background: rgba(20,184,166,0.03);
  }

  .dropdown-trigger .placeholder { color: #374151; }

  .dropdown-trigger .selected-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
  }

  .dropdown-arrow {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: #4b5563;
    transition: transform 0.2s ease, color 0.2s ease;
  }
  .dropdown-trigger.open .dropdown-arrow {
    transform: rotate(180deg);
    color: #2dd4bf;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0; right: 0;
    background: #0e1120;
    border: 1px solid rgba(20,184,166,0.25);
    border-radius: 14px;
    overflow: hidden;
    z-index: 999;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(20,184,166,0.05);
    animation: dropIn 0.15s ease;
  }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .dropdown-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 11px 14px;
    color: #e8eaf0;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    outline: none;
  }
  .dropdown-search::placeholder { color: #374151; }

  .dropdown-list {
    max-height: 180px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(20,184,166,0.25) transparent;
  }
  .dropdown-list::-webkit-scrollbar { width: 4px; }
  .dropdown-list::-webkit-scrollbar-track { background: transparent; }
  .dropdown-list::-webkit-scrollbar-thumb {
    background: rgba(20,184,166,0.25);
    border-radius: 4px;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 14px;
    cursor: pointer;
    font-size: 12px;
    color: #9ca3af;
    transition: background 0.12s ease, color 0.12s ease;
    gap: 8px;
  }
  .dropdown-item:hover {
    background: rgba(20,184,166,0.07);
    color: #e8eaf0;
  }
  .dropdown-item.active {
    background: rgba(20,184,166,0.1);
    color: #2dd4bf;
  }
  .dropdown-item .item-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dropdown-item .item-badge {
    flex-shrink: 0;
    font-size: 10px;
    letter-spacing: 0.04em;
    color: #374151;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px;
    padding: 2px 7px;
  }
  .dropdown-item.active .item-badge {
    color: #2dd4bf;
    border-color: rgba(20,184,166,0.3);
    background: rgba(20,184,166,0.08);
  }

  .dropdown-empty {
    padding: 20px 14px;
    text-align: center;
    font-size: 12px;
    color: #374151;
  }

  /* ── Grade buttons ── */
  .grade-options {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }

  .grade-btn {
    padding: 11px 0;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #6b7280;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .grade-btn:hover {
    border-color: rgba(20,184,166,0.3);
    color: #2dd4bf;
    background: rgba(20,184,166,0.05);
  }
  .grade-btn.selected {
    border-color: rgba(20,184,166,0.5);
    background: rgba(20,184,166,0.1);
    color: #2dd4bf;
  }

  .divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 24px 0;
  }

  .submit-btn {
    width: 100%;
    padding: 15px;
    background: #2dd4bf;
    border: none;
    border-radius: 12px;
    color: #060810;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.04em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: opacity 0.2s ease, transform 0.15s ease;
  }
  .submit-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .submit-btn:active { transform: translateY(0); }
  .submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
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

  .teacher-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 11px;
    color: #374151;
    letter-spacing: 0.05em;
  }
`;

const GRADES = ["A", "B", "C", "D", "F"];

/* ── Reusable custom dropdown component ── */
function CustomDropdown({ options, value, onChange, placeholder, labelKey, valueKey, badgeKey }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) =>
    String(o[labelKey] ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const selected = options.find((o) => String(o[valueKey]) === String(value));

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setSearch("");
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest(".dropdown-wrapper")) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="dropdown-wrapper">
      <button
        type="button"
        className={`dropdown-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {selected ? (
          <span className="selected-text">{selected[labelKey]}</span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <svg className="dropdown-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="dropdown-menu">
          <input
            className="dropdown-search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="dropdown-list">
            {filtered.length === 0 ? (
              <p className="dropdown-empty">No results found</p>
            ) : (
              filtered.map((o) => (
                <div
                  key={o[valueKey]}
                  className={`dropdown-item${String(value) === String(o[valueKey]) ? " active" : ""}`}
                  onClick={() => handleSelect(String(o[valueKey]))}
                >
                  <span className="item-label">{o[labelKey]}</span>
                  {badgeKey && (
                    <span className="item-badge">ID {o[badgeKey]}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Teacher() {
  const [form, setForm] = useState({
    student_id: "",
    exam_id: "",
    marks_obtained: "",
    grade_letter: "",
  });

  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);           // 🟢 1. NEW STATE
  const [selectedCourse, setSelectedCourse] = useState(""); // 🟢 1. NEW STATE
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res1 = await axios.get("http://localhost:5000/api/teacher/students", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const res2 = await axios.get("http://localhost:5000/api/teacher/exams", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 🟢 2. FETCH COURSES
        const res3 = await axios.get("http://localhost:5000/api/teacher/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudents(res1.data);
        setExams(res2.data);
        setCourses(res3.data); // 🟢 2. SET COURSES
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🟢 3. FILTER EXAMS BY SELECTED COURSE
  useEffect(() => {
    if (!selectedCourse) return;

    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/api/teacher/exams/${selectedCourse}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setExams(res.data))
      .catch((err) => console.error(err));
  }, [selectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/grades",
        {
          student_id: Number(form.student_id),
          exam_id: Number(form.exam_id),
          marks_obtained: Number(form.marks_obtained),
          grade_letter: form.grade_letter,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showToast("success", "Grade submitted successfully.");
      setForm({ student_id: "", exam_id: "", marks_obtained: "", grade_letter: "" });
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast("error", "Failed to submit grade.");
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="teacher-root">
        <div className="teacher-card">
          <p className="teacher-eyebrow">Academic Portal</p>
          <h2 className="teacher-title">Teacher Panel</h2>

          {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="fields-grid">

              {/* STUDENT DROPDOWN */}
              <div className="field-wrap">
                <span className="field-label">Student</span>
                <CustomDropdown
                  options={students}
                  value={form.student_id}
                  onChange={(val) => setForm({ ...form, student_id: val })}
                  placeholder="Select Student"
                  labelKey="EMAIL"
                  valueKey="STUDENT_ID"
                  badgeKey="STUDENT_ID"
                />
              </div>

              {/* 🟢 4. SUBJECT DROPDOWN — placed above Exam */}
              <div className="field-wrap">
                <span className="field-label">Subject</span>
                <CustomDropdown
                  options={courses}
                  value={selectedCourse}
                  onChange={(val) => {
                    setSelectedCourse(val);
                    setForm({ ...form, exam_id: "" }); // reset exam when subject changes
                  }}
                  placeholder="Select Subject"
                  labelKey="COURSE_NAME"
                  valueKey="COURSE_ID"
                  badgeKey="COURSE_ID"
                />
              </div>

              {/* EXAM DROPDOWN */}
              <div className="field-wrap">
                <span className="field-label">Exam</span>
                <CustomDropdown
                  options={exams}
                  value={form.exam_id}
                  onChange={(val) => setForm({ ...form, exam_id: val })}
                  placeholder="Select Exam"
                  labelKey="EXAM_NAME"
                  valueKey="EXAM_ID"
                  badgeKey="EXAM_ID"
                />
              </div>

              <div className="field-wrap full">
                <span className="field-label">Marks Obtained</span>
                <input
                  className="teacher-input"
                  placeholder="e.g. 87"
                  value={form.marks_obtained}
                  onChange={(e) => setForm({ ...form, marks_obtained: e.target.value })}
                />
              </div>

              <div className="field-wrap full">
                <span className="field-label">Grade Letter</span>
                <div className="grade-options">
                  {GRADES.map((g) => (
                    <button
                      type="button"
                      key={g}
                      className={`grade-btn${form.grade_letter === g ? " selected" : ""}`}
                      onClick={() => setForm({ ...form, grade_letter: g })}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="divider" />

            <button type="submit" className="submit-btn">
              Submit Grade →
            </button>
          </form>

          <p className="teacher-footer">Academic Management System · v2.0</p>
        </div>
      </div>
    </>
  );
}