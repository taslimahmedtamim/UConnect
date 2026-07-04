import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuGraduationCap, LuBookOpen, LuBriefcase } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const roles = [
  { value: 'STUDENT', icon: LuGraduationCap, label: 'Student' },
  { value: 'TEACHER', icon: LuBookOpen, label: 'Teacher' },
  { value: 'RECRUITER', icon: LuBriefcase, label: 'Recruiter' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
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
      toast.success('Account created — welcome to UConnect');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">U</div>
          <span className="auth-logo-text">Connect</span>
        </div>
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join the UConnect university ecosystem</p>

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">I am a</label>
            <div className="role-selector">
              {roles.map(r => (
                <div
                  key={r.value}
                  className={`role-option${form.role === r.value ? ' selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, role: r.value }))}
                >
                  <div className="role-option-icon"><r.icon /></div>
                  <div className="role-option-label">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@university.edu"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required minLength={8}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
