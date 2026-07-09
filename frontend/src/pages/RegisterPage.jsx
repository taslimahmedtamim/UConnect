import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuGraduationCap, LuBookOpen, LuBriefcase, LuArrowRight, LuCheck, LuSun, LuMoon } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import logoIcon from '../assets/UConnect.png';
import fullLogo from '../assets/UConnect(512 x 512 px).png';

const roles = [
  { value: 'STUDENT',   icon: LuGraduationCap, label: 'Student',   desc: 'Build your portfolio' },
  { value: 'TEACHER',   icon: LuBookOpen,      label: 'Teacher',   desc: 'Guide your students' },
  { value: 'RECRUITER', icon: LuBriefcase,     label: 'Recruiter', desc: 'Find top talent' },
];

const perks = [
  '✦ Verified academic credentials',
  '✦ Gamified XP & achievements',
  '✦ Direct recruiter connections',
  '✦ AI-powered skill mapping',
];

export default function RegisterPage() {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created — welcome to UConnect 🎉');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Registration failed — check console for details';
      toast.error(message, { duration: 6000 });
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 48 }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '50%', padding: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '200px', height: '200px', marginLeft: '-15px' }}>
              <img src={fullLogo} alt="UConnect Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          <h1 className="auth-left-title">
            Start building<br />
            your academic<br />
            legacy today.
          </h1>
          <p className="auth-left-subtitle">
            Join thousands of students turning their university work into a verified career portfolio that speaks for itself.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            {perks.map(p => (
              <div key={p} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}>
                <div style={{
                  width: 22, height: 22,
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.2)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <LuCheck size={12} style={{ color: '#818cf8' }} />
                </div>
                {p.replace('✦ ', '')}
              </div>
            ))}
          </div>

          {/* Gradient divider */}
          <div style={{
            marginTop: 48,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(139,92,246,0.4), transparent)',
          }} />

          <p style={{ marginTop: 24, fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
            Free forever for students. No credit card required.
          </p>
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

          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join the UConnect university ecosystem</p>

          <form onSubmit={handleSubmit}>
            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {roles.map(r => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      padding: '12px 8px',
                      borderRadius: 'var(--r-md)',
                      border: form.role === r.value
                        ? '1.5px solid var(--indigo)'
                        : '1.5px solid var(--border-strong)',
                      background: form.role === r.value
                        ? 'rgba(99,102,241,0.1)'
                        : 'var(--bg-input)',
                      cursor: 'pointer',
                      transition: 'all var(--t-fast)',
                      color: form.role === r.value ? 'var(--indigo-light)' : 'var(--text-2)',
                      boxShadow: form.role === r.value
                        ? '0 0 0 3px rgba(99,102,241,0.12)'
                        : 'none',
                    }}
                  >
                    <r.icon size={18} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                className="form-input"
                placeholder="Your full name"
                value={form.name}
                onChange={set('name')}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
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
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set('password')}
                required
                minLength={8}
                autoComplete="new-password"
              />
              {/* Password strength indicator */}
              {form.password.length > 0 && (
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  {[1,2,3,4].map(i => (
                    <div
                      key={i}
                      style={{
                        flex: 1, height: 3, borderRadius: 99,
                        background: form.password.length >= i * 2
                          ? i <= 1 ? 'var(--rose)'
                          : i <= 2 ? 'var(--amber)'
                          : i <= 3 ? 'var(--emerald)'
                          : 'var(--indigo)'
                          : 'var(--border-strong)',
                        transition: 'background 0.2s ease',
                      }}
                    />
                  ))}
                </div>
              )}
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
                  Creating account…
                </>
              ) : (
                <>Create Account <LuArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
