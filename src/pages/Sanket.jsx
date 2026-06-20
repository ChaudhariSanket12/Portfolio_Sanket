import { useState, useEffect, useRef } from "react";

// ── BIKE INTRO ANIMATION ──────────────────────────────────────────────────────
function BikeIntro({ onDone }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    frame: 0,
    bikeX: -200,
    phase: "ride-in",
    skidX: 0,
    skidLen: 0,
    opacity: 1,
    textAlpha: 0,
    textScale: 0.6,
    sparks: [],
    exhaustPuffs: [],
    stars: Array.from({ length: 80 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 400,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
    })),
    roadDashes: Array.from({ length: 12 }, (_, i) => ({ x: i * 130 })),
    wheelAngle: 0,
    shakeX: 0,
    shakeY: 0,
  });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const DPR = window.devicePixelRatio || 1;
    const W = (canvas.width = canvas.offsetWidth * DPR);
    const H = (canvas.height = canvas.offsetHeight * DPR);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    const ctx = canvas.getContext("2d");
    ctx.scale(DPR, DPR);
    const CW = W / DPR,
      CH = H / DPR;
    const groundY = CH * 0.72;
    const centerX = CW / 2;

    function drawSky() {
      const grd = ctx.createLinearGradient(0, 0, 0, groundY);
      grd.addColorStop(0, "#02010a");
      grd.addColorStop(1, "#0d0520");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, CW, groundY);
    }

    function drawStars(s) {
      s.stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(
          star.x - s.frame * star.speed * 0.5,
          star.y,
          star.r,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.sin(s.frame * 0.05 + star.x) * 0.3})`;
        ctx.fill();
      });
    }

    function drawMoon() {
      ctx.save();
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(CW * 0.82, CH * 0.12, 28, 0, Math.PI * 2);
      ctx.fillStyle = "#fde68a";
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(CW * 0.82 + 10, CH * 0.12 - 4, 22, 0, Math.PI * 2);
      ctx.fillStyle = "#0d0520";
      ctx.fill();
    }

    function drawGround() {
      ctx.fillStyle = "#0f0a1e";
      ctx.fillRect(0, groundY, CW, CH - groundY);
      ctx.strokeStyle = "#1e1040";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(CW, groundY);
      ctx.stroke();
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 1.5);
      ctx.lineTo(CW, groundY + 1.5);
      ctx.stroke();
    }

    function drawRoadDashes(s, speed) {
      s.roadDashes.forEach((d) => {
        d.x -= speed;
        if (d.x < -120) d.x = CW + 10;
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(d.x, groundY + 10, 80, 4);
      });
    }

    function drawExhaustPuffs(s) {
      s.exhaustPuffs = s.exhaustPuffs.filter((p) => p.life > 0);
      s.exhaustPuffs.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,120,60,${p.life * 0.018})`;
        ctx.fill();
        p.x -= 2.5;
        p.y -= 0.6;
        p.r += 0.7;
        p.life--;
      });
    }

    function spawnPuff(s, bx) {
      s.exhaustPuffs.push({ x: bx - 60, y: groundY - 28, r: 6, life: 30 });
    }

    function drawSparks(s) {
      s.sparks = s.sparks.filter((sp) => sp.life > 0);
      s.sparks.forEach((sp) => {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sp.color},${sp.life * 0.04})`;
        ctx.fill();
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.15;
        sp.life--;
        sp.r *= 0.92;
      });
    }

    function spawnSparks(s, bx) {
      for (let i = 0; i < 8; i++) {
        const ang = Math.PI + (Math.random() - 0.5) * 1.2;
        const spd = Math.random() * 4 + 1;
        s.sparks.push({
          x: bx - 20,
          y: groundY - 4,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1,
          r: Math.random() * 3 + 1,
          life: 25,
          color: Math.random() > 0.5 ? "249,115,22" : "251,191,36",
        });
      }
    }

    function drawSkidMark(s) {
      if (s.skidLen <= 0) return;
      ctx.save();
      ctx.strokeStyle = "rgba(249,115,22,0.35)";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(s.skidX, groundY + 2);
      ctx.lineTo(s.skidX + s.skidLen, groundY + 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(s.skidX, groundY + 2);
      ctx.lineTo(s.skidX + s.skidLen, groundY + 2);
      ctx.stroke();
      ctx.restore();
    }

    function drawBike(bx, wheelAngle, tiltDeg) {
      ctx.save();
      ctx.translate(bx, groundY);
      ctx.rotate((tiltDeg * Math.PI) / 180);
      ctx.save();
      ctx.scale(1, 0.25);
      ctx.beginPath();
      ctx.arc(0, 0, 55, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(249,115,22,0.10)";
      ctx.fill();
      ctx.restore();

      const drawWheel = (wx, wy, wr) => {
        ctx.save();
        ctx.translate(wx, wy);
        ctx.beginPath();
        ctx.arc(0, 0, wr, 0, Math.PI * 2);
        ctx.strokeStyle = "#2a2a3e";
        ctx.lineWidth = 9;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, wr * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 2;
        ctx.stroke();
        for (let i = 0; i < 6; i++) {
          const a = wheelAngle + (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6);
          ctx.lineTo(Math.cos(a) * (wr * 0.68), Math.sin(a) * (wr * 0.68));
          ctx.strokeStyle = "#555";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#f97316";
        ctx.fill();
        ctx.restore();
      };

      drawWheel(-55, 0, 36);
      drawWheel(55, 0, 36);
      ctx.beginPath();
      ctx.ellipse(-20, 0, 18, 7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-55, 0);
      ctx.lineTo(-10, -75);
      ctx.lineTo(55, -60);
      ctx.lineTo(35, -30);
      ctx.lineTo(10, 0);
      ctx.closePath();
      ctx.fillStyle = "#13131f";
      ctx.fill();
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-20, -78, 70, 10, 5);
      ctx.fillStyle = "#1e1e30";
      ctx.fill();
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(15, -52, 32, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#0f0f1a";
      ctx.fill();
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-20, -38, 48, 28, 4);
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-20, -18);
      ctx.quadraticCurveTo(-48, -10, -60, 0);
      ctx.strokeStyle = "#777";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(35, -30);
      ctx.lineTo(55, 0);
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(25, -72);
      ctx.lineTo(48, -68);
      ctx.lineTo(48, -55);
      ctx.strokeStyle = "#777";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(62, -40, 11, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(62, -40, 7, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,220,0.8)";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(72, -40);
      ctx.lineTo(CW - bx + 60, -40 + (CW - bx) * 0.05);
      ctx.lineTo(CW - bx + 60, -40 - (CW - bx) * 0.05);
      ctx.closePath();
      ctx.fillStyle = "rgba(251,191,36,0.04)";
      ctx.fill();
      ctx.save();
      ctx.translate(-2, -78);
      ctx.beginPath();
      ctx.roundRect(-8, -38, 22, 38, 6);
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, -44, 18, 0, Math.PI * 2);
      ctx.fillStyle = "#f97316";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, -44, 18, 0, Math.PI * 2);
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, -42, 10, -0.4, 0.5);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, -26);
      ctx.lineTo(10, -26);
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, -28);
      ctx.quadraticCurveTo(26, -24, 36, -68);
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.lineTo(6, 20);
      ctx.lineTo(18, 18);
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();
      ctx.restore();
    }

    function drawNameReveal(s) {
      const alpha = s.textAlpha;
      const sc = s.textScale;
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(centerX + s.shakeX, CH * 0.38 + s.shakeY);
      ctx.scale(sc, sc);
      ctx.font = `900 ${Math.round(CW * 0.092)}px Barlow Condensed, Impact, Arial Black, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("SANKET", 0, 0);
      ctx.font = `900 ${Math.round(CW * 0.06)}px Barlow Condensed, Impact, Arial Black, sans-serif`;
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.strokeText("CHAUDHARI", 0, Math.round(CW * 0.072));
      ctx.fillStyle = "transparent";
      ctx.fillText("CHAUDHARI", 0, Math.round(CW * 0.072));
      if (alpha > 0.7) {
        ctx.globalAlpha = alpha * ((alpha - 0.7) / 0.3);
        ctx.font = `500 ${Math.round(CW * 0.018)}px Inter, sans-serif`;
        ctx.fillStyle = "#f97316";
        ctx.fillText(
          "FULL-STACK DEVELOPER  ·  BIKER  ·  BUILDER",
          0,
          Math.round(CW * 0.072) + 36,
        );
      }
      ctx.restore();
    }

    function drawSkipHint(s) {
      if (s.phase === "done") return;
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.font = "13px Inter, sans-serif";
      ctx.fillStyle = "#aaa";
      ctx.textAlign = "right";
      ctx.fillText("TAP TO SKIP →", CW - 20, CH - 18);
      ctx.restore();
    }

    function tick() {
      const s = stateRef.current;
      s.frame++;
      ctx.clearRect(0, 0, CW, CH);
      drawSky();
      drawStars(s);
      drawMoon();
      drawGround();
      let speed = 0,
        tilt = 0;

      if (s.phase === "ride-in") {
        speed = 9;
        s.bikeX += speed;
        s.wheelAngle += speed / 36;
        drawRoadDashes(s, speed);
        if (s.frame % 3 === 0) spawnPuff(s, s.bikeX);
        if (s.bikeX >= centerX - 10) {
          s.phase = "brake";
          s.skidX = s.bikeX - 20;
        }
      } else if (s.phase === "brake") {
        speed = Math.max(0, 9 - (s.frame % 60) * 0.4);
        s.bikeX = Math.min(centerX, s.bikeX + speed);
        s.wheelAngle += speed / 36;
        s.skidLen = centerX - s.skidX;
        if (s.frame % 2 === 0 && speed > 1) spawnSparks(s, s.bikeX);
        drawRoadDashes(s, speed);
        tilt = -speed * 0.6;
        s.shakeX = speed > 2 ? (Math.random() - 0.5) * speed * 0.8 : 0;
        s.shakeY = speed > 2 ? (Math.random() - 0.5) * speed * 0.4 : 0;
        if (speed < 0.5) {
          s.phase = "reveal";
          s.shakeX = 0;
          s.shakeY = 0;
        }
      } else if (s.phase === "reveal") {
        drawRoadDashes(s, 0);
        s.textAlpha = Math.min(1, s.textAlpha + 0.025);
        s.textScale = Math.min(1, s.textScale + 0.022);
        if (s.textAlpha >= 1 && s.textScale >= 1) {
          s.phase = "hold";
          s.holdTimer = 0;
        }
      } else if (s.phase === "hold") {
        drawRoadDashes(s, 0);
        s.holdTimer = (s.holdTimer || 0) + 1;
        if (s.holdTimer > 80) s.phase = "fade-out";
      } else if (s.phase === "fade-out") {
        drawRoadDashes(s, 0);
        s.opacity = Math.max(0, s.opacity - 0.035);
        if (s.opacity <= 0) {
          s.phase = "done";
          onDone();
          return;
        }
      }

      drawSkidMark(s);
      drawExhaustPuffs(s);
      drawSparks(s);
      drawBike(s.bikeX, s.wheelAngle, tilt);
      if (s.phase === "reveal" || s.phase === "hold" || s.phase === "fade-out")
        drawNameReveal(s);

      ctx.save();
      ctx.globalAlpha = s.opacity;
      const vig = ctx.createRadialGradient(
        CW / 2,
        CH / 2,
        CW * 0.3,
        CW / 2,
        CH / 2,
        CW * 0.75,
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, CW, CH);
      ctx.restore();

      if (s.phase !== "done") {
        if (s.opacity < 1) {
          ctx.save();
          ctx.globalAlpha = 1 - s.opacity;
          ctx.fillStyle = "#0a0a0e";
          ctx.fillRect(0, 0, CW, CH);
          ctx.restore();
        }
        drawSkipHint(s);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    const skip = () => {
      stateRef.current.phase = "done";
      cancelAnimationFrame(rafRef.current);
      onDone();
    };
    window.addEventListener("keydown", skip);
    canvasRef.current?.addEventListener("click", skip);
    canvasRef.current?.addEventListener("touchstart", skip);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", skip);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  "About",
  "Skills",
  "Experience",
  "Projects",
  "Education",
  "Contact",
];

const SKILLS = {
  Languages: ["Java", "JavaScript", "TypeScript", "SQL"],
  Backend: [
    "Spring Boot",
    "Spring Security",
    "Spring AI",
    "REST APIs",
    "JWT",
    "Node.js",
    "Express.js",
    "Socket.io",
  ],
  Frontend: ["React.js", "HTML5", "CSS3", "Tailwind CSS"],
  Databases: ["MySQL", "PostgreSQL"],
  "DevOps & Cloud": [
    "Git",
    "Docker",
    "Maven",
    "Supabase",
    "DigitalOcean",
    "Cloudflare CDN",
    "Cloudflare R2",
  ],
};

const PROJECTS = [
  {
    name: "LendOS",
    tagline: "Multi-Tenant Lending Platform",
    desc: "Open-source platform for small NBFCs replacing error-prone spreadsheet-based loan tracking with automated lifecycle management, double-entry accounting, and AI-powered KYC verification.",
    tags: ["Spring Boot", "Spring Security", "JWT", "PostgreSQL", "REST APIs"],
    features: [
      "7-State Loan Lifecycle",
      "RBAC (Admin/Officer/Auditor)",
      "Double-Entry Ledger",
      "Idempotent Payments",
      "500k Row Tested",
    ],
    link: "https://github.com/ChaudhariSanket12/lendos",
    year: "2026",
    emoji: "🏦",
    color: "#f97316",
  },
  {
    name: "OneVerse Club Platform",
    tagline: "Club Management System",
    desc: "Centralized cloud-based club management system eliminating fragmented WhatsApp coordination, now serving 50+ members, 40+ events, and 120+ participants.",
    tags: [
      "Spring Boot",
      "React.js",
      "MySQL",
      "JWT",
      "DigitalOcean",
      "Cloudflare",
    ],
    features: [
      "4-Role Access Control",
      "OTP Verification",
      "Dropbox-style File Submission",
      "Event Management",
      "Academic PYQP Repo",
    ],
    link: "https://github.com/prathameshsingh-rajput/Oneverse-Club-Backend",
    year: "2025–26",
    emoji: "🎯",
    color: "#8b5cf6",
  },
  {
    name: "RentEz",
    tagline: "Property Rental Platform",
    desc: "Full-stack application connecting property owners and tenants with real-time messaging, automated rent reminders, and comprehensive property management features.",
    tags: ["MERN", "Socket.io", "JWT", "Tailwind CSS", "Mapbox"],
    features: [
      "Real-time Chat",
      "Payment Tracking",
      "Automated Reminders",
      "Image Upload",
      "Location Maps",
    ],
    link: "https://github.com/ChaudhariSanket12/RentEz",
    year: "2025",
    emoji: "🏠",
    color: "#06b6d4",
  },
  {
    name: "Vicharmanthan",
    tagline: "Startup Collaboration Platform",
    desc: "Social platform for startup enthusiasts to share ideas, find co-founders, and collaborate with real-time chat and thriving community features.",
    tags: ["MERN", "Socket.io", "Real-time Chat", "Search & Filter"],
    features: [
      "Idea Sharing",
      "Team Building",
      "Real-time Chat",
      "User Profiles",
      "Admin Panel",
    ],
    link: "https://github.com/ChaudhariSanket12/VicharManthan",
    year: "2025",
    emoji: "💡",
    color: "#10b981",
  },
];

const EXPERIENCE = [
  {
    role: "Full-Stack Developer Intern",
    company: "Patronage Realtor",
    link: "https://patronagerealtor.in",
    period: "Jan 2026 – Present",
    location: "Pune, Maharashtra (On-Site)",
    points: [
      "Built & deployed full production platform with React.js + Supabase (PostgreSQL) driving 500–700 monthly organic visitors.",
      "Designed 4 bank-grade financial calculators: Smart EMI (99.9% accuracy, saves buyers up to 8Y 11M repayment time & ₹43L interest), Rent vs. Buy, Loan Eligibility, and Ownership Cost.",
      "Built public lead capture system - successfully capturing 70+ real buyer leads since launch.",
      "Implemented client-side WebP compression reducing property images from 2MB to under 200KB (10× reduction).",
    ],
  },
  {
    role: "Anchoring Head",
    company: "OneVerse Club, JSPM's RSCOE",
    period: "Jun 2024 – Present",
    location: "Pune, Maharashtra",
    points: [
      "Led stage and event operations for 500+ attendee college events across technical fests, seminars, and cultural programs.",
      "Coordinated cross-functional teams of faculty, students, and external guests managing live event timelines.",
    ],
  },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Sanket() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);
  const [rpmVal, setRpmVal] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    if (showIntro) return;
    let start = null;
    const target = 92;
    const duration = 2000;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setRpmVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(animate);
    };
    const t = setTimeout(() => requestAnimationFrame(animate), 400);
    return () => clearTimeout(t);
  }, [showIntro]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (showIntro) return <BikeIntro onDone={() => setShowIntro(false)} />;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const needleAngle = -135 + (rpmVal / 100) * 270;

  return (
    <div className="sc-root">
      {/* ── NAV ── */}
      <nav className={`sc-nav${scrollY > 60 ? " sc-nav--scrolled" : ""}`}>
        <div className="sc-nav-logo" onClick={() => scrollTo("hero")}>
          <span className="sc-logo-icon">⚡</span>
          <span className="sc-logo-text">Sanket Chaudhari</span>
        </div>
        <div className="sc-nav-links">
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              className="sc-nav-btn"
              onClick={() => scrollTo(l.toLowerCase())}
            >
              {l}
            </button>
          ))}
          <a
            href="/Resume - Sanket Chaudhari.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="sc-nav-cta"
          >
            Resume
          </a>
        </div>
        <button className="sc-burger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="sc-mobile-menu">
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              className="sc-mobile-btn"
              onClick={() => scrollTo(l.toLowerCase())}
            >
              {l}
            </button>
          ))}
          <a
            href="/public/Resume - Sanket Chaudhari.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="sc-mobile-resume"
          >
            Resume ↗
          </a>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="sc-hero">
        <div className="sc-road">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="sc-road-line"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="sc-particle"
            style={{
              left: `${5 + ((i * 4.7) % 90)}%`,
              top: `${10 + ((i * 7.3) % 80)}%`,
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              animationDuration: `${3 + (i % 5)}s`,
              animationDelay: `${(i * 0.3) % 3}s`,
            }}
          />
        ))}

        <div className="sc-hero-content">
          <div className="sc-gauge-wrap">
            <svg
              width="160"
              height="120"
              viewBox="0 0 180 110"
              className="sc-gauge-svg"
            >
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="60%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              <path
                d="M 20 95 A 70 70 0 0 1 160 95"
                fill="none"
                stroke="#1f1f2e"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 20 95 A 70 70 0 0 1 160 95"
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset={220 - (rpmVal / 100) * 220}
                style={{ transition: "stroke-dashoffset 0.1s" }}
              />
              {[0, 25, 50, 75, 100].map((v) => {
                const a = (-135 + (v / 100) * 270) * (Math.PI / 180);
                const r1 = 58,
                  r2 = 68;
                return (
                  <line
                    key={v}
                    x1={90 + r1 * Math.cos(a)}
                    y1={95 + r1 * Math.sin(a)}
                    x2={90 + r2 * Math.cos(a)}
                    y2={95 + r2 * Math.sin(a)}
                    stroke="#444"
                    strokeWidth="2"
                  />
                );
              })}
              <line
                x1="90"
                y1="95"
                x2={90 + 40 * Math.cos((needleAngle * Math.PI) / 180)}
                y2={95 + 40 * Math.sin((needleAngle * Math.PI) / 180)}
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ transition: "x2 0.05s, y2 0.05s" }}
              />
              <circle cx="90" cy="95" r="5" fill="#f97316" />
              <text
                x="90"
                y="70"
                textAnchor="middle"
                fill="#f97316"
                fontSize="13"
                fontWeight="700"
                fontFamily="monospace"
              >
                {rpmVal}
              </text>

              <text
                x="90"
                y="118"
                textAnchor="middle"
                fill="#888"
                fontSize="9"
                fontFamily="monospace"
              >
                COMMITS/SPRINT
              </text>
            </svg>
          </div>

          <div className="sc-badge">Full-Stack Developer · Biker · Builder</div>
          <h1 className="sc-hero-name">
            <span className="sc-hero-first">SANKET</span>
            <br />
            <span className="sc-hero-last">CHAUDHARI</span>
          </h1>
          <p className="sc-hero-tagline">
            I ride to think. I code to build.
            <br />
            <span className="sc-accent">Production-grade systems</span> by day,
            <br />
            open roads by soul.
          </p>
          <div className="sc-hero-btns">
            <button
              className="sc-primary-btn"
              onClick={() => scrollTo("projects")}
            >
              View Projects <span className="sc-btn-arrow">→</span>
            </button>
            <a
              href="mailto:chaudharisanket2003@gmail.com"
              className="sc-ghost-btn"
            >
              Let's Talk
            </a>
          </div>
          <div className="sc-hero-links">
            <a
              href="https://linkedin.com/in/sanketkchaudhari"
              className="sc-social-link"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <span className="sc-social-divider">·</span>
            <a
              href="https://github.com/ChaudhariSanket12"
              className="sc-social-link"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <span className="sc-social-divider">·</span>
            <a
              href="https://sanketchaudhari.tech"
              className="sc-social-link"
              target="_blank"
              rel="noreferrer"
            >
              Website
            </a>
          </div>
        </div>

        <div className="sc-bike-wrap">
          <svg viewBox="0 0 420 220" width="100%">
            <ellipse
              cx="210"
              cy="200"
              rx="160"
              ry="12"
              fill="#f97316"
              opacity="0.12"
            />
            <circle
              cx="110"
              cy="175"
              r="42"
              fill="none"
              stroke="#333"
              strokeWidth="10"
            />
            <circle
              cx="110"
              cy="175"
              r="30"
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              opacity="0.5"
            />
            <circle cx="110" cy="175" r="8" fill="#f97316" />
            {[0, 45, 90, 135].map((a) => {
              const rad = (a * Math.PI) / 180;
              return (
                <line
                  key={a}
                  x1={110 + 8 * Math.cos(rad)}
                  y1={175 + 8 * Math.sin(rad)}
                  x2={110 + 30 * Math.cos(rad)}
                  y2={175 + 30 * Math.sin(rad)}
                  stroke="#555"
                  strokeWidth="2.5"
                />
              );
            })}
            <circle
              cx="320"
              cy="175"
              r="42"
              fill="none"
              stroke="#333"
              strokeWidth="10"
            />
            <circle
              cx="320"
              cy="175"
              r="30"
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              opacity="0.5"
            />
            <circle cx="320" cy="175" r="8" fill="#f97316" />
            {[0, 45, 90, 135].map((a) => {
              const rad = (a * Math.PI) / 180;
              return (
                <line
                  key={a}
                  x1={320 + 8 * Math.cos(rad)}
                  y1={175 + 8 * Math.sin(rad)}
                  x2={320 + 30 * Math.cos(rad)}
                  y2={175 + 30 * Math.sin(rad)}
                  stroke="#555"
                  strokeWidth="2.5"
                />
              );
            })}
            <ellipse
              cx="145"
              cy="175"
              rx="20"
              ry="8"
              fill="none"
              stroke="#444"
              strokeWidth="4"
            />
            <polygon
              points="110,175 155,105 230,105 265,155 215,155 195,175"
              fill="#1a1a2e"
              stroke="#f97316"
              strokeWidth="2.5"
            />
            <rect
              x="150"
              y="97"
              width="75"
              height="12"
              rx="6"
              fill="#2a2a3e"
              stroke="#666"
              strokeWidth="1.5"
            />
            <ellipse
              cx="215"
              cy="120"
              rx="38"
              ry="18"
              fill="#0f0f1a"
              stroke="#f97316"
              strokeWidth="2"
            />
            <rect
              x="170"
              y="138"
              width="55"
              height="30"
              rx="4"
              fill="#111"
              stroke="#333"
              strokeWidth="2"
            />
            <line
              x1="265"
              y1="155"
              x2="290"
              y2="175"
              stroke="#555"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <line
              x1="265"
              y1="155"
              x2="320"
              y2="175"
              stroke="#555"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="255"
              y1="110"
              x2="280"
              y2="105"
              stroke="#666"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="280"
              y1="105"
              x2="280"
              y2="118"
              stroke="#666"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 168 155 Q 140 170 115 168"
              fill="none"
              stroke="#888"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 115 168 Q 95 166 85 172"
              fill="none"
              stroke="#888"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <ellipse
              cx="340"
              cy="148"
              rx="12"
              ry="8"
              fill="#fbbf24"
              opacity="0.9"
            />
            <ellipse
              cx="340"
              cy="148"
              rx="8"
              ry="5"
              fill="#fff"
              opacity="0.5"
            />
            {[155, 162, 170, 178].map((y, i) => (
              <line
                key={y}
                x1={i % 2 === 0 ? 30 : 20}
                y1={y}
                x2={i % 2 === 0 ? 5 : 0}
                y2={y}
                stroke="#f97316"
                strokeWidth={2 - i * 0.3}
                opacity={0.6 - i * 0.1}
              />
            ))}
          </svg>
        </div>

        <div className="sc-scroll-hint">
          <span className="sc-scroll-dot" />
          <span
            style={{ color: "#666", fontSize: "11px", letterSpacing: "2px" }}
          >
            SCROLL
          </span>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="sc-section">
        <SectionLabel label="01 / ABOUT" />
        <div className="sc-about-grid">
          <div className="sc-about-left">
            <h2 className="sc-section-title">
              Code at <span className="sc-accent">full throttle.</span>
            </h2>
            <p className="sc-about-text">
              Full-Stack Java Developer with production deployment experience. I
              build Spring Boot REST APIs, real-time web applications, and
              database-driven platforms that actually ship and serve real users.
            </p>
            <p className="sc-about-text">
              Just like on a bike - I don't just start engines, I take them to
              the finish line. One production platform, 500–700 monthly
              visitors, 70+ leads captured. That's the kind of mileage I put on
              my code.
            </p>
            <div className="sc-stats-row">
              {[
                { val: "500+", label: "Monthly Visitors" },
                { val: "70+", label: "Leads Captured" },
                { val: "45+", label: "REST Endpoints" },
                { val: "500K", label: "Ledger Rows Tested" },
              ].map(({ val, label }) => (
                <div key={label} className="sc-stat-card">
                  <span className="sc-stat-val">{val}</span>
                  <span className="sc-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sc-about-right">
            <div className="sc-info-card">
              <InfoRow icon="📍" label="Location" val="Pune, Maharashtra" />
              <InfoRow
                icon="🎓"
                label="Education"
                val="MCA - JSPM RSCOE (CGPA 8.28)"
              />
              <InfoRow icon="📱" label="Phone" val="+91 7709841585" />
              <InfoRow
                icon="✉️"
                label="Email"
                val="chaudharisanket2003@gmail.com"
              />
              <InfoRow icon="🌐" label="Website" val="sanketchaudhari.tech" />
              <InfoRow
                icon="🏍️"
                label="Fuel Type"
                val="Caffeine + Open Roads"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="sc-section sc-section--dark">
        <SectionLabel label="02 / SKILLS" />
        <h2 className="sc-section-title">
          The <span className="sc-accent">tech stack</span> in the garage.
        </h2>
        <div className="sc-skills-grid">
          {Object.entries(SKILLS).map(([cat, items]) => (
            <div key={cat} className="sc-skill-group">
              <div className="sc-skill-cat">{cat}</div>
              <div className="sc-skill-tags">
                {items.map((s) => (
                  <span key={s} className="sc-skill-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="sc-section">
        <SectionLabel label="03 / EXPERIENCE" />
        <h2 className="sc-section-title">
          Miles <span className="sc-accent">on the road.</span>
        </h2>
        <div className="sc-exp-list">
          {EXPERIENCE.map((e, i) => (
            <div key={i} className="sc-exp-card">
              <div className="sc-exp-left">
                <div className="sc-exp-dot" />
                {i < EXPERIENCE.length - 1 && <div className="sc-exp-line" />}
              </div>
              <div className="sc-exp-right">
                <div className="sc-exp-header">
                  <div>
                    <div className="sc-exp-role">{e.role}</div>
                    <div className="sc-exp-company">
                      {e.link ? (
                        <a
                          href={e.link}
                          className="sc-exp-link"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {e.company} ↗
                        </a>
                      ) : (
                        e.company
                      )}
                    </div>
                  </div>
                  <div className="sc-exp-meta">
                    <span className="sc-exp-period">{e.period}</span>
                    <span className="sc-exp-location">{e.location}</span>
                  </div>
                </div>
                <ul className="sc-exp-points">
                  {e.points.map((p, pi) => (
                    <li key={pi} className="sc-exp-point">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="sc-section sc-section--dark">
        <SectionLabel label="04 / PROJECTS" />
        <h2 className="sc-section-title">
          Builds that <span className="sc-accent">actually shipped.</span>
        </h2>
        <div className="sc-proj-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" className="sc-section">
        <SectionLabel label="05 / EDUCATION" />
        <h2 className="sc-section-title">
          The <span className="sc-accent">pit stop</span> years.
        </h2>
        <div className="sc-edu-list">
          {[
            {
              degree: "Master of Computer Applications (MCA)",
              school: "JSPM Rajarshi Shahu College of Engineering",
              location: "Pune, Maharashtra",
              period: "Aug 2024 – Jun 2026",
              grade: "CGPA: 8.28",
              icon: "🎓",
            },
            {
              degree:
                "Bachelor of Vocational – Industrial Automation & Mechatronics",
              school: "KCE's College of Engineering and Management",
              location: "Jalgaon",
              period: "Jun 2020 – Jun 2023",
              grade: null,
              icon: "🔧",
            },
          ].map((edu) => (
            <div key={edu.degree} className="sc-edu-card">
              <div className="sc-edu-icon">{edu.icon}</div>
              <div className="sc-edu-body">
                <div className="sc-edu-header">
                  <div>
                    <div className="sc-edu-degree">{edu.degree}</div>
                    <div className="sc-edu-school">{edu.school}</div>
                  </div>
                  <div className="sc-edu-meta">
                    <span className="sc-edu-period">{edu.period}</span>
                    <span className="sc-edu-loc">{edu.location}</span>
                  </div>
                </div>
                {edu.grade && <span className="sc-edu-grade">{edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>

        <SectionLabel label="06 / CERTIFICATIONS & ACHIEVEMENTS" />
        <h2 className="sc-section-title">
          Badges on the <span className="sc-accent">jacket.</span>
        </h2>
        <div className="sc-cert-grid">
          {[
            {
              title: "Java Spring Framework, Spring Boot & Spring AI",
              issuer: "Udemy – Navin Reddy, Telusko",
              meta: "Dec 2025 · 55 hrs",
              icon: "🏅",
              color: "#f97316",
            },
            {
              title: "Communication Skills for BPM Industry",
              issuer: "Wadhwani Foundation",
              meta: "Professional Certification",
              icon: "🎤",
              color: "#8b5cf6",
            },
            {
              title: "Event Host & Anchor",
              issuer: "Annual College Fest 2025",
              meta: "JSPM RSCOE, Pune",
              icon: "🎙️",
              color: "#06b6d4",
            },
          ].map((cert) => (
            <div
              key={cert.title}
              className="sc-cert-card"
              style={{ borderColor: cert.color + "33" }}
            >
              <div className="sc-cert-icon">{cert.icon}</div>
              <div>
                <div className="sc-cert-title">{cert.title}</div>
                <div className="sc-cert-issuer" style={{ color: cert.color }}>
                  {cert.issuer}
                </div>
                <div className="sc-cert-meta">{cert.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="sc-section sc-section--dark">
        <SectionLabel label="07 / CONTACT" />
        <div className="sc-contact-wrap">
          <h2 className="sc-section-title" style={{ textAlign: "center" }}>
            Let's <span className="sc-accent">ride together.</span>
          </h2>
          <p className="sc-contact-sub">
            Whether it's a production problem, a new project, or just a good
            conversation about bikes and code - I'm in.
          </p>
          <div className="sc-contact-links">
            <ContactItem
              icon="✉️"
              label="Email"
              val="chaudharisanket2003@gmail.com"
              href="mailto:chaudharisanket2003@gmail.com"
            />
            <ContactItem
              icon="📱"
              label="Phone"
              val="+91 7709841585"
              href="tel:+917709841585"
            />
            <ContactItem
              icon="💼"
              label="LinkedIn"
              val="sanketkchaudhari"
              href="https://linkedin.com/in/sanketkchaudhari"
            />
            <ContactItem
              icon="🐙"
              label="GitHub"
              val="ChaudhariSanket12"
              href="https://github.com/ChaudhariSanket12"
            />
            <ContactItem
              icon="🌐"
              label="Website"
              val="sanketchaudhari.tech"
              href="https://sanketchaudhari.tech"
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="sc-footer">
        <span style={{ color: "#444" }}>Developed</span>
        <span style={{ color: "#444" }}> by Sanket Chaudhari · 2026</span>
        <span style={{ color: "#f97316", marginLeft: "8px" }}>🏍️</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0a0e; overflow-x: hidden; }

        @keyframes roadAnim { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes float { 0%,100% { transform:translateY(0); opacity:0.4; } 50% { transform:translateY(-12px); opacity:0.9; } }
        @keyframes scrollBob { 0%,100% { transform:translateY(0); opacity:0.7; } 50% { transform:translateY(8px); opacity:0.3; } }
        @keyframes bikeFloat { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }

        /* ROOT */
        .sc-root {
          font-family: 'Inter', sans-serif;
          background: #0a0a0e;
          color: #e0e0e0;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* NAV */
        .sc-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 40px;
          transition: background 0.4s ease, backdrop-filter 0.4s ease;
        }
        .sc-nav--scrolled {
          background: rgba(10,10,14,0.97);
          backdrop-filter: blur(12px);
        }
        .sc-nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .sc-logo-icon { font-size: 20px; }
        .sc-logo-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #f97316;
          letter-spacing: 2px;
        }
        .sc-nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .sc-nav-btn {
          background: none;
          border: none;
          color: #aaa;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          padding: 6px 10px;
          letter-spacing: 0.5px;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .sc-nav-btn:hover { color: #f97316; }
        .sc-nav-cta {
          background: #f97316;
          color: #000;
          padding: 8px 18px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          margin-left: 8px;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .sc-burger {
          display: none;
          background: none;
          border: none;
          color: #f97316;
          font-size: 22px;
          cursor: pointer;
          padding: 4px 8px;
          line-height: 1;
        }
        .sc-mobile-menu {
          position: fixed;
          top: 58px; left: 0; right: 0;
          background: rgba(10,10,14,0.98);
          backdrop-filter: blur(12px);
          z-index: 99;
          display: flex;
          flex-direction: column;
          padding: 12px 20px 20px;
          gap: 2px;
          border-bottom: 1px solid #1a1a2e;
        }
        .sc-mobile-btn {
          background: none;
          border: none;
          color: #ccc;
          font-size: 16px;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          padding: 13px 0;
          text-align: left;
          border-bottom: 1px solid #111;
        }
        .sc-mobile-resume {
          color: #f97316;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          padding: 14px 0 4px;
          display: block;
        }

        /* HERO */
        .sc-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse at 20% 50%, #1a0a00 0%, #0a0a0e 60%);
          padding: 100px 20px 60px;
        }
        .sc-road {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          gap: 40px;
          opacity: 0.08;
          pointer-events: none;
          overflow: hidden;
        }
        .sc-road-line {
          width: 2px;
          height: 120px;
          background: linear-gradient(to bottom, transparent, #f97316, transparent);
          animation: roadAnim 2s linear infinite;
        }
        .sc-particle {
          position: absolute;
          border-radius: 50%;
          background: #f97316;
          animation: float 4s ease-in-out infinite;
          pointer-events: none;
        }
        .sc-hero-content {
          text-align: center;
          z-index: 2;
          max-width: 680px;
          width: 100%;
        }
        .sc-gauge-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .sc-gauge-svg { filter: drop-shadow(0 0 12px #f9731640); }
        .sc-badge {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #f97316;
          letter-spacing: 2px;
          border: 1px solid #f9731444;
          padding: 5px 14px;
          border-radius: 2px;
          margin-bottom: 20px;
          background: #f9731608;
        }
        .sc-hero-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(52px, 14vw, 110px);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -2px;
          margin-bottom: 24px;
        }
        .sc-hero-first { color: #ffffff; }
        .sc-hero-last { color: transparent; -webkit-text-stroke: 2px #f97316; }
        .sc-hero-tagline {
          font-size: 15px;
          color: #888;
          line-height: 1.8;
          margin-bottom: 32px;
        }
        .sc-accent { color: #f97316; }
        .sc-hero-btns {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .sc-primary-btn {
          background: #f97316;
          color: #000;
          border: none;
          padding: 13px 28px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .sc-btn-arrow { font-size: 18px; }
        .sc-ghost-btn {
          background: transparent;
          color: #f97316;
          border: 1px solid #f97316;
          padding: 13px 28px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .sc-hero-links {
          display: flex;
          gap: 12px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }
        .sc-social-link {
          color: #666;
          font-size: 12px;
          text-decoration: none;
          letter-spacing: 1px;
          font-family: 'JetBrains Mono', monospace;
          transition: color 0.2s;
        }
        .sc-social-link:hover { color: #f97316; }
        .sc-social-divider { color: #333; }
        .sc-bike-wrap {
          position: absolute;
          bottom: 20px;
          right: -10px;
          width: min(380px, 44vw);
          opacity: 0.3;
          animation: bikeFloat 4s ease-in-out infinite;
          pointer-events: none;
        }
        .sc-scroll-hint {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 3;
        }
        .sc-scroll-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f97316;
          animation: scrollBob 2s ease-in-out infinite;
        }

        /* SECTIONS */
        .sc-section {
          padding: 90px 40px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .sc-section--dark {
          background: #07070d;
          max-width: 100%;
          padding: 90px 40px;
        }
        .sc-section--dark > * {
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }
        .sc-section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(32px, 6vw, 58px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 36px;
        }

        /* ABOUT */
        .sc-about-grid {
          display: flex;
          gap: 60px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .sc-about-left { flex: 1 1 320px; }
        .sc-about-right { flex: 1 1 280px; }
        .sc-about-text { color: #888; line-height: 1.8; margin-bottom: 18px; font-size: 15px; }
        .sc-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 28px;
        }
        .sc-stat-card {
          background: #0f0f1a;
          border: 1px solid #1a1a2e;
          border-radius: 8px;
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .sc-stat-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #f97316;
        }
        .sc-stat-label { font-size: 10px; color: #666; letter-spacing: 1px; text-transform: uppercase; }
        .sc-info-card {
          background: #0f0f1a;
          border: 1px solid #1a1a2e;
          border-radius: 10px;
          padding: 18px 22px;
        }

        /* SKILLS */
        .sc-skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 36px;
        }
        .sc-skill-group {
          background: #0f0f1a;
          border: 1px solid #1a1a2e;
          border-radius: 10px;
          padding: 18px;
        }
        .sc-skill-cat {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #f97316;
          letter-spacing: 2px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .sc-skill-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .sc-skill-tag {
          background: #1a1a2e;
          color: #ccc;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
        }

        /* EXPERIENCE */
        .sc-exp-list { display: flex; flex-direction: column; }
        .sc-exp-card { display: flex; gap: 20px; padding-bottom: 36px; }
        .sc-exp-left { display: flex; flex-direction: column; align-items: center; padding-top: 4px; }
        .sc-exp-dot {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #f97316;
          border: 3px solid #0a0a0e;
          box-shadow: 0 0 0 2px #f97316;
          flex-shrink: 0;
        }
        .sc-exp-line {
          width: 2px; flex: 1;
          background: linear-gradient(to bottom, #f97316, #1a1a2e);
          margin-top: 8px;
          min-height: 60px;
        }
        .sc-exp-right { flex: 1; min-width: 0; }
        .sc-exp-header {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }
        .sc-exp-role {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 0.5px;
        }
        .sc-exp-company { font-size: 13px; color: #888; margin-top: 3px; }
        .sc-exp-link { color: #f97316; text-decoration: none; }
        .sc-exp-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
        .sc-exp-period { font-size: 11px; color: #f97316; font-family: 'JetBrains Mono', monospace; }
        .sc-exp-location { font-size: 11px; color: #555; text-align: right; }
        .sc-exp-points { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .sc-exp-point { color: #888; font-size: 13px; line-height: 1.6; padding-left: 14px; position: relative; }
        .sc-exp-point::before { content: "—"; position: absolute; left: 0; color: #f9731660; }

        /* PROJECTS */
        .sc-proj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 440px), 1fr));
          gap: 24px;
        }
        .sc-proj-card {
          background: #0f0f1a;
          border: 1px solid #1a1a2e;
          border-radius: 12px;
          padding: 24px;
          cursor: default;
          transition: all 0.3s ease;
        }
        .sc-proj-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .sc-proj-emoji { font-size: 26px; }
        .sc-proj-year { font-size: 10px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; }
        .sc-proj-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 3px;
          letter-spacing: 0.5px;
        }
        .sc-proj-tagline { font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px; margin-bottom: 12px; text-transform: uppercase; }
        .sc-proj-desc { color: #777; font-size: 13px; line-height: 1.7; margin-bottom: 16px; }
        .sc-proj-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .sc-tech-tag { font-size: 11px; padding: 3px 9px; border: 1px solid; border-radius: 3px; font-family: 'JetBrains Mono', monospace; background: transparent; }
        .sc-proj-features { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
        .sc-feature-chip { background: #1a1a2e; color: #666; font-size: 11px; padding: 3px 9px; border-radius: 3px; }
        .sc-proj-link { font-size: 12px; font-weight: 600; text-decoration: none; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px; }

        /* EDUCATION */
        .sc-edu-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 60px; }
        .sc-edu-card {
          background: #0f0f1a;
          border: 1px solid #1a1a2e;
          border-radius: 12px;
          padding: 24px 28px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }
        .sc-edu-icon { font-size: 28px; flex-shrink: 0; margin-top: 2px; }
        .sc-edu-body { flex: 1; min-width: 0; }
        .sc-edu-header { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
        .sc-edu-degree { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; color: #fff; }
        .sc-edu-school { color: #888; font-size: 13px; margin-top: 3px; }
        .sc-edu-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
        .sc-edu-period { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #f97316; }
        .sc-edu-loc { font-size: 11px; color: #555; text-align: right; }
        .sc-edu-grade {
          display: inline-block;
          background: #f9731620;
          border: 1px solid #f9731444;
          color: #f97316;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 4px;
          margin-top: 8px;
        }
        .sc-cert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
        .sc-cert-card {
          background: #0f0f1a;
          border: 1px solid;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .sc-cert-icon { font-size: 24px; flex-shrink: 0; }
        .sc-cert-title { color: #fff; font-size: 13px; font-weight: 600; line-height: 1.4; margin-bottom: 5px; }
        .sc-cert-issuer { font-size: 11px; font-family: 'JetBrains Mono', monospace; margin-bottom: 3px; }
        .sc-cert-meta { color: #555; font-size: 11px; }

        /* CONTACT */
        .sc-contact-wrap { max-width: 760px; margin: 0 auto; text-align: center; }
        .sc-contact-sub { color: #777; font-size: 15px; line-height: 1.7; margin-bottom: 44px; }
        .sc-contact-links { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; text-align: left; }
        .sc-contact-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #0f0f1a;
          border: 1px solid #1a1a2e;
          border-radius: 10px;
          padding: 16px 18px;
          text-decoration: none;
          transition: border-color 0.2s;
          min-width: 0;
        }
        .sc-contact-item:hover { border-color: #f97316; }
        .sc-contact-icon { font-size: 20px; flex-shrink: 0; }
        .sc-contact-label { font-size: 10px; color: #555; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px; }
        .sc-contact-val { color: #ccc; font-size: 12px; word-break: break-all; }

        /* FOOTER */
        .sc-footer {
          text-align: center;
          padding: 28px 20px;
          background: #07070d;
          border-top: 1px solid #111;
          font-size: 13px;
        }

        /* ── MOBILE BREAKPOINTS ── */
        @media (max-width: 768px) {
          .sc-nav { padding: 14px 20px; }
          .sc-nav-links { display: none; }
          .sc-burger { display: block; }

          .sc-hero { padding: 80px 16px 80px; }
          .sc-bike-wrap { display: none; }
          .sc-scroll-hint { display: none; }
          .sc-badge { font-size: 9px; letter-spacing: 1px; padding: 5px 10px; }
          .sc-hero-tagline { font-size: 14px; }
          .sc-primary-btn, .sc-ghost-btn { padding: 12px 22px; font-size: 13px; }

          .sc-section { padding: 64px 20px; }
          .sc-section--dark { padding: 64px 20px; }

          .sc-about-grid { flex-direction: column; gap: 32px; }
          .sc-about-left, .sc-about-right { flex: 1 1 100%; }

          .sc-skills-grid { grid-template-columns: 1fr; }
          .sc-proj-grid { grid-template-columns: 1fr; }

          .sc-exp-header { flex-direction: column; gap: 4px; }
          .sc-exp-meta { align-items: flex-start; }
          .sc-exp-location { text-align: left; }

          .sc-edu-card { padding: 18px 16px; gap: 14px; }
          .sc-edu-header { flex-direction: column; gap: 6px; }
          .sc-edu-meta { align-items: flex-start; }
          .sc-edu-loc { text-align: left; }

          .sc-cert-grid { grid-template-columns: 1fr; }

          .sc-contact-links { grid-template-columns: 1fr; }
          .sc-contact-val { font-size: 11px; }
        }

        @media (max-width: 420px) {
          .sc-hero-name { letter-spacing: -1px; }
          .sc-hero-btns { gap: 10px; }
          .sc-primary-btn, .sc-ghost-btn { padding: 11px 18px; }
          .sc-stats-row { grid-template-columns: 1fr 1fr; gap: 10px; }
          .sc-stat-val { font-size: 26px; }
          .sc-edu-icon { font-size: 22px; }
        }
      `}</style>
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function SectionLabel({ label }) {
  return (
    <div
      style={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "11px",
        color: "#f97316",
        letterSpacing: "3px",
        marginBottom: "14px",
      }}
    >
      {label}
    </div>
  );
}

function InfoRow({ icon, label, val }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "11px 0",
        borderBottom: "1px solid #1a1a2e",
        alignItems: "flex-start",
      }}
    >
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          color: "#666",
          fontSize: "12px",
          minWidth: "72px",
          fontFamily: "JetBrains Mono, monospace",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{ color: "#ccc", fontSize: "12px", wordBreak: "break-word" }}
      >
        {val}
      </span>
    </div>
  );
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="sc-proj-card"
      style={{
        borderColor: hovered ? project.color : "#1a1a2e",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 60px ${project.color}22` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="sc-proj-top">
        <div className="sc-proj-emoji" style={{ color: project.color }}>
          {project.emoji}
        </div>
        <span className="sc-proj-year" style={{ color: project.color }}>
          {project.year}
        </span>
      </div>
      <h3 className="sc-proj-name">{project.name}</h3>
      <div className="sc-proj-tagline" style={{ color: project.color }}>
        {project.tagline}
      </div>
      <p className="sc-proj-desc">{project.desc}</p>
      <div className="sc-proj-tags">
        {project.tags.map((t) => (
          <span
            key={t}
            className="sc-tech-tag"
            style={{ borderColor: project.color + "44", color: project.color }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="sc-proj-features">
        {project.features.map((f) => (
          <span key={f} className="sc-feature-chip">
            ✓ {f}
          </span>
        ))}
      </div>
      {project.link && project.link !== "#" && (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="sc-proj-link"
          style={{ color: project.color }}
        >
          View on GitHub →
        </a>
      )}
    </div>
  );
}

function ContactItem({ icon, label, val, href }) {
  return (
    <a href={href} className="sc-contact-item" target="_blank" rel="noreferrer">
      <span className="sc-contact-icon">{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div className="sc-contact-label">{label}</div>
        <div className="sc-contact-val">{val}</div>
      </div>
    </a>
  );
}
