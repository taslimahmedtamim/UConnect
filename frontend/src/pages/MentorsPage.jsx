import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mentorsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MentorsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [connected, setConnected] = useState(new Set());

  const { data: mentors, isLoading } = useQuery({
    queryKey: ['mentors', search],
    queryFn: () => mentorsAPI.getAll({ search }).then(r => r.data.data),
  });

  const connectMut = useMutation({
    mutationFn: (mentorId) => mentorsAPI.connect({ mentorId }),
    onSuccess: (_, mentorId) => {
      setConnected(s => new Set([...s, mentorId]));
      toast.success('Mentor connection created! 🤝');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Already connected'),
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Mentors</h1>
          <p>Connect with experienced students and faculty for guidance</p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input className="form-input" style={{ maxWidth: 320 }} placeholder="Search mentors by name…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
      ) : mentors?.length ? (
        <div className="grid-auto">
          {mentors.filter(m => m.id !== user?.id).map(mentor => {
            const isConnected = connected.has(mentor.id);
            const initials = mentor.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={mentor.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div className="avatar avatar-md">{initials}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{mentor.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{mentor.profile?.headline || mentor.role}</div>
                    <span className={`badge badge-${mentor.role === 'TEACHER' ? 'success' : 'primary'}`} style={{ marginTop: 4 }}>
                      {mentor.role === 'TEACHER' ? '📚 Faculty' : '🎓 Student'}
                    </span>
                  </div>
                </div>

                {mentor.profile?.bio && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                    {mentor.profile.bio.slice(0, 100)}{mentor.profile.bio.length > 100 ? '…' : ''}
                  </p>
                )}

                {mentor.profile?.university && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    🏛 {mentor.profile.university} {mentor.profile.department ? `• ${mentor.profile.department}` : ''}
                  </div>
                )}

                {/* Skills */}
                {mentor.skills?.length > 0 && (
                  <div className="skills-wrap mb-3">
                    {mentor.skills.slice(0, 4).map(us => (
                      <span key={us.id} className="skill-tag">{us.skill.name}</span>
                    ))}
                    {mentor.skills.length > 4 && <span className="skill-tag">+{mentor.skills.length - 4} more</span>}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                  <button
                    className={`btn btn-sm flex-1 ${isConnected ? 'btn-ghost' : 'btn-primary'}`}
                    style={{ justifyContent: 'center' }}
                    onClick={() => !isConnected && connectMut.mutate(mentor.id)}
                    disabled={isConnected || connectMut.isPending}
                  >
                    {isConnected ? '✓ Connected' : '🤝 Connect'}
                  </button>
                  <Link to={`/profile/${mentor.id}`} className="btn btn-outline btn-sm">Profile</Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">◉</div>
          <h3>No mentors found</h3>
          <p>Try a different search term</p>
        </div>
      )}
    </div>
  );
}
