import React from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight, LuSparkles, LuBrainCircuit, LuTarget, LuUsers, LuFileText, LuTrendingUp, LuSun, LuMoon } from 'react-icons/lu';
import logoIcon from '../assets/UConnect.png';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-page" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* ── Background Mesh ──────────────────────── */}
      <div className="auth-mesh" style={{ position: 'fixed', zIndex: 0, pointerEvents: 'none' }}>
        <div className="auth-mesh-dot" style={{ width: '800px', height: '800px', opacity: 0.5 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* ── Navbar ────────────────────────────────── */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 48px',
          background: 'rgba(5, 8, 16, 0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div className="auth-logo" style={{ marginBottom: 0 }}>
            <div className="auth-logo-icon" style={{ width: 32, height: 32 }}>
              <img src={logoIcon} alt="UConnect Logo" />
            </div>
            <span className="auth-logo-text" style={{ fontSize: '1.2rem' }}>Connect</span>
          </div>
          
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              className="theme-btn"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <LuSun /> : <LuMoon />}
            </button>
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/register" className="btn btn-primary">
              Get Started <LuArrowRight size={16} />
            </Link>
          </div>
        </nav>

        {/* ── Hero Section ──────────────────────────── */}
        <section style={{ 
          padding: '120px 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 900,
          margin: '0 auto'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 99,
            color: 'var(--indigo-light)',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: 32,
            animation: 'fadeSlideUp 0.5s ease both'
          }}>
            <LuSparkles size={14} /> The Next-Gen Academic Network
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-1px',
            marginBottom: 24,
            animation: 'fadeSlideUp 0.6s ease both',
            animationDelay: '100ms'
          }}>
            Turn Academic Work Into <br />
            <span className="gradient-text">Career Assets</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-2)',
            lineHeight: 1.6,
            maxWidth: 600,
            marginBottom: 40,
            animation: 'fadeSlideUp 0.7s ease both',
            animationDelay: '200ms'
          }}>
            UConnect brings students, teachers, and recruiters together. Build verifiable portfolios, form AI-balanced teams, and discover real career opportunities.
          </p>

          <div style={{ 
            display: 'flex', 
            gap: 16, 
            animation: 'fadeSlideUp 0.8s ease both',
            animationDelay: '300ms'
          }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: 10 }}>
              Start Free Today <LuArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-outline btn-lg">
              Explore Features
            </a>
          </div>
        </section>

        {/* ── Stats Section ─────────────────────────── */}
        <section style={{ maxWidth: 1000, margin: '0 auto 100px', padding: '0 20px' }}>
          <div className="stats-grid">
            <div className="stat-card purple">
              <div className="stat-icon purple"><LuUsers /></div>
              <div>
                <div className="stat-value">10k+</div>
                <div className="stat-label">Active Students</div>
              </div>
            </div>
            <div className="stat-card blue">
              <div className="stat-icon blue"><LuTarget /></div>
              <div>
                <div className="stat-value">500+</div>
                <div className="stat-label">Projects Built</div>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon green"><LuTrendingUp /></div>
              <div>
                <div className="stat-value">95%</div>
                <div className="stat-label">Placement Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Section ──────────────────────── */}
        <section id="features" style={{ 
          maxWidth: 1200, 
          margin: '0 auto 120px', 
          padding: '0 20px' 
        }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '2.5rem', 
              fontWeight: 700,
              marginBottom: 16
            }}>Everything You Need to Succeed</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '1.1rem' }}>
              Powerful tools designed specifically for the university ecosystem.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 24 
          }}>
            {[
              { 
                icon: LuBrainCircuit, title: 'AI Team Formation', 
                desc: 'Intelligent matching based on skills, interests, and availability. Build balanced, diverse teams automatically.',
                color: 'purple'
              },
              { 
                icon: LuFileText, title: 'U-Resume Builder', 
                desc: 'Generate polished, ATS-friendly resumes from your profile with AI-powered bullet point optimization.',
                color: 'blue'
              },
              { 
                icon: LuTarget, title: 'Job Matching', 
                desc: 'AI-powered job recommendations with skill gap analysis and personalized career roadmaps.',
                color: 'amber'
              },
              { 
                icon: LuTrendingUp, title: 'U-Score Reputation', 
                desc: 'Build verifiable reputation through project outcomes, peer reviews, and mentor endorsements.',
                color: 'green'
              }
            ].map((f, i) => (
              <div key={i} className="card card-glass" style={{ padding: 32 }}>
                <div className={`stat-icon ${f.color}`} style={{ marginBottom: 24 }}>
                  <f.icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA / Footer Section ──────────────────── */}
        <section style={{
          background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.05))',
          padding: '100px 20px',
          textAlign: 'center',
          borderTop: '1px solid var(--border)'
        }}>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '3rem', 
            fontWeight: 800,
            marginBottom: 24
          }}>Ready to accelerate?</h2>
          <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', marginBottom: 40 }}>
            Join thousands of students who are building their future with UConnect.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Your Free Account
          </Link>
          
          <div style={{ 
            marginTop: 100, 
            paddingTop: 40, 
            borderTop: '1px solid var(--border)',
            color: 'var(--text-3)',
            fontSize: '0.85rem'
          }}>
            © {new Date().getFullYear()} UConnect. Designed for the future of education.
          </div>
        </section>
        
      </div>
    </div>
  );
}
