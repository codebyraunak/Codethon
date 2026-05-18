
import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "Anvaya@2026";
const MCQ_DURATION = 30 * 60; // 30 minutes in seconds

const MCQ_QUESTIONS = [
  {
    id: 1,
    q: "Adya writes a function that is supposed to print a right angled star triangle of n rows. She tests it with n=4 but the output surprises her.\nCode:\ndef star_triangle(n):\n    for i in range(n):\n        print(\"*\" * i)\n\nstar_triangle(4)\n\nWhat is actually printed?",
    options: ["(blank line), *, **, ***", "*, **, ***, ****", "****, ***, **, *", "*, **, ***"],
    ans: 0
  },
  {
    id: 2,
    q: "Which of the following will NOT raise an error?\nt = ([1, 2], [3, 4])",
    options: ["t[0] = [9, 8]", "t[0].append(99)", "t[1] = []", "t = ()"],
    ans: 1
  },
  {
    id: 3,
    q: "What is the output?\nd = {'a': 1, 'b': 2, 'a': 3}\nprint(len(d), d['a'])",
    options: ["3 1", "2 3", "2 1", "3 3"],
    ans: 1
  },
  {
    id: 4,
    q: "What does this print?\nd = {'x': 10}\nprint(d.get('y', 0) + d.get('x', 0))",
    options: ["10", "0", "Error", "None"],
    ans: 0
  },
  {
    id: 5,
    q: "What is the output?\nt = (1,)\nprint(type(t), type((1)))",
    options: ["<class 'tuple'> <class 'tuple'>", "<class 'tuple'> <class 'int'>", "<class 'int'> <class 'tuple'>", "<class 'int'> <class 'int'>"],
    ans: 1
  },
  {
    id: 6,
    q: "Online Shopping Fraud Detection\ntransactions = [5000, 12000, 3000, 25000]\ncount = 0\n\nfor amount in transactions:\n   if amount > 10000:\n       count += 1\n\nprint(count)\nOutput?",
    options: ["1", "2", "3", "4"],
    ans: 1
  },
  {
    id: 7,
    q: "College Fest Entry \nDuring a college fest, the organizing team maintains a blacklist of students who are not allowed to enter the event venue.\nThe system checks each student one by one and prints only the names of students who are not present in the blacklist.\nstudents = [\"A\", \"B\", \"C\"]\nblacklist = [\"C\"]\n\nfor s in students:\n   if s not in blacklist:\n       print(s)\nWhat will be the output?",
    options: ["A\nB\nC", "A\nB", "C", "Error"],
    ans: 1
  },
  {
    id: 8,
    q: "Code:- \nnumbers = [2, 5, 8, 11, 14]\n\nfor n in numbers:\n   if n % 2 == 0:\n       print(n)\nWhat will be the output?",
    options: ["2\n5\n8\n11\n14", "5\n11", "2\n8\n14", "Error"],
    ans: 2
  },
  {
    id: 9,
    q: "values = [True, False, True, True]\ncount = 0\nfor v in values:\n   count += v\nprint(count)\nWhat will be the output?",
    options: ["True", "4", "3", "Error"],
    ans: 2
  },
  {
    id: 10,
    q: "Nested Condition\nx = 7\nif x > 5:\n   if x < 10:\n       print(\"Inside\")\nelse:\n   print(\"Outside\")\nWhat will be the output?",
    options: ["Inside", "Outside", "Inside\nOutside", "No Output"],
    ans: 0
  },
  {
    id: 11,
    q: "In the workshop, every shelf label has a tool name, an id number, and a count. A helper walks through the shelves and writes entries in a notebook. Sometimes he reaches the same shelf later after recounting it, so the count should become the later count. But the printed shelf label is old and must remain the first name written for that id. The final report must also keep the order in which ids first appeared in the notebook. Two shelves can have similar names, so the id is the trusted clue. The array a already holds n accepted records before the new notebook line is processed. A C program stores final records in an array of structures.\nWhich code fragment correctly handles one new notebook entry name, id, count?",
    options: [
      "pos = -1;\nfor(i = 0; i < n; i++)\n    if(a[i].id == id) pos = i;\nif(pos == -1) {\n    a[n].id = id;\n    strcpy(a[n].name, name);\n    a[n].count = count;\n    n++;\n} else {\n    a[pos].count = count;\n}",
      "pos = -1;\nfor(i = 0; i <= n; i++)\n    if(a[i].id = id) pos = i;\nif(pos == -1) {\n    a[n].id == id;\n    strcpy(a[n].name, name);\n    a[n].count = count;\n    n++;\n} else {\n    strcpy(a[pos].name, name);\n    a[pos].count = count;\n}",
      "pos = 0;\nfor(i = 0; i < n; i++)\n    if(a[i].id == id) pos = i;\nif(pos == 0) {\n    a[n].id = id;\n    strcpy(a[n].name, name);\n    a[n].count = count;\n    n++;\n} else {\n    a[pos].count = count;\n}",
      "pos = -1;\nfor(i = 0; i < n; i++)\n    if(strcmp(a[i].name, name) == 0) pos = i;\nif(pos == -1) {\n    a[n].id = id;\n    strcpy(a[n].name, name);\n    a[n].count = count;\n    n++;\n} else {\n    a[pos].id = id;\n    a[pos].count = count;\n}"
    ],
    ans: 0
  },
  {
    id: 12,
    q: "Nina is a junior developer helping a local hardware shop digitize its inventory system.\nEach tool in the shop must store:\n·     the tool’s name\n·     the available quantity\nShe creates a structure called Item, stores three tools in an array, writes a function to update the quantity of one tool using pointers, and another function to print the inventory.\nDuring code review, four trainees submit different snippets for the quantity update function.\nOnly ONE correctly updates the original structure stored in memory.\nWhich snippet correctly matches Nina’s intended logic?",
    options: [
      "void update_quantity(struct Item item, int q) {\n    item.quantity = q;\n}",
      "void update_quantity(struct Item *item, int q) {\n    item->quantity = q;\n}",
      "void update_quantity(struct Item *item, int q) {\n    *item.quantity = q;\n}",
      "void update_quantity(struct Item item[], int q) {\n    item.quantity = q;\n}"
    ],
    ans: 1
  },
  {
    id: 13,
    q: "Sana is building a voter eligibility checker. A person is eligible if they are 18 or older and  a citizen. She also wants to flag people who are citizens under 18 as future voters. Identify all code fragments that correctly implement this logic.\n\n# Fragment A\ndef check(age, citizen):\n    if age >= 18 and citizen:\n        return \"Eligible\"\n    elif citizen and age < 18:\n        return \"Future voter\"\n    else:\n        return \"Not eligible\"\n\n# Fragment B\ndef check(age, citizen):\n    if age >= 18:\n        if citizen:\n            return \"Eligible\"\n    if citizen:\n        return \"Future voter\"\n    return \"Not eligible\"\n\n# Fragment C\ndef check(age, citizen):\n    if age >= 18 and citizen == True:\n        return \"Eligible\"\n    if citizen == True and age < 18:\n        return \"Future voter\"\n    else:\n        return \"Not eligible”\n\nWhich fragments correctly handle all three cases?\nSelect all that apply, then click Check.",
    options: [
      "Fragment A only",
      "Fragment B only",
      "Fragment A and Fragment C",
      "All three fragments"
    ],
    ans: [2]
  },
  {
    id: 14,
    q: "Rajath, a first-year CS student, is desperately trying to automate his RC Circuit experiment using Python before his lab test tomorrow. He recalls from his Physics class that a capacitor stores electrical charge, and the relationship between capacitance, charge, and voltage is defined by:\n\nC = Q / V\n\nWhere:\nC = Capacitance (measured in Farads, F)\nQ = Electric charge stored on the capacitor plates (measured in Coulombs, C)\nV = Potential difference across the capacitor terminals (measured in Volts, V)\n\nRajath decides to write a modular Python program where each physical quantity is computed by a separate function, following the principle of separation of concerns. He begins by defining a function stub with a descriptive signature that clearly conveys the order and role of each parameter to anyone reading the code.\npythondef calculate_capacitance(charge, voltage):\n    pass  # To be implemented\nHe knows that in Python, parameter order in a function signature matters when the function is invoked using positional arguments. A mismatch between the intended semantics of the parameter and its position can cause silent logical errors — bugs that don't raise exceptions but return incorrect results.\nWhich of the following implementations is semantically correct, consistent with the function signature, and will return the accurate capacitance value?",
    options: [
      "def calculate_capacitance(voltage, charge):\n    capacitance = charge / voltage\n    return capacitance",
      "def calculate_capacitance(charge, voltage):\n    capacitance = charge / voltage\n    return capacitance",
      "def calculate_capacitance(v, q):\n    capacitance = v / q\n    return capacitance",
      "def calculate_capacitance(q, v):\n    capacitance = v / q\n    return capacitance"
    ],
    ans: 1
  },
  {
    id: 15,
    q: "During the Anvaya finals, only participants with valid wristbands are allowed into the auditorium.\nA volunteer writes the following code:\nCode:-\nwristband = True\nif wristband:\n   print(\"Entry Allowed\")\n   print(\"Seat Assigned\")\nelse:\n   print(\"Entry Denied\")\n\nprint(\"Next Participant\")\nIf wristband = False, which output will be produced?",
    options: [
      "Entry Denied",
      "Entry Denied\nNext Participant",
      "Entry Allowed\nSeat Assigned",
      "Seat Assigned\nNext Participant"
    ],
    ans: 1
  },
  {
    id: 16,
    q: "Certificate Eligibility Filter \nThe event platform issues certificates only if:\n● attendance > 75\n● quiz_completed is True\n● feedback_submitted is True\nA student writes:\nif attendance > 75 and quiz_completed or feedback_submitted:\nUnexpectedly, some students who skipped the quiz still receive certificates.\nWhich statement best explains the issue?",
    options: [
      "Boolean variables cannot be combined in conditions",
      "'or' evaluates independently when previous 'and' conditions fail",
      "Conditional statements require only one Boolean expression",
      "Python ignores Boolean precedence inside 'if' blocks"
    ],
    ans: 1
  },
  {
    id: 17,
    q: "Audience Poll Analyzer \nAn event poll stores votes as:\nvotes = [\"AI\", \"Web\", \"AI\", \"Cyber\", \"AI\"]\nA participant writes:\ncount = 0\n\nfor i in votes:\n   if i == \"AI\":\n       count = 1\nThe expected output is 3, but the program outputs only 1.\nWhich option best identifies the issue?",
    options: [
      "The counter variable is overwritten instead of accumulated",
      "Loop variables cannot compare string values",
      "Lists do not support repeated elements",
      "Assignment inside loops terminates iteration"
    ],
    ans: 0
  },
  {
    id: 18,
    q: "Dynamic Elimination Logic \nParticipants qualify only if:\n● coding > 70\n● debugging > 60\nA student writes:\nif coding > 70:\n   if debugging > 60:\n       print(\"Qualified\")\nelse:\n   print(\"Rejected\")\nSome participants receive no output at all.\nWhich option best explains this behavior?",
    options: [
      "The 'else' block is associated only with the outer condition",
      "Nested conditions cannot contain print statements",
      "Python skips nested blocks after the first comparison",
      "Comparison operators inside nested blocks execute independently"
    ],
    ans: 0
  },
  {
    id: 19,
    q: "AI-Based Attendance Counter \nAttendance data is stored as:\nattendance = [True, True, False, True]\nA student writes:\npresent = 0\n\nfor i in attendance:\n   present += i\nThe output correctly becomes 3.\nWhy does this work?",
    options: [
      "Boolean values participate numerically during arithmetic operations",
      "Lists automatically convert Boolean values into strings",
      "'+=' ignores False values completely",
      "Loop variables cannot store Boolean values"
    ],
    ans: 0
  },
  {
    id: 20,
    q: "Before the coding round begins, a countdown system runs:\ntime = 3\nwhile time > 0:\n   print(time)\n   time -= 1\nHow many times will the loop execute?",
    options: ["2", "3", "4", "Infinite times"],
    ans: 1
  },
];



];

