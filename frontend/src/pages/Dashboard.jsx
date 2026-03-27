import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
 
  * { box-sizing: border-box; margin: 0; padding: 0; }
 
  body {
    background: #060810;
    font-family: 'DM Mono', monospace;
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
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(20,184,166,0.3), transparent);
  }
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
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
  .nav-center {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 4px;
  }
  .nav-pill {
    padding: 6px 16px;
    border-radius: 7px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.08em;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    border: none;
    background: none;
  }
  .nav-pill:hover { color: #9ca3af; }
  .nav-pill.active {
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
    border: 1px solid rgba(99,102,241,0.25);
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
    color: #4b5563;
    font-family: 'DM Mono', monospace;
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
 
  .dashboard {
    min-height: 100vh;
    background: #060810;
    color: #e8eaf0;
    padding: 108px 56px 48px;
    position: relative;
    overflow: hidden;
    font-family: 'DM Mono', monospace;
  }
 
  /* Ambient background blobs */
  .dashboard::before {
    content: '';
    position: fixed;
    top: -20%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .dashboard::after {
    content: '';
    position: fixed;
    bottom: -10%;
    right: -5%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
 
  .content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }
 
  /* HEADER */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 52px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding-bottom: 28px;
  }
  .header-left .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6366f1;
    margin-bottom: 8px;
  }
  .header-left h1 {
    font-family: 'Syne', sans-serif;
    font-size: 42px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #f0f1f6;
    line-height: 1;
  }
  .avg-badge {
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 12px;
    padding: 14px 22px;
    text-align: right;
  }
  .avg-badge .label {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 4px;
  }
  .avg-badge .value {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #a5b4fc;
  }
 
  /* CARDS */
  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }
  .card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 28px 30px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }
  .card:hover {
    transform: translateY(-3px);
    border-color: rgba(99,102,241,0.3);
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent);
  }
  .card .card-label {
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 14px;
  }
  .card .card-value {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 700;
    color: #f0f1f6;
    line-height: 1;
  }
  .card .card-value.accent { color: #a5b4fc; }
  .card .card-icon {
    position: absolute;
    bottom: 20px; right: 24px;
    font-size: 32px;
    opacity: 0.15;
  }
 
  /* SECTION HEADERS */
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #4b5563;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.05);
  }
 
  /* TABLE */
  .table-wrap {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 36px;
  }
  .table-inner { padding: 28px 30px 0; }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead tr {
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  th {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4b5563;
    padding: 0 16px 16px;
    text-align: left;
    font-weight: 500;
  }
  tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.03);
    transition: background 0.15s ease;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(99,102,241,0.04); }
  td {
    padding: 16px;
    font-size: 13px;
    color: #9ca3af;
  }
  td.course-name {
    color: #d1d5db;
    font-weight: 500;
  }
  td.marks {
    color: #818cf8;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 14px;
  }
  td.grade {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
  }
  .grade-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px; height: 36px;
    border-radius: 10px;
    background: rgba(20,184,166,0.1);
    border: 1px solid rgba(20,184,166,0.2);
    color: #2dd4bf;
    font-size: 13px;
  }
 
  /* CHART */
  .chart-wrap {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 28px 30px;
    margin-bottom: 30px;
  }
  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: rgba(255,255,255,0.04) !important;
  }
  .recharts-text {
    fill: #4b5563 !important;
    font-family: 'DM Mono', monospace !important;
    font-size: 11px !important;
  }
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    background: #111827 !important;
    border: 1px solid rgba(99,102,241,0.3) !important;
    border-radius: 10px !important;
    font-family: 'DM Mono', monospace !important;
    font-size: 12px !important;
    color: #e8eaf0 !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
  }
