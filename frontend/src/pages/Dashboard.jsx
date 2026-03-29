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
} from "recharts";

/* ─────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #060810;
    font-family: 'DM Mono', monospace;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0c0f1a; }
  ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 99px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
    70%  { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
    100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
  }

  /* ── NAVBAR ── */
  .scholaris-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    background: rgba(6,8,16,0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.055);
  }
  .scholaris-nav::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 35%, rgba(20,184,166,0.4) 65%, transparent 100%);
  }
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .nav-brand-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #6366f1, #2dd4bf);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    box-shadow: 0 0 14px rgba(99,102,241,0.3);
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
  .nav-right { display: flex; align-items: center; gap: 12px; }
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
    box-shadow: 0 0 12px rgba(239,68,68,0.12);
  }

  /* ── DASHBOARD ROOT ── */
  .dashboard {
    min-height: 100vh;
    background: #060810;
    color: #e8eaf0;
    padding: 112px 56px 64px;
    position: relative;
    overflow: hidden;
    font-family: 'DM Mono', monospace;
  }
  .dashboard::before {
    content: '';
    position: fixed;
    top: -20%; left: -10%;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .dashboard::after {
    content: '';
    position: fixed;
    bottom: -10%; right: -5%;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    animation: fadeUp 0.5s ease both;
  }

  /* ── HEADER ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 48px;
    border-bottom: 1px solid rgba(255,255,255,0.055);
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
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-left .eyebrow::before {
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #6366f1;
    box-shadow: 0 0 6px #6366f1;
    animation: pulse-ring 2s infinite;
    flex-shrink: 0;
  }
  .header-left h1 {
    font-family: 'Syne', sans-serif;
    font-size: 44px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #f0f1f6;
    line-height: 1;
  }
  .avg-badge {
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 14px;
    padding: 14px 22px;
    text-align: right;
    position: relative;
    overflow: hidden;
  }
  .avg-badge::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent);
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
    font-size: 30px;
    font-weight: 700;
    background: linear-gradient(135deg, #a5b4fc, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* ── CARDS ── */
  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 44px;
  }
  .card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 22px;
    padding: 28px 30px;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    animation: fadeUp 0.5s ease both;
  }
  .card:nth-child(1) { animation-delay: 0.05s; }
  .card:nth-child(2) { animation-delay: 0.10s; }
  .card:nth-child(3) { animation-delay: 0.15s; }
  .card:hover {
    transform: translateY(-4px);
    border-color: rgba(99,102,241,0.35);
    box-shadow: 0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.08);
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
  }
  .card .card-label {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .card .card-label::before {
    content: '';
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #6366f1;
    flex-shrink: 0;
  }
  .card .card-value {
    font-family: 'Syne', sans-serif;
    font-size: 34px;
    font-weight: 700;
    color: #f0f1f6;
    line-height: 1;
  }
  .card .card-value.accent {
    background: linear-gradient(135deg, #a5b4fc, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .card .card-icon {
    position: absolute;
    bottom: 18px; right: 22px;
    font-size: 36px;
    opacity: 0.10;
    transition: opacity 0.2s ease, transform 0.25s ease;
  }
  .card:hover .card-icon { opacity: 0.18; transform: scale(1.1) rotate(-4deg); }
  .card-progress {
    position: absolute;
    bottom: 0; left: 0;
    height: 2px;
    border-radius: 0 2px 2px 0;
    background: linear-gradient(90deg, #6366f1, #2dd4bf);
    transition: width 1s ease;
  }

  /* ── SECTION TITLE ── */
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.14em;
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
    background: linear-gradient(90deg, rgba(255,255,255,0.06), transparent);
  }

  /* ── TABLE ── */
  .table-wrap {
    background: rgba(255,255,255,0.018);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 22px;
    overflow: hidden;
    margin-bottom: 36px;
    animation: fadeUp 0.5s 0.2s ease both;
  }
  .table-inner { padding: 24px 28px 0; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
  th {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4b5563;
    padding: 0 16px 14px;
    text-align: left;
    font-weight: 500;
  }
  tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.028);
    transition: background 0.15s ease;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(99,102,241,0.05); }
  td { padding: 14px 16px; font-size: 13px; color: #9ca3af; }
  td.course-name { color: #d1d5db; font-weight: 500; }
  td.marks {
    color: #818cf8;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 14px;
  }
  td.grade { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; }
  .grade-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px; height: 36px;
    padding: 0 6px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    transition: box-shadow 0.2s ease;
  }
  .marks-cell-inner { display: flex; align-items: center; gap: 10px; }
  .marks-mini-bar {
    width: 48px; height: 3px;
    background: rgba(255,255,255,0.06);
    border-radius: 99px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .marks-mini-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #6366f1, #2dd4bf);
  }

  /* ── RECHARTS GLOBALS ── */
  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line { stroke: rgba(255,255,255,0.04) !important; }
  .recharts-text {
    fill: #4b5563 !important;
    font-family: 'DM Mono', monospace !important;
    font-size: 11px !important;
  }

  /* ── PERFORMANCE PANEL ── */
  .perf-panel {
    background: rgba(255,255,255,0.016);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 36px;
    animation: fadeUp 0.5s 0.25s ease both;
  }
  .perf-tabs {
    display: flex;
    border-bottom: 1px solid rgba(255,255,255,0.055);
    padding: 0 28px;
    background: rgba(0,0,0,0.15);
    overflow-x: auto;
  }
  .perf-tabs::-webkit-scrollbar { height: 0; }
  .perf-tab {
    padding: 17px 22px;
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
    gap: 8px;
    margin-bottom: -1px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .perf-tab:hover { color: #9ca3af; }
  .perf-tab.active { color: #a5b4fc; border-bottom-color: #6366f1; }
  .perf-body { padding: 28px 30px; }

  /* ── INSIGHT STRIP ── */
  .insight-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }
  .insight-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }
  .insight-card:hover {
    border-color: rgba(99,102,241,0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  }
  .insight-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.35), transparent);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .insight-card:hover::before { opacity: 1; }
  .insight-card .ic-icon { font-size: 20px; margin-bottom: 10px; display: block; }
  .insight-card .ic-label {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .insight-card .ic-value {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #f0f1f6;
    line-height: 1;
    margin-bottom: 4px;
  }
  .insight-card .ic-sub {
    font-size: 10px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 130px;
  }
  .insight-card .ic-good   { color: #2dd4bf; }
  .insight-card .ic-warn   { color: #fb923c; }
  .insight-card .ic-danger { color: #f87171; }

  /* ── NARRATIVE BOX ── */
  .narrative-box {
    background: rgba(99,102,241,0.045);
    border: 1px solid rgba(99,102,241,0.14);
    border-left: 3px solid #6366f1;
    border-radius: 12px;
    padding: 18px 20px;
    margin-bottom: 28px;
    font-size: 12px;
    line-height: 1.9;
    color: #9ca3af;
  }
  .narrative-box strong { color: #c7d2fe; }

  /* ── CHART HEADER ── */
  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  .chart-header-title {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #4b5563;
  }
  .chart-header-badge {
    font-size: 10px;
    padding: 3px 10px;
    border-radius: 6px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    color: #a5b4fc;
    font-family: 'DM Mono', monospace;
  }

  /* ── COURSE PERF ROWS ── */
  .course-perf-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 10px;
    border-bottom: 1px solid rgba(255,255,255,0.028);
    cursor: pointer;
    transition: background 0.15s ease;
    border-radius: 10px;
  }
  .course-perf-row:last-child { border-bottom: none; }
  .course-perf-row:hover { background: rgba(99,102,241,0.05); }
  .cpr-rank {
    width: 24px; height: 24px;
    border-radius: 7px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    color: #4b5563;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    flex-shrink: 0;
  }
  .cpr-name { flex: 1; font-size: 12px; color: #d1d5db; font-weight: 500; min-width: 0; }
  .cpr-name-sub { font-size: 10px; color: #4b5563; margin-top: 2px; }
  .cpr-bar-track {
    width: 130px; height: 5px;
    background: rgba(255,255,255,0.05);
    border-radius: 99px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .cpr-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
  }
  .cpr-score {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    min-width: 36px;
    text-align: right;
    flex-shrink: 0;
  }
  .cpr-badge {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 6px;
    font-family: 'DM Mono', monospace;
    min-width: 82px;
    text-align: center;
    flex-shrink: 0;
  }
  .cpr-grade-pill {
    width: 32px; height: 32px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    flex-shrink: 0;
    transition: box-shadow 0.2s ease;
  }
  .course-perf-row:hover .cpr-grade-pill { box-shadow: 0 0 12px rgba(45,212,191,0.25); }

  /* ── GRADE LEGEND ── */
  .grade-legend { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 14px; }
  .gl-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #6b7280; }
  .gl-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }

  /* ── TREND NOTE ── */
  .trend-note {
    background: rgba(45,212,191,0.045);
    border: 1px solid rgba(45,212,191,0.14);
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 11px;
    color: #5eead4;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    line-height: 1.6;
  }

  /* ── IMPROVEMENT ROWS ── */
  .improve-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 16px;
    margin-bottom: 8px;
    background: rgba(251,146,60,0.045);
    border: 1px solid rgba(251,146,60,0.14);
    border-radius: 12px;
    font-size: 12px;
    transition: background 0.15s ease;
  }
  .improve-row:hover { background: rgba(251,146,60,0.07); }
  .improve-left { color: #d1d5db; display: flex; align-items: center; gap: 8px; }
  .improve-left::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #fb923c;
    flex-shrink: 0;
  }
  .improve-right {
    color: #fb923c;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .improve-delta { font-size: 10px; color: #4b5563; font-family: 'DM Mono', monospace; font-weight: 400; }

  /* ── GRADE STAT CARDS ── */
  .grade-stat-card {
    border-radius: 14px;
    padding: 16px;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
  }
  .grade-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .grade-stat-letter { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
  .grade-stat-count { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #f0f1f6; line-height: 1; }
  .grade-stat-pct { font-size: 10px; color: #6b7280; margin-top: 4px; }

  /* ── PANEL DIVIDER ── */
  .panel-divider { height: 1px; background: rgba(255,255,255,0.04); margin: 28px 0; }

  /* ── EMPTY STATE ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 12px;
    color: #4b5563;
  }
  .empty-state-icon { font-size: 36px; opacity: 0.4; }
  .empty-state-text { font-size: 13px; }
`;

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */
const BAR_COLORS = [
  "#6366f1", "#818cf8", "#a5b4fc",
  "#2dd4bf", "#34d399", "#60a5fa",
  "#f472b6", "#fb923c",
];

// FIX 1: Added "A+" as a distinct color key
const GRADE_COLORS = {
  O: "#a78bfa",
  "A+": "#34d399",
  A: "#2dd4bf", B: "#60a5fa", C: "#fb923c", D: "#f87171", F: "#ef4444",
};

// Helper: resolve color for any grade letter (full key first, then first char fallback)
const getGradeColor = (letter) =>
  GRADE_COLORS[letter] || GRADE_COLORS[(letter || "").charAt(0)] || "#6366f1";

/* ─────────────────────────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0f172a",
        border: "1px solid rgba(99,102,241,0.35)",
        borderRadius: 12,
        padding: "12px 18px",
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: "#e8eaf0",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      }}>
        <p style={{ color: "#6b7280", marginBottom: 6, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
        <p style={{ color: "#a5b4fc", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20 }}>
          {payload[0].value}
          <span style={{ fontSize: 11, color: "#4b5563", marginLeft: 4, fontFamily: "'DM Mono'" }}>/100</span>
        </p>
      </div>
    );
  }
  return null;
};

/* ─────────────────────────────────────────────────────────────────
   PERFORMANCE PANEL
───────────────────────────────────────────────────────────────── */
function PerformancePanel({ grades }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredCourse, setHoveredCourse] = useState(null);

  if (!grades || grades.length === 0) {
    return (
      <div className="perf-panel">
        <div className="empty-state">
          <span className="empty-state-icon">📭</span>
          <p className="empty-state-text">No performance data available yet.</p>
        </div>
      </div>
    );
  }

  /* ── derived stats ── */
  const scores      = grades.map(g => Number(g.MARKS_OBTAINED || 0));
  const avg         = scores.reduce((a, b) => a + b, 0) / scores.length;
  const highest     = Math.max(...scores);
  const lowest      = Math.min(...scores);
  const stdDev      = Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / scores.length);
  const highestCourse = grades.find(g => Number(g.MARKS_OBTAINED) === highest);
  const lowestCourse  = grades.find(g => Number(g.MARKS_OBTAINED) === lowest);
  const passCount   = scores.filter(s => s >= 40).length;
  const passRate    = Math.round((passCount / scores.length) * 100);

  // FIX 2: Use full grade letter as key — don't collapse "A+" to "A" via charAt(0)
  const gradeDist = grades.reduce((acc, g) => {
    const letter = g.GRADE_LETTER || "?";
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(gradeDist).map(([name, value]) => ({ name, value }));

  const courseData = grades.map((g, i) => ({
    name:  g.COURSE_NAME,
    score: Number(g.MARKS_OBTAINED || 0),
    grade: g.GRADE_LETTER,
    exam:  g.EXAM_NAME,
    color: BAR_COLORS[i % BAR_COLORS.length],
  })).sort((a, b) => b.score - a.score);

  const trendData = grades.map((g) => ({
    name:  g.COURSE_NAME,
    score: Number(g.MARKS_OBTAINED || 0),
  }));

  const getScoreBadge = (score) => {
    if (score >= 90) return { label: "Excellent", bg: "rgba(45,212,191,0.12)",  color: "#2dd4bf", border: "rgba(45,212,191,0.25)" };
    if (score >= 80) return { label: "Very Good", bg: "rgba(99,102,241,0.12)",  color: "#a5b4fc", border: "rgba(99,102,241,0.25)" };
    if (score >= 70) return { label: "Good",      bg: "rgba(96,165,250,0.12)",  color: "#60a5fa", border: "rgba(96,165,250,0.25)" };
    if (score >= 60) return { label: "Average",   bg: "rgba(251,146,60,0.12)",  color: "#fb923c", border: "rgba(251,146,60,0.25)" };
    return              { label: "Needs Work",  bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.25)" };
  };

  const getNarrative = () => {
    if (avg >= 85) return <>You're performing <strong>exceptionally well</strong> across your courses with an average of <strong>{avg.toFixed(1)}</strong>. Your best result was in <strong>{highestCourse?.COURSE_NAME}</strong> ({highest}). Keep up the momentum — consistency at this level sets you apart.</>;
    if (avg >= 70) return <>Solid academic standing with an average of <strong>{avg.toFixed(1)}</strong>. You excel in <strong>{highestCourse?.COURSE_NAME}</strong> ({highest}) and have room to push <strong>{lowestCourse?.COURSE_NAME}</strong> ({lowest}) higher. Focus on closing that gap and you'll see your CGPA climb.</>;
    if (avg >= 55) return <>Your average stands at <strong>{avg.toFixed(1)}</strong> — you're passing, but there's clear headroom for improvement. <strong>{highestCourse?.COURSE_NAME}</strong> shows your potential. Prioritise <strong>{lowestCourse?.COURSE_NAME}</strong> ({lowest}) and aim to bring all scores above 70.</>;
    return <>Your current average is <strong>{avg.toFixed(1)}</strong>. Immediate attention is needed, especially in <strong>{lowestCourse?.COURSE_NAME}</strong> ({lowest}). Break your study time into focused sessions per subject, and speak with your instructors for targeted guidance.</>;
  };

  const tabs = [
    { id: "overview", label: "Overview",      icon: "📊" },
    { id: "courses",  label: "Course Detail", icon: "📚" },
    { id: "trends",   label: "Trends",        icon: "📈" },
    { id: "dist",     label: "Grade Split",   icon: "🎯" },
  ];

  const insightCards = [
    { icon: "⚡", label: "Avg Score",  value: avg.toFixed(1),  cls: avg >= 70 ? "ic-good" : avg >= 55 ? "ic-warn" : "ic-danger", sub: "out of 100" },
    { icon: "🏅", label: "Highest",    value: highest,          cls: "ic-good",  sub: highestCourse?.COURSE_NAME },
    { icon: "⚠️", label: "Lowest",     value: lowest,           cls: lowest < 40 ? "ic-danger" : "ic-warn", sub: lowestCourse?.COURSE_NAME },
    { icon: "✅", label: "Pass Rate",  value: `${passRate}%`,   cls: passRate >= 80 ? "ic-good" : passRate >= 60 ? "ic-warn" : "ic-danger", sub: `${passCount}/${scores.length} courses` },
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
            <span style={{ fontSize: 13 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="perf-body">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            <div className="insight-strip">
              {insightCards.map((ic, i) => (
                <div key={i} className="insight-card">
                  <span className="ic-icon">{ic.icon}</span>
                  <p className="ic-label">{ic.label}</p>
                  <p className={`ic-value ${ic.cls}`}>{ic.value}</p>
                  <p className="ic-sub">{ic.sub}</p>
                </div>
              ))}
            </div>

            <div className="narrative-box">{getNarrative()}</div>

            <div className="chart-header">
              <span className="chart-header-title">Subject Performance</span>
              <span className="chart-header-badge">{grades.length} subjects</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={grades} barSize={28} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="1 4" vertical={false} />
                <XAxis dataKey="COURSE_NAME" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                <Bar dataKey="MARKS_OBTAINED" radius={[7, 7, 0, 0]}>
                  {grades.map((_, index) => (
                    <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="trend-note">
              <span>📐</span>
              <span>
                Score spread: <strong style={{ color: "#f0f1f6", margin: "0 3px" }}>{highest - lowest}</strong> pts ·{" "}
                Std dev: <strong style={{ color: "#f0f1f6", margin: "0 3px" }}>{stdDev.toFixed(1)}</strong> —{" "}
                {stdDev < 10 ? "Very consistent performer 🎯" : stdDev < 20 ? "Moderate variance across subjects" : "High variance — focus on weak subjects"}
              </span>
            </div>
          </>
        )}

        {/* ── COURSE DETAIL ── */}
        {activeTab === "courses" && (
          <>
            <div className="chart-header">
              <span className="chart-header-title">Per-Course Breakdown</span>
              <span className="chart-header-badge">sorted best → lowest</span>
            </div>
            <div className="narrative-box">
              Hover a course to highlight it. Scores shown as a fill bar out of 100. Courses sorted highest → lowest.
            </div>

            {courseData.map((c, i) => {
              const badge = getScoreBadge(c.score);
              // FIX 3 (part): use getGradeColor helper for full "A+" support
              const gradeColor = getGradeColor(c.grade);
              return (
                <div
                  key={i}
                  className="course-perf-row"
                  onMouseEnter={() => setHoveredCourse(i)}
                  onMouseLeave={() => setHoveredCourse(null)}
                  style={{ opacity: hoveredCourse !== null && hoveredCourse !== i ? 0.45 : 1, transition: "opacity 0.2s ease" }}
                >
                  <div className="cpr-rank">{i + 1}</div>
                  <div className="cpr-name">
                    <div>{c.name}</div>
                    <div className="cpr-name-sub">{c.exam}</div>
                  </div>
                  <div className="cpr-bar-track">
                    <div className="cpr-bar-fill" style={{ width: `${c.score}%`, background: c.color }} />
                  </div>
                  <div className="cpr-score" style={{ color: c.color }}>{c.score}</div>
                  <div className="cpr-badge" style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                    {badge.label}
                  </div>
                  <div className="cpr-grade-pill" style={{ background: `${gradeColor}18`, border: `1px solid ${gradeColor}35`, color: gradeColor }}>
                    {c.grade}
                  </div>
                </div>
              );
            })}

            <div className="panel-divider" />

            <div className="chart-header">
              <span className="chart-header-title">Skill Web</span>
              <span className="chart-header-badge">radar view</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="78%" data={grades}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="COURSE_NAME" tick={{ fill: "#4b5563", fontSize: 9 }} />
                <Radar name="Score" dataKey="MARKS_OBTAINED" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* ── TRENDS ── */}
        {activeTab === "trends" && (
          <>
            <div className="chart-header">
              <span className="chart-header-title">Score Trend Across Entries</span>
              <span className="chart-header-badge">line view</span>
            </div>
            <div className="narrative-box">
              This chart shows how your scores flow across recorded entries. A rising slope indicates improving performance; a dip signals a subject that may need extra attention.
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
                <Line
                  type="monotone"
                  dataKey={() => avg}
                  stroke="#2dd4bf"
                  strokeWidth={1}
                  strokeDasharray="5 4"
                  dot={false}
                  name="Average"
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="grade-legend" style={{ marginTop: 12 }}>
              <div className="gl-item"><div className="gl-dot" style={{ background: "#6366f1" }} /> Your scores</div>
              <div className="gl-item"><div className="gl-dot" style={{ background: "#2dd4bf", opacity: 0.7 }} /> Overall avg ({avg.toFixed(1)})</div>
            </div>

            <div className="panel-divider" />

            <div className="chart-header">
              <span className="chart-header-title">Improvement Opportunities</span>
              <span className="chart-header-badge">{courseData.filter(c => c.score < avg).length} below avg</span>
            </div>

            {courseData.filter(c => c.score < avg).length === 0 ? (
              <div className="trend-note"><span>🌟</span> All courses are above your average — outstanding consistency!</div>
            ) : (
              courseData.filter(c => c.score < avg).map((c, i) => (
                <div key={i} className="improve-row">
                  <span className="improve-left">{c.name}</span>
                  <span className="improve-right">
                    {c.score}
                    <span className="improve-delta">needs +{(avg - c.score).toFixed(1)} to hit avg</span>
                  </span>
                </div>
              ))
            )}
          </>
        )}

        {/* ── GRADE DISTRIBUTION ── */}
        {activeTab === "dist" && (
          <>
            <div className="chart-header">
              <span className="chart-header-title">Grade Distribution</span>
              <span className="chart-header-badge">{grades.length} entries</span>
            </div>
            <div className="narrative-box">
              A breakdown of letter grades across all your recorded exams. A concentration of A's and B's reflects strong overall preparation; C's and below indicate areas for a targeted study push.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Donut */}
              <div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={62} outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={getGradeColor(entry.name) || BAR_COLORS[index % BAR_COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(99,102,241,0.35)",
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
                      <div className="gl-dot" style={{ background: getGradeColor(e.name) || BAR_COLORS[i % BAR_COLORS.length] }} />
                      Grade {e.name} ({e.value})
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-course grade bars */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                {courseData.map((c, i) => {
                  // FIX 3 (part): use getGradeColor for full "A+" support here too
                  const gc = getGradeColor(c.grade) || BAR_COLORS[i % BAR_COLORS.length];
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: `${gc}18`, border: `1px solid ${gc}35`,
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

            {/* FIX 4: Grade stat cards — added "A+", 6-column grid */}
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
              {["O", "A+", "A", "B", "C", "F"].map(letter => {
                const count = gradeDist[letter] || 0;
                const pct = grades.length > 0 ? Math.round((count / grades.length) * 100) : 0;
                const col = getGradeColor(letter);
                return (
                  <div key={letter} className="grade-stat-card" style={{ background: `${col}0d`, border: `1px solid ${col}28` }}>
                    <p className="grade-stat-letter" style={{ color: col }}>{letter}</p>
                    <p className="grade-stat-count">{count}</p>
                    <p className="grade-stat-pct">{pct}% of entries</p>
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

/* ─────────────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState({ rank: "-", cgpa: 0, name: "" });

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
        setTimeout(async () => {
          const statRes = await axios.get(
            `http://localhost:5000/api/teacher/rank/${user.student_id}?t=${t}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (statRes.data) {
            setStats({
              rank: statRes.data.STUDENT_RANK || "-",
              cgpa: statRes.data.CGPA || 0,
              name: statRes.data.FULL_NAME || "",
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
    if (score > 0)   return "🔻 Needs Improvement";
    return "📚 Average";
  };

  return (
    <>
      <style>{style}</style>

      {/* ── NAVBAR ── */}
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

          {/* ── HEADER ── */}
          <div className="header">
            <div className="header-left">
              <p className="eyebrow">Academic Portal</p>
              <h1>Dashboard</h1>
              {stats.name && (
                <p style={{
                  marginTop: 8,
                  fontSize: 15,
                  color: "#9ca3af",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.04em"
                }}>
                  Hello, <span style={{ color: "#a5b4fc", fontWeight: 500 }}>{stats.name}</span> 👋
                </p>
              )}
            </div>
            <div className="avg-badge">
              <p className="label">Overall Average</p>
              <p className="value">{avg.toFixed(2)}</p>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="cards">
            <div className="card">
              <p className="card-label">CGPA / Rank</p>
              <p className="card-value accent">
                {stats.cgpa ? Number(stats.cgpa).toFixed(2) : "0.00"} / #{stats.rank}
              </p>
              <span className="card-icon">🏆</span>
              <div className="card-progress" style={{ width: `${Math.min((stats.cgpa || 0) * 10, 100)}%` }} />
            </div>
            <div className="card">
              <p className="card-label">Average Score</p>
              <p className="card-value">{avg.toFixed(2)}</p>
              <span className="card-icon">📊</span>
              <div className="card-progress" style={{ width: `${Math.min(avg, 100)}%` }} />
            </div>
            <div className="card">
              <p className="card-label">Performance</p>
              <p className="card-value" style={{ fontSize: 26 }}>{getPerformanceLabel(avg)}</p>
              <span className="card-icon">⭐</span>
            </div>
          </div>

          {/* ── GRADES TABLE ── */}
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
                  {grades.length > 0 ? grades.map((g, i) => {
                    // FIX 5: Grade pill color is now dynamic per grade letter
                    const gc = getGradeColor(g.GRADE_LETTER);
                    return (
                      <tr key={i}>
                        <td className="course-name">{g.COURSE_NAME}</td>
                        <td>{g.EXAM_NAME}</td>
                        <td className="marks">
                          <div className="marks-cell-inner">
                            {g.MARKS_OBTAINED}
                            <div className="marks-mini-bar">
                              <div className="marks-mini-fill" style={{ width: `${Math.min(Number(g.MARKS_OBTAINED), 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="grade">
                          <span
                            className="grade-pill"
                            style={{
                              background: `${gc}1a`,
                              border: `1px solid ${gc}38`,
                              color: gc,
                            }}
                          >
                            {g.GRADE_LETTER}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="4">
                        <div className="empty-state">
                          <span className="empty-state-icon">📭</span>
                          <p className="empty-state-text">No records found</p>
                        </div>
                      </td>
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