import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuGraduationCap, LuBookOpen, LuShield, LuZap, LuUsers, LuArrowRight, LuSun, LuMoon } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import logoIcon from '../assets/UConnect.png';
import fullLogo from '../assets/UConnect(512 x 512 px).png';

const features = [
  { icon: '🎓', title: 'Verified Credentials', desc: 'Every skill, project, and achievement — verified and trusted' },
  { icon: '⚡', title: 'XP & Leaderboards',   desc: 'Gamified learning that keeps you motivated every day' },
  { icon: '🌐', title: 'Real Opportunities',   desc: 'Connect directly with top recruiters and mentors' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="auth-page">
      {/* ── Left Panel ─────────────────────────────── */}
      <div className="auth-left">
        <div className="auth-mesh">
          <div className="auth-mesh-dot" />
        </div>

        <div className="auth-left-inner">
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 48 }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '50%', padding: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '200px', height: '200px', marginLeft: '-15px' }}>
              <img src={fullLogo} alt="UConnect Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          <h1 className="auth-left-title">
            Your University.<br />
            Your Career.<br />
            Verified.
          </h1>
          <p className="auth-left-subtitle">
            UConnect turns academic work into a verifiable career portfolio — projects, skills, achievements, all in one place.
          </p>

          <div className="auth-left-features">
            {features.map(f => (
              <div className="auth-feature-item" key={f.title}>
                <div className="auth-feature-icon">{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{
            marginTop: 48,
            padding: '16px 20px',
            background: 'rgba(99,102,241,0.1)',
            borderRadius: 'var(--r-lg)',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{ display: 'flex' }}>
              {['#6366f1','#8b5cf6','#06b6d4'].map((c, i) => (
                <div key={i} style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: c,
                  border: '2px solid rgba(5,8,16,0.8)',
                  marginLeft: i > 0 ? -8 : 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'white',
                }}>
                  {['T','A','S'][i]}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>1,200+ students</strong> already building their future
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ──────────────────────── */}
      <div className="auth-right" style={{ position: 'relative' }}>
        {/* Theme Toggle — pinned top-right */}
        <button
          onClick={toggleTheme}
          className="theme-btn"
          style={{ position: 'absolute', top: 20, right: 20 }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <LuSun /> : <LuMoon />}
        </button>

        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <img src={logoIcon} alt="UConnect Logo" />
            </div>
            <span className="auth-logo-text">Connect</span>
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@university.edu"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ marginTop: 8, padding: '12px 18px', fontSize: '0.9rem', gap: 10 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Signing in…
                </>
              ) : (
                <>Sign In <LuArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="auth-divider">or try a demo account</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Student Demo',  icon: LuGraduationCap, email: 'taslim@uconnect.com' },
              { label: 'Teacher Demo',  icon: LuBookOpen,      email: 'hasan@uconnect.com' },
            ].map(demo => (
              <button
                key={demo.email}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'center', padding: '10px 12px' }}
                onClick={() => setForm({ email: demo.email, password: 'password123' })}
              >
                <demo.icon size={14} /> {demo.label}
              </button>
            ))}
          </div>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
