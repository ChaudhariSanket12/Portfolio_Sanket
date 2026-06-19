import { useState, useEffect, useRef } from "react";

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
    stars: [],
    roadDashes: [],
    wheelAngle: 0,
    shakeX: 0,
    shakeY: 0,
  });
  const rafRef = useRef(null);
  const initializedRef = useRef(false);

  // Initialize stars and road dashes once
  useEffect(() => {
    if (!initializedRef.current) {
      const s = stateRef.current;
      s.stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * 1400,
        y: Math.random() * 400,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.4 + 0.1,
      }));
      s.roadDashes = Array.from({ length: 12 }, (_, i) => ({ x: i * 130 }));
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const W = rect.width || window.innerWidth;
    const H = rect.height || window.innerHeight;
    const DPR = window.devicePixelRatio || 1;

    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(DPR, DPR);
    const CW = W;
    const CH = H;
    const groundY = CH * 0.72;
    const centerX = CW / 2;

    // Draw functions
    const drawSky = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, groundY);
      grd.addColorStop(0, "#02010a");
      grd.addColorStop(1, "#0d0520");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, CW, groundY);
    };

    const drawStars = (s) => {
      s.stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x - s.frame * star.speed * 0.5, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.sin(s.frame * 0.05 + star.x) * 0.3})`;
        ctx.fill();
      });
    };

    const drawMoon = () => {
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
    };

    const drawGround = () => {
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
    };

    const drawRoadDashes = (s, speed) => {
      s.roadDashes.forEach(d => {
        d.x -= speed;
        if (d.x < -120) d.x = CW + 10;
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(d.x, groundY + 10, 80, 4);
      });
    };

    const drawExhaustPuffs = (s) => {
      s.exhaustPuffs = s.exhaustPuffs.filter(p => p.life > 0);
      s.exhaustPuffs.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,120,60,${p.life * 0.018})`;
        ctx.fill();
        p.x -= 2.5;
        p.y -= 0.6;
        p.r += 0.7;
        p.life--;
      });
    };

    const spawnPuff = (s, bx) => {
      if (s.exhaustPuffs.length < 30) {
        s.exhaustPuffs.push({ x: bx - 60, y: groundY - 28, r: 6, life: 30 });
      }
    };

    const drawSparks = (s) => {
      s.sparks = s.sparks.filter(sp => sp.life > 0);
      s.sparks.forEach(sp => {
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
    };

    const spawnSparks = (s, bx) => {
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
    };

    const drawSkidMark = (s) => {
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
    };

    const drawBike = (bx, wheelAngle, tiltDeg) => {
      ctx.save();
      ctx.translate(bx, groundY);
      ctx.rotate((tiltDeg * Math.PI) / 180);

      // Shadow
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

      // Frame
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

      // Seat
      const roundRect = (x, y, w, h, r) => {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
      };

      ctx.beginPath();
      roundRect(-20, -78, 70, 10, 5);
      ctx.fillStyle = "#1e1e30";
      ctx.fill();
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Tank
      ctx.beginPath();
      ctx.ellipse(15, -52, 32, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#0f0f1a";
      ctx.fill();
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Engine
      ctx.beginPath();
      roundRect(-20, -38, 48, 28, 4);
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Exhaust pipe
      ctx.beginPath();
      ctx.moveTo(-20, -18);
      ctx.quadraticCurveTo(-48, -10, -60, 0);
      ctx.strokeStyle = "#777";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();

      // Fork
      ctx.beginPath();
      ctx.moveTo(35, -30);
      ctx.lineTo(55, 0);
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();

      // Handlebar
      ctx.beginPath();
      ctx.moveTo(25, -72);
      ctx.lineTo(48, -68);
      ctx.lineTo(48, -55);
      ctx.strokeStyle = "#777";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Headlight
      ctx.beginPath();
      ctx.ellipse(62, -40, 11, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(62, -40, 7, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,220,0.8)";
      ctx.fill();

      // Headlight beam
      ctx.beginPath();
      ctx.moveTo(72, -40);
      ctx.lineTo(CW - bx + 60, -40 + (CW - bx) * 0.05);
      ctx.lineTo(CW - bx + 60, -40 - (CW - bx) * 0.05);
      ctx.closePath();
      ctx.fillStyle = "rgba(251,191,36,0.04)";
      ctx.fill();

      // Rider silhouette
      ctx.save();
      ctx.translate(-2, -78);
      ctx.beginPath();
      roundRect(-8, -38, 22, 38, 6);
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();
      // Helmet
      ctx.beginPath();
      ctx.arc(4, -44, 18, 0, Math.PI * 2);
      ctx.fillStyle = "#f97316";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, -44, 18, 0, Math.PI * 2);
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Visor
      ctx.beginPath();
      ctx.arc(12, -42, 10, -0.4, 0.5);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      // Jacket stripe
      ctx.beginPath();
      ctx.moveTo(-4, -26);
      ctx.lineTo(10, -26);
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Arms
      ctx.beginPath();
      ctx.moveTo(10, -28);
      ctx.quadraticCurveTo(26, -24, 36, -68);
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.stroke();
      // Leg
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
    };

    const drawNameReveal = (s) => {
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
        ctx.fillText("FULL-STACK DEVELOPER  ·  BIKER  ·  BUILDER", 0, Math.round(CW * 0.072) + 36);
      }
      ctx.restore();
    };

    const drawSkipHint = (s) => {
      if (s.phase === "done") return;
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.font = "13px Inter, sans-serif";
      ctx.fillStyle = "#aaa";
      ctx.textAlign = "right";
      ctx.fillText("PRESS ANY KEY TO SKIP →", CW - 20, CH - 18);
      ctx.restore();
    };

    const tick = () => {
      const s = stateRef.current;
      s.frame++;
      ctx.clearRect(0, 0, CW, CH);

      drawSky();
      drawStars(s);
      drawMoon();
      drawGround();

      let speed = 0;
      let tilt = 0;

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

      if (s.phase === "reveal" || s.phase === "hold" || s.phase === "fade-out") {
        drawNameReveal(s);
      }

      ctx.save();
      ctx.globalAlpha = s.opacity;
      const vig = ctx.createRadialGradient(CW / 2, CH / 2, CW * 0.3, CW / 2, CH / 2, CW * 0.75);
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
    };

    // Start animation
    rafRef.current = requestAnimationFrame(tick);

    // Skip handlers
    const skip = () => {
      const s = stateRef.current;
      if (s.phase !== "done") {
        s.phase = "done";
        cancelAnimationFrame(rafRef.current);
        onDone();
      }
    };

    window.addEventListener("keydown", skip);
    const canvasElement = canvasRef.current;
    canvasElement?.addEventListener("click", skip);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", skip);
      canvasElement?.removeEventListener("click", skip);
    };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0a0a0e",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", cursor: "pointer" }}
      />
    </div>
  );
}

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Contact"];

