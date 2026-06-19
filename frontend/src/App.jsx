import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion, useScroll, useSpring, useMotionValue, useTransform,
  AnimatePresence, useInView as fmInView,
} from "framer-motion";

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
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

    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
    @keyframes glow{0%,100%{text-shadow:0 0 10px #00ff9d66,0 0 20px #00ff9d33}50%{text-shadow:0 0 20px #00ff9d,0 0 40px #00ff9d66,0 0 80px #00ff9d22}}
    @keyframes scanDown{0%{transform:translateY(-8px);opacity:0}50%{opacity:1}100%{transform:translateY(8px);opacity:0}}
    @keyframes float{0%,100%{transform:translateY(0px) rotate(0deg)}33%{transform:translateY(-18px) rotate(2deg)}66%{transform:translateY(-8px) rotate(-1deg)}}
    @keyframes orbitSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes glitch1{0%,100%{clip-path:inset(0 0 95% 0);transform:translate(-4px,0)}25%{clip-path:inset(30% 0 50% 0);transform:translate(4px,0)}50%{clip-path:inset(60% 0 20% 0);transform:translate(-2px,0)}75%{clip-path:inset(10% 0 80% 0);transform:translate(2px,0)}}
    @keyframes glitch2{0%,100%{clip-path:inset(80% 0 5% 0);transform:translate(4px,0)}25%{clip-path:inset(10% 0 70% 0);transform:translate(-4px,0)}50%{clip-path:inset(40% 0 40% 0);transform:translate(2px,0)}75%{clip-path:inset(70% 0 15% 0);transform:translate(-2px,0)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes borderPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,255,157,0)}50%{box-shadow:0 0 0 4px rgba(0,255,157,0.12)}}
    @keyframes flicker{0%,19%,21%,23%,25%,54%,56%,100%{opacity:1}20%,24%,55%{opacity:0.4}}

    .glitch-wrap{position:relative;display:inline-block}
    .glitch-wrap::before,.glitch-wrap::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;background:#0a0a0f}
    .glitch-wrap::before{color:#00d4ff;animation:glitch1 3.5s infinite linear;opacity:0.7}
    .glitch-wrap::after{color:#ff006e;animation:glitch2 3.5s infinite linear 0.1s;opacity:0.7}
    .glitch-wrap:hover::before,.glitch-wrap:hover::after{animation-play-state:running}
  `}</style>
);

/* ─── SCROLL PROGRESS ───────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div style={{ scaleX, position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#00ff9d,#00d4ff,#bd00ff)", transformOrigin: "0%", zIndex: 9998 }} />
  );
}

/* ─── GLITCH TEXT ───────────────────────────────────────────── */
function GlitchText({ children, style = {} }) {
  return (
    <span className="glitch-wrap" data-text={children} style={style}>
      {children}
    </span>
  );
}

/* ─── FLOATING PARTICLES ────────────────────────────────────── */
function FloatingParticles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 6,
    dur: Math.random() * 8 + 6,
    color: ["#00ff9d", "#00d4ff", "#bd00ff", "#ff006e"][Math.floor(Math.random() * 4)],
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -30, -10, -40, 0], x: [0, 10, -8, 5, 0], opacity: [0.2, 0.8, 0.4, 0.9, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: "50%",
            background: p.color, boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── ORBITING RINGS (hero decoration) ─────────────────────── */
function OrbitRings() {
  return (
    <div style={{ position: "absolute", right: "5%", top: "15%", width: 320, height: 320, pointerEvents: "none" }}>
      {[320, 240, 160].map((size, i) => (
        <motion.div
          key={size}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: size, height: size,
            marginTop: -size / 2, marginLeft: -size / 2,
            border: `1px solid rgba(0,255,157,${0.08 - i * 0.02})`,
            borderRadius: "50%",
            borderTopColor: i === 0 ? "#00ff9d55" : i === 1 ? "#00d4ff44" : "#bd00ff33",
          }}
        />
      ))}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 80, height: 80, border: "1px solid rgba(0,255,157,0.2)", borderRadius: "50%", background: "radial-gradient(circle,rgba(0,255,157,0.08),transparent)" }} />
    </div>
  );
}

/* ─── DRAMATIC REVEAL ───────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {}, from = "bottom" }) {
  const ref = useRef(null);
  const inView = fmInView(ref, { once: true, margin: "-80px" });
  const variants = {
    hidden: {
      opacity: 0,
      y: from === "bottom" ? 60 : from === "top" ? -60 : 0,
      x: from === "left" ? -80 : from === "right" ? 80 : 0,
      scale: 0.92,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)",
      transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? "visible" : "hidden"} style={style}>
      {children}
    </motion.div>
  );
}

/* ─── MATRIX RAIN ───────────────────────────────────────────── */
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

/* ─── NEURAL BG ─────────────────────────────────────────────── */
function NeuralBg() {
  const nodes = [[80,120],[80,220],[80,320],[80,420],[240,80],[240,180],[240,280],[240,380],[240,480],[400,120],[400,220],[400,320],[400,420],[560,160],[560,280],[560,400],[700,200],[700,320]];
  const edges = [[0,4],[0,5],[1,4],[1,5],[1,6],[2,5],[2,6],[2,7],[3,6],[3,7],[3,8],[4,9],[4,10],[5,9],[5,10],[5,11],[6,10],[6,11],[6,12],[7,11],[7,12],[8,12],[9,13],[9,14],[10,13],[10,14],[11,14],[11,15],[12,14],[12,15],[13,16],[13,17],[14,16],[14,17],[15,17]];
  return (
    <svg style={{ position: "absolute", right: 0, top: 0, width: "55%", height: "100%", opacity: 0.14, pointerEvents: "none" }} viewBox="0 0 780 560" preserveAspectRatio="xMidYMid meet">
      <defs><filter id="ng"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {edges.map(([a, b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#00ff9d" strokeWidth="0.5" opacity={0.2} />)}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill="none" stroke="#00ff9d" strokeWidth="1.2" filter="url(#ng)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.5 + (i % 4) * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="4;6;4" dur={`${2 + (i % 3) * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* ─── CYBER CARD (3D tilt + glow explosion) ─────────────────── */
function CyberCard({ children, accent = "#00ff9d", style = {} }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [10, -10]);
  const rotateY = useTransform(x, [-80, 80], [-10, 10]);
  const glowX = useTransform(x, [-80, 80], [0, 100]);
  const glowY = useTransform(y, [-80, 80], [0, 100]);
  const [hov, setHov] = useState(false);

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => { x.set(0); y.set(0); setHov(false); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      style={{
        rotateX, rotateY,
        transformStyle: "preserve-3d",
        position: "relative",
        background: hov ? `rgba(0,0,0,0.85)` : "rgba(10,14,20,0.85)",
        border: `1px solid ${hov ? accent + "66" : accent + "1a"}`,
        borderRadius: 2,
        padding: "1.75rem",
        boxShadow: hov ? `0 20px 60px ${accent}20, 0 0 0 1px ${accent}22, inset 0 0 40px ${accent}06` : "none",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.4s",
        ...style,
      }}
    >
      <motion.div style={{
        position: "absolute", inset: 0, borderRadius: 2, pointerEvents: "none",
        opacity: hov ? 0.12 : 0,
        background: useTransform([glowX, glowY], ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, ${accent} 0%, transparent 60%)`),
        transition: "opacity 0.3s",
      }} />
      {[["top:-1px;left:-1px;border-top:2px solid;border-left:2px solid","tl"],["top:-1px;right:-1px;border-top:2px solid;border-right:2px solid","tr"],["bottom:-1px;left:-1px;border-bottom:2px solid;border-left:2px solid","bl"],["bottom:-1px;right:-1px;border-bottom:2px solid;border-right:2px solid","br"]].map(([s, k]) => (
        <span key={k} style={{ position: "absolute", width: 14, height: 14, ...Object.fromEntries(s.split(";").map(x => { const [k2, v] = x.split(":"); return [k2.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v]; })), borderColor: accent, transition: "all 0.3s", opacity: hov ? 1 : 0.35 }} />
      ))}
      {children}
    </motion.div>
  );
}

/* ─── SECTION HEADER ────────────────────────────────────────── */
function SectionHeader({ idx, title, sub }) {
  return (
    <Reveal>
      <div style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.7rem", color: "#00ff9d", letterSpacing: "0.2em" }}>{idx}</span>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,#00ff9d55,transparent)", transformOrigin: "left" }}
          />
        </div>
        <h2 style={{ fontFamily: "'Orbitron'", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, color: "#e2ede8", letterSpacing: "0.04em" }}>{title}</h2>
        {sub && <p style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.78rem", color: "#3a7a60", marginTop: "0.5rem", letterSpacing: "0.06em" }}>{sub}</p>}
      </div>
    </Reveal>
  );
}

/* ─── TERMINAL LINE ─────────────────────────────────────────── */
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

/* ─── LIVE STATS ────────────────────────────────────────────── */
function useLiveStats() {
  const [leetcode, setLeetcode] = useState(undefined);
  const [repos, setRepos] = useState(undefined);
  useEffect(() => {
    let cancelled = false;
    const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
    withTimeout(fetch("https://leetcode-api-faisalshohag.vercel.app/SESH_MANUVARTHI").then(r => r.ok ? r.json() : Promise.reject()), 6000)
      .then(d => { if (!cancelled) setLeetcode(typeof d.totalSolved === "number" ? d.totalSolved : "300+"); })
      .catch(() => { if (!cancelled) setLeetcode("425+"); });
    withTimeout(fetch("https://api.github.com/users/Seshmanuvarthi").then(r => r.ok ? r.json() : Promise.reject()), 6000)
      .then(d => { if (!cancelled) setRepos(typeof d.public_repos === "number" ? d.public_repos : "20+"); })
      .catch(() => { if (!cancelled) setRepos("20+"); });
    return () => { cancelled = true; };
  }, []);
  return { leetcode, repos };
}

/* ─── COUNT UP ──────────────────────────────────────────────── */
function CountUp({ value }) {
  const [display, setDisplay] = useState("...");
  useEffect(() => {
    if (value === undefined || value === null) { setDisplay("..."); return; }
    const num = parseFloat(value);
    if (Number.isNaN(num)) { setDisplay(value); return; }
    const isInt = Number.isInteger(num);
    let raf;
    const duration = 1400;
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

/* ─── MAGNETIC BUTTON ───────────────────────────────────────── */
function MagneticBtn({ children, onClick, primary, href, color = "#00ff9d" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };
  const Tag = href ? "a" : "button";
  return (
    <motion.div ref={ref} style={{ x, y, display: "inline-block" }}
      onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}>
      <Tag href={href} onClick={onClick} target={href ? "_blank" : undefined} rel={href ? "noreferrer" : undefined}
        style={{
          display: "inline-block", padding: "12px 30px",
          fontFamily: "'Orbitron'", fontSize: "0.72rem", fontWeight: primary ? 700 : 600,
          letterSpacing: "0.12em", borderRadius: 2, cursor: "pointer",
          background: primary ? color : "transparent", color: primary ? "#0a0a0f" : color,
          border: primary ? "none" : `1px solid ${color}44`,
          transition: "box-shadow 0.3s, border-color 0.3s, background 0.3s",
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 40px ${color}60, 0 0 80px ${color}20`; if (!primary) { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = color + "15"; } }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; if (!primary) { e.currentTarget.style.borderColor = color + "44"; e.currentTarget.style.background = "transparent"; } }}>
        {children}
      </Tag>
    </motion.div>
  );
}

/* ─── INTERACTIVE TERMINAL ──────────────────────────────────── */
function InteractiveTerminal() {
  const [bootDone, setBootDone] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [cmdLog, setCmdLog] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setBootDone(true), 4400); return () => clearTimeout(t); }, []);
  useEffect(() => { if (bootDone && inputRef.current) inputRef.current.focus(); }, [bootDone]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history]);

  const projects = {
    honeypot: ["Adaptive Deception-Driven Cyber Resilience System","Stack: Python, Groq API (Llama-3.3-70B), Paramiko, SQLite, AWS EC2","- SSH honeypot logging real attacker sessions (5-table SQLite, 100+ patterns)","- LLM-fallback classifier, confidence-gated (>=0.75), structured JSON output","- Chaos Engine escalates response intensity on repeated attacks","github.com/RahulArra/honeypot-choas"],
    pdf: ["Transformer-Based English -> Telugu PDF Translator","Stack: Flask, Meta NLLB-200, PyMuPDF, HarfBuzz, Server-Sent Events","- Privacy-first, fully offline translation","- MPS-accelerated NLLB-200 (minutes -> seconds)","- HarfBuzz Telugu rendering + smart background sampling","github.com/Seshmanuvarthi/english-to-telugu-pdf-translator"],
    hotel: ["Hotel Inventory & Procurement Management System","Stack: MERN, JWT, Cloudinary, Brevo SMTP","- 4-role workflow (Admin / Manager / Staff / Vendor)","- JWT auth, Cloudinary uploads, automated SMTP alerts","Live: hotel-inventory-procurement-management-sr7u.onrender.com"],
    exam: ["Virtual Exam Bridge","Stack: MERN, RBAC, Session Management","- Role-based access (student / teacher portals)","- Configurable question bank with 3-level difficulty","Live: virtualexam-bridge-frontend.onrender.com"],
    civic: ["Civic Issue Reporting Mobile App","Stack: Flutter, Deep Learning, GPS","- ImageNet transfer learning classifier (88%+ validation accuracy)","- GPS auto-routes reports to nearest municipal department","github.com/SudheeHacakthon/CivicVision"],
    cti: ["Cyber Threat Intelligence Pipeline","Stack: Kafka, Spark Structured Streaming, Flink CEP, GraphX, FastAPI, React, Leaflet","- Kafka ingestion -> parallel Spark + Flink CEP consumers","- Spark: rule-based threat classification on every event","- Flink CEP: multi-event attack-pattern detection","- GraphX PageRank surfaces high-centrality threat actors","- FastAPI WebSocket -> React + Leaflet UI, animated geo-arcs every 2s","github.com/Seshmanuvarthi/cyber-threat-intelligence"],
    tcc: ["TCC Club — Members' Website","Stack: Next.js 16, TypeScript, Tailwind 4, bcrypt","- Public: menu, facilities, gallery, newsletter, payments, bookings","- Admin auth: bcrypt-hashed creds + HttpOnly signed session cookies","- On-demand menu / newsletter uploads with social-share hooks","Live: tccclub.net"],
  };

  const commands = {
    help: () => ["Available commands:","  whoami           - about me","  skills           - tech stack","  projects         - list my projects","  cat <project>    - details (e.g., cat honeypot)","  socials          - github / linkedin / leetcode / hackerrank","  resume           - open resume","  contact          - email & phone","  clear            - clear the terminal","  sudo hire-me     - ;)"],
    whoami: () => ["Manuvarthi Seshadri Naidu","B.E. Information Technology @ CBIT  |  CGPA: 9.22","Building production-grade software, ML pipelines, and cyber resilience systems."],
    skills: () => ["Languages:    Python, Java, SQL, JavaScript","AI / ML:      LLM Integration (Groq, Llama-3.3-70B), NLLB-200, Transfer Learning, MPS","Web/Backend:  MERN, REST APIs, SSE, JWT","Databases:    MongoDB, SQLite","Cloud/Tools:  AWS EC2, Render, Cloudinary, Git, Postman"],
    projects: () => ["  cti       - Cyber Threat Intelligence Pipeline (Kafka + Spark + Flink + GraphX)","  honeypot  - Adaptive Deception-Driven Cyber Resilience System","  pdf       - Transformer-Based English -> Telugu PDF Translator","  tcc       - TCC Club Members' Website (Next.js, live client work)","  hotel     - Hotel Inventory & Procurement Management System","  exam      - Virtual Exam Bridge","  civic     - Civic Issue Reporting Mobile App","Type 'cat <name>' for details (e.g., cat cti)."],
    socials: () => ["GitHub:     github.com/Seshmanuvarthi","LinkedIn:   linkedin.com/in/seshadri-naidu-manuvarthi-366466295","LeetCode:   leetcode.com/u/SESH_MANUVARTHI  (425+ solved)","HackerRank: hackerrank.com/profile/seshmanuvarthi27"],
    contact: () => ["Email: seshmanuvarthi27@gmail.com","Phone: +91 8897055099","Or scroll to the CONTACT.SSH section below."],
    resume: () => { window.open("/resume.pdf", "_blank"); return ["Opening resume.pdf in new tab..."]; },
    clear: () => { setHistory([]); return null; },
    "sudo hire-me": () => {
      setTimeout(() => { window.location.href = "mailto:seshmanuvarthi27@gmail.com?subject=Let%27s%20talk&body=Hi%20Sesh%2C"; }, 700);
      return ["[sudo] password for sesh: ****************","Access granted. Initiating outreach...",">> Launching email client. Talk soon."];
    },
  };

  const run = (raw) => {
    const t = raw.trim();
    if (!t) return;
    const next = [...history, { type: "in", text: t }];
    setCmdLog(l => [...l, t]); setHistIdx(-1);
    const lower = t.toLowerCase();
    let out;
    if (commands[lower]) { out = commands[lower](); }
    else if (lower.startsWith("cat ")) { const arg = lower.slice(4).trim(); out = projects[arg] || [`cat: ${arg}: No such project. Run 'projects' to see the list.`]; }
    else if (lower === "ls" || lower.startsWith("ls ")) { out = commands.projects(); }
    else if (lower === "pwd") { out = ["/home/sesh/portfolio"]; }
    else if (lower === "exit" || lower === "quit") { out = ["Nice try. You can't exit a portfolio."]; }
    else { out = [`bash: ${t}: command not found. Type 'help'.`]; }
    if (out === null && lower === "clear") { setHistory([]); setInput(""); return; }
    if (out) next.push(...out.map(text => ({ type: "out", text })));
    setHistory(next); setInput("");
  };

  const onKey = (e) => {
    if (e.key === "Enter") { run(input); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (cmdLog.length === 0) return; const i = histIdx === -1 ? cmdLog.length - 1 : Math.max(0, histIdx - 1); setHistIdx(i); setInput(cmdLog[i]); }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (histIdx === -1) return; const i = histIdx + 1; if (i >= cmdLog.length) { setHistIdx(-1); setInput(""); } else { setHistIdx(i); setInput(cmdLog[i]); } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => inputRef.current?.focus()}
      style={{ background: "rgba(0,0,0,0.85)", border: "1px solid rgba(0,255,157,0.45)", padding: "1.25rem 1.5rem", maxWidth: 560, borderRadius: 2, cursor: "text", boxShadow: "0 0 40px rgba(0,255,157,0.2), 0 0 100px rgba(0,255,157,0.07), inset 0 0 30px rgba(0,0,0,0.5)" }}
    >
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.9rem", alignItems: "center" }}>
        {["#ff5f56","#ffbd2e","#27c93f"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.6rem", color: "#3a6a50", marginLeft: 8 }}>seshadri@cbit:~</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, background: "rgba(0,255,157,0.14)", border: "1px solid rgba(0,255,157,0.55)", padding: "4px 12px", borderRadius: 999, boxShadow: "0 0 14px rgba(0,255,157,0.35), inset 0 0 8px rgba(0,255,157,0.08)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 8px #00ff9d, 0 0 14px #00ff9d", animation: "pulse 1.2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", fontWeight: 700, color: "#00ff9d", letterSpacing: "0.14em" }}>INTERACTIVE &mdash; TYPE 'help'</span>
        </div>
      </div>
      <TerminalLine text="whoami - Manuvarthi_Seshadri_Naidu" delay={1400} />
      <TerminalLine text="stack - MERN + ML + CyberSec" delay={2600} />
      <TerminalLine text="hint - type 'help' to explore" delay={3800} />
      {bootDone && (
        <div ref={scrollRef} style={{ maxHeight: 220, overflowY: "auto", marginTop: "0.4rem", paddingRight: 6 }}>
          {history.map((h, i) => (
            <div key={i} style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.78rem", lineHeight: 1.7, whiteSpace: "pre-wrap", color: h.type === "in" ? "#00ff9d" : "#7a9a90" }}>
              {h.type === "in" ? (<><span style={{ color: "#2a6a4a", marginRight: 8 }}>~/dev $</span>{h.text}</>) : h.text}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", fontFamily: "'JetBrains Mono'", fontSize: "0.82rem", color: "#00ff9d" }}>
            <span style={{ color: "#2a6a4a", marginRight: 8 }}>~/dev $</span>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} autoComplete="off" spellCheck={false}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#00ff9d", fontFamily: "'JetBrains Mono'", fontSize: "0.82rem", padding: 0, caretColor: "#00ff9d" }} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── NAV ───────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const links = [["01","ABOUT","about"],["02","SKILLS","skills"],["03","PROJECTS","projects"],["04","XP","experience"],["05","CERTS","achievements"],["06","CONTACT","contact"]];
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(8,10,14,0.95)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,255,157,0.08)" : "none", transition: "all 0.4s", padding: "0 2rem" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <motion.div whileHover={{ scale: 1.08, textShadow: "0 0 30px #00ff9d" }} style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: "1.05rem", color: "#00ff9d", letterSpacing: "0.2em", animation: "glow 4s ease-in-out infinite", cursor: "pointer" }}>
          SM<span style={{ color: "rgba(0,255,157,0.25)" }}>.EXE</span>
        </motion.div>
        <div style={{ display: "flex", gap: "0.2rem" }}>
          {links.map(([num, label, id], i) => (
            <motion.button key={id}
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ color: "#00ff9d", y: -2, scale: 1.05 }}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#3a6a50", padding: "6px 12px", letterSpacing: "0.1em", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: "0.5rem", opacity: 0.45 }}>{num}</span>{label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

/* ─── HERO ──────────────────────────────────────────────────── */
const roles = ["Full-Stack Developer","ML Engineer","DL Enthusiast","Cyber Researcher","MERN Stack Dev","AI Integrations Dev"];

function Hero() {
  const [typed, setTyped] = useState("");
  const [ri, setRi] = useState(0);
  const [erasing, setErasing] = useState(false);
  const { leetcode, repos } = useLiveStats();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const cur = roles[ri]; let i = erasing ? cur.length : 0;
    const id = setInterval(() => {
      if (!erasing) { i++; setTyped(cur.slice(0, i)); if (i >= cur.length) { clearInterval(id); setTimeout(() => setErasing(true), 1600); } }
      else { i--; setTyped(cur.slice(0, i)); if (i <= 0) { clearInterval(id); setErasing(false); setRi(r => (r + 1) % roles.length); } }
    }, erasing ? 38 : 72);
    return () => clearInterval(id);
  }, [ri, erasing]);

  return (
    <section id="about" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 64 }}>
      <NeuralBg />
      <FloatingParticles />
      <OrbitRings />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,157,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,157,0.025) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
      <motion.div style={{ position: "absolute", top: "25%", left: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,255,157,0.05) 0%,transparent 65%)", pointerEvents: "none", y: heroY }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 2rem 160px", position: "relative", zIndex: 1, width: "100%" }}>

        {/* Text content fades on scroll */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>

          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem", background: "rgba(0,255,157,0.06)", border: "1px solid rgba(0,255,157,0.18)", borderRadius: 2, padding: "5px 16px", marginBottom: "2rem", animation: "borderPulse 3s ease-in-out infinite" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 10px #00ff9d", animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.68rem", color: "#00ff9d", letterSpacing: "0.18em" }}>SYSTEM_ONLINE // AVAILABLE_FOR_HIRE</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
            <h1 style={{ fontFamily: "'Orbitron'", lineHeight: 1.05, letterSpacing: "0.03em" }}>
              <span style={{ display: "block", fontSize: "clamp(1rem,2.5vw,1.4rem)", color: "rgba(0,255,157,0.4)", fontWeight: 400, marginBottom: "0.3rem" }}>INITIALIZING //</span>
              <GlitchText style={{ display: "block", fontSize: "clamp(2.8rem,7vw,5.8rem)", fontWeight: 900, color: "#ddeee6" }}>MANUVARTHI</GlitchText>
              <span style={{ display: "block", fontSize: "clamp(2.8rem,7vw,5.8rem)", fontWeight: 900, background: "linear-gradient(90deg,#00ff9d,#00d4ff 60%,#bd00ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shimmer 4s linear infinite" }}>SESHADRI NAIDU</span>
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: "1.5rem", height: 34, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.78rem", color: "rgba(0,255,157,0.4)" }}>&gt;&gt;</span>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "clamp(0.85rem,2vw,1.1rem)", color: "#3a9a70" }}>{typed}</span>
            <span style={{ animation: "blink 0.75s infinite", color: "#00ff9d", fontFamily: "'JetBrains Mono'" }}>▋</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: "1.75rem", maxWidth: 560, borderLeft: "3px solid #00ff9d", paddingLeft: "1.25rem", background: "rgba(0,0,0,0.35)" }}>
            <p style={{ fontFamily: "'Space Grotesk'", fontSize: "0.92rem", color: "#7a9e90", lineHeight: 1.85, padding: "1rem 0 1rem 0.25rem" }}>
              IT undergraduate at <span style={{ color: "#00ff9d", fontWeight: 600 }}>CBIT</span> with{" "}
              <span style={{ fontFamily: "'JetBrains Mono'", color: "#00d4ff" }}>9.22 CGPA</span>.
              Building production-grade apps, architecting ML/DL pipelines, and researching cyber resilience systems.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
            style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <MagneticBtn primary onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>VIEW_PROJECTS</MagneticBtn>
            <MagneticBtn href="https://github.com/Seshmanuvarthi" color="#00d4ff">GITHUB ↗</MagneticBtn>
            <MagneticBtn href="https://www.linkedin.com/in/seshadri-naidu-manuvarthi-366466295/" color="#bd00ff">LINKEDIN ↗</MagneticBtn>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
            style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", maxWidth: 520, background: "rgba(0,255,157,0.04)", border: "1px solid rgba(0,255,157,0.12)", gap: "1px" }}>
            {[{ v: 9.22, l: "CGPA", live: false },{ v: leetcode, l: "LEETCODE", live: typeof leetcode === "number" },{ v: repos, l: "GITHUB REPOS", live: typeof repos === "number" },{ v: 5, l: "CERTS", live: false }].map(({ v, l, live }) => (
              <motion.div key={l} whileHover={{ scale: 1.05, background: "rgba(0,255,157,0.08)" }} style={{ background: "#0a0a0f", padding: "1.2rem 0.75rem", textAlign: "center", position: "relative", transition: "background 0.3s" }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: "1.45rem", fontWeight: 700, color: "#00ff9d", animation: "glow 3s ease-in-out infinite" }}><CountUp value={v} /></div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.58rem", color: "#2a6040", marginTop: 4, letterSpacing: "0.08em" }}>{l}</div>
                {live && <span title="live" style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 8px #00ff9d", animation: "pulse 1.4s infinite" }} />}
              </motion.div>
            ))}
          </motion.div>

        </motion.div>

        {/* Terminal always full brightness — outside the fading wrapper */}
        <InteractiveTerminal />

      </div>

      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.45 }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.58rem", color: "#2a6040", letterSpacing: "0.2em" }}>SCROLL.DOWN</span>
        <div style={{ width: 1, height: 36, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", width: "100%", height: "100%", background: "linear-gradient(transparent,#00ff9d)", animation: "scanDown 1.8s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

/* ─── SKILLS ────────────────────────────────────────────────── */
function Skills() {
  const [tab, setTab] = useState(0);
  const tabs = [
    { label: "LANGUAGES", color: "#00ff9d", items: [{ n: "Python", v: 88 },{ n: "JavaScript", v: 80 },{ n: "Java", v: 73 },{ n: "SQL", v: 81 }] },
    { label: "WEB/MERN", color: "#00d4ff", items: [{ n: "React.js", v: 88 },{ n: "Node.js", v: 78 },{ n: "Express.js", v: 72 },{ n: "MongoDB", v: 80 },{ n: "HTML/CSS", v: 92 }] },
    { label: "ML / DL", color: "#bd00ff", items: [{ n: "Deep Learning", v: 72 },{ n: "Image Classification", v: 70 },{ n: "AI Integration", v: 75 }] },
    { label: "SECURITY", color: "#ff3c3c", items: [{ n: "SSH Honeypot", v: 76 },{ n: "Threat Classification", v: 70 },{ n: "Chaos Engineering", v: 65 },{ n: "SQLite Forensics", v: 78 }] },
    { label: "CLOUD/TOOLS", color: "#ffd700", items: [{ n: "Git", v: 88 },{ n: "AWS EC2", v: 65 },{ n: "Cloudinary", v: 80 },{ n: "REST APIs", v: 90 },{ n: "Postman", v: 85 }] },
  ];
  const t = tabs[tab];
  const allTags = ["Python","JavaScript","Java","SQL","React.js","Node.js","Express.js","MongoDB","Flutter","Deep Learning","Transfer Learning","Image Classification","SSH Honeypot","AWS EC2","Paramiko","SQLite","REST APIs","Git","Cloudinary","JWT","MERN Stack","Postman","ImageNet","HTML/CSS"];

  return (
    <section id="skills" style={{ padding: "120px 2rem", position: "relative" }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "35%", background: "radial-gradient(circle at right,rgba(189,0,255,0.05),transparent)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader idx={"// 02"} title="SKILLS.EXE" sub="Technical proficiency matrix" />
        <Reveal>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {tabs.map((tb, i) => (
              <motion.button key={tb.label} onClick={() => setTab(i)}
                whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
                style={{ background: tab === i ? `${tb.color}18` : "transparent", border: `1px solid ${tab === i ? tb.color + "66" : "rgba(255,255,255,0.08)"}`, color: tab === i ? tb.color : "#3a6a50", padding: "7px 18px", fontFamily: "'JetBrains Mono'", fontSize: "0.68rem", letterSpacing: "0.1em", cursor: "pointer", borderRadius: 2, transition: "all 0.3s", boxShadow: tab === i ? `0 0 25px ${tb.color}30, 0 0 50px ${tb.color}10` : "none" }}>
                {tb.label}
              </motion.button>
            ))}
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 30, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              {t.items.map((item, i) => (
                <Reveal key={item.n} delay={i * 0.06}>
                  <div style={{ marginBottom: "1.6rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.8rem", color: "#b8cec5" }}>{item.n}</span>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.7rem", color: t.color }}>{item.v}%</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.v}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: "100%", background: `linear-gradient(90deg,${t.color},${t.color}88)`, borderRadius: 2, boxShadow: `0 0 12px ${t.color}66, 0 0 24px ${t.color}22`, position: "relative" }}>
                        <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%", background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </motion.div>
          </AnimatePresence>
          <Reveal delay={0.2} from="right">
            <CyberCard accent={t.color}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: t.color, letterSpacing: "0.15em", marginBottom: "1.25rem", opacity: 0.8 }}>FULL_TECH_STACK</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
                {allTags.map((tag, i) => (
                  <motion.span key={tag}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, ease: "easeOut" }}
                    whileHover={{ color: "#00ff9d", borderColor: "rgba(0,255,157,0.5)", background: "rgba(0,255,157,0.1)", scale: 1.08, y: -2 }}
                    style={{ background: "rgba(0,255,157,0.04)", border: "1px solid rgba(0,255,157,0.1)", color: "#6a9080", padding: "4px 12px", fontFamily: "'JetBrains Mono'", fontSize: "0.68rem", borderRadius: 2, cursor: "default", display: "inline-block" }}>
                    {tag}
                  </motion.span>
                ))}
              </div>
            </CyberCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ──────────────────────────────────────────────── */
function Projects() {
  const projects = [
    { code: "PRJ_001", title: "Hotel Inventory & Procurement", tag: "FULL-STACK", accent: "#00d4ff", stack: ["MERN","JWT","Cloudinary","Brevo SMTP"], desc: "Full-stack hotel operations platform with multi-role authentication and real-time stock dashboards.", bullets: ["Multi-role auth: Admin, Manager, Staff","JWT + Cloudinary bill uploads","Brevo SMTP automated alerts","Real-time procurement dashboards"], live: "https://hotel-inventory-procurement-management-sr7u.onrender.com", github: "https://github.com/Seshmanuvarthi/Hotel-Inventory-Procurement-Management-System" },
    { code: "PRJ_002", title: "Virtual Exam Bridge", tag: "FULL-STACK", accent: "#00ff9d", stack: ["MERN","RBAC","Session Mgmt"], desc: "Secure internal examination system with role-based access and configurable question banks.", bullets: ["Role-based access: students & teachers","Configurable question bank + difficulty levels","Real-time submission tracking","Secure session management"], live: "https://virtualexam-bridge-frontend.onrender.com", github: "https://github.com/ExamBridge-System/virtualexam_bridge" },
    { code: "PRJ_003", title: "CDC Placements Portal", tag: "AI-POWERED", accent: "#bd00ff", stack: ["MERN","AI APIs","Email Auto","Data Viz"], desc: "AI-powered campus placement management with resume generation and recruitment dashboards.", bullets: ["AI-powered resume generation","Job filtering & management","Automated email notifications","Data visualization dashboards"], github: "https://github.com/Seshmanuvarthi/Placement_Portal" },
    { code: "PRJ_004", title: "Cyber Resilience Validation", tag: "SECURITY", accent: "#ff3c3c", stack: ["Python","SQLite","Paramiko","AWS EC2"], desc: "SSH honeypot logging real attacker sessions with AI classification and a chaos stress-testing engine.", bullets: ["SSH honeypot — 5-table SQLite logging","AI: Recon, Privesc, Lateral, Persistence","Chaos Engine stress-tests on threat","Mirrors real SOC response workflows"], github: "https://github.com/Seshmanuvarthi" },
    { code: "PRJ_005", title: "Civic Issue Reporting App", tag: "MOBILE + DL", accent: "#ffd700", stack: ["Flutter","Deep Learning","GPS","ImageNet"], desc: "Flutter mobile app with AI image classification and GPS routing to auto-report civic issues.", bullets: ["ImageNet transfer learning classifier","Detects garbage, road damage, streetlights","GPS auto-routes to nearest municipal dept","Real-time issue tracking"], github: "https://github.com/SudheeHacakthon/CivicVision/tree/integration-demo" },
    { code: "PRJ_006", title: "PDF Translator — English to Telugu", tag: "AI + NLP", accent: "#ff9d00", stack: ["Flask","PyMuPDF","NLLB-200","HarfBuzz","SSE"], desc: "Privacy-first offline PDF translator that converts English documents to Telugu while preserving layout.", bullets: ["Fully offline AI translation via Meta's NLLB-200","Real-time progress streaming via SSE","HarfBuzz complex shaping for Telugu script","Apple Silicon MPS acceleration"], github: "https://github.com/Seshmanuvarthi/english-to-telugu-pdf-translator" },
    { code: "PRJ_007", title: "Cyber Threat Intelligence Pipeline", tag: "BIG DATA + CYBER", accent: "#ff006e", stack: ["Kafka","Spark","Flink CEP","GraphX","FastAPI","React","Leaflet"], desc: "Real-time big-data pipeline that classifies threats and pushes a live world map to React every 2 seconds.", bullets: ["Kafka → parallel Spark + Flink CEP consumers","Spark Structured Streaming threat classification","GraphX PageRank surfaces high-risk actors","Animated geo-arcs on live world map"], github: "https://github.com/Seshmanuvarthi/cyber-threat-intelligence" },
    { code: "PRJ_008", title: "TCC Club — Members' Website", tag: "CLIENT WORK", accent: "#38bdf8", stack: ["Next.js 16","TypeScript","Tailwind 4","bcrypt"], desc: "Production members' website for the Telangana Contractors Cultural Club with secured admin panel.", bullets: ["Public pages: menu, gallery, newsletter, bookings","Admin auth: bcrypt + HttpOnly signed cookies","On-demand uploads with social-share hooks","Deployed live on Vercel"], live: "https://tccclub.net", github: "https://github.com/Seshmanuvarthi/tcc-club" },
  ];

  const ref = useRef(null);
  const inView = fmInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" style={{ padding: "120px 2rem", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: "10%", width: "40%", height: "80%", background: "radial-gradient(circle at left,rgba(0,212,255,0.03),transparent)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader idx="// 03" title="PROJECTS.DB" sub="Production-grade builds" />
        <motion.div ref={ref}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: "1.5rem" }}>
          {projects.map(p => (
            <motion.div key={p.code}
              variants={{ hidden: { opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}>
              <CyberCard accent={p.accent} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.6rem", color: p.accent, opacity: 0.6 }}>{p.code}</span>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {p.live && <motion.a href={p.live} target="_blank" rel="noreferrer" whileHover={{ color: p.accent, scale: 1.1 }} style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#3a6a50" }}>LIVE ↗</motion.a>}
                    <motion.a href={p.github} target="_blank" rel="noreferrer" whileHover={{ color: p.accent, scale: 1.1 }} style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#3a6a50" }}>GIT ↗</motion.a>
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── EXPERIENCE ────────────────────────────────────────────── */
function Experience() {
  return (
    <section id="experience" style={{ padding: "120px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader idx="// 04" title="EXPERIENCE.LOG" sub="Career & education timeline" />
        <div style={{ position: "relative", paddingLeft: "2.5rem" }}>
          <motion.div
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "linear-gradient(#00ff9d44,#00d4ff44,rgba(189,0,255,0.3),transparent)", transformOrigin: "top" }}
          />
          {[
            { type: "INCOMING · INTERNSHIP", color: "#00ff9d", period: "Jul 2026 — Jun 2027", title: "Software Engineer Intern / Trainee", org: "The Hartford — Hyderabad, India", sub: "12-month enterprise SDE internship · Property & Casualty insurance, employee benefits, mutual funds", content: { grid: true, items: ["Java / Python / JavaScript stack with React frontends","SQL relational data modelling + Git version control","Agile ceremonies: stand-ups, sprint planning, retrospectives","Cross-functional collaboration: product, design, QA","Security-aware coding under senior engineer mentorship","AWS / Azure cloud and CI/CD pipeline exposure"] } },
            { type: "EDUCATION", color: "#00d4ff", period: "2023 — May 2027", title: "B.E. Information Technology", org: "Chaitanya Bharathi Institute of Technology", sub: "CGPA: 9.22 / 10.0", content: { tags: true, items: ["DSA","OOP","DBMS","OS","Computer Networks","Machine Learning","Deep Learning","Big Data Analytics"] } },
          ].map((item, i) => (
            <Reveal key={item.type} delay={i * 0.15}>
              <div style={{ position: "relative", marginBottom: "2.5rem" }}>
                <motion.div
                  animate={{ boxShadow: [`0 0 10px ${item.color}`, `0 0 30px ${item.color}88`, `0 0 10px ${item.color}`] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
                  style={{ position: "absolute", left: "-2.85rem", top: 10, width: 10, height: 10, borderRadius: "50%", background: item.color }}
                />
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

/* ─── ACHIEVEMENTS ──────────────────────────────────────────── */
function Achievements() {
  const certifications = [
    { icon: "☁", name: "Microsoft Azure Fundamentals", org: "Microsoft", color: "#00d4ff", link: "https://drive.google.com/file/d/1Uj9T80eRGSfT8G-HdICgMUi--92Ffz_9/view?usp=share_link" },
    { icon: "🤖", name: "Salesforce AI Associate", org: "Salesforce", color: "#00a6e0", link: "https://drive.google.com/file/d/12eKyzIrdg2E9JL7Ei6M3PfhkW0PfKh1l/view?usp=sharing" },
    { icon: "⚡", name: "Agentforce Specialist", org: "Salesforce", color: "#bd00ff", link: "https://drive.google.com/file/d/1ig8ZAgni9Ml1-eQw-yYwkyeQZiyzHk-t/view?usp=share_link" },
    { icon: "🐍", name: "Joy of Computing with Python", org: "NPTEL / IIT Madras", color: "#00ff9d", link: "https://drive.google.com/file/d/1ig8ZAgni9Ml1-eQw-yYwkyeQZiyzHk-t/view?usp=share_link" },
    { icon: "💡", name: "LeetCode 300+ Solved", org: "LeetCode", color: "#ffd700", link: "https://leetcode.com/u/SESH_MANUVARTHI/" },
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
                <motion.a href={c.link} target="_blank" rel="noreferrer" whileHover={{ x: 8, scale: 1.01 }} style={{ display: "block", textDecoration: "none", marginBottom: "0.8rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(10,14,20,0.8)", border: `1px solid ${c.color}18`, padding: "1rem 1.25rem", borderRadius: 2, transition: "all 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.color}55`; e.currentTarget.style.background = `${c.color}08`; e.currentTarget.style.boxShadow = `0 0 25px ${c.color}15`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.color}18`; e.currentTarget.style.background = "rgba(10,14,20,0.8)"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ width: 36, height: 36, background: `${c.color}15`, border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.05rem", borderRadius: 2, flexShrink: 0 }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Space Grotesk'", fontSize: "0.83rem", fontWeight: 600, color: "#b8cec5" }}>{c.name}</div>
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.65rem", color: "#2a6040", marginTop: 2 }}>{c.org}</div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.55rem", color: c.color, border: `1px solid ${c.color}44`, padding: "2px 6px", borderRadius: 1 }}>VIEW ↗</div>
                  </div>
                </motion.a>
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
              <Reveal key={a.code} delay={i * 0.1} from={i % 2 === 0 ? "right" : "bottom"}>
                <CyberCard accent={a.color} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.9rem" }}>
                    <motion.span animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1 }} style={{ fontSize: "1.4rem", flexShrink: 0, display: "inline-block" }}>{a.icon}</motion.span>
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

/* ─── CONTACT ───────────────────────────────────────────────── */
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
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,rgba(0,255,157,0.03) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <SectionHeader idx="// 06" title="CONTACT.SSH" sub="Open a connection" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          <Reveal from="left">
            <p style={{ fontFamily: "'Space Grotesk'", fontSize: "0.9rem", color: "#5a7a70", lineHeight: 1.85, marginBottom: "2.5rem" }}>
              Whether it's a project, internship, or collaboration — drop a message. Always open to interesting problems.
            </p>
            {[
              { label: "EMAIL", value: "seshmanuvarthi27@gmail.com", href: "mailto:seshmanuvarthi27@gmail.com", color: "#00ff9d" },
              { label: "PHONE", value: "+91 8897055099", href: "tel:+918897055099", color: "#00d4ff" },
              { label: "LINKEDIN", value: "seshadri-naidu-manuvarthi", href: "https://www.linkedin.com/in/seshadri-naidu-manuvarthi-366466295/", color: "#00a6e0" },
              { label: "GITHUB", value: "Seshmanuvarthi", href: "https://github.com/Seshmanuvarthi", color: "#bd00ff" },
              { label: "LEETCODE", value: "SESH_MANUVARTHI (425+)", href: "https://leetcode.com/u/SESH_MANUVARTHI/", color: "#ffd700" },
              { label: "HACKERRANK", value: "5★ Python", href: "https://www.hackerrank.com/profile/seshmanuvarthi27", color: "#00ff9d" },
            ].map(item => (
              <motion.a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                whileHover={{ x: 8, boxShadow: `0 0 25px ${item.color}20` }}
                style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.7rem", padding: "0.8rem 1.2rem", background: "rgba(10,14,20,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 2, transition: "border-color 0.3s, background 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}44`; e.currentTarget.style.background = `${item.color}08`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(10,14,20,0.8)"; }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.6rem", color: item.color, minWidth: 75, letterSpacing: "0.1em" }}>{item.label}</span>
                <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)" }} />
                <span style={{ fontFamily: "'Space Grotesk'", fontSize: "0.8rem", color: "#7a9a90" }}>{item.value}</span>
              </motion.a>
            ))}
          </Reveal>
          <Reveal delay={0.15} from="right">
            <form onSubmit={submit}>
              <div style={{ background: "rgba(10,14,20,0.9)", border: "1px solid rgba(0,255,157,0.12)", borderRadius: 2, padding: "2.5rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 1, background: "linear-gradient(90deg,transparent,#00ff9d88,transparent)" }} />
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.68rem", color: "#00ff9d", letterSpacing: "0.14em", marginBottom: "2rem", opacity: 0.7 }}>{"// SEND_MESSAGE.POST"}</div>
                {[{ key: "name", label: "YOUR_NAME", ph: "Seshadri Naidu" },{ key: "email", label: "EMAIL_ADDR", ph: "you@domain.com", type: "email" }].map(f => (
                  <div key={f.key} style={{ marginBottom: "1.2rem" }}>
                    <label style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#2a6040", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>{f.label} <span style={{ color: "#ff3c3c" }}>*</span></label>
                    <input type={f.type || "text"} style={iStyle} placeholder={f.ph} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                      onFocus={e => { e.target.style.borderColor = "#00ff9d55"; e.target.style.boxShadow = "0 0 20px rgba(0,255,157,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(0,255,157,0.12)"; e.target.style.boxShadow = "none"; }} />
                  </div>
                ))}
                <div style={{ marginBottom: "2rem" }}>
                  <label style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.62rem", color: "#2a6040", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>MESSAGE <span style={{ color: "#ff3c3c" }}>*</span></label>
                  <textarea rows={5} style={{ ...iStyle, resize: "vertical", lineHeight: 1.7 }} placeholder="Hello! I'd like to discuss..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required
                    onFocus={e => { e.target.style.borderColor = "#00ff9d55"; e.target.style.boxShadow = "0 0 20px rgba(0,255,157,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(0,255,157,0.12)"; e.target.style.boxShadow = "none"; }} />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(0,255,157,0.5), 0 0 80px rgba(0,255,157,0.15)" }} whileTap={{ scale: 0.96 }}
                  style={{ width: "100%", background: sent ? "rgba(0,255,157,0.12)" : "#00ff9d", color: sent ? "#00ff9d" : "#0a0a0f", border: sent ? "1px solid #00ff9d44" : "none", padding: "14px", fontFamily: "'Orbitron'", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em", cursor: "pointer", borderRadius: 2, transition: "background 0.3s, color 0.3s" }}>
                  {sent ? "[ OPENING EMAIL CLIENT... ]" : "[ TRANSMIT_MESSAGE ]"}
                </motion.button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(0,255,157,0.08)", padding: "2.5rem", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 160, height: 1, background: "linear-gradient(90deg,transparent,#00ff9d77,transparent)" }} />
      <motion.div whileHover={{ scale: 1.1, textShadow: "0 0 40px #00ff9d" }} style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: "1.05rem", color: "#00ff9d", letterSpacing: "0.2em", marginBottom: "1rem", animation: "glow 4s ease-in-out infinite", cursor: "default", display: "inline-block" }}>SM.EXE</motion.div>
      <p style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.65rem", color: "#1a4030", letterSpacing: "0.1em" }}>BUILT_WITH: React + Framer Motion + passion // © 2025 Seshadri Naidu Manuvarthi</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1.5rem" }}>
        {[["GITHUB","https://github.com/Seshmanuvarthi"],["LINKEDIN","https://www.linkedin.com/in/seshadri-naidu-manuvarthi-366466295/"],["LEETCODE","https://leetcode.com/u/SESH_MANUVARTHI/"],["HACKERRANK","https://www.hackerrank.com/profile/seshmanuvarthi27"]].map(([n, h]) => (
          <motion.a key={n} href={h} target="_blank" rel="noreferrer" whileHover={{ color: "#00ff9d", y: -3, scale: 1.05 }} style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.6rem", color: "#1a4030", letterSpacing: "0.1em" }}>{n}</motion.a>
        ))}
      </div>
    </footer>
  );
}

/* ─── APP ───────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <GlobalStyles />
      <ScrollProgress />
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
