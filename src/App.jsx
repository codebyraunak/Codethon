
import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "Anvaya@2026";
const MCQ_DURATION = 30 * 60; // 30 minutes in seconds

const MCQ_QUESTIONS = [
  { id: 1, q: "What does `len('hello')` return?", options: ["4", "5", "6", "Error"], ans: 1 },
  { id: 2, q: "Which data structure follows LIFO?", options: ["Queue", "Array", "Stack", "Tree"], ans: 2 },
  { id: 3, q: "Output of `2 ** 3` in Python?", options: ["6", "8", "9", "Error"], ans: 1 },
  { id: 4, q: "What symbol is used for single-line comment in Python?", options: ["//", "/*", "#", "--"], ans: 2 },
  { id: 5, q: "Which of these is a mutable data type?", options: ["String", "Tuple", "List", "Integer"], ans: 2 },
  { id: 6, q: "Time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], ans: 2 },
  { id: 7, q: "What does `range(1, 6)` produce?", options: ["1 to 5", "1 to 6", "0 to 5", "0 to 6"], ans: 0 },
  { id: 8, q: "What keyword is used to define a function in Python?", options: ["func", "def", "function", "define"], ans: 1 },
  { id: 9, q: "What is the output of `print(10 % 3)`?", options: ["3", "1", "0", "Error"], ans: 1 },
  { id: 10, q: "Which HTML tag is used for the largest heading?", options: ["<h6>", "<head>", "<h1>", "<header>"], ans: 2 },
  { id: 11, q: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Processing Unit", "Core Processing Unit"], ans: 1 },
  { id: 12, q: "What is `type([])` in Python?", options: ["<class 'tuple'>", "<class 'dict'>", "<class 'list'>", "<class 'array'>"], ans: 2 },
  { id: 13, q: "Which loop runs at least once always?", options: ["for", "while", "do-while", "foreach"], ans: 2 },
  { id: 14, q: "Output of `bool(0)` in Python?", options: ["True", "False", "0", "None"], ans: 1 },
  { id: 15, q: "What does `//` do in Python?", options: ["Comment", "Division", "Floor division", "Modulo"], ans: 2 },
  { id: 16, q: "Riya writes `for i in range(1,6): print(i)`. How many lines printed?", options: ["4", "5", "6", "Error"], ans: 1 },
  { id: 17, q: "Karan does `['a','b','c','d'][-1]`. What does he get?", options: ["'a'", "'c'", "'d'", "Error"], ans: 2 },
  { id: 18, q: "Dev's if checks `x > 0`, he inputs `-5`. Which block runs?", options: ["if block", "elif block", "else block", "No block"], ans: 2 },
  { id: 19, q: "Which operator checks equality in Python?", options: ["=", "==", "===", "!="], ans: 1 },
  { id: 20, q: "What is `0b1010` in decimal?", options: ["8", "10", "12", "2"], ans: 1 },
];

const TREASURE_HUNT = [
  {
    level: 1,
    hint: "🔍 Clue 1: The place where knowledge is stored, books are your friends. Find the secret code hidden near the entrance of this place.",
    code: "LIB2025",
    next_hint: "📚 Well done! Clue 2: Head to the place where machines think and keyboards speak. Look under the third table from the door.",
  },
  {
    level: 2,
    hint: "💻 Clue 2: Head to the place where machines think and keyboards speak. Look under the third table from the door.",
    code: "LAB4567",
    next_hint: "🍽️ Clue 3: When hunger strikes, this is where everyone gathers. The code is on the notice board near the counter.",
  },
  {
    level: 3,
    hint: "🍽️ Clue 3: When hunger strikes, this is where everyone gathers. The code is on the notice board near the counter.",
    code: "CANTEEN8",
    next_hint: "🏆 Clue 4 (Final!): Return to where you started this journey — the main hall. Look for a sealed envelope on the stage. You're almost there!",
  },
  {
    level: 4,
    hint: "🏆 Final Clue: Return to where you started this journey — the main hall. Look for a sealed envelope on the stage. You're almost there!",
    code: "WINNER99",
    next_hint: "COMPLETE",
  },
];

import { db } from './firebase';
import { ref, get, set as setFirebase } from 'firebase/database';

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const getTeams = async () => {
  try { const snapshot = await get(ref(db, "teams")); return snapshot.exists() ? snapshot.val() : {}; } catch { return {}; }
};
const setTeams = async (t) => { try { await setFirebase(ref(db, "teams"), t); } catch {} };

const getCurrentRound = async () => {
  try { const snapshot = await get(ref(db, "current_round")); return snapshot.exists() ? snapshot.val() : "waiting"; } catch { return "waiting"; }
};
const setCurrentRound = async (round) => { try { await setFirebase(ref(db, "current_round"), round); } catch {} };

const getMCQActive = async () => {
  try { const snapshot = await get(ref(db, "mcq_active")); return snapshot.exists() ? snapshot.val() : { active: false, startTime: null }; } catch { return { active: false, startTime: null }; }
};
const setMCQActive = async (val) => { try { await setFirebase(ref(db, "mcq_active"), val); } catch {} };

// ─── ANTI CHEAT HOOK ──────────────────────────────────────────────────────────
function useAntiCheat(active, onViolation) {
  const violationsRef = useRef(0);
  useEffect(() => {
    if (!active) return;
    const handleVisibility = () => {
      if (document.hidden) {
        violationsRef.current++;
        onViolation(violationsRef.current);
      }
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) onViolation("fullscreen_exit");
    };
    const handleBlur = () => {
      violationsRef.current++;
      onViolation(violationsRef.current);
    };
    const blockContextMenu = (e) => e.preventDefault();
    
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("contextmenu", blockContextMenu);

    const blockKeys = (e) => {
      if ((e.ctrlKey && ["t","w","n","r","c","v","p"].includes(e.key.toLowerCase())) || e.key === "F5") e.preventDefault();
    };
    document.addEventListener("keydown", blockKeys);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [active, onViolation]);
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Barlow+Condensed:wght@300;400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --bg2: #111118;
    --bg3: #1a1a24;
    --card: #13131c;
    --border: #2a2a3a;
    --accent: #00ff87;
    --accent2: #ff3864;
    --accent3: #ffcc02;
    --accent4: #0ff;
    --text: #e8e8f0;
    --text2: #8888aa;
    --text3: #5555770;
    --glow: 0 0 20px rgba(0,255,135,0.3);
    --glow2: 0 0 20px rgba(255,56,100,0.3);
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'Barlow Condensed', sans-serif; overflow-x: hidden; }

  #root { min-height: 100vh; }

  .mono { font-family: 'Space Mono', monospace; }

  /* SCANLINE EFFECT */
  body::after {
    content: '';
    position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
    pointer-events: none; z-index: 9999;
  }

  /* NOISE */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9998; opacity: 0.4;
  }

  .screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; position: relative; z-index: 1; }

  /* ── HEADER BAR ── */
  .topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10,10,15,0.95); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; height: 52px; gap: 16px; backdrop-filter: blur(12px); }
  .topbar-logo { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--accent); letter-spacing: 0.1em; flex: 1; }
  .topbar-team { font-size: 14px; color: var(--text2); }
  .topbar-round { background: var(--accent); color: #000; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 3px; letter-spacing: 0.1em; }

  /* ── CARDS ── */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 32px; width: 100%; max-width: 480px; }
  .card-wide { max-width: 800px; }
  .card-full { max-width: 1100px; }

  /* ── LOGO ── */
  .logo { font-family: 'Space Mono', monospace; font-size: clamp(28px, 5vw, 48px); font-weight: 700; color: var(--accent); letter-spacing: -0.02em; line-height: 1; margin-bottom: 4px; }
  .logo span { color: var(--accent2); }
  .tagline { font-size: 14px; color: var(--text2); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 32px; }

  /* ── INPUTS ── */
  .input { width: 100%; background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; padding: 12px 16px; color: var(--text); font-family: 'Space Mono', monospace; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(0,255,135,0.1); }
  .input::placeholder { color: var(--text2); }
  .label { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text2); margin-bottom: 6px; display: block; }

  /* ── BUTTONS ── */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 6px; font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border: none; transition: all 0.2s; width: 100%; }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: #00e87a; box-shadow: var(--glow); transform: translateY(-1px); }
  .btn-danger { background: var(--accent2); color: #fff; }
  .btn-danger:hover { box-shadow: var(--glow2); transform: translateY(-1px); }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .btn-sm { padding: 8px 16px; font-size: 13px; width: auto; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  /* ── TIMER ── */
  .timer-wrap { display: flex; flex-direction: column; align-items: center; margin: 16px 0; }
  .timer { font-family: 'Space Mono', monospace; font-size: clamp(36px, 6vw, 56px); font-weight: 700; color: var(--accent3); letter-spacing: 0.05em; line-height: 1; }
  .timer.danger { color: var(--accent2); animation: timerPulse 0.5s infinite alternate; }
  @keyframes timerPulse { from { opacity: 1; } to { opacity: 0.5; } }
  .timer-bar-wrap { width: 100%; background: var(--bg3); border-radius: 4px; height: 4px; margin-top: 10px; overflow: hidden; }
  .timer-bar { height: 100%; background: var(--accent3); border-radius: 4px; transition: width 1s linear; }
  .timer-bar.danger { background: var(--accent2); }

  /* ── MCQ ── */
  .q-header { font-size: 11px; color: var(--text2); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }
  .q-text { font-size: clamp(18px, 2.5vw, 24px); font-weight: 600; line-height: 1.4; margin-bottom: 24px; color: var(--text); }
  .q-text code { font-family: 'Space Mono', monospace; background: var(--bg3); padding: 2px 8px; border-radius: 4px; font-size: 0.9em; color: var(--accent4); }
  .options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .option { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; cursor: pointer; transition: all 0.2s; font-size: 16px; font-weight: 600; text-align: left; color: var(--text); letter-spacing: 0.02em; }
  .option:hover { border-color: var(--accent); background: rgba(0,255,135,0.05); }
  .option.selected { border-color: var(--accent); background: rgba(0,255,135,0.1); color: var(--accent); }
  .option.correct { border-color: var(--accent) !important; background: rgba(0,255,135,0.2) !important; }
  .option.wrong { border-color: var(--accent2) !important; background: rgba(255,56,100,0.15) !important; }
  .q-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; gap: 12px; }
  .q-dots { display: flex; flex-wrap: wrap; gap: 6px; max-width: 320px; }
  .q-dot { width: 20px; height: 20px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg3); cursor: pointer; transition: all 0.2s; }
  .q-dot.answered { background: var(--accent); border-color: var(--accent); }
  .q-dot.current { border-color: var(--accent3); box-shadow: 0 0 8px rgba(255,204,2,0.4); }

  /* ── TREASURE HUNT ── */
  .hunt-level { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .hunt-badge { background: var(--accent3); color: #000; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 4px; letter-spacing: 0.1em; }
  .hunt-hint { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 20px 24px; font-size: 18px; line-height: 1.6; color: var(--text); margin-bottom: 24px; }
  .hunt-penalty { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--accent2); margin-bottom: 12px; }
  .code-input { font-family: 'Space Mono', monospace; text-transform: uppercase; letter-spacing: 0.2em; font-size: 20px; text-align: center; }
  .shake { animation: shake 0.4s ease; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
  .success-flash { animation: successFlash 0.5s ease; }
  @keyframes successFlash { 0%{background:rgba(0,255,135,0.3)} 100%{background:var(--card)} }
  .complete-badge { text-align: center; padding: 32px; }
  .complete-icon { font-size: 64px; margin-bottom: 16px; }

  /* ── LEADERBOARD ── */
  .lb-table { width: 100%; border-collapse: collapse; }
  .lb-table th { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text2); padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); }
  .lb-table td { padding: 14px 16px; border-bottom: 1px solid rgba(42,42,58,0.5); font-size: 16px; font-weight: 600; }
  .lb-table tr:last-child td { border-bottom: none; }
  .lb-table tr { transition: background 0.2s; }
  .lb-table tr:hover td { background: rgba(0,255,135,0.03); }
  .rank-1 { color: var(--accent3); }
  .rank-2 { color: #c0c0c0; }
  .rank-3 { color: #cd7f32; }
  .score-pill { display: inline-flex; background: var(--bg3); border-radius: 4px; padding: 2px 10px; font-family: 'Space Mono', monospace; font-size: 14px; }

  /* ── ADMIN ── */
  .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 20px; }
  .stat-num { font-family: 'Space Mono', monospace; font-size: 32px; font-weight: 700; color: var(--accent); }
  .stat-label { font-size: 12px; color: var(--text2); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
  .round-btn { background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; padding: 14px 20px; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 600; color: var(--text); letter-spacing: 0.05em; text-align: left; transition: all 0.2s; width: 100%; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
  .round-btn:hover { border-color: var(--accent); }
  .round-btn.active { border-color: var(--accent); background: rgba(0,255,135,0.08); color: var(--accent); }
  .round-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); }
  .round-dot.active { background: var(--accent); box-shadow: 0 0 8px rgba(0,255,135,0.6); }

  /* ── WAITING ── */
  .pulse-ring { width: 80px; height: 80px; border-radius: 50%; border: 2px solid var(--accent); margin: 0 auto 24px; animation: pulsering 1.5s ease-in-out infinite; }
  @keyframes pulsering { 0%{transform:scale(0.9);opacity:0.5} 50%{transform:scale(1.1);opacity:1} 100%{transform:scale(0.9);opacity:0.5} }

  /* ── VIOLATION ALERT ── */
  .violation { position: fixed; top: 60px; left: 50%; transform: translateX(-50%); background: var(--accent2); color: #fff; font-family: 'Space Mono', monospace; font-size: 13px; padding: 12px 24px; border-radius: 6px; z-index: 1000; animation: slideDown 0.3s ease; box-shadow: 0 4px 24px rgba(255,56,100,0.4); }
  @keyframes slideDown { from{transform:translateX(-50%) translateY(-20px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }

  /* MISC */
  .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
  .text-sm { font-size: 14px; color: var(--text2); }
  .text-accent { color: var(--accent); }
  .text-danger { color: var(--accent2); }
  .mt-4 { margin-top: 16px; }
  .mt-6 { margin-top: 24px; }
  .mb-4 { margin-bottom: 16px; }
  .gap-2 { gap: 8px; }
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .w-full { width: 100%; }
  .text-center { text-align: center; }
  .fw-bold { font-weight: 700; }
  .pt-topbar { padding-top: 72px; }
  
  @media (max-width: 600px) {
    .options { grid-template-columns: 1fr; }
    .admin-grid { grid-template-columns: 1fr; }
    .card, .card-wide { padding: 20px; }
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function TopBar({ team, round }) {
  const roundLabels = { waiting: "STANDBY", mcq: "ROUND 1 · MCQ", treasure: "ROUND 2 · TREASURE HUNT", leaderboard: "LEADERBOARD" };
  return (
    <div className="topbar">
      <div className="topbar-logo">Code<span style={{ color: "var(--accent2)" }}>thon</span> 2026</div>
      {team && <div className="topbar-team mono" style={{ fontSize: 13 }}>{team.name}</div>}
      {round && <div className="topbar-round">{roundLabels[round] || round.toUpperCase()}</div>}
    </div>
  );
}

function ViolationAlert({ msg, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3000); return () => clearTimeout(t); }, [onDismiss]);
  return <div className="violation">⚠️ {msg}</div>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // login | register | admin

  const register = async () => {
    if (!teamName.trim() || !password.trim()) { setError("All fields required"); return; }
    if (teamName.length < 3) { setError("Team Name must be at least 3 characters"); return; }
    const id = teamName.trim().toLowerCase();
    if (id === "admin") { setError("This team name is reserved."); return; }
    setLoading(true);
    const teams = await getTeams();
    if (teams[id]) { setError("Team Name already taken. Try another."); setLoading(false); return; }
    const team = { id, name: teamName.trim(), password, mcq_score: 0, mcq_answers: {}, mcq_submitted: false, hunt_level: 1, hunt_score: 0, hunt_penalties: 0, total_score: 0 };
    teams[id] = team;
    await setTeams(teams);
    onLogin(team, "team");
    setLoading(false);
  };

  const login = async () => {
    if (!teamName.trim() || !password.trim()) { setError("All fields required"); return; }
    const id = teamName.trim().toLowerCase();
    if (id === "admin") {
      if (password === ADMIN_PASSWORD) { onLogin(null, "admin"); }
      else { setError("Wrong password"); }
      return;
    }
    setLoading(true);
    const teams = await getTeams();
    const team = teams[id];
    if (!team) { setError("Team not found"); setLoading(false); return; }
    if (team.password !== password) { setError("Wrong password"); setLoading(false); return; }
    onLogin(team, "team");
    setLoading(false);
  };

  return (
    <div className="screen">
      <div className="card">
        <div className="text-center mb-4" style={{ marginBottom: 32 }}>
          <img src="./logo.png" alt="AnveshYA NIE-IUCEE Student Chapter" style={{ height: 60, marginBottom: 16, objectFit: "contain" }} />
          <div className="logo">Code<span>thon</span></div>
          <div className="tagline">coderun codefun 2026</div>
        </div>

        <div className="flex gap-2 mb-4" style={{ marginBottom: 20, gap: 8 }}>
          {["login", "register"].map(m => (
            <button key={m} className={`btn btn-sm ${mode === m ? "btn-primary" : "btn-outline"}`} style={{ flex: 1 }} onClick={() => { setMode(m); setError(""); }}>
              {m === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="label">Team Name</label>
            <input className="input" placeholder="e.g. The Debug Squad" value={teamName} onChange={e => setTeamName(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input mono" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && (mode === "register" ? register() : login())} />
          </div>

          {error && <div className="text-danger mono" style={{ fontSize: 13 }}>⚠ {error}</div>}

          <button className="btn btn-primary" onClick={mode === "register" ? register : login} disabled={loading}>
            {loading ? "..." : mode === "register" ? "Register & Join" : "Enter Arena"}
          </button>
        </div>

        <div className="text-sm text-center mt-4" style={{ marginTop: 20 }}>
          Admins: use team name 'admin' and your password to login
        </div>
      </div>
    </div>
  );
}

// ─── WAITING ROOM ─────────────────────────────────────────────────────────────
function WaitingRoom({ team }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const poll = async () => { const teams = await getTeams(); setCount(Object.keys(teams).length); };
    poll();
    const i = setInterval(poll, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="screen pt-topbar">
      <div className="card text-center">
        <div className="pulse-ring"></div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Waiting for event to start...</div>
        <div className="text-sm" style={{ marginBottom: 24 }}>The admin will begin Round 1 shortly. Stay on this page.</div>
        <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
          <div className="mono" style={{ fontSize: 32, color: "var(--accent)", fontWeight: 700 }}>{count}</div>
          <div className="text-sm">teams registered</div>
        </div>
        <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "16px 20px", textAlign: "left" }}>
          <div className="text-sm" style={{ marginBottom: 8, fontWeight: 600, color: "var(--text)" }}>Your team info</div>
          <div className="mono" style={{ fontSize: 13, color: "var(--accent)" }}>{team.id}</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{team.name}</div>
        </div>
      </div>
    </div>
  );
}

// ─── MCQ ROUND ────────────────────────────────────────────────────────────────
function MCQRound({ team, onUpdate }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(team.mcq_answers || {});
  const [submitted, setSubmitted] = useState(team.mcq_submitted || false);
  const [timeLeft, setTimeLeft] = useState(MCQ_DURATION);
  const [violation, setViolation] = useState("");
  const [violations, setViolations] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const containerRef = useRef(null);
  const fullscreenRequested = useRef(false);

  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  useEffect(() => {
    if (!fullscreenRequested.current && !submitted) {
      setTimeout(enterFullscreen, 500);
      fullscreenRequested.current = true;
    }
  }, [submitted]);

  // Timer from server start
  useEffect(() => {
    if (submitted) return;
    const syncTimer = async () => {
      const state = await getMCQActive();
      if (state.active && state.startTime) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const left = Math.max(0, MCQ_DURATION - elapsed);
        setTimeLeft(left);
        if (left === 0) handleSubmit();
      }
    };
    syncTimer();
    const i = setInterval(syncTimer, 1000);
    return () => clearInterval(i);
  }, [submitted]);

  const [rank, setRank] = useState(null);
  const answersRef = useRef(answers);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
    if (!submitted) return;
    const fetchRank = async () => {
      const teams = await getTeams();
      const arr = Object.values(teams).sort((a, b) => (b.mcq_score || 0) - (a.mcq_score || 0));
      const idx = arr.findIndex(t => t.id === team.id);
      if (idx !== -1) setRank(idx + 1);
    };
    fetchRank();
    const i = setInterval(fetchRank, 5000);
    return () => clearInterval(i);
  }, [submitted, team.id]);

  const handleViolation = useCallback((v) => {
    if (submitted) return;
    setViolations(prev => { const n = typeof v === "number" ? v : prev + 1; return n; });
    if (v === "fullscreen_exit") {
      setViolation("⚠️ Fullscreen exited! Return to fullscreen immediately.");
      setTimeout(enterFullscreen, 1000);
    } else {
      setViolation(`Tab switch detected! Your test has been automatically submitted.`);
      (async () => {
        let score = 0;
        MCQ_QUESTIONS.forEach((q, i) => { if (answersRef.current[i] === q.ans) score += 2; });
        const teams = await getTeams();
        if (teams[team.id]) {
          teams[team.id].mcq_score = score;
          teams[team.id].mcq_answers = answersRef.current;
          teams[team.id].mcq_submitted = true;
          teams[team.id].total_score = score + (teams[team.id].hunt_score || 0);
          await setTeams(teams);
          onUpdate(teams[team.id]);
        }
        setSubmitted(true);
        if (document.fullscreenElement) document.exitFullscreen();
      })();
    }
  }, [submitted, team.id, onUpdate]);

  useAntiCheat(!submitted, handleViolation);

  const handleSubmit = async () => {
    let score = 0;
    MCQ_QUESTIONS.forEach((q, i) => { if (answers[i] === q.ans) score += 2; });
    const teams = await getTeams();
    if (teams[team.id]) {
      teams[team.id].mcq_score = score;
      teams[team.id].mcq_answers = answers;
      teams[team.id].mcq_submitted = true;
      teams[team.id].total_score = score + (teams[team.id].hunt_score || 0);
      await setTeams(teams);
      onUpdate(teams[team.id]);
    }
    setSubmitted(true);
    if (document.fullscreenElement) document.exitFullscreen();
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const pct = (timeLeft / MCQ_DURATION) * 100;
  const isDanger = timeLeft < 300;

  if (submitted) return (
    <div className="screen pt-topbar">
      <div className="card text-center">
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>MCQ Submitted!</div>
        <div className="text-sm" style={{ marginBottom: 24 }}>Your answers have been recorded. Wait for Round 2.</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "20px", flex: 1 }}>
            <div className="mono" style={{ fontSize: 40, color: "var(--accent)", fontWeight: 700 }}>
              {Object.values(answers).filter((a, i) => a === MCQ_QUESTIONS[i]?.ans).length * 2}
            </div>
            <div className="text-sm">points scored</div>
          </div>
          {rank !== null && (
            <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "20px", flex: 1 }}>
              <div className="mono" style={{ fontSize: 40, color: "var(--accent3)", fontWeight: 700 }}>#{rank}</div>
              <div className="text-sm">current rank</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const q = MCQ_QUESTIONS[current];

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 52 }}>
      {violation && <ViolationAlert msg={violation} onDismiss={() => setViolation("")} />}

      {/* Header */}
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div className="mono" style={{ color: "var(--accent)", fontSize: 14, flex: 1 }}>{team.name}</div>
        <div className="timer-wrap" style={{ margin: 0 }}>
          <div className={`timer ${isDanger ? "danger" : ""}`}>{mins}:{secs}</div>
          <div className="timer-bar-wrap" style={{ width: 120 }}>
            <div className={`timer-bar ${isDanger ? "danger" : ""}`} style={{ width: `${pct}%` }}></div>
          </div>
        </div>
        <div className="text-sm mono">{Object.keys(answers).length}/{MCQ_QUESTIONS.length} answered</div>
        <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}>Submit</button>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 104px)" }}>
        {/* Q Sidebar */}
        <div style={{ width: 200, background: "var(--bg2)", borderRight: "1px solid var(--border)", padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="text-sm" style={{ marginBottom: 8, fontWeight: 600 }}>Questions</div>
          {MCQ_QUESTIONS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ background: i === current ? "var(--accent)" : answers[i] !== undefined ? "rgba(0,255,135,0.15)" : "var(--bg3)", border: `1px solid ${i === current ? "var(--accent)" : answers[i] !== undefined ? "var(--accent)" : "var(--border)"}`, borderRadius: 4, padding: "8px 12px", cursor: "pointer", color: i === current ? "#000" : answers[i] !== undefined ? "var(--accent)" : "var(--text)", fontFamily: "Space Mono", fontSize: 12, textAlign: "left", transition: "all 0.15s" }}>
              Q{i + 1}
            </button>
          ))}
        </div>

        {/* Question */}
        <div style={{ flex: 1, padding: "32px", overflowY: "auto", maxWidth: 700, margin: "0 auto" }}>
          <div className="q-header">Question {current + 1} of {MCQ_QUESTIONS.length}</div>
          <div className="q-text" dangerouslySetInnerHTML={{ __html: q.q.replace(/`([^`]+)`/g, '<code>$1</code>') }} />
          <div className="options">
            {q.options.map((opt, i) => (
              <button key={i} className={`option ${answers[current] === i ? "selected" : ""}`} onClick={() => setAnswers(prev => ({ ...prev, [current]: i }))}>
                <span style={{ color: "var(--text2)", marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>← Prev</button>
            <button className="btn btn-outline btn-sm" onClick={() => setCurrent(Math.min(MCQ_QUESTIONS.length - 1, current + 1))} disabled={current === MCQ_QUESTIONS.length - 1}>Next →</button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}>
          <div className="card" style={{ maxWidth: 360 }}>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Submit MCQ?</div>
            <div className="text-sm" style={{ marginBottom: 24 }}>You've answered {Object.keys(answers).length}/{MCQ_QUESTIONS.length} questions. This cannot be undone.</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { setShowConfirm(false); handleSubmit(); }}>Submit Final</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TREASURE HUNT ────────────────────────────────────────────────────────────
function TreasureHunt({ team, onUpdate }) {
  const [level, setLevel] = useState(team.hunt_level || 1);
  const [code, setCode] = useState("");
  const [penalties, setPenalties] = useState(team.hunt_penalties || 0);
  const [wrongAttempts, setWrongAttempts] = useState(team.hunt_wrong_attempts || 0);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [completed, setCompleted] = useState(level > TREASURE_HUNT.length);
  const [violation, setViolation] = useState("");

  useEffect(() => { setTimeout(() => { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); }, 300); }, []);

  const handleViolation = useCallback((v) => {
    if (v === "fullscreen_exit") { 
      setViolation("Return to fullscreen!"); 
      setTimeout(() => document.documentElement.requestFullscreen?.(), 500); 
    } else {
      setViolation(`Tab/App switch detected! A penalty has been added.`);
      (async () => {
        const teams = await getTeams();
        if (teams[team.id]) {
          teams[team.id].hunt_penalties = (teams[team.id].hunt_penalties || 0) + 1;
          await setTeams(teams);
          onUpdate(teams[team.id]);
          setPenalties(teams[team.id].hunt_penalties);
        }
      })();
    }
  }, [team.id, onUpdate]);

  useAntiCheat(true, handleViolation);

  const clue = TREASURE_HUNT.find(c => c.level === level);

  const submit = async () => {
    if (!code.trim()) return;
    if (code.trim().toUpperCase() === clue?.code) {
      setSuccess(true);
      setError("");
      const nextLevel = level + 1;
      const isComplete = nextLevel > TREASURE_HUNT.length;
      const huntScore = isComplete ? Math.max(10, 100 - penalties * 10 - wrongAttempts * 2) : (level * 20);
      const teams = await getTeams();
      if (teams[team.id]) {
        teams[team.id].hunt_level = nextLevel;
        teams[team.id].hunt_score = huntScore;
        teams[team.id].hunt_penalties = penalties;
        teams[team.id].hunt_wrong_attempts = wrongAttempts;
        teams[team.id].total_score = (teams[team.id].mcq_score || 0) + huntScore;
        await setTeams(teams);
        onUpdate(teams[team.id]);
      }
      setTimeout(() => {
        setSuccess(false);
        setCode("");
        if (isComplete) { setCompleted(true); } else { setLevel(nextLevel); }
      }, 1500);
    } else {
      const newWrong = wrongAttempts + 1;
      setWrongAttempts(newWrong);
      setShaking(true);
      setError(`Wrong code! Total wrong attempts: ${newWrong}`);
      const teams = await getTeams();
      if (teams[team.id]) { teams[team.id].hunt_wrong_attempts = newWrong; await setTeams(teams); }
      setTimeout(() => setShaking(false), 500);
    }
  };

  if (completed) return (
    <div className="screen pt-topbar">
      <div className="card text-center">
        <div className="complete-badge">
          <div className="complete-icon">🏆</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "var(--accent3)", marginBottom: 8 }}>HUNT COMPLETE!</div>
          <div className="text-sm" style={{ marginBottom: 24 }}>You've found all the clues! Amazing work.</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "16px 24px" }}>
              <div className="mono" style={{ fontSize: 28, color: "var(--accent)", fontWeight: 700 }}>{Math.max(10, 100 - penalties * 5)}</div>
              <div className="text-sm">hunt points</div>
            </div>
            <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "16px 24px" }}>
              <div className="mono" style={{ fontSize: 28, color: "var(--accent2)", fontWeight: 700 }}>{penalties}</div>
              <div className="text-sm">wrong attempts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 52 }}>
      {violation && <ViolationAlert msg={violation} onDismiss={() => setViolation("")} />}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {TREASURE_HUNT.map((c, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < level - 1 ? "var(--accent)" : i === level - 1 ? "var(--accent3)" : "var(--border)", transition: "background 0.4s" }}></div>
          ))}
        </div>

        <div className="hunt-level">
          <div className="hunt-badge">CLUE {level} / {TREASURE_HUNT.length}</div>
          {penalties > 0 && <div className="hunt-penalty">-{penalties} marks (wrong attempts)</div>}
        </div>

        <div className={`hunt-hint ${success ? "success-flash" : ""}`}>{clue?.hint}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label className="label">Enter the secret code you found</label>
          <input className={`input code-input ${shaking ? "shake" : ""}`} placeholder="_ _ _ _ _ _ _ _" value={code} onChange={e => setCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && submit()} />
          {error && <div className="text-danger mono" style={{ fontSize: 13 }}>⚠ {error}</div>}
          {success && <div style={{ color: "var(--accent)", fontFamily: "Space Mono", fontSize: 13 }}>✓ Correct! Loading next clue...</div>}
          <button className="btn btn-primary" onClick={submit} disabled={!code.trim() || success}>Unlock Next Clue →</button>
        </div>

        {level > 1 && (
          <div style={{ marginTop: 28, background: "var(--bg3)", borderRadius: 8, padding: "16px 20px", border: "1px solid var(--border)" }}>
            <div className="text-sm" style={{ fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>Previous clue answer led you to:</div>
            <div style={{ fontSize: 14, color: "var(--accent4)" }}>{TREASURE_HUNT[level - 2]?.next_hint}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
function Leaderboard({ team }) {
  const [teams, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const t = await getTeams();
    const arr = Object.values(t).sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
    setTeamsData(arr);
    setLoading(false);
  };

  useEffect(() => { refresh(); const i = setInterval(refresh, 5000); return () => clearInterval(i); }, []);

  const rankIcon = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
  const rankClass = (i) => i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 52 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em" }}>LEADERBOARD</div>
            <div className="text-sm">Live · updates every 5 seconds</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={refresh}>↻ Refresh</button>
        </div>

        {loading ? <div className="text-sm text-center" style={{ padding: 40 }}>Loading...</div> : (
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            <table className="lb-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>MCQ</th>
                  <th>Hunt</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t, i) => (
                  <tr key={t.id} style={{ background: t.id === team?.id ? "rgba(0,255,135,0.04)" : "" }}>
                    <td className={rankClass(i)} style={{ fontFamily: "Space Mono", fontSize: 18 }}>{rankIcon(i)}</td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 17 }}>{t.name}</div>
                      <div className="mono" style={{ fontSize: 11, color: "var(--text2)" }}>{t.id}</div>
                    </td>
                    <td><span className="score-pill">{t.mcq_score || 0}</span></td>
                    <td><span className="score-pill">{t.hunt_score || 0}</span></td>
                    <td><span className="score-pill" style={{ background: "rgba(0,255,135,0.1)", color: "var(--accent)", fontWeight: 700 }}>{t.total_score || 0}</span></td>
                    <td>
                      {t.mcq_submitted && <span style={{ fontSize: 11, background: "rgba(0,255,135,0.15)", color: "var(--accent)", padding: "2px 8px", borderRadius: 4 }}>MCQ ✓</span>}
                      {t.hunt_level > TREASURE_HUNT.length && <span style={{ fontSize: 11, background: "rgba(255,204,2,0.15)", color: "var(--accent3)", padding: "2px 8px", borderRadius: 4, marginLeft: 4 }}>Hunt ✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const [teams, setTeamsData] = useState({});
  const [currentRound, setRound] = useState("waiting");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const t = await getTeams();
    const r = await getCurrentRound();
    setTeamsData(t);
    setRound(r);
    setLoading(false);
  };

  useEffect(() => { refresh(); const i = setInterval(refresh, 3000); return () => clearInterval(i); }, []);

  const changeRound = async (r) => {
    await setCurrentRound(r);
    if (r === "mcq") await setMCQActive({ active: true, startTime: Date.now() });
    else await setMCQActive({ active: false, startTime: null });
    setRound(r);
  };

  const resetAll = async () => {
    if (!confirm("Reset ALL team data? This cannot be undone.")) return;
    await setTeams({});
    await setCurrentRound("waiting");
    await setMCQActive({ active: false, startTime: null });
    refresh();
  };

  const teamArr = Object.values(teams).sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
  const submitted = teamArr.filter(t => t.mcq_submitted).length;
  const huntDone = teamArr.filter(t => t.hunt_level > TREASURE_HUNT.length).length;

  const rounds = [
    { key: "waiting", label: "Waiting Room", desc: "Hold teams in lobby" },
    { key: "mcq", label: "Round 1 — MCQ", desc: "Start 30 min MCQ timer" },
    { key: "treasure", label: "Round 2 — Treasure Hunt", desc: "Unlock hunt for all teams" },
    { key: "leaderboard", label: "Leaderboard", desc: "Show final scores" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "72px 20px 40px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "var(--accent2)" }}>ADMIN PANEL</div>
          <div className="text-sm">Codethon 2026 · Event Control Center</div>
        </div>

        {loading ? <div>Loading...</div> : (<>
          <div className="admin-grid">
            <div className="stat-card"><div className="stat-num">{teamArr.length}</div><div className="stat-label">Teams Registered</div></div>
            <div className="stat-card"><div className="stat-num">{submitted}</div><div className="stat-label">MCQ Submitted</div></div>
            <div className="stat-card"><div className="stat-num">{huntDone}</div><div className="stat-label">Hunt Completed</div></div>
            <div className="stat-card"><div className="stat-num" style={{ color: "var(--accent3)", textTransform: "uppercase", fontSize: 20 }}>{currentRound}</div><div className="stat-label">Current Round</div></div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="text-sm" style={{ marginBottom: 12, fontWeight: 600, color: "var(--text)" }}>ROUND CONTROL</div>
            {rounds.map(r => (
              <button key={r.key} className={`round-btn ${currentRound === r.key ? "active" : ""}`} onClick={() => changeRound(r.key)}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.label}</div>
                  <div className="text-sm">{r.desc}</div>
                </div>
                <div className={`round-dot ${currentRound === r.key ? "active" : ""}`}></div>
              </button>
            ))}
          </div>

          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>Live Leaderboard</div>
            <table className="lb-table">
              <thead>
                <tr><th>Rank</th><th>Team</th><th>MCQ</th><th>Hunt Lvl</th><th>Tab Penalties</th><th>Wrong Codes</th><th>Total</th></tr>
              </thead>
              <tbody>
                {teamArr.map((t, i) => (
                  <tr key={t.id}>
                    <td className={`mono ${i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":""}`} style={{ fontSize: 16 }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i + 1}`}</td>
                    <td><div style={{ fontWeight: 700 }}>{t.name}</div><div className="mono" style={{ fontSize: 11, color: "var(--text2)" }}>{t.id}</div></td>
                    <td><span className="score-pill">{t.mcq_score || 0} {t.mcq_submitted ? "✓" : ""}</span></td>
                    <td className="mono">{t.hunt_level || 1}/{TREASURE_HUNT.length + 1}</td>
                    <td className="mono" style={{ color: "var(--accent2)" }}>{t.hunt_penalties || 0}</td>
                    <td className="mono" style={{ color: "var(--accent3)" }}>{t.hunt_wrong_attempts || 0}</td>
                    <td><span className="score-pill" style={{ color: "var(--accent)", fontWeight: 700 }}>{t.total_score || 0}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn btn-danger btn-sm" onClick={resetAll}>⚠️ Reset All Data</button>
        </>)}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null); // { team, role }
  const [round, setRound] = useState("waiting");
  const [teamData, setTeamData] = useState(null);

  const pollRound = useCallback(async () => {
    const r = await getCurrentRound();
    setRound(r);
  }, []);

  useEffect(() => {
    if (!user || user.role === "admin") return;
    pollRound();
    const i = setInterval(pollRound, 4000);
    return () => clearInterval(i);
  }, [user, pollRound]);

  const handleLogin = (team, role) => {
    setUser({ team, role });
    setTeamData(team);
  };

  const handleTeamUpdate = (updatedTeam) => { setTeamData(updatedTeam); };

  const showNav = user && user.role === "team";

  return (
    <>
      <style>{css}</style>
      {showNav && <TopBar team={teamData} round={round} />}
      {!user && <LoginScreen onLogin={handleLogin} />}
      {user?.role === "admin" && <AdminPanel />}
      {user?.role === "team" && (() => {
        if (round === "waiting") return <WaitingRoom team={teamData} />;
        if (round === "mcq") return <MCQRound team={teamData} onUpdate={handleTeamUpdate} />;
        if (round === "treasure") return <TreasureHunt team={teamData} onUpdate={handleTeamUpdate} />;
        if (round === "leaderboard") return <Leaderboard team={teamData} />;
        return <WaitingRoom team={teamData} />;
      })()}
    </>
  );
}