const RIDDLES = [
  "I stand among a crowd yet I alone set the sky on fire every season. Machines sleep in rows beside me, indifferent to my blaze. People eat and laugh not far from where I root, yet they rarely look up. A night of music once shook the earth near my feet, and still I flowered on in silence.",
  "I am neither wall nor door, yet I guard the face of a building every day. Circles come and go beside me, but I have never moved an inch. I wear a crown no jeweller crafted — flame-coloured, wild, and seasonal. Voices once sang beneath my canopy, and the stars above me did not flinch.",
  "My siblings surround me, yet none of them burns the way I do. A huge wall faces me, a cart feeds the hungry behind me, and iron horses rest beside me. Once music spun beats into the air and the crowd moved beneath my gaze. I give no warmth despite my fire, for my fire is only colour.",
  "I was rooted before the lot was paved. I have witnessed wheels arrive and depart, and one wild evening of bass and lights. Every year I dress in two colours that stop those who bother to notice. I stand in front of what you enter, among those who are green but not ablaze.",
  "A wild of kin grows around me, yet I alone remember the taste of fire in my petals. The building beyond me watches with many eyes. A instrument’s heartbeat once pulsed through my roots without my permission. Ask the one who has seen me bloom: what stands between the space and the door, wearing sunset on its branches?",
  "I blaze without burning, flame without heat,\nNear resting giants and hurried feet.\nBeside cheap bites and fading cheer,\nThe ember crown hides something near",
  "Where music once shattered the silent air,\nA fire-colored guardian still stands there.\nNo smoke, no ash, no raging pyre —\nOnly branches dressed in fire.",
  "Between hungry crowds and sleeping wheels,\nA burning tree its secret seals.\nStudents pass yet rarely see\nThe flaming king beneath the free sky.",
  "I watched the fest in flashing light,\nNow only petals paint the site.\nSeek the blaze that roots below,\nWhere buses rest and cool winds blow.",
  "Not the canteen, not parking too,\nBut somewhere standing between the two.\nA scarlet shadow guards the way,\nDropping sunsets every day.",
  "My flowers fall like shattered flame,\nYet no one pauses at my name.\nNear horns, tea, and dusty air,\nYour hidden answer lingers there.",
  "A silent inferno spreads its crown,\nPainting orange-red on the ground.\nNear where engines wait in line,\nThe treasure sleeps beneath my spine.",
  "No fire fears the rain like I —\nFor mine blooms safely toward the sky.\nNear the fest’s forgotten sound,\nThe final clue may yet be found.",
  "I burn through bloom, not through rage,\nWatching students cross my stage.\nNear the tiny feast of tea,\nThe answer waits beside me.",
  "Find the tree that mimics flame,\nThough smoke and heat it never claimed.\nBy buses, snacks, and fest-night air —\nThe hidden prize is waiting there"
];

