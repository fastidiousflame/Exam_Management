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
  LineChart,
  Line,
  PieChart,
  Pie,
  Legend,
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

  /* ── PERFORMANCE PANEL ── */
  .perf-panel {
    background: rgba(255,255,255,0.018);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 36px;
  }

  /* Tab bar */
  .perf-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 0 28px;
    background: rgba(255,255,255,0.01);
  }
  .perf-tab {
    padding: 16px 20px;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-family: 'DM Mono', monospace;
    color: #4b5563;
    cursor: pointer;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: -1px;
  }
  .perf-tab:hover { color: #9ca3af; }
  .perf-tab.active {
    color: #a5b4fc;
    border-bottom-color: #6366f1;
  }
  .perf-tab .tab-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.6;
  }

  /* Tab body */
  .perf-body {
    padding: 28px 30px;
  }

  /* Insight strip */
  .insight-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }
  .insight-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 16px 18px;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }
  .insight-card:hover {
    border-color: rgba(99,102,241,0.25);
    transform: translateY(-2px);
  }
  .insight-card .ic-label {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .insight-card .ic-value {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #f0f1f6;
    line-height: 1;
    margin-bottom: 4px;
  }
  .insight-card .ic-sub {
    font-size: 10px;
    color: #6b7280;
  }
  .insight-card .ic-accent { color: #a5b4fc; }
  .insight-card .ic-good   { color: #2dd4bf; }
  .insight-card .ic-warn   { color: #fb923c; }
  .insight-card .ic-danger { color: #f87171; }

  /* Narrative box */
  .narrative-box {
    background: rgba(99,102,241,0.05);
    border: 1px solid rgba(99,102,241,0.15);
    border-left: 3px solid #6366f1;
    border-radius: 12px;
    padding: 18px 20px;
    margin-bottom: 28px;
    font-size: 12px;
    line-height: 1.8;
    color: #9ca3af;
  }
  .narrative-box strong { color: #c7d2fe; }

  /* Course insight rows */
  .course-perf-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    cursor: pointer;
    transition: background 0.15s ease;
    border-radius: 8px;
    padding-left: 8px;
  }
  .course-perf-row:last-child { border-bottom: none; }
  .course-perf-row:hover { background: rgba(99,102,241,0.04); }
  .cpr-name {
    flex: 1;
    font-size: 12px;
    color: #d1d5db;
    font-weight: 500;
  }
  .cpr-score {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #a5b4fc;
    min-width: 40px;
    text-align: right;
  }
  .cpr-bar-track {
    width: 120px;
    height: 5px;
    background: rgba(255,255,255,0.06);
    border-radius: 99px;
    overflow: hidden;
  }
  .cpr-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.6s ease;
  }
  .cpr-badge {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 6px;
    font-family: 'DM Mono', monospace;
    min-width: 80px;
    text-align: center;
  }

  /* Grade distribution legend */
  .grade-legend {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .gl-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #6b7280;
  }
  .gl-dot {
    width: 10px; height: 10px;
    border-radius: 3px;
  }

  /* Trend insight note */
  .trend-note {
    background: rgba(45,212,191,0.05);
    border: 1px solid rgba(45,212,191,0.15);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 11px;
    color: #5eead4;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Gauge ring */
  .gauge-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .gauge-label {
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6b7280;
    text-align: center;
  }
`;

const BAR_COLORS = [
  "#6366f1", "#818cf8", "#a5b4fc",
  "#2dd4bf", "#34d399", "#60a5fa",
  "#f472b6", "#fb923c",
];

const GRADE_COLORS = {
  A: "#2dd4bf", B: "#60a5fa", C: "#fb923c", D: "#f87171", F: "#ef4444",
};

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

// ── PERFORMANCE PANEL ──────────────────────────────────────────────
function PerformancePanel({ grades }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredCourse, setHoveredCourse] = useState(null);

  if (!grades || grades.length === 0) {
    return (
      <div className="perf-panel">
        <div className="perf-body">
          <p style={{ color: "#4b5563", textAlign: "center", padding: "40px 0", fontSize: 13 }}>
            No performance data available yet.
          </p>
        </div>
      </div>
    );
  }

  // ── derived stats ──
  const scores = grades.map(g => Number(g.MARKS_OBTAINED || 0));
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const stdDev = Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / scores.length);

  const highestCourse = grades.find(g => Number(g.MARKS_OBTAINED) === highest);
  const lowestCourse  = grades.find(g => Number(g.MARKS_OBTAINED) === lowest);

  const passCount = scores.filter(s => s >= 40).length;
  const passRate  = Math.round((passCount / scores.length) * 100);

  // grade distribution for pie
  const gradeDist = grades.reduce((acc, g) => {
    const letter = (g.GRADE_LETTER || "?").charAt(0);
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(gradeDist).map(([name, value]) => ({ name, value }));

  // course-by-course performance for the list
  const courseData = grades.map((g, i) => ({
    name: g.COURSE_NAME,
    score: Number(g.MARKS_OBTAINED || 0),
    grade: g.GRADE_LETTER,
    exam: g.EXAM_NAME,
    color: BAR_COLORS[i % BAR_COLORS.length],
  })).sort((a, b) => b.score - a.score);

  // line trend (index as proxy for time / entry order)
  const trendData = grades.map((g, i) => ({
    name: g.COURSE_NAME,
    score: Number(g.MARKS_OBTAINED || 0),
    idx: i + 1,
  }));

  const getScoreBadge = (score) => {
    if (score >= 90) return { label: "Excellent", bg: "rgba(45,212,191,0.12)", color: "#2dd4bf", border: "rgba(45,212,191,0.25)" };
    if (score >= 80) return { label: "Very Good", bg: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "rgba(99,102,241,0.25)" };
    if (score >= 70) return { label: "Good",      bg: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "rgba(96,165,250,0.25)" };
    if (score >= 60) return { label: "Average",   bg: "rgba(251,146,60,0.12)", color: "#fb923c", border: "rgba(251,146,60,0.25)" };
    return { label: "Needs Work", bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.25)" };
  };

  const getNarrative = () => {
    if (avg >= 85) return <>You're performing <strong>exceptionally well</strong> across your courses with an average of <strong>{avg.toFixed(1)}</strong>. Your best result was in <strong>{highestCourse?.COURSE_NAME}</strong> ({highest}). Keep up the momentum — consistency at this level sets you apart.</>; 
    if (avg >= 70) return <>Solid academic standing with an average of <strong>{avg.toFixed(1)}</strong>. You excel in <strong>{highestCourse?.COURSE_NAME}</strong> ({highest}) and have room to push <strong>{lowestCourse?.COURSE_NAME}</strong> ({lowest}) higher. Focus on closing that gap and you'll see your CGPA climb.</>; 
    if (avg >= 55) return <>Your average stands at <strong>{avg.toFixed(1)}</strong> — you're passing, but there's clear headroom for improvement. <strong>{highestCourse?.COURSE_NAME}</strong> shows your potential. Prioritise <strong>{lowestCourse?.COURSE_NAME}</strong> ({lowest}) and aim to bring all scores above 70.</>; 
    return <>Your current average is <strong>{avg.toFixed(1)}</strong>. Immediate attention is needed, especially in <strong>{lowestCourse?.COURSE_NAME}</strong> ({lowest}). Break your study time into focused sessions per subject, and speak with your instructors for targeted guidance.</>;
  };

  const tabs = [
    { id: "overview",   label: "Overview",     icon: "📊" },
    { id: "courses",    label: "Course Detail", icon: "📚" },
    { id: "trends",     label: "Trends",        icon: "📈" },
    { id: "dist",       label: "Grade Split",   icon: "🎯" },
  ];

  return (
    <div className="perf-panel">
      {/* Tab bar */}
      <div className="perf-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`perf-tab${activeTab === t.id ? " active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="perf-body">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Insight strip */}
            <div className="insight-strip">
              <div className="insight-card">
                <p className="ic-label">Avg Score</p>
                <p className={`ic-value ${avg >= 70 ? "ic-good" : avg >= 55 ? "ic-warn" : "ic-danger"}`}>{avg.toFixed(1)}</p>
                <p className="ic-sub">out of 100</p>
              </div>
              <div className="insight-card">
                <p className="ic-label">Highest</p>
                <p className="ic-value ic-good">{highest}</p>
                <p className="ic-sub" style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {highestCourse?.COURSE_NAME}
                </p>
              </div>
              <div className="insight-card">
                <p className="ic-label">Lowest</p>
                <p className={`ic-value ${lowest < 40 ? "ic-danger" : "ic-warn"}`}>{lowest}</p>
                <p className="ic-sub" style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lowestCourse?.COURSE_NAME}
                </p>
              </div>
              <div className="insight-card">
                <p className="ic-label">Pass Rate</p>
                <p className={`ic-value ${passRate >= 80 ? "ic-good" : passRate >= 60 ? "ic-warn" : "ic-danger"}`}>{passRate}%</p>
                <p className="ic-sub">{passCount}/{scores.length} courses</p>
              </div>
            </div>

            {/* Narrative */}
            <div className="narrative-box">{getNarrative()}</div>

            {/* Bar chart */}
            <p className="section-title" style={{ border: "none", marginBottom: 16 }}>Subject Performance</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={grades} barSize={30} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="1 4" vertical={false} />
                <XAxis dataKey="COURSE_NAME" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
                <Bar dataKey="MARKS_OBTAINED" radius={[6, 6, 0, 0]}>
                  {grades.map((_, index) => (
                    <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Consistency note */}
            <div className="trend-note">
              <span>📐</span>
              Score spread: <strong style={{ color: "#f0f1f6", margin: "0 4px" }}>{(highest - lowest)}</strong> points · Standard deviation: <strong style={{ color: "#f0f1f6", margin: "0 4px" }}>{stdDev.toFixed(1)}</strong> — {stdDev < 10 ? "very consistent performer" : stdDev < 20 ? "moderate variance across subjects" : "high variance — focus on weak subjects"}
            </div>
          </>
        )}

        {/* ── COURSE DETAIL TAB ── */}
        {activeTab === "courses" && (
          <>
            <p className="section-title" style={{ border: "none", marginBottom: 20 }}>Per-Course Breakdown</p>
            <div className="narrative-box">
              Hover a course to highlight it. Scores are shown as a fill bar relative to 100. Courses sorted highest → lowest.
            </div>
            {courseData.map((c, i) => {
              const badge = getScoreBadge(c.score);
              const isHovered = hoveredCourse === i;
              return (
                <div
                  key={i}
                  className="course-perf-row"
                  onMouseEnter={() => setHoveredCourse(i)}
                  onMouseLeave={() => setHoveredCourse(null)}
                  style={{ opacity: hoveredCourse !== null && !isHovered ? 0.5 : 1, transition: "opacity 0.2s ease" }}
                >
                  <div style={{ width: 22, textAlign: "center", fontSize: 12, color: "#4b5563", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                    {i + 1}
                  </div>
                  <div className="cpr-name">
                    <div>{c.name}</div>
                    <div style={{ fontSize: 10, color: "#4b5563", marginTop: 2 }}>{c.exam}</div>
                  </div>
                  <div className="cpr-bar-track">
                    <div className="cpr-bar-fill" style={{ width: `${c.score}%`, background: c.color }} />
                  </div>
                  <div className="cpr-score" style={{ color: c.color }}>{c.score}</div>
                  <div
                    className="cpr-badge"
                    style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
                  >
                    {badge.label}
                  </div>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: "rgba(20,184,166,0.1)",
                    border: "1px solid rgba(20,184,166,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#2dd4bf", fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 700
                  }}>
                    {c.grade}
                  </div>
                </div>
              );
            })}

            {/* Radar */}
            <p className="section-title" style={{ border: "none", marginTop: 32, marginBottom: 12 }}>Skill Web</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={grades}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="COURSE_NAME" tick={{ fill: "#4b5563", fontSize: 9 }} />
                <Radar name="Score" dataKey="MARKS_OBTAINED" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* ── TRENDS TAB ── */}
        {activeTab === "trends" && (
          <>
            <p className="section-title" style={{ border: "none", marginBottom: 16 }}>Score Trend Across Entries</p>
            <div className="narrative-box">
              This line chart shows how your scores flow across recorded entries. A rising slope indicates improving performance; a dip signals a subject that may need extra attention.
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData} margin={{ top: 4, right: 16, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(99,102,241,0.2)", strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#a5b4fc", r: 5, strokeWidth: 0 }}
                  activeDot={{ fill: "#f0f1f6", r: 7, stroke: "#6366f1", strokeWidth: 2 }}
                />
                {/* Reference average line as a flat dashed */}
                <Line
                  type="monotone"
                  dataKey={() => avg}
                  stroke="#2dd4bf"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Average"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="grade-legend" style={{ marginTop: 12 }}>
              <div className="gl-item"><div className="gl-dot" style={{ background: "#6366f1" }} /> Your scores</div>
              <div className="gl-item"><div className="gl-dot" style={{ background: "#2dd4bf", opacity: 0.7 }} /> Overall avg ({avg.toFixed(1)})</div>
            </div>

            {/* improvement opportunity */}
            <div style={{ marginTop: 24 }}>
              <p className="section-title" style={{ border: "none", marginBottom: 14 }}>Improvement Opportunities</p>
              {courseData.filter(c => c.score < avg).length === 0 ? (
                <div className="trend-note"><span>🌟</span> All courses are above your average — outstanding consistency!</div>
              ) : (
                courseData.filter(c => c.score < avg).map((c, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", marginBottom: 8,
                    background: "rgba(251,146,60,0.05)",
                    border: "1px solid rgba(251,146,60,0.15)",
                    borderRadius: 12, fontSize: 12
                  }}>
                    <span style={{ color: "#d1d5db" }}>{c.name}</span>
                    <span style={{ color: "#fb923c", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                      {c.score} <span style={{ color: "#4b5563", fontSize: 10, fontFamily: "'DM Mono'" }}>/ needs +{(avg - c.score).toFixed(1)} to hit avg</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── GRADE DISTRIBUTION TAB ── */}
        {activeTab === "dist" && (
          <>
            <p className="section-title" style={{ border: "none", marginBottom: 16 }}>Grade Distribution</p>
            <div className="narrative-box">
              A breakdown of letter grades across all your recorded exams. A concentration of A's and B's reflects strong overall preparation; C's and below indicate areas for a targeted study push.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Donut / Pie */}
              <div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={GRADE_COLORS[entry.name] || BAR_COLORS[index % BAR_COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#111827",
                        border: "1px solid rgba(99,102,241,0.3)",
                        borderRadius: 10,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 12,
                        color: "#e8eaf0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grade-legend" style={{ justifyContent: "center" }}>
                  {pieData.map((e, i) => (
                    <div key={i} className="gl-item">
                      <div className="gl-dot" style={{ background: GRADE_COLORS[e.name] || BAR_COLORS[i % BAR_COLORS.length] }} />
                      Grade {e.name} ({e.value})
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade score breakdown bars */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                {courseData.map((c, i) => {
                  const gc = GRADE_COLORS[(c.grade || "").charAt(0)] || BAR_COLORS[i % BAR_COLORS.length];
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 6,
                        background: `${gc}20`, border: `1px solid ${gc}40`,
                        color: gc, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>{c.grade}</div>
                      <div style={{ flex: 1, fontSize: 11, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.name}
                      </div>
                      <div style={{ width: 80, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden", flexShrink: 0 }}>
                        <div style={{ width: `${c.score}%`, height: "100%", background: gc, borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 600, color: gc, width: 26, textAlign: "right", flexShrink: 0 }}>
                        {c.score}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grade stats */}
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {["A","B","C","D"].map(letter => {
                const count = gradeDist[letter] || 0;
                const pct = grades.length > 0 ? Math.round((count / grades.length) * 100) : 0;
                return (
                  <div key={letter} style={{
                    background: `${GRADE_COLORS[letter] || "#6366f1"}0d`,
                    border: `1px solid ${GRADE_COLORS[letter] || "#6366f1"}25`,
                    borderRadius: 12, padding: "14px 16px", textAlign: "center"
                  }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: GRADE_COLORS[letter] || "#a5b4fc" }}>{letter}</p>
                    <p style={{ fontSize: 18, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#f0f1f6" }}>{count}</p>
                    <p style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{pct}% of courses</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────
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

        const t = Date.now();

        // 1. Fetch Grades
        const gradeRes = await axios.get(
          `http://localhost:5000/api/grades/student/${user.student_id}?t=${t}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGrades(gradeRes.data);

        // 2. Fetch Rank and CGPA
        // Ensuring we use the UPPERCASE keys returned by Oracle
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

  const getPerformanceLabel = (score) => {
    if (score >= 90) return "🔥 Excellent";
    if (score >= 80) return "✨ Very Good";
    if (score >= 70) return "📈 Good";
    if (score >= 60) return "⚠️ Average";
    if (score > 0) return "🔻 Needs Improvement";
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
                {/* Fixed numeric check and case sensitivity mapping */}
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

          {/* ── PERFORMANCE PANEL ── */}
          <p className="section-title">Course Performance</p>
          <PerformancePanel grades={grades} />

        </div>
      </div>
    </>
  );
}