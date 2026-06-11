import { useState, useEffect, useRef } from "react";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&family=Orbitron:wght@400;600;700;900&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;scrollbar-width:thin;scrollbar-color:#00ff9d22 #0a0a0f}
    body{background:#0a0a0f;color:#c8d6e5;font-family:'Space Grotesk',sans-serif;overflow-x:hidden}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:#0a0a0f}
    ::-webkit-scrollbar-thumb{background:#00ff9d33;border-radius:2px}
    ::selection{background:#00ff9d33;color:#00ff9d}
    a{color:inherit;text-decoration:none}
    @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
    @keyframes glow{0%,100%{text-shadow:0 0 10px #00ff9d66,0 0 20px #00ff9d33}50%{text-shadow:0 0 20px #00ff9d,0 0 40px #00ff9d66}}
    @keyframes scanDown{0%{transform:translateY(-8px);opacity:0}50%{opacity:1}100%{transform:translateY(8px);opacity:0}}
  `}</style>
);

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold }
    );

    const current = ref.current;
    if (current) obs.observe(current);

    return () => {
      if (current) obs.unobserve(current);
      obs.disconnect();
    };
  }, [threshold]);

  return [ref, inView];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const fontSize = 13;
    const chars = "01アイウエオカキクケコ∇∂∫∑√∞≈≠←→↑↓⊕⊗∈∩∪";
    let cols = Math.floor(w / fontSize);
    let drops = Array(cols).fill(1);
    let raf;
    function draw() {
      ctx.fillStyle = "rgba(10,10,15,0.05)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px 'JetBrains Mono'`;
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.92 ? "rgba(0,255,157,0.9)" : "rgba(0,255,157,0.25)";
        ctx.fillText(ch, i * fontSize, y * fontSize);
        if (y * fontSize > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; cols = Math.floor(w / fontSize); drops = Array(cols).fill(1); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.07 }} />;
}

function NeuralBg() {
  const nodes = [
    [80,120],[80,220],[80,320],[80,420],
    [240,80],[240,180],[240,280],[240,380],[240,480],
    [400,120],[400,220],[400,320],[400,420],
    [560,160],[560,280],[560,400],
    [700,200],[700,320],
  ];
  const edges = [
    [0,4],[0,5],[1,4],[1,5],[1,6],[2,5],[2,6],[2,7],[3,6],[3,7],[3,8],
    [4,9],[4,10],[5,9],[5,10],[5,11],[6,10],[6,11],[6,12],[7,11],[7,12],[8,12],
    [9,13],[9,14],[10,13],[10,14],[11,14],[11,15],[12,14],[12,15],
    [13,16],[13,17],[14,16],[14,17],[15,17],
  ];
  return (
    <svg style={{ position: "absolute", right: 0, top: 0, width: "55%", height: "100%", opacity: 0.12, pointerEvents: "none" }} viewBox="0 0 780 560" preserveAspectRatio="xMidYMid meet">
      <defs><filter id="ng"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="#00ff9d" strokeWidth="0.5" opacity={0.15 + Math.random() * 0.25} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill="none" stroke="#00ff9d" strokeWidth="1.2" filter="url(#ng)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.5 + (i % 4) * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="4;6;4" dur={`${2 + (i % 3) * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function CyberCard({ children, accent = "#00ff9d", style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "relative", background: hov ? `rgba(0,0,0,0.7)` : "rgba(10,14,20,0.85)", border: `1px solid ${hov ? accent + "55" : accent + "1a"}`, borderRadius: 2, padding: "1.75rem", transition: "all 0.3s", boxShadow: hov ? `0 0 28px ${accent}18, inset 0 0 20px ${accent}05` : "none", ...style }}>
      {[["top:-1px;left:-1px;border-top:2px solid;border-left:2px solid", "tl"],["top:-1px;right:-1px;border-top:2px solid;border-right:2px solid", "tr"],["bottom:-1px;left:-1px;border-bottom:2px solid;border-left:2px solid", "bl"],["bottom:-1px;right:-1px;border-bottom:2px solid;border-right:2px solid", "br"]].map(([s, k]) => (
        <span key={k} style={{ position: "absolute", width: 12, height: 12, ...Object.fromEntries(s.split(";").map(x => { const [k2, v] = x.split(":"); return [k2.replace(/-([a-z])/g, (_,c) => c.toUpperCase()), v]; })), borderColor: accent, transition: "opacity 0.3s", opacity: hov ? 1 : 0.4 }} />
      ))}
      {children}
    </div>
  );
}

function SectionHeader({ idx, title, sub }) {
  return (
    <Reveal>
      <div style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.7rem", color: "#00ff9d", letterSpacing: "0.2em" }}>{idx}</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,#00ff9d33,transparent)" }} />
        </div>
        <h2 style={{ fontFamily: "'Orbitron'", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, color: "#e2ede8", letterSpacing: "0.04em" }}>{title}</h2>
        {sub && <p style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.78rem", color: "#3a7a60", marginTop: "0.5rem", letterSpacing: "0.06em" }}>{sub}</p>}
      </div>
    </Reveal>
  );
}

function TerminalLine({ text, delay = 0 }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const id = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setDone(true); }
      }, 38);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return (
    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.82rem", lineHeight: 2.2, color: "#00ff9d" }}>
      <span style={{ color: "#2a6a4a", marginRight: 8 }}>~/dev $</span>
      {shown}
      {!done && <span style={{ animation: "blink 0.7s infinite" }}>▋</span>}
    </div>
  );
}

/* LIVE STATS HOOK */
function useLiveStats() {
  const [leetcode, setLeetcode] = useState(undefined);
  const [repos, setRepos] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    const withTimeout = (p, ms) => Promise.race([
      p,
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
    ]);

    withTimeout(
      fetch("https://leetcode-api-faisalshohag.vercel.app/SESH_MANUVARTHI").then(r => r.ok ? r.json() : Promise.reject()),
      6000
    )
      .then(d => { if (!cancelled) setLeetcode(typeof d.totalSolved === "number" ? d.totalSolved : "300+"); })
      .catch(() => { if (!cancelled) setLeetcode("300+"); });

    withTimeout(
      fetch("https://api.github.com/users/Seshmanuvarthi").then(r => r.ok ? r.json() : Promise.reject()),
      6000
    )
      .then(d => { if (!cancelled) setRepos(typeof d.public_repos === "number" ? d.public_repos : "20+"); })
      .catch(() => { if (!cancelled) setRepos("20+"); });

    return () => { cancelled = true; };
  }, []);

  return { leetcode, repos };
}

