import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { resumesAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const { user } = useAuth();
  const [template, setTemplate] = useState('professional');
  const [generated, setGenerated] = useState(null);

  const { data: resumes } = useQuery({
    queryKey: ['resumes', user?.id],
    queryFn: () => usersAPI.getResumes(user.id).then(r => r.data.data),
    enabled: !!user?.id,
  });

  const generateMut = useMutation({
    mutationFn: (data) => resumesAPI.generate(data),
    onSuccess: (res) => {
      setGenerated(res.data.data);
      toast.success('Resume generated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Generation failed'),
  });

  const { resumeData } = generated || {};

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Resume Builder</h1>
          <p>Generate a polished resume from your profile</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => generateMut.mutate({ templateName: template })}
          disabled={generateMut.isPending}
        >
          {generateMut.isPending ? 'Generating…' : '⚡ Generate Resume'}
        </button>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Settings */}
        <div className="card">
          <div className="card-title mb-4">Resume Settings</div>
          <div className="form-group">
            <label className="form-label">Template</label>
            <select className="form-select" value={template} onChange={e => setTemplate(e.target.value)}>
              <option value="professional">Professional</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="academic">Academic</option>
            </select>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Your resume will be generated from your profile, skills, projects, and achievements.
          </p>

          {/* Previous Resumes */}
          {resumes?.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>PREVIOUS RESUMES</div>
              {resumes.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.templateName} template</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.generatedDate).toLocaleDateString()}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => resumesAPI.getById(r.id).then(res => setGenerated(res.data.data))}>
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="card">
          <div className="card-title mb-4">💡 Tips for a Better Resume</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '◉', text: 'Complete your profile headline and bio' },
              { icon: '◈', text: 'Add completed projects with skill tags' },
              { icon: '★', text: 'Earn achievements to boost your XP score' },
              { icon: '◎', text: 'Join teams to showcase collaboration' },
              { icon: '📚', text: 'Add your skills with proficiency levels' },
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--primary)', fontSize: '1rem', flexShrink: 0 }}>{tip.icon}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Resume Preview */}
      {resumeData && (
        <div className="card" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <button className="btn btn-outline btn-sm" onClick={() => window.print()}>🖨 Print / PDF</button>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '2px solid var(--primary)', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{resumeData.personalInfo.name}</h2>
            {resumeData.personalInfo.headline && (
              <p style={{ color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>{resumeData.personalInfo.headline}</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>✉ {resumeData.personalInfo.email}</span>
              {resumeData.personalInfo.phone && <span>📱 {resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.university && <span>🏛 {resumeData.personalInfo.university}</span>}
              {resumeData.personalInfo.department && <span>📐 {resumeData.personalInfo.department}</span>}
            </div>
          </div>

          {/* Bio */}
          {resumeData.personalInfo.bio && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>About</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.875rem' }}>{resumeData.personalInfo.bio}</p>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>Skills</h3>
              <div className="skills-wrap">
                {resumeData.skills.map((s, i) => (
                  <span key={i} className="skill-tag">
                    {s.name}
                    {s.category && <span style={{ opacity: 0.6 }}> · {s.category}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>Projects</h3>
              {resumeData.projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < resumeData.projects.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div className="flex-between">
                    <span style={{ fontWeight: 700 }}>{p.title}</span>
                    <span className="badge badge-secondary">{p.status.replace('_', ' ')}</span>
                  </div>
                  {p.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4 }}>{p.description}</p>}
                  {p.skills?.length > 0 && (
                    <div className="skills-wrap mt-2">
                      {p.skills.map((s, j) => <span key={j} className="skill-tag">{s}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {resumeData.achievements?.length > 0 && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>Achievements</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {resumeData.achievements.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span>{a.type === 'badge' ? '🏅' : a.type === 'certificate' ? '📜' : '🎯'}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{a.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{a.xpPoints} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!resumeData && (
        <div className="empty-state">
          <div className="empty-state-icon">◆</div>
          <h3>Your resume will appear here</h3>
          <p>Click "Generate Resume" to create your AI-powered resume</p>
        </div>
      )}
    </div>
  );
}