// Remove Firebase SDK imports because we are using the REST API
// to avoid the 100 concurrent WebSocket connection limit on the Spark plan.
const DB_URL = "https://codethon-34ed5-default-rtdb.firebaseio.com";

// ─── STORAGE HELPERS (REST API) ───────────────────────────────────────────────
const fetchNoCache = async (url) => {
  const res = await fetch(url, { cache: "no-store" });
  return await res.json();
};

const getTeams = async () => {
  try { const data = await fetchNoCache(`${DB_URL}/teams.json?_t=${Date.now()}`); return data || {}; } catch { return {}; }
};
const setTeams = async (t) => { try { await fetch(`${DB_URL}/teams.json`, { method: "PUT", body: JSON.stringify(t) }); } catch {} };

const getCurrentRound = async () => {
  try { const data = await fetchNoCache(`${DB_URL}/current_round.json?_t=${Date.now()}`); return data || "waiting"; } catch { return "waiting"; }
};
const setCurrentRound = async (round) => { try { await fetch(`${DB_URL}/current_round.json`, { method: "PUT", body: JSON.stringify(round) }); } catch {} };

const getMCQActive = async () => {
  try { const data = await fetchNoCache(`${DB_URL}/mcq_active.json?_t=${Date.now()}`); return data || { active: false, startTime: null }; } catch { return { active: false, startTime: null }; }
};
const setMCQActive = async (val) => { try { await fetch(`${DB_URL}/mcq_active.json`, { method: "PUT", body: JSON.stringify(val) }); } catch {} };

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
    
    const blockCopyPaste = (e) => e.preventDefault();
    document.addEventListener("copy", blockCopyPaste);
    document.addEventListener("cut", blockCopyPaste);
    document.addEventListener("paste", blockCopyPaste);
    document.addEventListener("dragstart", blockCopyPaste);
    document.addEventListener("drop", blockCopyPaste);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("copy", blockCopyPaste);
      document.removeEventListener("cut", blockCopyPaste);
      document.removeEventListener("paste", blockCopyPaste);
      document.removeEventListener("dragstart", blockCopyPaste);
      document.removeEventListener("drop", blockCopyPaste);
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

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'Barlow Condensed', sans-serif; overflow-x: hidden; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }

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
  .input { width: 100%; background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; padding: 12px 16px; color: var(--text); font-family: 'Space Mono', monospace; font-size: 14px; outline: none; transition: border-color 0.2s; user-select: auto; -webkit-user-select: auto; }
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
  
  .mcq-container { display: flex; height: calc(100vh - 104px); }
  .mcq-sidebar { width: 200px; background: var(--bg2); border-right: 1px solid var(--border); padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
  .mcq-content { flex: 1; padding: 32px; overflow-y: auto; max-width: 700px; margin: 0 auto; width: 100%; }
  .mcq-sidebar-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text2); }
  .mcq-header { background: var(--bg2); border-bottom: 1px solid var(--border); padding: 12px 24px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  
  @media (max-width: 600px) {
    .options { grid-template-columns: 1fr; }
    .admin-grid { grid-template-columns: 1fr; }
    .card, .card-wide { padding: 20px; }
    
    .mcq-header { padding: 12px 16px; gap: 12px; }
    .mcq-container { flex-direction: column; height: auto; }
    .mcq-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); padding: 12px 16px; flex-direction: row; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .mcq-sidebar-title { display: none; }
    .mcq-sidebar button { flex: 0 0 auto; padding: 6px 12px; }
    .mcq-content { padding: 20px 16px; }
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function TopBar({ team, round, memberId, onLogout }) {
  const roundLabels = { waiting: "STANDBY", mcq: "ROUND 1 · MCQ", treasure: "ROUND 2 · TREASURE HUNT", leaderboard: "LEADERBOARD" };
  return (
    <div className="topbar">
      <div className="topbar-logo">Code<span style={{ color: "var(--accent2)" }}>thon</span> 2026</div>
      {team && <div className="topbar-team mono" style={{ fontSize: 13 }}>{team.name} {memberId && memberId !== "team" ? `(M${memberId})` : ""}</div>}
      {round && <div className="topbar-round">{roundLabels[round] || round.toUpperCase()}</div>}
      {onLogout && <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px", fontSize: 11, marginLeft: "auto" }} onClick={onLogout}>Logout</button>}
    </div>
  );
}

function ViolationAlert({ msg, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3000); return () => clearTimeout(t); }, [onDismiss]);
  return <div className="violation">⚠️ {msg}</div>;
}

