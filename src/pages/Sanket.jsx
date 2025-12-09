// Modern Portfolio - Sanket Chaudhari
import React, { useEffect, useRef, useState } from "react";
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaCode, FaServer, FaDatabase,
  FaReact, FaNodeJs, FaJava, FaPython,
  FaHtml5, FaCss3Alt, FaGitAlt, FaTools,
  FaAnchor, FaComments, FaDownload, FaExternalLinkAlt,
  FaGraduationCap, FaBriefcase, FaCertificate,
  FaFolderOpen, FaHome, FaUser,
  FaLightbulb, FaBuilding,
  FaUsers, FaBell,
  FaLock, FaMoneyCheckAlt
} from 'react-icons/fa';
import { 
  SiExpress, SiMongodb, SiSpringboot, 
  SiTailwindcss, SiSocketdotio, SiJavascript,
  SiPostman
} from 'react-icons/si';

const Sanket = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef(null);

  // Profile Links
  const profileLinks = [
    {
      name: "GitHub",
      url: "https://github.com/ChaudhariSanket12",
      icon: <FaGithub />,
      color: "#6e5494"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/sanketkchaudhari",
      icon: <FaLinkedin />,
      color: "#0077b5"
    },
    {
      name: "Email",
      url: "mailto:chaudharisanket2003@gmail.com",
      icon: <FaEnvelope />,
      color: "#ea4335"
    },
    {
      name: "Phone",
      url: "tel:+917709841585",
      icon: <FaPhone />,
      color: "#34a853"
    }
  ];

  // Skills with icons
  const skills = [
    { name: "Java", icon: <FaJava />, category: "backend", color: "#f89820" },
    { name: "JavaScript", icon: <SiJavascript />, category: "frontend", color: "#f7df1e" },
    { name: "Python", icon: <FaPython />, category: "backend", color: "#3776ab" },
    { name: "React", icon: <FaReact />, category: "frontend", color: "#61dafb" },
    { name: "Node.js", icon: <FaNodeJs />, category: "backend", color: "#339933" },
    { name: "MongoDB", icon: <SiMongodb />, category: "database", color: "#47a248" },
    { name: "Express.js", icon: <SiExpress />, category: "backend", color: "#000000" },
    { name: "Spring Boot", icon: <SiSpringboot />, category: "backend", color: "#6db33f" },
    { name: "MySQL", icon: <FaDatabase />, category: "database", color: "#4479a1" },
    { name: "HTML5", icon: <FaHtml5 />, category: "frontend", color: "#e34f26" },
    { name: "CSS3", icon: <FaCss3Alt />, category: "frontend", color: "#1572b6" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, category: "frontend", color: "#06b6d4" },
    { name: "Socket.io", icon: <SiSocketdotio />, category: "tools", color: "#010101" },
    { name: "Git", icon: <FaGitAlt />, category: "tools", color: "#f05032" },
    { name: "JWT Auth", icon: <FaLock />, category: "tools", color: "#000000" },
    { name: "REST APIs", icon: <FaServer />, category: "backend", color: "#009688" }
  ];

  // Projects with images
  const projects = [
    {
      title: "RentEz",
      subtitle: "Property Rental Platform",
      description: "Full-stack application connecting property owners and tenants with real-time messaging, automated rent reminders, and property management features.",
      tech: ["MERN", "Socket.io", "JWT", "Tailwind CSS", "Mapbox"],
      features: ["Real-time Chat", "Payment Tracking", "Automated Reminders", "Image Upload", "Location Maps"],
      image: "/rentez.png",
      icon: <FaBuilding />,
      color: "#00d4ff",
      github: "https://github.com/ChaudhariSanket12/RentEz",
      live: "#"
    },
    {
      title: "Vicharmanthan",
      subtitle: "Startup Collaboration Platform",
      description: "Social platform for startup enthusiasts to share ideas, find co-founders, and collaborate with real-time chat and community features.",
      tech: ["MERN", "Socket.io", "Real-time Chat", "Search & Filter"],
      features: ["Idea Sharing", "Team Building", "Real-time Chat", "User Profiles", "Admin Panel"],
      image: "/vicharmanthan.png",
      icon: <FaUsers />,
      color: "#8b5cf6",
      github: "https://github.com/ChaudhariSanket12/VicharManthan",
      live: "#"
    }
  ];

  // Experience
  const experiences = [
    {
      role: "Anchoring Head",
      company: "OneVerse Club – JSPM's RSCOE, Pune",
      duration: "Jun 2024 – Present",
      description: "Lead anchoring activities for college events, preparing scripts and managing stage presentations. Develop team communication and hosting skills for effective event coordination.",
      icon: <FaComments />,
      skills: ["Public Speaking", "Leadership", "Event Management", "Team Coordination"]
    }
  ];

  // Education
  const education = [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "JSPM Rajarshi Shahu College of Engineering, Pune",
      icon: <FaGraduationCap />,
      year: "Aug 2024 – Present"
    },
    {
      degree: "Bachelor of Vocational (Industrial Automation & Mechatronics)",
      institution: "KCE's College of Engineering and Management, Jalgaon",
      icon: <FaTools />,
      year: "Jun 2020 – Jun 2023"
    },
    {
      degree: "12th (State Board)",
      institution: "DS. High School, Bhusawal, Jalgaon",
      icon: <FaCertificate />,
      year: "Feb 2020"
    }
  ];

  // Certifications
  const certifications = [
    {
      name: "Communication Skills for BPM Industry",
      issuer: "Wadhwani Foundation",
      icon: <FaComments />
    },
    {
      name: "Mastering Data Structures & Algorithms using C and C++",
      issuer: "Online Course",
      icon: <FaCode />
    },
    {
      name: "Host and Anchor for Annual College Events",
      issuer: "2024 Achievement",
      icon: <FaAnchor />
    }
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
      }

      draw() {
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = './Resume - Sanket_Chaudhari.pdf';
    link.download = 'Resume - Sanket Chaudhari.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modern-portfolio">
      {/* Animated Background */}
      <canvas ref={canvasRef} className="background-canvas" />

      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${(scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%` }} />

      {/* Navigation */}
      <nav className={`navbar ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <FaCode className="brand-icon" />
            <span>Sanket Chaudhari</span>
          </div>

          <ul className="nav-menu">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>Home</a></li>
            <li><a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection("skills"); }}>Skills</a></li>
            <li><a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection("projects"); }}>Projects</a></li>
            <li><a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection("experience"); }}>Experience</a></li>
            <li><a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection("education"); }}>Education</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>Contact</a></li>
          </ul>

          <button onClick={handleResumeDownload} className="resume-btn">
            <FaDownload /> Resume
          </button>

          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>Home</a></li>
          <li><a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection("skills"); }}>Skills</a></li>
          <li><a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection("projects"); }}>Projects</a></li>
          <li><a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection("experience"); }}>Experience</a></li>
          <li><a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection("education"); }}>Education</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>Contact</a></li>
          <li><button onClick={handleResumeDownload} className="mobile-resume-btn"><FaDownload /> Download Resume</button></li>
        </ul>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Hi, I'm <span className="gradient-text">Sanket Chaudhari</span>
              </h1>
              <h2 className="hero-subtitle">Full Stack Developer</h2>
              <p className="hero-description">
                Proficient in MERN stack (MongoDB, Express.js, React, Node.js) and Java stack (Spring Boot, JSP, Servlets). 
                Experienced in building real-time web applications with secure authentication, REST APIs, and responsive interfaces.
              </p>
              <div className="hero-tags">
                <span className="tag">MERN Stack</span>
                <span className="tag">Java Spring Boot</span>
                <span className="tag">Real-time Apps</span>
                <span className="tag">REST APIs</span>
              </div>
              <div className="hero-buttons">
                <button onClick={() => scrollToSection("projects")} className="btn-primary">
                  View Projects
                </button>
                <button onClick={() => scrollToSection("contact")} className="btn-secondary">
                  Get In Touch
                </button>
              </div>
            </div>
            <div className="hero-image">
              <div className="profile-circle">
                <img src="/sanket.jpg" alt="Sanket Chaudhari" className="profile-photo" />
              </div>
              <div className="social-links">
                {profileLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ '--link-color': link.color }}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <h2 className="section-title">
            <FaCode className="section-icon" />
            Technical Skills
          </h2>
          
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-card" style={{ '--skill-color': skill.color }}>
                <div className="skill-icon">{skill.icon}</div>
                <div className="skill-name">{skill.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">
            <FaFolderOpen className="section-icon" />
            Featured Projects
          </h2>
          
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <div className="project-icon" style={{ color: project.color }}>
                      {project.icon}
                    </div>
                  </div>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-tech">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  
                  <div className="project-links">
                    <a href={project.github} className="project-link" target="_blank" rel="noopener noreferrer">
                      <FaGithub /> View Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="experience">
        <div className="container">
          <h2 className="section-title">
            <FaBriefcase className="section-icon" />
            Experience
          </h2>
          
          <div className="experience-grid">
            {experiences.map((exp, index) => (
              <div key={index} className="experience-card">
                <div className="experience-icon">{exp.icon}</div>
                <div className="experience-content">
                  <h3>{exp.role}</h3>
                  <p className="company">{exp.company}</p>
                  <p className="duration">{exp.duration}</p>
                  <p className="description">{exp.description}</p>
                  <div className="skills-tags">
                    {exp.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="soft-skills">
            <h3>Soft Skills</h3>
            <div className="soft-skills-grid">
              <div className="soft-skill-item"><FaComments /> Anchoring & Public Speaking</div>
              <div className="soft-skill-item"><FaUsers /> Leadership</div>
              <div className="soft-skill-item"><FaBell /> Communication</div>
              <div className="soft-skill-item"><FaLightbulb /> Event Coordination</div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section id="education" className="education">
        <div className="container">
          <div className="education-container">
            <div className="education-section">
              <h2 className="section-title">
                <FaGraduationCap className="section-icon" />
                Education
              </h2>
              
              <div className="education-timeline">
                {education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <div className="education-icon">{edu.icon}</div>
                    <div className="education-content">
                      <h3>{edu.degree}</h3>
                      <p className="institution">{edu.institution}</p>
                      <p className="year">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="certifications-section">
              <h2 className="section-title">
                <FaCertificate className="section-icon" />
                Certifications
              </h2>
              
              <div className="certifications-grid">
                {certifications.map((cert, index) => (
                  <div key={index} className="certification-item">
                    <div className="certification-icon">{cert.icon}</div>
                    <div className="certification-content">
                      <h3>{cert.name}</h3>
                      <p className="issuer">{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">
            <FaEnvelope className="section-icon" />
            Get In Touch
          </h2>
          
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h3>Email</h3>
                  <a href="mailto:chaudharisanket2003@gmail.com">chaudharisanket2003@gmail.com</a>
                </div>
              </div>
              
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <h3>Phone</h3>
                  <a href="tel:+91770">+91 770</a>
                </div>
              </div>
              
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h3>Location</h3>
                  <p>Pune, Maharashtra, India</p>
                </div>
              </div>
              
              <div className="contact-socials">
                {profileLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="contact-social"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: link.color }}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="contact-form-container">
              <h3>Send me a message</h3>
              <form className="contact-form">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message" rows="5"></textarea>
                <button type="submit" className="submit-btn">
                  <FaEnvelope /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <FaCode />
              <span>Sanket Chaudhari</span>
            </div>
            
            <div className="footer-links">
              <button onClick={() => scrollToSection("home")}>Home</button>
              <button onClick={() => scrollToSection("projects")}>Projects</button>
              <button onClick={() => scrollToSection("skills")}>Skills</button>
              <button onClick={() => scrollToSection("contact")}>Contact</button>
            </div>
            
            <div className="footer-socials">
              {profileLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: link.color }}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            
            <p className="footer-copyright">
              © {new Date().getFullYear()} Sanket Chaudhari. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #0d1117;
          color: #c9d1d9;
          overflow-x: hidden;
        }

        .modern-portfolio {
          min-height: 100vh;
          position: relative;
        }

        /* Smooth animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        section {
          animation: fadeIn 0.6s ease-out;
        }

        .background-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0.3;
        }

        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #58a6ff, #1f6feb);
          z-index: 1001;
          transition: width 0.1s ease;
          box-shadow: 0 0 10px rgba(88, 166, 255, 0.5);
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 75px;
          background: rgba(13, 17, 23, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #21262d;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled {
          background: rgba(13, 17, 23, 0.95);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          border-bottom-color: #30363d;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 3rem;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
        }

        .brand-icon {
          color: #58a6ff;
          font-size: 1.8rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .nav-menu {
          display: flex;
          list-style: none;
          gap: 2.5rem;
          align-items: center;
          margin: 0;
          padding: 0;
        }

        .nav-menu a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-menu a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #58a6ff, #1f6feb);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-menu a:hover {
          color: #ffffff;
        }

        .nav-menu a:hover::after {
          width: 100%;
        }

        .resume-btn {
          background: linear-gradient(135deg, #238636, #2ea043);
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 0 1px rgba(35, 134, 54, 0.4);
        }

        .resume-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(35, 134, 54, 0.4), 0 8px 25px rgba(35, 134, 54, 0.3);
          background: linear-gradient(135deg, #2ea043, #3fb950);
        }

        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .mobile-menu-btn span {
          width: 28px;
          height: 3px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn.active span:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }

        .mobile-menu-btn.active span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100vh;
          background: rgba(10, 14, 39, 0.98);
          backdrop-filter: blur(20px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: left 0.3s ease;
        }

        .mobile-menu.active {
          left: 0;
        }

        .mobile-menu ul {
          list-style: none;
          text-align: center;
          padding: 0;
        }

        .mobile-menu li {
          margin: 2rem 0;
        }

        .mobile-menu a {
          color: #ffffff;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .mobile-menu a:hover {
          color: #00d4ff;
        }

        .mobile-resume-btn {
          background: linear-gradient(135deg, #00d4ff, #0066ff);
          color: #ffffff;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          margin: 0 auto;
        }

        /* Container */
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 3rem;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 75px;
          position: relative;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
          padding: 4rem 0;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
          animation: fadeInUp 0.8s ease-out;
        }

        .gradient-text {
          background: linear-gradient(135deg, #58a6ff, #1f6feb, #a371f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-subtitle {
          font-size: 1.8rem;
          color: #8b949e;
          margin-bottom: 1.5rem;
          font-weight: 500;
          font-family: 'JetBrains Mono', monospace;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #cbd5e1;
          margin-bottom: 2rem;
        }

        .hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .tag {
          background: rgba(56, 139, 253, 0.1);
          border: 1px solid #1f6feb;
          color: #58a6ff;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: 'Fira Code', monospace;
          transition: all 0.3s ease;
        }

        .tag:hover {
          background: rgba(56, 139, 253, 0.15);
          transform: translateY(-2px);
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #1f6feb, #388bfd);
          color: #ffffff;
          border: none;
          padding: 1rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 0 1px rgba(31, 111, 235, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 0 1px rgba(31, 111, 235, 0.4), 0 10px 30px rgba(31, 111, 235, 0.4);
          background: linear-gradient(135deg, #388bfd, #58a6ff);
        }

        .btn-secondary {
          background: transparent;
          color: #c9d1d9;
          border: 1px solid #30363d;
          padding: 1rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-secondary:hover {
          border-color: #58a6ff;
          color: #58a6ff;
          background: rgba(56, 139, 253, 0.1);
          transform: translateY(-3px);
        }

        .hero-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .profile-circle {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1f6feb, #388bfd, #a371f7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          color: #ffffff;
          box-shadow: 0 20px 60px rgba(31, 111, 235, 0.3);
          animation: float 3s ease-in-out infinite;
          border: 3px solid #30363d;
          overflow: hidden;
          position: relative;
        }
        
        .profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.3s ease;
        }
        
        .profile-circle:hover .profile-photo {
          transform: scale(1.1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .social-links {
          display: flex;
          gap: 1.5rem;
        }

        .social-link {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--link-color);
          font-size: 1.3rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--link-color);
          color: #ffffff;
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        /* Sections */
        section {
          padding: 6rem 0;
          position: relative;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 3rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .section-icon {
          color: #58a6ff;
          font-size: 2.2rem;
          animation: slideInLeft 0.6s ease-out;
        }

        /* Skills Section */
        .skills {
          background: rgba(22, 27, 34, 0.6);
          border-top: 1px solid #21262d;
          border-bottom: 1px solid #21262d;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1.5rem;
        }

        .skill-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          animation: fadeInUp 0.6s ease-out both;
        }

        .skill-card:hover {
          background: #1c2128;
          border-color: var(--skill-color);
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--skill-color);
        }

        .skill-icon {
          font-size: 3rem;
          color: var(--skill-color);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .skill-card:hover .skill-icon {
          transform: scale(1.2) rotate(5deg);
          filter: drop-shadow(0 0 20px var(--skill-color));
        }

        .skill-name {
          font-size: 0.95rem;
          font-weight: 600;
          text-align: center;
          color: #cbd5e1;
        }

        /* Projects Section */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2.5rem;
        }

        .project-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 6px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out both;
        }

        .project-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px #58a6ff;
          border-color: #58a6ff;
        }

        .project-image {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }

        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .project-card:hover .project-image img {
          transform: scale(1.1);
        }

        .project-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent, rgba(10, 14, 39, 0.9));
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .project-card:hover .project-overlay {
          opacity: 1;
        }

        .project-icon {
          font-size: 2.5rem;
        }

        .project-content {
          padding: 2rem;
        }

        .project-content h3 {
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .project-subtitle {
          color: #00d4ff;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .project-description {
          color: #94a3b8;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .tech-tag {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #8b5cf6;
          padding: 0.4rem 0.9rem;
          border-radius: 15px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .project-links {
          display: flex;
          gap: 1rem;
        }

        .project-link {
          width: 100%;
          background: linear-gradient(135deg, #238636, #2ea043);
          color: #ffffff;
          border: none;
          padding: 0.9rem 1.2rem;
          border-radius: 6px;
          text-decoration: none;
          text-align: center;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 0 1px rgba(35, 134, 54, 0.4);
        }

        .project-link:hover {
          background: linear-gradient(135deg, #2ea043, #3fb950);
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(35, 134, 54, 0.4), 0 8px 20px rgba(35, 134, 54, 0.3);
        }

        /* Experience Section */
        .experience {
          background: rgba(26, 31, 58, 0.3);
        }

        .experience-grid {
          display: grid;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .experience-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          display: flex;
          gap: 2rem;
          transition: all 0.3s ease;
        }

        .experience-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(0, 212, 255, 0.5);
        }

        .experience-icon {
          font-size: 3rem;
          color: #00d4ff;
          flex-shrink: 0;
        }

        .experience-content h3 {
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .company {
          color: #94a3b8;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .duration {
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          display: inline-block;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .description {
          color: #cbd5e1;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .skill-tag {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #8b5cf6;
          padding: 0.4rem 0.9rem;
          border-radius: 15px;
          font-size: 0.85rem;
        }

        .soft-skills {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
        }

        .soft-skills h3 {
          font-size: 1.6rem;
          margin-bottom: 1.5rem;
          color: #ffffff;
        }

        .soft-skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .soft-skill-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          color: #cbd5e1;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .soft-skill-item:hover {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }

        .soft-skill-item svg {
          font-size: 1.5rem;
          color: #8b5cf6;
        }

        /* Education Section */
        .education-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .education-timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .education-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .education-item:hover {
          transform: translateX(10px);
          border-color: rgba(0, 212, 255, 0.5);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .education-icon {
          font-size: 2rem;
          color: #00d4ff;
          flex-shrink: 0;
        }

        .education-content h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .institution {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }

        .year {
          color: #00d4ff;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .certifications-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .certification-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.8rem;
          display: flex;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .certification-item:hover {
          transform: translateX(10px);
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .certification-icon {
          font-size: 1.8rem;
          color: #8b5cf6;
          flex-shrink: 0;
        }

        .certification-content h3 {
          font-size: 1rem;
          margin-bottom: 0.4rem;
          color: #ffffff;
        }

        .issuer {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        /* Contact Section */
        .contact {
          background: rgba(26, 31, 58, 0.3);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .contact-item {
          display: flex;
          gap: 1.5rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          border-color: rgba(0, 212, 255, 0.5);
          transform: translateY(-5px);
        }

        .contact-icon {
          font-size: 2rem;
          color: #00d4ff;
          flex-shrink: 0;
        }

        .contact-item h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .contact-item a,
        .contact-item p {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-item a:hover {
          color: #00d4ff;
        }

        .contact-socials {
          display: flex;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .contact-social {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .contact-social:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .contact-form-container {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
        }

        .contact-form-container h3 {
          font-size: 1.6rem;
          margin-bottom: 2rem;
          color: #ffffff;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 1rem 1.2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 1rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: #00d4ff;
          background: rgba(255, 255, 255, 0.08);
        }

        .submit-btn {
          background: linear-gradient(135deg, #00d4ff, #0066ff);
          color: #ffffff;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
        }

        /* Footer */
        .footer {
          background: rgba(10, 14, 39, 0.8);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem 0;
        }

        .footer-content {
          text-align: center;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 2rem;
        }

        .footer-brand svg {
          color: #00d4ff;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-links button {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 0.95rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .footer-links button:hover {
          color: #ffffff;
        }

        .footer-socials {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .footer-socials a {
          font-size: 1.3rem;
          transition: all 0.3s ease;
        }

        .footer-socials a:hover {
          transform: translateY(-3px);
        }

        .footer-copyright {
          color: #64748b;
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .nav-container,
          .container {
            padding: 0 2rem;
          }

          .hero-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hero-image {
            order: -1;
          }

          .profile-circle {
            width: 250px;
            height: 250px;
            font-size: 4rem;
          }
        }

        @media (max-width: 968px) {
          .nav-menu,
          .resume-btn {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.4rem;
          }

          .skills-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .education-container,
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .section-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 640px) {
          .nav-container,
          .container {
            padding: 0 1.5rem;
          }

          .navbar {
            height: 65px;
          }

          .nav-brand {
            font-size: 1.2rem;
          }

          .brand-icon {
            font-size: 1.5rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .profile-circle {
            width: 200px;
            height: 200px;
            font-size: 3rem;
          }

          .skills-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 1rem;
          }

          .skill-card {
            padding: 1.5rem 0.8rem;
          }

          .skill-icon {
            font-size: 2.5rem;
          }

          .section-title {
            font-size: 1.6rem;
          }

          .section-icon {
            font-size: 1.8rem;
          }

          section {
            padding: 4rem 0;
          }

          .soft-skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Sanket;