`;

const BAR_COLORS = [
  "#6366f1", "#818cf8", "#a5b4fc",
  "#2dd4bf", "#34d399", "#60a5fa",
  "#f472b6", "#fb923c",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#111827",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 10,
        padding: "10px 16px",
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: "#e8eaf0",
      }}>
        <p style={{ color: "#6b7280", marginBottom: 4, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
        <p style={{ color: "#a5b4fc", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState({ rank: "-", cgpa: 0 });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.student_id) return;

        // 🟢 CACHE BUSTER: Added timestamp to bypass browser cache and force fresh fetch
        const t = Date.now();

        // 1. Fetch Grades
        const gradeRes = await axios.get(
          `http://localhost:5000/api/grades/student/${user.student_id}?t=${t}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGrades(gradeRes.data);

        // 2. Fetch Rank and CGPA with a slight delay
        // This ensures the Oracle View calculation has processed the latest merge
        setTimeout(async () => {
            const statRes = await axios.get(
                `http://localhost:5000/api/teacher/rank/${user.student_id}?t=${t}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (statRes.data) {
                setStats({ 
                    rank: statRes.data.STUDENT_RANK || "-", 
                    cgpa: statRes.data.CGPA || 0 
                });
            }
        }, 300);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      }
    };

    fetchData();
  }, []);

  const avg = grades.length > 0
    ? grades.reduce((acc, g) => acc + Number(g.MARKS_OBTAINED || 0), 0) / grades.length
    : 0;

  // Dynamic Performance Logic
  const getPerformanceLabel = (score) => {
    if (score >= 90) return "🔥 Elite";
    if (score >= 75) return "✨ Excellent";
    if (score >= 60) return "📈 Good";
    return "📚 Average";
  };

  return (
    <>
      <style>{style}</style>
      <nav className="scholaris-nav">
        <div className="nav-brand">
          <div className="nav-brand-icon">🎓</div>
          <span className="nav-brand-name">Scholaris</span>
        </div>
        <div className="nav-center">
          <button className="nav-pill active">Dashboard</button>
        </div>
        <div className="nav-right">
          <span className="nav-page-tag">Student View</span>
          <button className="nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard">
        <div className="content">

          {/* HEADER */}
          <div className="header">
            <div className="header-left">
              <p className="eyebrow">Academic Portal</p>
              <h1>Dashboard</h1>
            </div>
            <div className="avg-badge">
              <p className="label">Overall Average</p>
              <p className="value">{avg.toFixed(2)}</p>
            </div>
          </div>

          {/* CARDS */}
          <div className="cards">
            <div className="card">
              <p className="card-label">CGPA / Rank</p>
              <p className="card-value accent">
                {stats.cgpa ? Number(stats.cgpa).toFixed(2) : "0.00"} / #{stats.rank}
              </p>
              <span className="card-icon">🏆</span>
            </div>
            <div className="card">
              <p className="card-label">Average Score</p>
              <p className="card-value">{avg.toFixed(2)}</p>
              <span className="card-icon">📊</span>
            </div>
            <div className="card">
              <p className="card-label">Performance</p>
              <p className="card-value">{getPerformanceLabel(avg)}</p>
            </div>
          </div>

          {/* TABLE */}
          <p className="section-title">Grades Breakdown</p>
          <div className="table-wrap">
            <div className="table-inner">
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Exam</th>
                    <th>Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.length > 0 ? grades.map((g, i) => (
                    <tr key={i}>
                      <td className="course-name">{g.COURSE_NAME}</td>
                      <td>{g.EXAM_NAME}</td>
                      <td className="marks">{g.MARKS_OBTAINED}</td>
                      <td className="grade">
                        <span className="grade-pill">{g.GRADE_LETTER}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHARTS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
            <div className="chart-wrap">
              <p className="section-title" style={{ border: 'none', marginBottom: '15px' }}>Subject Performance</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={grades} barSize={32} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="1 4" vertical={false} />
                  <XAxis dataKey="COURSE_NAME" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
                  <Bar dataKey="MARKS_OBTAINED" radius={[6, 6, 0, 0]}>
                    {grades.map((_, index) => (
                      <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-wrap">
              <p className="section-title" style={{ border: 'none', marginBottom: '15px' }}>Skill Analysis</p>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={grades}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="COURSE_NAME" tick={{ fill: "#4b5563", fontSize: 9 }} />
                  <Radar name="Score" dataKey="MARKS_OBTAINED" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}