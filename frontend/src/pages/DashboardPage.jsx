import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, projectsAPI, opportunitiesAPI, achievementsAPI } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: profileData } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => usersAPI.getById(user.id).then(r => r.data.data),
    enabled: !!user?.id,
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll({ limit: 5 }).then(r => r.data),
  });

  const { data: opportunitiesData } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => opportunitiesAPI.getAll({ limit: 5 }).then(r => r.data),
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => achievementsAPI.getLeaderboard({ limit: 5 }).then(r => r.data.data),
  });

  const { data: achievementsData } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: () => usersAPI.getAchievements(user.id).then(r => r.data.data),
    enabled: !!user?.id,
  });

  const stats = [
    { label: 'Projects', value: profileData?._count?.projects ?? '—', icon: '◈', cls: 'purple' },
    { label: 'Teams', value: profileData?._count?.teamMembers ?? '—', icon: '◎', cls: 'blue' },
    { label: 'Achievements', value: profileData?._count?.achievements ?? '—', icon: '★', cls: 'amber' },
    { label: 'Total XP', value: achievementsData?.totalXp ?? '—', icon: '⚡', cls: 'green' },
  ];

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      {/* Welcome banner */}
      <div className="card mb-6" style={{
        background: 'var(--primary)',
        border: 'none', color: 'white', padding: '28px 32px'
      }}>
        <div className="flex-between">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, marginBottom: 6 }}>
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p style={{ opacity: 0.85, fontSize: '0.875rem' }}>
              {user?.role === 'STUDENT' && 'Ready to build something amazing today?'}
              {user?.role === 'TEACHER' && 'Your students are waiting for guidance.'}
              {user?.role === 'RECRUITER' && 'Discover top talent from our network.'}
            </p>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <Link to="/profile" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                Complete Profile
              </Link>
              <Link to="/projects" className="btn btn-sm" style={{ background: 'white', color: 'var(--primary)' }}>
                Browse Projects
              </Link>
            </div>
          </div>
          <div className="avatar avatar-xl" style={{ fontSize: '2rem', background: 'rgba(255,255,255,0.2)' }}>
            {initials}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid-2" style={{ gap: 20 }}>
        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Projects</span>
            <Link to="/projects" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {projectsData?.data?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {projectsData.data.map(p => (
                <Link key={p.id} to={`/projects/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: 'var(--bg-secondary)', transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--primary-glow)'}
                  onMouseOut={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>◈</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {p.owner?.name}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-state-icon">◈</div>
              <p>No projects yet</p>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🏆 Leaderboard</span>
            <Link to="/leaderboard" className="btn btn-ghost btn-sm">Full Board</Link>
          </div>
          {leaderboardData?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leaderboardData.map((u, i) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < leaderboardData.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <span style={{ width: 24, fontWeight: 700, color: i < 3 ? ['#f59e0b','#94a3b8','#cd7c2f'][i] : 'var(--text-muted)', fontSize: '0.85rem' }}>#{i+1}</span>
                  <div className="avatar avatar-sm">{u.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.profile?.university || 'University'}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.875rem' }}>{u.totalXp} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-state-icon">🏆</div>
              <p>No data yet</p>
            </div>
          )}
        </div>

        {/* Latest Opportunities */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Latest Opportunities</span>
            <Link to="/opportunities" className="btn btn-ghost btn-sm">Browse</Link>
          </div>
          {opportunitiesData?.data?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {opportunitiesData.data.map(op => (
                <div key={op.id} style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{op.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{op.company || 'Open'} • {op.isRemote ? 'Remote' : op.location}</div>
                    </div>
                    <span className={`badge badge-${op.type === 'job' ? 'primary' : op.type === 'internship' ? 'success' : 'accent'}`}>{op.type}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-state-icon">◇</div>
              <p>No opportunities yet</p>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">My Achievements</span>
            <span className="badge badge-primary">⚡ {achievementsData?.totalXp ?? 0} XP</span>
          </div>
          {achievementsData?.achievements?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {achievementsData.achievements.slice(0, 5).map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', borderRadius: 8, background: 'var(--bg-secondary)' }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {a.type === 'badge' ? '🏅' : a.type === 'certificate' ? '📜' : '🎯'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{a.xpPoints} XP</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-state-icon">🏅</div>
              <p>No achievements yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    PLANNING: ['badge-warning', 'Planning'],
    IN_PROGRESS: ['badge-primary', 'In Progress'],
    COMPLETED: ['badge-success', 'Completed'],
    ARCHIVED: ['badge-secondary', 'Archived'],
  };
  const [cls, label] = map[status] || ['badge-secondary', status];
  return <span className={`badge ${cls}`}>{label}</span>;
}