const SKILLS = {
  "Languages": ["Java", "JavaScript", "TypeScript", "SQL"],
  "Backend": ["Spring Boot", "Spring Security", "Spring AI", "REST APIs", "JWT", "Node.js", "Express.js", "Socket.io"],
  "Frontend": ["React.js", "HTML5", "CSS3", "Tailwind CSS"],
  "Databases": ["MySQL", "PostgreSQL"],
  "DevOps & Cloud": ["Git", "Docker", "Maven", "Supabase", "DigitalOcean", "Cloudflare CDN", "Cloudflare R2"],
};

const PROJECTS = [
  {
    name: "LendOS",
    tagline: "Multi-Tenant Lending Platform",
    desc: "Open-source platform for small NBFCs replacing error-prone spreadsheet-based loan tracking with automated lifecycle management, double-entry accounting, and AI-powered KYC verification.",
    tags: ["Spring Boot", "Spring Security", "JWT", "PostgreSQL", "REST APIs"],
    features: ["7-State Loan Lifecycle", "RBAC (Admin/Officer/Auditor)", "Double-Entry Ledger", "Idempotent Payments", "500k Row Tested"],
    link: "https://github.com/ChaudhariSanket12/lendos",
    year: "2026",
    emoji: "🏦",
    color: "#f97316",
  },
  {
    name: "OneVerse Club Platform",
    tagline: "Club Management System",
    desc: "Centralized cloud-based club management system eliminating fragmented WhatsApp coordination, now serving 50+ members, 40+ events, and 120+ participants.",
    tags: ["Spring Boot", "React.js", "MySQL", "JWT", "DigitalOcean", "Cloudflare"],
    features: ["4-Role Access Control", "OTP Verification", "Dropbox-style File Submission", "Event Management", "Academic PYQP Repo"],
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
    features: ["Real-time Chat", "Payment Tracking", "Automated Reminders", "Image Upload", "Location Maps"],
    link: "http://github.com/ChaudhariSanket12/RentEz",
    year: "2025",
    emoji: "🏠",
    color: "#06b6d4",
  },
  {
    name: "Vicharmanthan",
    tagline: "Startup Collaboration Platform",
    desc: "Social platform for startup enthusiasts to share ideas, find co-founders, and collaborate with real-time chat and thriving community features.",
    tags: ["MERN", "Socket.io", "Real-time Chat", "Search & Filter"],
    features: ["Idea Sharing", "Team Building", "Real-time Chat", "User Profiles", "Admin Panel"],
    link: "https://github.com/ChaudhariSanket12/VicharManthan",
    year: "2026",
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

export default function Sanket() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);
  const [rpmVal, setRpmVal] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const rpmRef = useRef(null);

  useEffect(() => {
    // Animate RPM on load
    let start = null;
    const target = 78;
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
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleIntroDone = () => {
    setShowIntro(false);
  };

  const needleAngle = -135 + (rpmVal / 100) * 270;

  // Show intro first
  if (showIntro) {
    return <BikeIntro onDone={handleIntroDone} />;
  }

  return (
    <div style={styles.root}>
      {/* ── NAV ── */}
      <nav style={{ ...styles.nav, background: scrollY > 60 ? "rgba(10,10,14,0.97)" : "transparent", backdropFilter: scrollY > 60 ? "blur(12px)" : "none" }}>
        <div style={styles.navLogo} onClick={() => scrollTo("hero")}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>SC</span>
        </div>
        <div style={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <button key={l} style={styles.navBtn} onClick={() => scrollTo(l.toLowerCase())}>
              {l}
            </button>
          ))}
          <a href="mailto:chaudharisanket2003@gmail.com" style={styles.navCta}>Hire Me</a>
          <a href="/public/Resume - Sanket Chaudhari.pdf" target="_blank" rel="noopener noreferrer" style={styles.navCta}>Resume</a>
        </div>
        <button style={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          {NAV_LINKS.map((l) => (
            <button key={l} style={styles.mobileBtn} onClick={() => scrollTo(l.toLowerCase())}>{l}</button>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} style={styles.hero}>
        {/* Road lines */}
        <div style={styles.road}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ ...styles.roadLine, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            ...styles.particle,
            left: `${5 + (i * 4.7) % 90}%`,
            top: `${10 + (i * 7.3) % 80}%`,
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            animationDuration: `${3 + (i % 5)}s`,
            animationDelay: `${(i * 0.3) % 3}s`,
          }} />
        ))}

        <div style={styles.heroContent}>
          {/* RPM Gauge */}
          <div style={styles.gaugeWrap}>
            <svg width="180" height="100" viewBox="0 0 180 110" style={styles.gaugeSvg}>
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="60%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              {/* Background arc */}
              <path d="M 20 95 A 70 70 0 0 1 160 95" fill="none" stroke="#1f1f2e" strokeWidth="12" strokeLinecap="round" />
              {/* Colored arc */}
              <path d="M 20 95 A 70 70 0 0 1 160 95" fill="none" stroke="url(#arcGrad)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray="220" strokeDashoffset={220 - (rpmVal / 100) * 220} style={{ transition: "stroke-dashoffset 0.1s" }} />
              {/* Tick marks */}
              {[0, 25, 50, 75, 100].map((v) => {
                const a = (-135 + (v / 100) * 270) * (Math.PI / 180);
                const r1 = 58, r2 = 68;
                return (
                  <line key={v}
                    x1={90 + r1 * Math.cos(a)} y1={95 + r1 * Math.sin(a)}
                    x2={90 + r2 * Math.cos(a)} y2={95 + r2 * Math.sin(a)}
                    stroke="#444" strokeWidth="2" />
                );
              })}
              {/* Needle */}
              <line
                x1="90" y1="95"
                x2={90 + 52 * Math.cos(needleAngle * Math.PI / 180)}
                y2={95 + 52 * Math.sin(needleAngle * Math.PI / 180)}
                stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"
                style={{ transition: "x2 0.05s, y2 0.05s" }}
              />
              <circle cx="90" cy="95" r="5" fill="#f97316" />
              <text x="90" y="78" textAnchor="middle" fill="#f97316" fontSize="13" fontWeight="700" fontFamily="monospace">{rpmVal}</text>
              <text x="90" y="108" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">COMMITS/SPRINT</text>
            </svg>
          </div>

          <div style={styles.badge}>Full-Stack Developer · Biker · Builder</div>
          <h1 style={styles.heroName}>
            <span style={styles.heroFirst}>SANKET</span>
            <br />
            <span style={styles.heroLast}>CHAUDHARI</span>
          </h1>
          <p style={styles.heroTagline}>
            I ride to think. I code to build.<br />
            <span style={styles.accent}>Production-grade systems</span> by day,<br />
            open roads by soul.
          </p>

          <div style={styles.heroBtns}>
            <button style={styles.primaryBtn} onClick={() => scrollTo("projects")}>
              View Projects <span style={styles.btnArrow}>→</span>
            </button>
            <a href="mailto:chaudharisanket2003@gmail.com" style={styles.ghostBtn}>Let's Talk</a>
          </div>

          <div style={styles.heroLinks}>
            <a href="https://linkedin.com/in/sanketkchaudhari" style={styles.socialLink} target="_blank" rel="noreferrer">LinkedIn</a>
            <span style={styles.socialDivider}>·</span>
            <a href="https://github.com/ChaudhariSanket12" style={styles.socialLink} target="_blank" rel="noreferrer">GitHub</a>
            <span style={styles.socialDivider}>·</span>
            <a href="https://sanketchaudhari.tech" style={styles.socialLink} target="_blank" rel="noreferrer">Website</a>
          </div>
        </div>

        {/* Bike SVG */}
        <div style={styles.bikeWrap}>
          <svg viewBox="0 0 420 220" width="100%" style={styles.bikeSvg}>
            <ellipse cx="210" cy="200" rx="160" ry="12" fill="#f97316" opacity="0.12" />
            {/* Rear wheel */}
            <circle cx="110" cy="175" r="42" fill="none" stroke="#333" strokeWidth="10" />
            <circle cx="110" cy="175" r="30" fill="none" stroke="#f97316" strokeWidth="3" opacity="0.5" />
            <circle cx="110" cy="175" r="8" fill="#f97316" />
            {[0, 45, 90, 135].map(a => {
              const rad = a * Math.PI / 180;
              return <line key={a} x1={110 + 8 * Math.cos(rad)} y1={175 + 8 * Math.sin(rad)} x2={110 + 30 * Math.cos(rad)} y2={175 + 30 * Math.sin(rad)} stroke="#555" strokeWidth="2.5" />;
            })}
            {/* Front wheel */}
            <circle cx="320" cy="175" r="42" fill="none" stroke="#333" strokeWidth="10" />
            <circle cx="320" cy="175" r="30" fill="none" stroke="#f97316" strokeWidth="3" opacity="0.5" />
            <circle cx="320" cy="175" r="8" fill="#f97316" />
            {[0, 45, 90, 135].map(a => {
              const rad = a * Math.PI / 180;
              return <line key={a} x1={320 + 8 * Math.cos(rad)} y1={175 + 8 * Math.sin(rad)} x2={320 + 30 * Math.cos(rad)} y2={175 + 30 * Math.sin(rad)} stroke="#555" strokeWidth="2.5" />;
            })}
            {/* Chain */}
            <ellipse cx="145" cy="175" rx="20" ry="8" fill="none" stroke="#444" strokeWidth="4" />
            {/* Frame */}
            <polygon points="110,175 155,105 230,105 265,155 215,155 195,175" fill="#1a1a2e" stroke="#f97316" strokeWidth="2.5" />
            {/* Seat */}
            <rect x="150" y="97" width="75" height="12" rx="6" fill="#2a2a3e" stroke="#666" strokeWidth="1.5" />
            {/* Tank */}
            <ellipse cx="215" cy="120" rx="38" ry="18" fill="#0f0f1a" stroke="#f97316" strokeWidth="2" />
            {/* Engine block */}
            <rect x="170" y="138" width="55" height="30" rx="4" fill="#111" stroke="#333" strokeWidth="2" />
            <rect x="178" y="143" width="15" height="10" rx="2" fill="#222" stroke="#555" strokeWidth="1" />
            <rect x="197" y="143" width="15" height="10" rx="2" fill="#222" stroke="#555" strokeWidth="1" />
            {/* Fork */}
            <line x1="265" y1="155" x2="290" y2="175" stroke="#555" strokeWidth="7" strokeLinecap="round" />
            <line x1="265" y1="155" x2="320" y2="175" stroke="#555" strokeWidth="4" strokeLinecap="round" />
            {/* Handlebar */}
            <line x1="255" y1="110" x2="280" y2="105" stroke="#666" strokeWidth="6" strokeLinecap="round" />
            <line x1="280" y1="105" x2="280" y2="118" stroke="#666" strokeWidth="5" strokeLinecap="round" />
            {/* Exhaust */}
            <path d="M 168 155 Q 140 170 115 168" fill="none" stroke="#888" strokeWidth="6" strokeLinecap="round" />
            <path d="M 115 168 Q 95 166 85 172" fill="none" stroke="#888" strokeWidth="4" strokeLinecap="round" />
            {/* Headlight */}
            <ellipse cx="340" cy="148" rx="12" ry="8" fill="#fbbf24" opacity="0.9" />
            <ellipse cx="340" cy="148" rx="8" ry="5" fill="#fff" opacity="0.5" />
            {/* Speed lines */}
            {[155, 162, 170, 178].map((y, i) => (
              <line key={y} x1={i % 2 === 0 ? 30 : 20} y1={y} x2={i % 2 === 0 ? 5 : 0} y2={y} stroke="#f97316" strokeWidth={2 - i * 0.3} opacity={0.6 - i * 0.1} />
            ))}
          </svg>
        </div>

        <div style={styles.scrollHint}>
          <span style={styles.scrollDot} />
          <span style={{ color: "#666", fontSize: "11px", letterSpacing: "2px" }}>SCROLL</span>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={styles.section}>
        <SectionLabel label="01 / ABOUT" />
        <div style={styles.aboutGrid}>
          <div style={styles.aboutLeft}>
            <h2 style={styles.sectionTitle}>
              Code at <span style={styles.accent}>full throttle.</span>
            </h2>
            <p style={styles.aboutText}>
              Full-Stack Java Developer with production deployment experience. I build Spring Boot REST APIs, real-time web applications, and database-driven platforms that actually ship and serve real users.
            </p>
            <p style={styles.aboutText}>
              Just like on a bike - I don't just start engines, I take them to the finish line. One production platform, 500–700 monthly visitors, 70+ leads captured. That's the kind of mileage I put on my code.
            </p>
            <div style={styles.statsRow}>
              {[
                { val: "500+", label: "Monthly Visitors" },
                { val: "70+", label: "Leads Captured" },
                { val: "45+", label: "REST Endpoints" },
                { val: "500K", label: "Ledger Rows Tested" },
              ].map(({ val, label }) => (
                <div key={label} style={styles.statCard}>
                  <span style={styles.statVal}>{val}</span>
                  <span style={styles.statLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.aboutRight}>
            <div style={styles.infoCard}>
              <InfoRow icon="📍" label="Location" val="Pune, Maharashtra" />
              <InfoRow icon="🎓" label="Education" val="MCA – JSPM RSCOE (CGPA 8.28)" />
              <InfoRow icon="📱" label="Phone" val="+91 7709841585" />
              <InfoRow icon="✉️" label="Email" val="chaudharisanket2003@gmail.com" />
              <InfoRow icon="🌐" label="Website" val="sanketchaudhari.tech" />
              <InfoRow icon="🏍️" label="Fuel Type" val="Caffeine + Open Roads" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ ...styles.section, background: "#07070d" }}>
        <SectionLabel label="02 / SKILLS" />
        <h2 style={styles.sectionTitle}>The <span style={styles.accent}>tech stack</span> in the garage.</h2>
        <div style={styles.skillsGrid}>
          {Object.entries(SKILLS).map(([cat, items]) => (
            <div key={cat} style={styles.skillGroup}>
              <div style={styles.skillCat}>{cat}</div>
              <div style={styles.skillTags}>
                {items.map((s) => (
                  <span key={s} style={styles.skillTag}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cert bar */}
        <div style={styles.certBar}>
          <span style={styles.certIcon}>🏅</span>
          <h6 style={styles.projName}>The <span style={styles.accent}>Certifications</span></h6>
          <span style={styles.certText}>Java Spring Framework, Spring Boot &amp; Spring AI - Udemy (Navin Reddy, Telusko) · Dec 2025 · 55hrs</span>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={styles.section}>
        <SectionLabel label="03 / EXPERIENCE" />
        <h2 style={styles.sectionTitle}>Miles <span style={styles.accent}>on the road.</span></h2>
        <div style={styles.expList}>
          {EXPERIENCE.map((e, i) => (
            <div key={i} style={styles.expCard}>
              <div style={styles.expLeft}>
                <div style={styles.expDot} />
                {i < EXPERIENCE.length - 1 && <div style={styles.expLine} />}
              </div>
              <div style={styles.expRight}>
                <div style={styles.expHeader}>
                  <div>
                    <div style={styles.expRole}>{e.role}</div>
                    <div style={styles.expCompany}>
                      {e.link ? <a href={e.link} style={styles.expLink} target="_blank" rel="noreferrer">{e.company} ↗</a> : e.company}
                    </div>
                  </div>
                  <div style={styles.expMeta}>
                    <span style={styles.expPeriod}>{e.period}</span>
                    <span style={styles.expLocation}>{e.location}</span>
                  </div>
                </div>
                <ul style={styles.expPoints}>
                  {e.points.map((p, pi) => (
                    <li key={pi} style={styles.expPoint}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ ...styles.section, background: "#07070d" }}>
        <SectionLabel label="04 / PROJECTS" />
        <h2 style={styles.sectionTitle}>Builds that <span style={styles.accent}>actually shipped.</span></h2>
        <div style={styles.projGrid}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={styles.section}>
        <SectionLabel label="05 / CONTACT" />
        <div style={styles.contactWrap}>
          <h2 style={{ ...styles.sectionTitle, textAlign: "center" }}>
            Let's <span style={styles.accent}>ride together.</span>
          </h2>
          <p style={styles.contactSub}>
            Whether it's a production problem, a new project, or just a good conversation about bikes and code - I'm in.
          </p>
          <div style={styles.contactLinks}>
            <ContactItem icon="✉️" label="Email" val="chaudharisanket2003@gmail.com" href="mailto:chaudharisanket2003@gmail.com" />
            <ContactItem icon="📱" label="Phone" val="+91 7709841585" href="tel:+917709841585" />
            <ContactItem icon="💼" label="LinkedIn" val="sanketkchaudhari" href="https://linkedin.com/in/sanketkchaudhari" />
            <ContactItem icon="🐙" label="GitHub" val="ChaudhariSanket12" href="https://github.com/ChaudhariSanket12" />
            <ContactItem icon="🌐" label="Website" val="sanketchaudhari.tech" href="https://sanketchaudhari.tech" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <span style={{ color: "#444" }}>Built by </span>
        <span style={{ color: "#444" }}>Sanket Chaudhari · 2026</span>
        <span style={{ color: "#f97316", marginLeft: "8px" }}>🏍️</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0a0e; }
        @keyframes roadAnim { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes pulse { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); opacity:0.4; } 50% { transform:translateY(-12px); opacity:0.9; } }
        @keyframes scrollBob { 0%,100% { transform:translateY(0); opacity:0.7; } 50% { transform:translateY(8px); opacity:0.3; } }
        @keyframes bikeFloat { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        @media (max-width: 768px) {
          .hero-content { padding: 0 20px !important; }
          .about-grid { flex-direction: column !important; }
          .proj-grid { grid-template-columns: 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#f97316", letterSpacing: "3px", marginBottom: "16px" }}>
      {label}
    </div>
  );
}

function InfoRow({ icon, label, val }) {
  return (
    <div style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #1a1a2e" }}>
      <span>{icon}</span>
      <span style={{ color: "#666", fontSize: "13px", minWidth: "80px", fontFamily: "JetBrains Mono, monospace" }}>{label}</span>
      <span style={{ color: "#ccc", fontSize: "13px" }}>{val}</span>
    </div>
  );
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...styles.projCard,
        borderColor: hovered ? project.color : "#1a1a2e",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 60px ${project.color}22` : "none",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.projTop}>
        <div style={{ ...styles.projEmoji, color: project.color }}>{project.emoji}</div>
        <span style={{ ...styles.projYear, color: project.color }}>{project.year}</span>
      </div>
      <h3 style={styles.projName}>{project.name}</h3>
      <div style={{ ...styles.projTagline, color: project.color }}>{project.tagline}</div>
      <p style={styles.projDesc}>{project.desc}</p>
      <div style={styles.projTags}>
        {project.tags.map((t) => (
          <span key={t} style={{ ...styles.techTag, borderColor: project.color + "44", color: project.color }}>{t}</span>
        ))}
      </div>
      <div style={styles.projFeatures}>
        {project.features.map((f) => (
          <span key={f} style={styles.featureChip}>✓ {f}</span>
        ))}
      </div>
      {project.link && project.link !== "#" && (
        <a href={project.link} target="_blank" rel="noreferrer" style={{ ...styles.projLink, color: project.color }}>
          View on GitHub →
        </a>
      )}
    </div>
  );
}

function ContactItem({ icon, label, val, href }) {
  return (
    <a href={href} style={styles.contactItem} target="_blank" rel="noreferrer">
      <span style={styles.contactIcon}>{icon}</span>
      <div>
        <div style={styles.contactLabel}>{label}</div>
        <div style={styles.contactVal}>{val}</div>
      </div>
    </a>
  );
}

const styles = {
  root: {
    fontFamily: "'Inter', sans-serif",
    background: "#0a0a0e",
    color: "#e0e0e0",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 40px",
    transition: "background 0.4s ease",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  logoIcon: { fontSize: "20px" },
  logoText: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: "22px",
    fontWeight: "900",
    color: "#f97316",
    letterSpacing: "2px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  navBtn: {
    background: "none",
    border: "none",
    color: "#aaa",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    padding: "6px 12px",
    letterSpacing: "0.5px",
    transition: "color 0.2s",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "color, transform",
  },
  navCta: {
    background: "#f97316",
    color: "#000",
    padding: "8px 20px",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "8px",
    letterSpacing: "0.5px",
  },
  burger: {
    display: "none",
    background: "none",
    border: "none",
    color: "#f97316",
    fontSize: "22px",
    cursor: "pointer",
  },
  mobileMenu: {
    position: "fixed",
    top: "60px",
    left: 0,
    right: 0,
    background: "#0a0a0e",
    zIndex: 99,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "4px",
    borderBottom: "1px solid #1a1a2e",
  },
  mobileBtn: {
    background: "none",
    border: "none",
    color: "#ccc",
    fontSize: "16px",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    padding: "12px 0",
    textAlign: "left",
    borderBottom: "1px solid #111",
  },
  hero: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "radial-gradient(ellipse at 20% 50%, #1a0a00 0%, #0a0a0e 60%)",
  },
  road: {
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    opacity: 0.08,
    pointerEvents: "none",
  },
  roadLine: {
    width: "2px",
    height: "120px",
    background: "linear-gradient(to bottom, transparent, #f97316, transparent)",
    animation: "roadAnim 2s linear infinite",
  },
  particle: {
    position: "absolute",
    borderRadius: "50%",
    background: "#f97316",
    animation: "float 4s ease-in-out infinite",
    pointerEvents: "none",
  },
  heroContent: {
    textAlign: "center",
    zIndex: 2,
    padding: "0 20px",
    maxWidth: "680px",
  },
  gaugeWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  gaugeSvg: { filter: "drop-shadow(0 0 12px #f9731640)" },
  badge: {
    display: "inline-block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    color: "#f97316",
    letterSpacing: "3px",
    border: "1px solid #f9731644",
    padding: "6px 16px",
    borderRadius: "2px",
    marginBottom: "24px",
    background: "#f9731608",
  },
  heroName: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: "clamp(56px, 12vw, 110px)",
    fontWeight: "900",
    lineHeight: "0.9",
    letterSpacing: "-2px",
    marginBottom: "28px",
  },
  heroFirst: { color: "#ffffff" },
  heroLast: {
    color: "transparent",
    WebkitTextStroke: "2px #f97316",
  },
  heroTagline: {
    fontSize: "17px",
    color: "#888",
    lineHeight: "1.8",
    marginBottom: "36px",
  },
  accent: { color: "#f97316" },
  heroBtns: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "36px",
  },
  primaryBtn: {
    background: "#f97316",
    color: "#000",
    border: "none",
    padding: "14px 32px",
    fontSize: "14px",
    fontWeight: "700",
    borderRadius: "4px",
    cursor: "pointer",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  btnArrow: { fontSize: "18px" },
  ghostBtn: {
    background: "transparent",
    color: "#f97316",
    border: "1px solid #f97316",
    padding: "14px 32px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
    letterSpacing: "0.5px",
  },
  heroLinks: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    alignItems: "center",
  },
  socialLink: {
    color: "#666",
    fontSize: "12px",
    textDecoration: "none",
    letterSpacing: "1px",
    fontFamily: "'JetBrains Mono', monospace",
    transition: "color 0.2s",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "color, transform",
  },
  socialDivider: { color: "#333" },
  bikeWrap: {
    position: "absolute",
    bottom: "20px",
    right: "-20px",
    width: "min(420px, 50vw)",
    opacity: 0.35,
    animation: "bikeFloat 4s ease-in-out infinite",
    pointerEvents: "none",
  },
  bikeSvg: { width: "100%", height: "auto" },
  scrollHint: {
    position: "absolute",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    zIndex: 3,
  },
  scrollDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#f97316",
    animation: "scrollBob 2s ease-in-out infinite",
  },
  section: {
    padding: "100px 40px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: "clamp(36px, 6vw, 60px)",
    fontWeight: "800",
    color: "#fff",
    lineHeight: "1.1",
    marginBottom: "40px",
  },
  aboutGrid: {
    display: "flex",
    gap: "60px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  aboutLeft: { flex: "1 1 340px" },
  aboutRight: { flex: "1 1 300px" },
  aboutText: {
    color: "#888",
    lineHeight: "1.8",
    marginBottom: "20px",
    fontSize: "15px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "32px",
  },
  statCard: {
    background: "#0f0f1a",
    border: "1px solid #1a1a2e",
    borderRadius: "8px",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statVal: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: "32px",
    fontWeight: "800",
    color: "#f97316",
  },
  statLabel: {
    fontSize: "11px",
    color: "#666",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  infoCard: {
    background: "#0f0f1a",
    border: "1px solid #1a1a2e",
    borderRadius: "10px",
    padding: "20px 24px",
  },
  skillsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  skillGroup: {
    background: "#0f0f1a",
    border: "1px solid #1a1a2e",
    borderRadius: "10px",
    padding: "20px",
  },
  skillCat: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    color: "#f97316",
    letterSpacing: "2px",
    marginBottom: "14px",
    textTransform: "uppercase",
  },
  skillTags: { display: "flex", flexWrap: "wrap", gap: "8px" },
  skillTag: {
    background: "#1a1a2e",
    color: "#ccc",
    padding: "5px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  certBar: {
    background: "#0f0f1a",
    border: "1px solid #f9731633",
    borderRadius: "8px",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  certIcon: { fontSize: "22px" },
  certText: { color: "#888", fontSize: "13px", lineHeight: "1.5" },
  expList: { display: "flex", flexDirection: "column", gap: "0" },
  expCard: { display: "flex", gap: "24px", paddingBottom: "40px" },
  expLeft: { display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4px" },
  expDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#f97316",
    border: "3px solid #0a0a0e",
    boxShadow: "0 0 0 2px #f97316",
    flexShrink: 0,
  },
  expLine: {
    width: "2px",
    flex: 1,
    background: "linear-gradient(to bottom, #f97316, #1a1a2e)",
    marginTop: "8px",
    minHeight: "60px",
  },
  expRight: { flex: 1 },
  expHeader: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  expRole: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    fontFamily: "'Barlow Condensed', sans-serif",
    letterSpacing: "0.5px",
  },
  expCompany: { fontSize: "14px", color: "#888", marginTop: "4px" },
  expLink: { color: "#f97316", textDecoration: "none" },
  expMeta: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" },
  expPeriod: { fontSize: "12px", color: "#f97316", fontFamily: "'JetBrains Mono', monospace" },
  expLocation: { fontSize: "11px", color: "#555" },
  expPoints: {
    listStyle: "none",
    display: "block",
    gap: "10px",
    paddingLeft: "20px",
    margin: 0,
    textAlign: "left",
  },
  expPoint: {
    color: "#888",
    fontSize: "14px",
    lineHeight: "1.8",
    paddingLeft: "0",
    marginBottom: "10px",
    position: "relative",
    textAlign: "left",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "transform",
  },
  projGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))",
    gap: "28px",
  },
  projCard: {
    background: "#0f0f1a",
    border: "1px solid #1a1a2e",
    borderRadius: "12px",
    padding: "28px",
    cursor: "default",
  },
  projTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  projEmoji: { fontSize: "28px" },
  projYear: {
    fontSize: "11px",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "2px",
  },
  projName: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: "26px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "4px",
    letterSpacing: "0.5px",
  },
  projTagline: {
    fontSize: "12px",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "1px",
    marginBottom: "14px",
    textTransform: "uppercase",
  },
  projDesc: { color: "#777", fontSize: "13px", lineHeight: "1.7", marginBottom: "18px" },
  projTags: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" },
  techTag: {
    fontSize: "11px",
    padding: "4px 10px",
    border: "1px solid",
    borderRadius: "3px",
    fontFamily: "'JetBrains Mono', monospace",
    background: "transparent",
  },
  projFeatures: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" },
  featureChip: {
    background: "#1a1a2e",
    color: "#666",
    fontSize: "11px",
    padding: "4px 10px",
    borderRadius: "3px",
  },
  projLink: {
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.5px",
  },
  contactWrap: {
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
  },
  contactSub: {
    color: "#777",
    fontSize: "16px",
    lineHeight: "1.7",
    marginBottom: "48px",
  },
  contactLinks: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
    textAlign: "left",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#0f0f1a",
    border: "1px solid #1a1a2e",
    borderRadius: "10px",
    padding: "18px 20px",
    textDecoration: "none",
    transition: "border-color 0.2s",
  },
  contactIcon: { fontSize: "22px" },
  contactLabel: {
    fontSize: "11px",
    color: "#555",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  contactVal: { color: "#ccc", fontSize: "13px" },
  footer: {
    textAlign: "center",
    padding: "32px",
    background: "#07070d",
    borderTop: "1px solid #111",
    fontSize: "13px",
  },
};