/* COUNT UP (animates int / decimal values; passes through strings) */
function CountUp({ value }) {
  const [display, setDisplay] = useState("...");
  useEffect(() => {
    if (value === undefined || value === null) { setDisplay("..."); return; }
    const num = parseFloat(value);
    if (Number.isNaN(num)) { setDisplay(value); return; }
    const isInt = Number.isInteger(num);
    let raf;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = eased * num;
      setDisplay(isInt ? Math.floor(cur) : cur.toFixed(2));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(isInt ? num : num.toFixed(2));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display}</>;
}

/* INTERACTIVE TERMINAL — hero centerpiece */
function InteractiveTerminal() {
  const [bootDone, setBootDone] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [cmdLog, setCmdLog] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 4400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { if (bootDone && inputRef.current) inputRef.current.focus(); }, [bootDone]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history]);

  const projects = {
    honeypot: [
      "Adaptive Deception-Driven Cyber Resilience System",
      "Stack: Python, Groq API (Llama-3.3-70B), Paramiko, SQLite, AWS EC2",
      "- SSH honeypot logging real attacker sessions (5-table SQLite, 100+ patterns)",
      "- LLM-fallback classifier, confidence-gated (>=0.75), structured JSON output",
      "- Chaos Engine escalates response intensity on repeated attacks",
      "github.com/RahulArra/honeypot-choas",
    ],
    pdf: [
      "Transformer-Based English -> Telugu PDF Translator",
      "Stack: Flask, Meta NLLB-200, PyMuPDF, HarfBuzz, Server-Sent Events",
      "- Privacy-first, fully offline translation",
      "- MPS-accelerated NLLB-200 (minutes -> seconds)",
      "- HarfBuzz Telugu rendering + smart background sampling",
      "github.com/Seshmanuvarthi/english-to-telugu-pdf-translator",
    ],
    hotel: [
      "Hotel Inventory & Procurement Management System",
      "Stack: MERN, JWT, Cloudinary, Brevo SMTP",
      "- 4-role workflow (Admin / Manager / Staff / Vendor)",
      "- JWT auth, Cloudinary uploads, automated SMTP alerts",
      "Live: hotel-inventory-procurement-management-sr7u.onrender.com",
    ],
    exam: [
      "Virtual Exam Bridge",
      "Stack: MERN, RBAC, Session Management",
      "- Role-based access (student / teacher portals)",
      "- Configurable question bank with 3-level difficulty",
      "Live: virtualexam-bridge-frontend.onrender.com",
    ],
    civic: [
      "Civic Issue Reporting Mobile App",
      "Stack: Flutter, Deep Learning, GPS",
      "- ImageNet transfer learning classifier (88%+ validation accuracy)",
      "- GPS auto-routes reports to nearest municipal department",
      "github.com/SudheeHacakthon/CivicVision",
    ],
    cti: [
      "Cyber Threat Intelligence Pipeline",
      "Stack: Kafka, Spark Structured Streaming, Flink CEP, GraphX, FastAPI, React, Leaflet",
      "- Kafka ingestion -> parallel Spark + Flink CEP consumers",
      "- Spark: rule-based threat classification on every event",
      "- Flink CEP: multi-event attack-pattern detection",
      "- GraphX PageRank surfaces high-centrality threat actors",
      "- FastAPI WebSocket -> React + Leaflet UI, animated geo-arcs every 2s",
      "github.com/Seshmanuvarthi/cyber-threat-intelligence",
    ],
    tcc: [
      "TCC Club — Members' Website",
      "Stack: Next.js 16, TypeScript, Tailwind 4, bcrypt",
      "- Public: menu, facilities, gallery, newsletter, payments, bookings",
      "- Admin auth: bcrypt-hashed creds + HttpOnly signed session cookies",
      "- On-demand menu / newsletter uploads with social-share hooks",
      "Live: tccclub.net",
    ],
  };

  const commands = {
    help: () => [
      "Available commands:",
      "  whoami           - about me",
      "  skills           - tech stack",
      "  projects         - list my projects",
      "  cat <project>    - details (e.g., cat honeypot)",
      "  socials          - github / linkedin / leetcode / hackerrank",
      "  resume           - open resume",
      "  contact          - email & phone",
      "  clear            - clear the terminal",
      "  sudo hire-me     - ;)",
    ],
    whoami: () => [
      "Manuvarthi Seshadri Naidu",
      "B.E. Information Technology @ CBIT  |  CGPA: 9.22",
      "Building production-grade software, ML pipelines, and cyber resilience systems.",
    ],
    skills: () => [
      "Languages:    Python, Java, SQL, JavaScript",
      "AI / ML:      LLM Integration (Groq, Llama-3.3-70B), NLLB-200, Transfer Learning, MPS",
      "Web/Backend:  MERN, REST APIs, SSE, JWT",
      "Databases:    MongoDB, SQLite",
      "Cloud/Tools:  AWS EC2, Render, Cloudinary, Git, Postman",
    ],
    projects: () => [
      "  cti       - Cyber Threat Intelligence Pipeline (Kafka + Spark + Flink + GraphX)",
      "  honeypot  - Adaptive Deception-Driven Cyber Resilience System",
      "  pdf       - Transformer-Based English -> Telugu PDF Translator",
      "  tcc       - TCC Club Members' Website (Next.js, live client work)",
      "  hotel     - Hotel Inventory & Procurement Management System",
      "  exam      - Virtual Exam Bridge",
      "  civic     - Civic Issue Reporting Mobile App",
      "Type 'cat <name>' for details (e.g., cat cti).",
    ],
    socials: () => [
      "GitHub:     github.com/Seshmanuvarthi",
      "LinkedIn:   linkedin.com/in/seshadri-naidu-manuvarthi-366466295",
      "LeetCode:   leetcode.com/u/SESH_MANUVARTHI",
      "HackerRank: hackerrank.com/profile/seshmanuvarthi27",
    ],
    contact: () => [
      "Email: seshmanuvarthi27@gmail.com",
      "Phone: +91 8897055099",
      "Or scroll to the CONTACT.SSH section below.",
    ],
    resume: () => {
      window.open("/resume.pdf", "_blank");
      return ["Opening resume.pdf in new tab..."];
    },
    clear: () => { setHistory([]); return null; },
    "sudo hire-me": () => {
      setTimeout(() => { window.location.href = "mailto:seshmanuvarthi27@gmail.com?subject=Let%27s%20talk&body=Hi%20Sesh%2C"; }, 700);
      return [
        "[sudo] password for sesh: ****************",
        "Access granted. Initiating outreach...",
        ">> Launching email client. Talk soon."
      ];
    },
  };

  const run = (raw) => {
    const t = raw.trim();
    if (!t) return;
    const next = [...history, { type: "in", text: t }];
    setCmdLog(l => [...l, t]); setHistIdx(-1);
    const lower = t.toLowerCase();
    let out;
    if (commands[lower]) {
      out = commands[lower]();
    } else if (lower.startsWith("cat ")) {
      const arg = lower.slice(4).trim();
      out = projects[arg] || [`cat: ${arg}: No such project. Run 'projects' to see the list.`];
    } else if (lower === "ls" || lower.startsWith("ls ")) {
      out = commands.projects();
    } else if (lower === "pwd") {
      out = ["/home/sesh/portfolio"];
    } else if (lower === "exit" || lower === "quit") {
      out = ["Nice try. You can't exit a portfolio."];
    } else {
      out = [`bash: ${t}: command not found. Type 'help'.`];
    }
    if (out === null && lower === "clear") { setHistory([]); setInput(""); return; }
    if (out) next.push(...out.map(text => ({ type: "out", text })));
    setHistory(next); setInput("");
  };

  const onKey = (e) => {
    if (e.key === "Enter") { run(input); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdLog.length === 0) return;
      const i = histIdx === -1 ? cmdLog.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i); setInput(cmdLog[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const i = histIdx + 1;
      if (i >= cmdLog.length) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(i); setInput(cmdLog[i]); }
    }
  };

  return (
    <div onClick={() => inputRef.current?.focus()}
      style={{ opacity: 0, animation: "fadeUp 0.8s ease 1s forwards", marginTop: "2.5rem", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,255,157,0.1)", padding: "1.25rem 1.5rem", maxWidth: 560, borderRadius: 2, cursor: "text" }}>
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.9rem", alignItems: "center" }}>
        {["#ff5f56","#ffbd2e","#27c93f"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.6rem", color: "#3a6a50", marginLeft: 8 }}>seshadri@cbit:~</span>
        <div style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: "rgba(0,255,157,0.14)",
          border: "1px solid rgba(0,255,157,0.55)",
          padding: "4px 12px",
          borderRadius: 999,
          boxShadow: "0 0 14px rgba(0,255,157,0.35), inset 0 0 8px rgba(0,255,157,0.08)",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#00ff9d",
            boxShadow: "0 0 8px #00ff9d, 0 0 14px #00ff9d",
            animation: "pulse 1.2s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", fontWeight: 700,
            color: "#00ff9d", letterSpacing: "0.14em",
          }}>
            INTERACTIVE &mdash; TYPE 'help'
          </span>
        </div>
      </div>

      <TerminalLine text="whoami - Manuvarthi_Seshadri_Naidu" delay={1400} />
      <TerminalLine text="stack - MERN + ML + CyberSec" delay={2600} />
      <TerminalLine text="hint - type 'help' to explore" delay={3800} />

      {bootDone && (
        <div ref={scrollRef} style={{ maxHeight: 220, overflowY: "auto", marginTop: "0.4rem", paddingRight: 6 }}>
          {history.map((h, i) => (
            <div key={i} style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.78rem", lineHeight: 1.7, whiteSpace: "pre-wrap", color: h.type === "in" ? "#00ff9d" : "#7a9a90" }}>
              {h.type === "in"
                ? (<><span style={{ color: "#2a6a4a", marginRight: 8 }}>~/dev $</span>{h.text}</>)
                : h.text}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", fontFamily: "'JetBrains Mono'", fontSize: "0.82rem", color: "#00ff9d" }}>
            <span style={{ color: "#2a6a4a", marginRight: 8 }}>~/dev $</span>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
              autoComplete="off" spellCheck={false}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#00ff9d", fontFamily: "'JetBrains Mono'", fontSize: "0.82rem", padding: 0, caretColor: "#00ff9d" }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* NAV */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const links = [["01","ABOUT","about"],["02","SKILLS","skills"],["03","PROJECTS","projects"],["04","XP","experience"],["05","CERTS","achievements"],["06","CONTACT","contact"]];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(8,10,14,0.94)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,255,157,0.08)" : "none", transition: "all 0.4s", padding: "0 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: "1.05rem", color: "#00ff9d", letterSpacing: "0.2em", animation: "glow 4s ease-in-out infinite" }}>SM<span style={{ color: "rgba(0,255,157,0.25)" }}>.EXE</span></div>
        <div style={{ display: "flex", gap: "0.2rem" }}>
          {links.map(([num, label, id]) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#3a6a50", padding: "6px 12px", letterSpacing: "0.1em", transition: "color 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
              onMouseEnter={e => e.currentTarget.style.color = "#00ff9d"} onMouseLeave={e => e.currentTarget.style.color = "#3a6a50"}>
              <span style={{ fontSize: "0.5rem", opacity: 0.45 }}>{num}</span>{label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
const roles = [
  "Full-Stack Developer",
  "ML Engineer",
  "DL Enthusiast",
  "Cyber Researcher",
  "MERN Stack Dev",
  "AI Integrations Dev"
];
/* HERO */
function Hero() {
  const [typed, setTyped] = useState("");
  const [ri, setRi] = useState(0);
  const [erasing, setErasing] = useState(false);
  const { leetcode, repos } = useLiveStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  const cur = roles[ri];
  let i = erasing ? cur.length : 0;

  const id = setInterval(() => {
    if (!erasing) {
      i++;
      setTyped(cur.slice(0, i));

      if (i >= cur.length) {
        clearInterval(id);
        setTimeout(() => setErasing(true), 1600);
      }
    } else {
      i--;
      setTyped(cur.slice(0, i));

      if (i <= 0) {
        clearInterval(id);
        setErasing(false);
        setRi((r) => (r + 1) % roles.length);
      }
    }
  }, erasing ? 38 : 72);

  return () => clearInterval(id);

}, [ri, erasing]);
  return (
    <section id="about" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 64 }}>
      <NeuralBg />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,157,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,157,0.025) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,255,157,0.04) 0%,transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 2rem 160px", position: "relative", zIndex: 1, width: "100%" }}>

        <div style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.1s forwards" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem", background: "rgba(0,255,157,0.06)", border: "1px solid rgba(0,255,157,0.18)", borderRadius: 2, padding: "5px 16px", marginBottom: "2rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 10px #00ff9d", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.68rem", color: "#00ff9d", letterSpacing: "0.18em" }}>SYSTEM_ONLINE // AVAILABLE_FOR_HIRE</span>
          </div>
        </div>

        <div style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.25s forwards" }}>
          <h1 style={{ fontFamily: "'Orbitron'", lineHeight: 1.05, letterSpacing: "0.03em" }}>
            <span style={{ display: "block", fontSize: "clamp(1rem,2.5vw,1.4rem)", color: "rgba(0,255,157,0.4)", fontWeight: 400, marginBottom: "0.3rem" }}>INITIALIZING //</span>
            <span style={{ display: "block", fontSize: "clamp(2.8rem,7vw,5.8rem)", fontWeight: 900, color: "#ddeee6" }}>MANUVARTHI</span>
            <span style={{ display: "block", fontSize: "clamp(2.8rem,7vw,5.8rem)", fontWeight: 900, background: "linear-gradient(90deg,#00ff9d,#00d4ff 60%,#bd00ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SESHADRI NAIDU</span>
          </h1>
        </div>

        <div style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.4s forwards", marginTop: "1.5rem", height: 34, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.78rem", color: "rgba(0,255,157,0.4)" }}>&gt;&gt;</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "clamp(0.85rem,2vw,1.1rem)", color: "#3a9a70" }}>{typed}</span>
          <span style={{ animation: "blink 0.75s infinite", color: "#00ff9d", fontFamily: "'JetBrains Mono'" }}>▋</span>
        </div>

        <div style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.55s forwards", marginTop: "1.75rem", maxWidth: 560, borderLeft: "3px solid #00ff9d", paddingLeft: "1.25rem", background: "rgba(0,0,0,0.35)" }}>
          <p style={{ fontFamily: "'Space Grotesk'", fontSize: "0.92rem", color: "#7a9e90", lineHeight: 1.85, padding: "1rem 0 1rem 0.25rem" }}>
            IT undergraduate at <span style={{ color: "#00ff9d", fontWeight: 600 }}>CBIT</span> with{" "}
            <span style={{ fontFamily: "'JetBrains Mono'", color: "#00d4ff" }}>9.22 CGPA</span>. 
            Building production-grade apps, architecting ML/DL pipelines, and researching cyber resilience systems.
          </p>
        </div>

        <div style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.7s forwards", marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            { label: "VIEW_PROJECTS", action: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }), primary: true },
            { label: "GITHUB ↗", href: "https://github.com/Seshmanuvarthi", color: "#00d4ff" },
            { label: "LINKEDIN ↗", href: "https://www.linkedin.com/in/seshadri-naidu-manuvarthi-366466295/", color: "#bd00ff" },
          ].map(btn => btn.primary ? (
            <button key={btn.label} onClick={btn.action}
              style={{ background: "#00ff9d", color: "#0a0a0f", border: "none", padding: "12px 30px", fontFamily: "'Orbitron'", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer", borderRadius: 2, transition: "all 0.3s" }}
              onMouseEnter={e => { e.target.style.boxShadow = "0 0 35px #00ff9d55"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.boxShadow = "none"; e.target.style.transform = "translateY(0)"; }}>
              {btn.label}
            </button>
          ) : (
            <a key={btn.label} href={btn.href} target="_blank" rel="noreferrer"
              style={{ border: `1px solid ${btn.color}44`, color: btn.color, padding: "12px 30px", fontFamily: "'Orbitron'", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", borderRadius: 2, transition: "all 0.3s", display: "inline-block" }}
              onMouseEnter={e => { e.target.style.borderColor = btn.color; e.target.style.background = btn.color + "12"; }}
              onMouseLeave={e => { e.target.style.borderColor = btn.color + "44"; e.target.style.background = "transparent"; }}>
              {btn.label}
            </a>
          ))}
        </div>

        <div style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.85s forwards", marginTop: "4rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", maxWidth: 520, background: "rgba(0,255,157,0.06)", border: "1px solid rgba(0,255,157,0.12)", gap: "1px" }}>
          {[
            { v: 9.22, l: "CGPA", live: false },
            { v: leetcode, l: "LEETCODE", live: typeof leetcode === "number" },
            { v: repos, l: "GITHUB REPOS", live: typeof repos === "number" },
            { v: 5, l: "CERTS", live: false },
          ].map(({ v, l, live }) => (
            <div key={l} style={{ background: "#0a0a0f", padding: "1.2rem 0.75rem", textAlign: "center", position: "relative" }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: "1.45rem", fontWeight: 700, color: "#00ff9d" }}><CountUp value={v} /></div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.58rem", color: "#2a6040", marginTop: 4, letterSpacing: "0.08em" }}>{l}</div>
              {live && (
                <span title="live" style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 8px #00ff9d", animation: "pulse 1.4s infinite" }} />
              )}
            </div>
          ))}
        </div>

        <InteractiveTerminal />
      </div>

      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.45, animation: "fadeUp 1s ease 1.2s both" }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.58rem", color: "#2a6040", letterSpacing: "0.2em" }}>SCROLL.DOWN</span>
        <div style={{ width: 1, height: 36, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", width: "100%", height: "100%", background: "linear-gradient(transparent,#00ff9d)", animation: "scanDown 1.8s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

/* SKILLS */
function Skills() {
  const [tab, setTab] = useState(0);
  const tabs = [
    { label: "LANGUAGES", color: "#00ff9d", items: [{ n: "Python", v: 88 }, { n: "JavaScript", v: 80 }, { n: "Java", v: 73 }, { n: "SQL", v: 81 }] },
    { label: "WEB/MERN", color: "#00d4ff", items: [{ n: "React.js", v: 88 }, { n: "Node.js", v: 78 }, { n: "Express.js", v: 72 }, { n: "MongoDB", v: 80 }, { n: "HTML/CSS", v: 92 }] },
    { label: "ML / DL", color: "#bd00ff", items: [{ n: "Deep Learning", v: 72 }, { n: "Image Classification", v: 70 }, { n: "AI Integration", v: 75 }] },
    { label: "SECURITY", color: "#ff3c3c", items: [{ n: "SSH Honeypot", v: 76 }, { n: "Threat Classification", v: 70 }, { n: "Chaos Engineering", v: 65 }, { n: "SQLite Forensics", v: 78 }] },
    { label: "CLOUD/TOOLS", color: "#ffd700", items: [{ n: "Git", v: 88 }, { n: "AWS EC2", v: 65 }, { n: "Cloudinary", v: 80 }, { n: "REST APIs", v: 90 }, { n: "Postman", v: 85 }] },
  ];
  const t = tabs[tab];
  const allTags = ["Python","JavaScript","Java","SQL","React.js","Node.js","Express.js","MongoDB","Flutter","Deep Learning","Transfer Learning","Image Classification","SSH Honeypot","AWS EC2","Paramiko","SQLite","REST APIs","Git","Cloudinary","JWT","MERN Stack","Postman","ImageNet","HTML/CSS"];

  return (
    <section id="skills" style={{ padding: "120px 2rem", position: "relative" }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "35%", background: "radial-gradient(circle at right,rgba(189,0,255,0.04),transparent)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader idx={"// 02"} title="SKILLS.EXE" sub="Technical proficiency matrix" />
        <Reveal>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {tabs.map((tb, i) => (
              <button key={tb.label} onClick={() => setTab(i)}
                style={{ background: tab === i ? `${tb.color}18` : "transparent", border: `1px solid ${tab === i ? tb.color + "66" : "rgba(255,255,255,0.08)"}`, color: tab === i ? tb.color : "#3a6a50", padding: "7px 18px", fontFamily: "'JetBrains Mono'", fontSize: "0.68rem", letterSpacing: "0.1em", cursor: "pointer", borderRadius: 2, transition: "all 0.3s", boxShadow: tab === i ? `0 0 18px ${tb.color}25` : "none" }}>
                {tb.label}
              </button>
            ))}
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
          <div>
            {t.items.map((item, i) => (
              <Reveal key={item.n} delay={i * 0.07}>
                <div style={{ marginBottom: "1.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.8rem", color: "#b8cec5" }}>{item.n}</span>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.7rem", color: t.color }}>{item.v}%</span>
                  </div>
                  <div style={{ height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${item.v}%`, background: `linear-gradient(90deg,${t.color},${t.color}77)`, borderRadius: 2, boxShadow: `0 0 8px ${t.color}55`, transition: "width 1s ease 0.1s" }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <CyberCard accent={t.color}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: t.color, letterSpacing: "0.15em", marginBottom: "1.25rem", opacity: 0.8 }}>FULL_TECH_STACK</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
                {allTags.map(tag => (
                  <span key={tag}
                    style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.12)", color: "#6a9080", padding: "4px 12px", fontFamily: "'JetBrains Mono'", fontSize: "0.68rem", borderRadius: 2, cursor: "default", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.target.style.color = "#00ff9d"; e.target.style.borderColor = "rgba(0,255,157,0.35)"; e.target.style.background = "rgba(0,255,157,0.09)"; }}
                    onMouseLeave={e => { e.target.style.color = "#6a9080"; e.target.style.borderColor = "rgba(0,255,157,0.12)"; e.target.style.background = "rgba(0,255,157,0.05)"; }}>
                    {tag}
                  </span>
                ))}
              </div>
            </CyberCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* PROJECTS */
function Projects() {
  const projects = [
    { code: "PRJ_001", title: "Hotel Inventory & Procurement", tag: "FULL-STACK", accent: "#00d4ff", stack: ["MERN","JWT","Cloudinary","Brevo SMTP"], desc: "Full-stack hotel operations platform with multi-role authentication and real-time stock dashboards.", bullets: ["Multi-role auth: Admin, Manager, Staff","JWT + Cloudinary bill uploads","Brevo SMTP automated alerts","Real-time procurement dashboards"], live: "https://hotel-inventory-procurement-management-sr7u.onrender.com", github: "https://github.com/Seshmanuvarthi/Hotel-Inventory-Procurement-Management-System" },
    { code: "PRJ_002", title: "Virtual Exam Bridge", tag: "FULL-STACK", accent: "#00ff9d", stack: ["MERN","RBAC","Session Mgmt"], desc: "Secure internal examination system with role-based access and configurable question banks.", bullets: ["Role-based access: students & teachers","Configurable question bank + difficulty levels","Real-time submission tracking","Secure session management"], live: "https://virtualexam-bridge-frontend.onrender.com", github: "https://github.com/ExamBridge-System/virtualexam_bridge" },
    { code: "PRJ_003", title: "CDC Placements Portal", tag: "AI-POWERED", accent: "#bd00ff", stack: ["MERN","AI APIs","Email Auto","Data Viz"], desc: "AI-powered campus placement management with resume generation and recruitment dashboards.", bullets: ["AI-powered resume generation","Job filtering & management","Automated email notifications","Data visualization dashboards"], github: "https://github.com/Seshmanuvarthi/Placement_Portal" },
    { code: "PRJ_004", title: "Cyber Resilience Validation", tag: "SECURITY", accent: "#ff3c3c", stack: ["Python","SQLite","Paramiko","AWS EC2"], desc: "SSH honeypot logging real attacker sessions with AI classification and a chaos stress-testing engine.", bullets: ["SSH honeypot — 5-table SQLite logging","AI: Recon, Privesc, Lateral, Persistence","Chaos Engine stress-tests on threat","Mirrors real SOC response workflows"], github: "https://github.com/Seshmanuvarthi" },
    { code: "PRJ_005", title: "Civic Issue Reporting App", tag: "MOBILE + DL", accent: "#ffd700", stack: ["Flutter","Deep Learning","GPS","ImageNet"], desc: "Flutter mobile app with AI image classification and GPS routing to auto-report civic issues.", bullets: ["ImageNet transfer learning classifier","Detects garbage, road damage, streetlights","GPS auto-routes to nearest municipal dept","Real-time issue tracking"], github: "https://github.com/SudheeHacakthon/CivicVision/tree/integration-demo" },
    {
      code: "PRJ_006",
      title: "PDF Translator — English to Telugu",
      tag: "AI + NLP",
      accent: "#ff9d00",
      stack: ["Flask", "PyMuPDF", "NLLB-200", "HarfBuzz", "SSE"],
      desc: "Privacy-first offline PDF translator that converts English documents to Telugu while preserving original layout and formatting.",
      bullets: [
        "Fully offline AI translation via Meta's NLLB-200 model","Real-time progress streaming via Server-Sent Events (SSE)","Background threading — UI never freezes during translation","HarfBuzz complex shaping for accurate Telugu script rendering","Smart background sampling for clean English text redaction","Apple Silicon MPS acceleration — inference in seconds"
      ],
      github: "https://github.com/Seshmanuvarthi/english-to-telugu-pdf-translator"
    },
    {
      code: "PRJ_007",
      title: "Cyber Threat Intelligence Pipeline",
      tag: "BIG DATA + CYBER",
      accent: "#ff006e",
      stack: ["Kafka","Spark","Flink CEP","GraphX","FastAPI","React","Leaflet"],
      desc: "Real-time big-data pipeline that ingests live network traffic, classifies threats, and pushes a live world map to a React dashboard every 2 seconds.",
      bullets: [
        "Kafka ingestion → parallel Spark + Flink CEP consumers",
        "Spark Structured Streaming for rule-based threat classification",
        "GraphX PageRank surfaces high-centrality threat actors",
        "FastAPI WebSocket pushes live results to React + Leaflet UI",
        "Animated geo-arcs map attacker-to-target flows on a world map"
      ],
      github: "https://github.com/Seshmanuvarthi/cyber-threat-intelligence"
    },
    {
      code: "PRJ_008",
      title: "TCC Club — Members' Website",
      tag: "CLIENT WORK",
      accent: "#38bdf8",
      stack: ["Next.js 16","TypeScript","Tailwind 4","bcrypt"],
      desc: "Production members' website for the Telangana Contractors Cultural Club — public site plus a secured single-admin control panel.",
      bullets: [
        "Public pages: menu, facilities, gallery, newsletter, payments, bookings",
        "Admin auth: bcrypt-hashed creds + HttpOnly signed session cookies",
        "On-demand menu / newsletter uploads with social-share hooks",
        "Deployed live on Vercel"
      ],
      live: "https://tccclub.net",
      github: "https://github.com/Seshmanuvarthi/tcc-club"
    },
  ];
  return (
    <section id="projects" style={{ padding: "120px 2rem", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: "10%", width: "40%", height: "80%", background: "radial-gradient(circle at left,rgba(0,212,255,0.025),transparent)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader idx="// 03" title="PROJECTS.DB" sub="Production-grade builds" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: "1.5rem" }}>
          {projects.map((p, i) => (
            <Reveal key={p.code} delay={i * 0.07}>
              <CyberCard accent={p.accent} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.6rem", color: p.accent, opacity: 0.6 }}>{p.code}</span>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {p.live && <a href={p.live} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#3a6a50", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = p.accent} onMouseLeave={e => e.target.style.color = "#3a6a50"}>LIVE ↗</a>}
                    <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#3a6a50", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = p.accent} onMouseLeave={e => e.target.style.color = "#3a6a50"}>GIT ↗</a>
                  </div>
                </div>
                <span style={{ display: "inline-block", background: `${p.accent}15`, border: `1px solid ${p.accent}40`, color: p.accent, fontFamily: "'JetBrains Mono'", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "3px 10px", borderRadius: 1, marginBottom: "0.75rem", width: "fit-content" }}>{p.tag}</span>
                <h3 style={{ fontFamily: "'Orbitron'", fontSize: "0.9rem", fontWeight: 700, color: "#ddeee6", lineHeight: 1.45, marginBottom: "0.65rem" }}>{p.title}</h3>
                <p style={{ fontFamily: "'Space Grotesk'", fontSize: "0.8rem", color: "#5a7a70", lineHeight: 1.75, marginBottom: "1rem", flex: 1 }}>{p.desc}</p>
                <ul style={{ listStyle: "none", marginBottom: "1.25rem" }}>
                  {p.bullets.map(b => (
                    <li key={b} style={{ display: "flex", gap: "0.5rem", fontFamily: "'Space Grotesk'", fontSize: "0.77rem", color: "#7a9a90", marginBottom: "0.28rem" }}>
                      <span style={{ color: p.accent, fontWeight: 700, flexShrink: 0 }}>›</span>{b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {p.stack.map(s => <span key={s} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#5a7a70", padding: "3px 10px", fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", borderRadius: 1 }}>{s}</span>)}
                </div>
              </CyberCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* EXPERIENCE */
function Experience() {
  return (
    <section id="experience" style={{ padding: "120px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader idx="// 04" title="EXPERIENCE.LOG" sub="Career & education timeline" />
        <div style={{ position: "relative", paddingLeft: "2.5rem" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "linear-gradient(#00ff9d44,#00d4ff44,rgba(189,0,255,0.3),transparent)" }} />
          {[
            { type: "INCOMING · INTERNSHIP", color: "#00ff9d", period: "Jul 2026 — Jun 2027", title: "Software Engineer Intern / Trainee", org: "The Hartford — Hyderabad, India", sub: "12-month enterprise SDE internship · Property & Casualty insurance, employee benefits, mutual funds", content: { grid: true, items: ["Java / Python / JavaScript stack with React frontends","SQL relational data modelling + Git version control","Agile ceremonies: stand-ups, sprint planning, retrospectives","Cross-functional collaboration: product, design, QA","Security-aware coding under senior engineer mentorship","AWS / Azure cloud and CI/CD pipeline exposure"] } },
            { type: "EDUCATION", color: "#00d4ff", period: "2023 — May 2027", title: "B.E. Information Technology", org: "Chaitanya Bharathi Institute of Technology", sub: "CGPA: 9.22 / 10.0", content: { tags: true, items: ["DSA","OOP","DBMS","OS","Computer Networks","Machine Learning","Deep Learning","Big Data Analytics"] } },
          ].map((item, i) => (
            <Reveal key={item.type} delay={i * 0.15}>
              <div style={{ position: "relative", marginBottom: "2.5rem" }}>
                <div style={{ position: "absolute", left: "-2.85rem", top: 10, width: 10, height: 10, borderRadius: "50%", background: item.color, boxShadow: `0 0 14px ${item.color}` }} />
                <CyberCard accent={item.color}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    <div>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.58rem", color: item.color, background: `${item.color}15`, border: `1px solid ${item.color}33`, padding: "2px 10px", letterSpacing: "0.1em", borderRadius: 1 }}>{item.type}</span>
                      <h3 style={{ fontFamily: "'Orbitron'", fontSize: "0.95rem", fontWeight: 700, color: "#ddeee6", marginTop: "0.7rem" }}>{item.title}</h3>
                      <p style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.73rem", color: item.color, marginTop: "0.2rem" }}>{item.org}</p>
                      <p style={{ fontFamily: "'Space Grotesk'", fontSize: "0.76rem", color: "#3a6a50", marginTop: "0.15rem" }}>{item.sub}</p>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.7rem", color: "#2a5040", border: "1px solid rgba(255,255,255,0.06)", padding: "4px 14px", borderRadius: 2, height: "fit-content" }}>{item.period}</span>
                  </div>
                  {item.content.grid ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      {item.content.items.map(b => (
                        <div key={b} style={{ display: "flex", gap: "0.5rem", fontFamily: "'Space Grotesk'", fontSize: "0.78rem", color: "#7a9a90" }}>
                          <span style={{ color: item.color, flexShrink: 0 }}>✓</span>{b}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                      {item.content.items.map(b => <span key={b} style={{ background: `${item.color}10`, border: `1px solid ${item.color}30`, color: item.color, padding: "4px 14px", fontFamily: "'JetBrains Mono'", fontSize: "0.68rem", borderRadius: 1 }}>{b}</span>)}
                    </div>
                  )}
                </CyberCard>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ACHIEVEMENTS */
function Achievements() {
  const certifications = [
    { 
      icon: "☁", 
      name: "Microsoft Azure Fundamentals", 
      org: "Microsoft", 
      color: "#00d4ff", 
      link: "https://drive.google.com/file/d/1Uj9T80eRGSfT8G-HdICgMUi--92Ffz_9/view?usp=share_link" 
    },
    { 
      icon: "🤖", 
      name: "Salesforce AI Associate", 
      org: "Salesforce", 
      color: "#00a6e0", 
      link: "https://drive.google.com/file/d/12eKyzIrdg2E9JL7Ei6M3PfhkW0PfKh1l/view?usp=sharing" 
    },
    { 
      icon: "⚡", 
      name: "Agentforce Specialist", 
      org: "Salesforce", 
      color: "#bd00ff", 
      link: "https://drive.google.com/file/d/1ig8ZAgni9Ml1-eQw-yYwkyeQZiyzHk-t/view?usp=share_link" 
    },
    { 
      icon: "🐍", 
      name: "Joy of Computing with Python", 
      org: "NPTEL / IIT Madras", 
      color: "#00ff9d", 
      link: "https://drive.google.com/file/d/1ig8ZAgni9Ml1-eQw-yYwkyeQZiyzHk-t/view?usp=share_link" 
    },
    { 
      icon: "💡", 
      name: "LeetCode 300+ Solved", 
      org: "LeetCode", 
      color: "#ffd700", 
      link: "https://leetcode.com/u/SESH_MANUVARTHI/" 
    }
  ];

  return (
    <section id="achievements" style={{ padding: "120px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader idx="// 05" title="CREDENTIALS.SH" sub="Certifications & achievements" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          <div>
            <Reveal><div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#2a6040", letterSpacing: "0.15em", marginBottom: "1.5rem" }}># CERTIFICATIONS + PROFILES</div></Reveal>
            {certifications.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.07}>
                <a href={c.link} target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none", marginBottom: "0.8rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(10,14,20,0.8)", border: `1px solid ${c.color}18`, padding: "1rem 1.25rem", borderRadius: 2, transition: "all 0.3s", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.color}44`; e.currentTarget.style.background = `${c.color}07`; e.currentTarget.style.transform = "translateX(5px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.color}18`; e.currentTarget.style.background = "rgba(10,14,20,0.8)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                    <div style={{ width: 36, height: 36, background: `${c.color}15`, border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.05rem", borderRadius: 2, flexShrink: 0 }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Space Grotesk'", fontSize: "0.83rem", fontWeight: 600, color: "#b8cec5" }}>{c.name}</div>
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.65rem", color: "#2a6040", marginTop: 2 }}>{c.org}</div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.55rem", color: c.color, border: `1px solid ${c.color}44`, padding: "2px 6px", borderRadius: 1 }}>VIEW ↗</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          
          <div>
            <Reveal><div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#2a6040", letterSpacing: "0.15em", marginBottom: "1.5rem" }}># ACHIEVEMENTS</div></Reveal>
            {[
              { code: "EVT_001", icon: "🏆", title: "Smart India Hackathon 2025", desc: "Competed at national level against thousands of teams on real government problem statements.", color: "#ffd700" },
              { code: "EVT_002", icon: "🚀", title: "Sudhee 2026 — CBIT Hackathon", desc: "Built and presented engineering solutions under tight constraints in team environment.", color: "#00d4ff" },
              { code: "EVT_003", icon: "🌐", title: "Production Cloud Deployments", desc: "Multiple live full-stack apps on cloud platforms — end-to-end ownership from dev to deploy.", color: "#00ff9d" },
            ].map((a, i) => (
              <Reveal key={a.code} delay={i * 0.1}>
                <CyberCard accent={a.color} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.9rem" }}>
                    <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{a.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.58rem", color: a.color, opacity: 0.55, marginBottom: "0.2rem" }}>{a.code}</div>
                      <h4 style={{ fontFamily: "'Orbitron'", fontSize: "0.82rem", fontWeight: 700, color: "#ddeee6", marginBottom: "0.45rem" }}>{a.title}</h4>
                      <p style={{ fontFamily: "'Space Grotesk'", fontSize: "0.78rem", color: "#5a7a70", lineHeight: 1.65 }}>{a.desc}</p>
                    </div>
                  </div>
                </CyberCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
/* CONTACT */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:seshmanuvarthi27@gmail.com?subject=Portfolio — ${form.name}&body=${form.message}%0A%0AFrom: ${form.email}`;
    setSent(true); setTimeout(() => setSent(false), 4000);
  };
  const iStyle = { width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,157,0.12)", color: "#c8d6e5", padding: "12px 16px", fontFamily: "'JetBrains Mono'", fontSize: "0.8rem", outline: "none", borderRadius: 2, transition: "border-color 0.2s, box-shadow 0.2s" };

  return (
    <section id="contact" style={{ padding: "120px 2rem", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,rgba(0,255,157,0.025) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <SectionHeader idx="// 06" title="CONTACT.SSH" sub="Open a connection" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          <Reveal>
            <div>
              <p style={{ fontFamily: "'Space Grotesk'", fontSize: "0.9rem", color: "#5a7a70", lineHeight: 1.85, marginBottom: "2.5rem" }}>
                Whether it's a project, internship, or collaboration — drop a message. Always open to interesting problems.
              </p>
              {[
                { label: "EMAIL", value: "seshmanuvarthi27@gmail.com", href: "mailto:seshmanuvarthi27@gmail.com", color: "#00ff9d" },
                { label: "PHONE", value: "+91 8897055099", href: "tel:+918897055099", color: "#00d4ff" },
                { label: "LINKEDIN", value: "seshadri-naidu-manuvarthi", href: "https://www.linkedin.com/in/seshadri-naidu-manuvarthi-366466295/", color: "#00a6e0" },
                { label: "GITHUB", value: "Seshmanuvarthi", href: "https://github.com/Seshmanuvarthi", color: "#bd00ff" },
                { label: "LEETCODE", value: "SESH_MANUVARTHI (300+)", href: "https://leetcode.com/u/SESH_MANUVARTHI/", color: "#ffd700" },
                { label: "HACKERRANK", value: "5★ Python", href: "https://www.hackerrank.com/profile/seshmanuvarthi27", color: "#00ff9d" },
              ].map(item => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.7rem", padding: "0.8rem 1.2rem", background: "rgba(10,14,20,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 2, transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}40`; e.currentTarget.style.background = `${item.color}07`; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(10,14,20,0.8)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.6rem", color: item.color, minWidth: 75, letterSpacing: "0.1em" }}>{item.label}</span>
                  <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)" }} />
                  <span style={{ fontFamily: "'Space Grotesk'", fontSize: "0.8rem", color: "#7a9a90" }}>{item.value}</span>
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <form onSubmit={submit}>
              <div style={{ background: "rgba(10,14,20,0.9)", border: "1px solid rgba(0,255,157,0.12)", borderRadius: 2, padding: "2.5rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 1, background: "linear-gradient(90deg,transparent,#00ff9d88,transparent)" }} />
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.68rem", color: "#00ff9d", letterSpacing: "0.14em", marginBottom: "2rem", opacity: 0.7 }}>
  {"// SEND_MESSAGE.POST"}
</div>
                {[{ key: "name", label: "YOUR_NAME", ph: "Seshadri Naidu" }, { key: "email", label: "EMAIL_ADDR", ph: "you@domain.com", type: "email" }].map(f => (
                  <div key={f.key} style={{ marginBottom: "1.2rem" }}>
                    <label style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#2a6040", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>{f.label} <span style={{ color: "#ff3c3c" }}>*</span></label>
                    <input type={f.type || "text"} style={iStyle} placeholder={f.ph} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                      onFocus={e => { e.target.style.borderColor = "#00ff9d44"; e.target.style.boxShadow = "0 0 12px rgba(0,255,157,0.08)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(0,255,157,0.12)"; e.target.style.boxShadow = "none"; }} />
                  </div>
                ))}
                <div style={{ marginBottom: "2rem" }}>
                  <label style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#2a6040", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>MESSAGE <span style={{ color: "#ff3c3c" }}>*</span></label>
                  <textarea rows={5} style={{ ...iStyle, resize: "vertical", lineHeight: 1.7 }} placeholder="Hello! I'd like to discuss..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required
                    onFocus={e => { e.target.style.borderColor = "#00ff9d44"; e.target.style.boxShadow = "0 0 12px rgba(0,255,157,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(0,255,157,0.12)"; e.target.style.boxShadow = "none"; }} />
                </div>
                <button type="submit"
                  style={{ width: "100%", background: sent ? "rgba(0,255,157,0.12)" : "#00ff9d", color: sent ? "#00ff9d" : "#0a0a0f", border: sent ? "1px solid #00ff9d44" : "none", padding: "14px", fontFamily: "'Orbitron'", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em", cursor: "pointer", borderRadius: 2, transition: "all 0.3s" }}
                  onMouseEnter={e => { if (!sent) e.target.style.boxShadow = "0 0 30px rgba(0,255,157,0.4)"; }}
                  onMouseLeave={e => e.target.style.boxShadow = "none"}>
                  {sent ? "[ OPENING EMAIL CLIENT... ]" : "[ TRANSMIT_MESSAGE ]"}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* FOOTER */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(0,255,157,0.08)", padding: "2.5rem", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 160, height: 1, background: "linear-gradient(90deg,transparent,#00ff9d77,transparent)" }} />
      <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: "1.05rem", color: "#00ff9d", letterSpacing: "0.2em", marginBottom: "1rem", animation: "glow 4s ease-in-out infinite" }}>SM.EXE</div>
      <p style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.65rem", color: "#1a4030", letterSpacing: "0.1em" }}>
        BUILT_WITH: React + passion + caffeine // © 2025 Seshadri Naidu Manuvarthi
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1.5rem" }}>
        {[["GITHUB","https://github.com/Seshmanuvarthi"],["LINKEDIN","https://www.linkedin.com/in/seshadri-naidu-manuvarthi-366466295/"],["LEETCODE","https://leetcode.com/u/SESH_MANUVARTHI/"],["HACKERRANK","https://www.hackerrank.com/profile/seshmanuvarthi27"]].map(([n, h]) => (
          <a key={n} href={h} target="_blank" rel="noreferrer"
            style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.6rem", color: "#1a4030", letterSpacing: "0.1em", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#00ff9d"} onMouseLeave={e => e.target.style.color = "#1a4030"}>{n}</a>
        ))}
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <GlobalStyles />
      <MatrixRain />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