// ─── LANDING PAGE ───────────────────────────────────────────────────────────────
function LandingScreen({ onStart }) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Intro animation
    const centralLogo = document.getElementById('centralLogo');
    const overlay = document.getElementById('intro-overlay');
    const hero = document.getElementById('hero-section');
    if (centralLogo && overlay && hero) {
      setTimeout(() => {
        centralLogo.classList.add('zoom-animate');
        setTimeout(() => {
          overlay.classList.add('fade-out');
          hero.classList.add('fade-in');
          setTimeout(() => { overlay.style.display = 'none'; }, 1200);
        }, 2600);
      }, 400);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="apple-theme landing-body" style={{ width: '100vw' }}>
      {/* Intro Overlay */}
      <div id="intro-overlay" className="intro-overlay">
        <div className="central-logo-wrapper">
          <img src="/images/logo1.png" alt="Anvaya" className="central-logo" id="centralLogo" />
        </div>
      </div>

      <div className="landing-scroll-container">
        {/* Hero Section */}
        <section id="hero-section" className="hero-section">
          <header className="hero-header">
            <img src="/images/logo2.png" alt="NIE" className="hero-logo left-logo" />
            <img src="/images/logo3.jpg" alt="Anvaya NIE-IUCEE" className="hero-logo right-logo" />
          </header>
          <div className="hero-content">
            <h1 className="hero-title">Codethon 2026</h1>
            <p className="hero-subtitle">Great engineers don't wait for opportunities.<br/>They build them.</p>
            <button className="cta-btn" onClick={onStart} style={{ marginTop: '2rem', animation: 'fadeUp 0.8s 1.2s ease forwards', opacity: 0 }}>
              Enter Arena
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 8}}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="challenge-section reveal">
          <div className="challenge-text">
            <h2>You are not filling a form.</h2>
            <h2><span>You are taking a challenge.</span></h2>
          </div>
          <div className="challenge-cards">
            <div className="challenge-card reveal">
              <div className="card-number">20</div>
              <div className="card-label">Questions</div>
            </div>
            <div className="challenge-card reveal">
              <div className="card-number">30</div>
              <div className="card-label">Minutes</div>
            </div>
            <div className="challenge-card reveal">
              <div className="card-number">▢</div>
              <div className="card-label">Logic Based</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section reveal">
          <button className="cta-btn" onClick={onStart}>
            Start the Assessment
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 8}}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </section>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("1");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    const team = { 
      id, name: teamName.trim(), password, 
      members: {
        1: { mcq_score: 0, mcq_answers: {}, mcq_submitted: false },
        2: { mcq_score: 0, mcq_answers: {}, mcq_submitted: false },
        3: { mcq_score: 0, mcq_answers: {}, mcq_submitted: false },
        4: { mcq_score: 0, mcq_answers: {}, mcq_submitted: false }
      },
      mcq_score: 0, mcq_answers: {}, mcq_submitted: false, hunt_level: 1, hunt_score: 0, hunt_penalties: 0, total_score: 0,
      riddle_index: Math.floor(Math.random() * 15)
    };
    teams[id] = team;
    await setTeams(teams);
    setLoading(false);
    setSuccess("Team registered successfully! Please login.");
    setMode("login");
    setPassword("");
  };

  const login = async () => {
    if (!teamName.trim() || !password.trim()) { setError("All fields required"); return; }
    const id = teamName.trim().toLowerCase();
    if (id === "admin") {
      if (password === ADMIN_PASSWORD) { onLogin(null, "admin", null); }
      else { setError("Wrong password"); }
      return;
    }
    setLoading(true);
    const teams = await getTeams();
    const team = teams[id];
    if (!team) { setError("Team not found"); setLoading(false); return; }
    if (team.password !== password) { setError("Wrong password"); setLoading(false); return; }
    
    if (!team.members) {
      team.members = {
        1: { mcq_score: 0, mcq_answers: {}, mcq_submitted: false, logged_in: false },
        2: { mcq_score: 0, mcq_answers: {}, mcq_submitted: false, logged_in: false },
        3: { mcq_score: 0, mcq_answers: {}, mcq_submitted: false, logged_in: false },
        4: { mcq_score: 0, mcq_answers: {}, mcq_submitted: false, logged_in: false }
      };
      teams[id] = team;
      await setTeams(teams);
    }

    if (team.members[loginAs]?.logged_in) {
      setError(`Member ${loginAs} is already logged in on another device.`);
      setLoading(false);
      return;
    }
    
    team.members[loginAs].logged_in = true;
    teams[id] = team;
    await setTeams(teams);
    
    if (loginAs) localStorage.setItem("codethon_user", JSON.stringify({ team, role: "team", memberId: loginAs }));
    
    onLogin(team, "team", loginAs);
    setLoading(false);
  };

  return (
    <div className="apple-theme auth-container" style={{ width: '100vw' }}>
      {/* Top Logo Bar */}
      <div className="page-logo-bar" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
          <img src="/images/logo2.png" alt="NIE" className="page-logo page-logo-left" />
          <img src="/images/logo1.png" alt="Anvaya" className="page-logo page-logo-right" />
      </div>

      <div className="auth-card" style={{ marginTop: 60 }}>
          <div className="auth-logo">
              <img src="/images/logo4.png" alt="Codethon" />
          </div>
          <div className="auth-header">
              <h2>Team Entry</h2>
              <p>Enter your details to enter the arena.</p>
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            {["login", "register"].map(m => (
              <button key={m} className={`btn ${mode === m ? "btn-primary" : "btn-secondary"}`} style={{ flex: 1 }} onClick={() => { setMode(m); setError(""); setSuccess(""); }}>
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          <div className="auth-form" onKeyDown={e => e.key === "Enter" && (mode === "register" ? register() : login())}>
              <div className="form-group">
                  <label>Team Name</label>
                  <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} required placeholder="e.g. The Debug Squad" />
              </div>

              {mode === "login" && (
                <div className="form-group">
                  <label>Login As</label>
                  <select value={loginAs} onChange={e => setLoginAs(e.target.value)} required>
                      <option value="1">Member 1 (MCQ)</option>
                      <option value="2">Member 2 (MCQ)</option>
                      <option value="3">Member 3 (MCQ)</option>
                      <option value="4">Member 4 (MCQ)</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{fontFamily: 'monospace'}} />
              </div>

              {error && <div className="error-msg">{error}</div>}
              {success && <div style={{ color: "var(--success)", fontSize: "0.85rem", marginBottom: "1rem" }}>{success}</div>}

              <button className="btn btn-primary w-100 mt-4" onClick={mode === "register" ? register : login} disabled={loading}>
                {loading ? "..." : mode === "register" ? "Register & Join" : "Enter Arena"}
              </button>
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
function MCQRound({ team, memberId, onUpdate }) {


  const memberData = team.members ? team.members[memberId] : { mcq_answers: {}, mcq_submitted: false, mcq_score: 0 };
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(memberData.mcq_answers || {});
  const [submitted, setSubmitted] = useState(memberData.mcq_submitted || false);
  const [timeLeft, setTimeLeft] = useState(MCQ_DURATION);
  const [violation, setViolation] = useState("");
  const [violations, setViolations] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);

  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(err => console.log(err));
  };

  const handleStartTest = () => {
    enterFullscreen();
    setHasStarted(true);
  };

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
        MCQ_QUESTIONS.forEach((q, i) => { 
          const ans = answersRef.current[i];
          if (Array.isArray(q.ans)) {
            if (Array.isArray(ans) && JSON.stringify([...ans].sort()) === JSON.stringify([...q.ans].sort())) score += 2;
          } else {
            if (ans === q.ans) score += 2; 
          }
        });
        const teams = await getTeams();
        if (teams[team.id]) {
          if (!teams[team.id].members) teams[team.id].members = {};
          if (!teams[team.id].members[memberId]) teams[team.id].members[memberId] = {};
          teams[team.id].members[memberId].mcq_score = score;
          teams[team.id].members[memberId].mcq_answers = answersRef.current;
          teams[team.id].members[memberId].mcq_submitted = true;
          
          let teamMcqScore = 0;
          for (let idx = 1; idx <= 4; idx++) {
            teamMcqScore += (teams[team.id].members[idx]?.mcq_score || 0);
          }
          teams[team.id].mcq_score = teamMcqScore;
          teams[team.id].total_score = teamMcqScore + (teams[team.id].hunt_score || 0);
          await setTeams(teams);
          onUpdate(teams[team.id]);
        }
        setSubmitted(true);
        if (document.fullscreenElement) document.exitFullscreen();
      })();
    }
  }, [submitted, team.id, memberId, onUpdate]);

  useAntiCheat(!submitted, handleViolation);

  const handleSubmit = async () => {
    let score = 0;
    MCQ_QUESTIONS.forEach((q, i) => { 
      const ans = answers[i];
      if (Array.isArray(q.ans)) {
        if (Array.isArray(ans) && JSON.stringify([...ans].sort()) === JSON.stringify([...q.ans].sort())) score += 2;
      } else {
        if (ans === q.ans) score += 2;
      }
    });
    const teams = await getTeams();
    if (teams[team.id]) {
      if (!teams[team.id].members) teams[team.id].members = {};
      if (!teams[team.id].members[memberId]) teams[team.id].members[memberId] = {};
      teams[team.id].members[memberId].mcq_score = score;
      teams[team.id].members[memberId].mcq_answers = answers;
      teams[team.id].members[memberId].mcq_submitted = true;
      
      let teamMcqScore = 0;
      for (let idx = 1; idx <= 4; idx++) {
        teamMcqScore += (teams[team.id].members[idx]?.mcq_score || 0);
      }
      teams[team.id].mcq_score = teamMcqScore;
      teams[team.id].total_score = teamMcqScore + (teams[team.id].hunt_score || 0);
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
        
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 12 }}>
          <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "20px", flex: 1 }}>
            <div className="mono" style={{ fontSize: 40, color: "var(--accent)", fontWeight: 700 }}>
              {memberData.mcq_score || 0}
            </div>
            <div className="text-sm">Your Score</div>
          </div>
          <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "20px", flex: 1 }}>
            <div className="mono" style={{ fontSize: 40, color: "var(--accent3)", fontWeight: 700 }}>
              {team.mcq_score || 0}
            </div>
            <div className="text-sm">Team Total Score</div>
          </div>
        </div>

        {rank !== null && (
          <div style={{ background: "rgba(0,255,135,0.05)", borderRadius: 8, border: "1px solid rgba(0,255,135,0.2)", padding: "16px", flex: 1 }}>
            <div className="text-sm">Current Team Rank</div>
            <div className="mono" style={{ fontSize: 24, color: "var(--accent)", fontWeight: 700 }}>#{rank}</div>
          </div>
        )}
      </div>
    </div>
  );

  if (!hasStarted) return (
    <div className="screen pt-topbar">
      <div className="card text-center">
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Ready to Begin?</div>
        <div className="text-sm" style={{ marginBottom: 24 }}>
          Your test session has been initiated by the admin.<br/>
          Click the button below to enter fullscreen and start your timer.
        </div>
        <button className="btn btn-primary" onClick={handleStartTest} style={{ padding: "12px 32px", fontSize: 16 }}>
          Enter Fullscreen & Start
        </button>
      </div>
    </div>
  );

  const q = MCQ_QUESTIONS[current];

  return (
    <div ref={containerRef} className="apple-theme test-body">
      {/* Slim Progress Bar */}
      <div className="test-progress-bar">
          <div className="test-progress-fill" style={{ width: `${pct}%` }}></div>
      </div>

      {violation && <ViolationAlert msg={violation} onDismiss={() => setViolation("")} />}

      {/* Top Logo Bar */}
      <div className="page-logo-bar">
          <img src="/images/logo2.png" alt="NIE" className="page-logo page-logo-left" />
          <img src="/images/logo1.png" alt="Anvaya" className="page-logo page-logo-right" />
      </div>

      {/* Navigation Header */}
      <header className="test-header">
          <div className="candidate-info">
              <span id="displayNavName">{team.name}</span>
              <span className="badge" id="displayNavUSN">M{memberId}</span>
          </div>
          <div id="questionCounterHeader" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {Object.keys(answers).length}/{MCQ_QUESTIONS.length} answered
          </div>
          <div className={`timer-display ${isDanger ? 'timer-warning' : ''}`} id="timerDisplay">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span id="timeRemaining">{mins}:{secs}</span>
          </div>
      </header>

      {/* Main Test Container */}
      <main className="test-container">
          {/* Sidebar Progress Navigation */}
          <aside className="test-sidebar">
              <h3>Progress</h3>
              <div className="question-nav" id="questionNavMap">
                {MCQ_QUESTIONS.map((_, i) => {
                  let cls = "nav-dot";
                  if (answers[i] !== undefined) cls += " answered";
                  if (i === current) cls += " active";
                  return (
                    <div key={i} className={cls} onClick={() => setCurrent(i)}>
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              <div className="test-actions-sidebar">
                  <button id="finalSubmitBtnSidebar" className="btn btn-primary w-100" onClick={() => setShowConfirm(true)}>Submit Assessment</button>
              </div>
          </aside>

          {/* Question View Area */}
          <section className="question-section">
              <div className="question-card">
                  <div className="question-header">
                      <span className="question-counter" id="questionCounter">Question {current + 1} of {MCQ_QUESTIONS.length}</span>
                  </div>

                  <h2 className="question-text" id="questionText" dangerouslySetInnerHTML={{ __html: q.q.replace(/`([^`]+)`/g, '<code>$1</code>') }} />

                  <div className="answer-area" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {q.options.map((opt, i) => {
                      const isMulti = Array.isArray(q.ans);
                      const isSelected = isMulti 
                        ? (Array.isArray(answers[current]) && answers[current].includes(i))
                        : (answers[current] === i);
                      return (
                        <button key={i} className={`btn ${isSelected ? "btn-primary" : "btn-outline"}`} style={{ textAlign: 'left', padding: '1rem', height: 'auto', whiteSpace: 'pre-wrap', borderRadius: 'var(--radius-sm)', justifyContent: 'flex-start' }} onClick={() => setAnswers(prev => {
                            if (isMulti) {
                                let currArr = Array.isArray(prev[current]) ? [...prev[current]] : [];
                                if (currArr.includes(i)) currArr = currArr.filter(x => x !== i);
                                else currArr.push(i);
                                return { ...prev, [current]: currArr };
                            } else {
                                return { ...prev, [current]: i };
                            }
                        })}>
                          <span style={{ color: isSelected ? "rgba(255,255,255,0.7)" : "var(--text-muted)", marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span> {opt}
                        </button>
                      );
                    })}
                  </div>

                  <div className="test-controls">
                      <button className="btn btn-secondary" id="prevBtn" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>Previous</button>
                      <button className="btn btn-primary" id="nextBtn" onClick={() => setCurrent(Math.min(MCQ_QUESTIONS.length - 1, current + 1))} disabled={current === MCQ_QUESTIONS.length - 1}>Next</button>
                  </div>
              </div>
          </section>
      </main>

      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
          <div className="warning-card">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Submit MCQ?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You've answered {Object.keys(answers).length}/{MCQ_QUESTIONS.length} questions. This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowConfirm(false); handleSubmit(); }}>Submit Final</button>
            </div>
          </div>
        </div>
      )}
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
                    <td><span className="score-pill" style={{ background: "rgba(0,255,135,0.1)", color: "var(--accent)", fontWeight: 700 }}>{t.total_score || 0}</span></td>
                    <td>
                      {(() => {
                        const numSubmitted = t.members ? Object.values(t.members).filter(m => m && m.mcq_submitted).length : (t.mcq_submitted ? 4 : 0);
                        return numSubmitted > 0 ? <span style={{ fontSize: 11, background: "rgba(0,255,135,0.15)", color: "var(--accent)", padding: "2px 8px", borderRadius: 4 }}>MCQ {numSubmitted}/4 ✓</span> : null;
                      })()}
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

// ─── TREASURE HUNT ROUND ───────────────────────────────────────────────────────
function TreasureHunt({ team }) {
  const assignedIndex = team.riddle_index !== undefined ? team.riddle_index : (team.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % RIDDLES.length);
  const riddle = RIDDLES[assignedIndex];
  
  return (
    <div className="screen pt-topbar">
      <div className="card text-center" style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🗺️</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Round 2: Treasure Hunt</div>
        <div className="text-sm" style={{ marginBottom: 24 }}>Find the location described in your team's unique riddle. All 4 members must go there.</div>
        
        <div style={{ background: "var(--bg3)", borderRadius: 12, padding: "32px", border: "1px solid var(--border)", textAlign: "left" }}>
          <div className="text-accent" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Your Team's Clue</div>
          <div style={{ fontSize: 20, lineHeight: 1.6, fontStyle: "italic", whiteSpace: "pre-wrap" }}>
            "{riddle}"
          </div>
        </div>
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

  const unlockTeam = async (teamId) => {
    if (!confirm(`Unlock all members of team ${teamId} so they can log in again?`)) return;
    const t = await getTeams();
    if (t[teamId] && t[teamId].members) {
      Object.values(t[teamId].members).forEach(m => { if (m) m.logged_in = false; });
      await setTeams(t);
      refresh();
    }
  };

  const teamArr = Object.values(teams).sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
  const submitted = teamArr.filter(t => (t.members ? Object.values(t.members).filter(m => m && m.mcq_submitted).length === 4 : t.mcq_submitted)).length;

  const rounds = [
    { key: "waiting", label: "Waiting Room", desc: "Hold teams in lobby" },
    { key: "mcq", label: "Round 1 — MCQ", desc: "Start 30 min MCQ timer" },
    { key: "treasure", label: "Round 2 — Treasure Hunt", desc: "Show team riddles" },
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
                <tr><th>Rank</th><th>Team</th><th>MCQ</th><th>Total</th></tr>
              </thead>
              <tbody>
                {teamArr.map((t, i) => (
                  <tr key={t.id}>
                    <td className={`mono ${i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":""}`} style={{ fontSize: 16 }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i + 1}`}</td>
                    <td>
                      <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                        {t.name}
                        <button className="btn btn-outline btn-sm" style={{ padding: "2px 6px", fontSize: 10 }} onClick={() => unlockTeam(t.id)}>Unlock</button>
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: "var(--text2)" }}>{t.id}</div>
                    </td>
                    <td>
                      <div style={{ marginBottom: 4 }}>
                        <span className="score-pill">{t.mcq_score || 0} {(t.members ? Object.values(t.members).filter(m => m && m.mcq_submitted).length : (t.mcq_submitted ? 4 : 0))}/4 ✓</span>
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--text2)", whiteSpace: "nowrap" }}>
                        M1:{t.members?.[1]?.mcq_score || 0} | M2:{t.members?.[2]?.mcq_score || 0} | M3:{t.members?.[3]?.mcq_score || 0} | M4:{t.members?.[4]?.mcq_score || 0}
                      </div>
                    </td>
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
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("codethon_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [round, setRound] = useState("waiting");
  const [teamData, setTeamData] = useState(() => user ? user.team : null);
  const [showLanding, setShowLanding] = useState(!user);

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

  const handleLogin = (team, role, memberId) => {
    const u = { team, role, memberId };
    if (role === "admin") localStorage.setItem("codethon_user", JSON.stringify(u));
    setUser(u);
    setTeamData(team);
    setShowLanding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("codethon_user");
    setUser(null);
    setTeamData(null);
    setShowLanding(true);
  };

  const handleTeamUpdate = (updatedTeam) => { setTeamData(updatedTeam); };

  const showNav = user && user.role === "team";

  return (
    <>
      <style>{css}</style>
      {showNav && <TopBar team={teamData} round={round} memberId={user.memberId} onLogout={handleLogout} />}
      {!user && showLanding && <LandingScreen onStart={() => setShowLanding(false)} />}
      {!user && !showLanding && <LoginScreen onLogin={handleLogin} />}
      {user?.role === "admin" && <AdminPanel />}
      {user?.role === "team" && (() => {
        if (round === "waiting") return <WaitingRoom team={teamData} />;
        if (round === "mcq") return <MCQRound team={teamData} memberId={user.memberId} onUpdate={handleTeamUpdate} />;
        if (round === "treasure") return <TreasureHunt team={teamData} />;
        if (round === "leaderboard") return <Leaderboard team={teamData} />;
        return <WaitingRoom team={teamData} />;
      })()}
    </>
  );
}
