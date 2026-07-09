import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, projectsAPI, opportunitiesAPI, achievementsAPI } from '../services/api';
import {
  LuFolderGit2, LuUsers, LuAward, LuZap, LuArrowRight,
  LuTrendingUp, LuBriefcase, LuStar, LuClock,
} from 'react-icons/lu';

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
    {
      label: 'Projects',      icon: LuFolderGit2,
      value: profileData?._count?.projects ?? '—',
      cls: 'purple', color: 'var(--indigo-light)', glow: 'rgba(99,102,241,0.15)',
    },
    {
      label: 'Teams',         icon: LuUsers,
      value: profileData?._count?.teamMembers ?? '—',
      cls: 'blue',   color: 'var(--cyan)',         glow: 'rgba(6,182,212,0.15)',
    },
    {
      label: 'Achievements',  icon: LuAward,
      value: profileData?._count?.achievements ?? '—',
      cls: 'amber',  color: 'var(--amber)',         glow: 'rgba(245,158,11,0.15)',
    },
    {
      label: 'Total XP',      icon: LuZap,
      value: achievementsData?.totalXp ?? '—',
      cls: 'green',  color: 'var(--emerald)',       glow: 'rgba(16,185,129,0.15)',
    },
  ];

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const firstName = user?.name?.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* ── Welcome Banner ───────────────────────────── */}
      <div className="welcome-banner" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 99,
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--indigo-light)',
              marginBottom: 14,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              <LuZap size={11} /> {user?.role?.toLowerCase()}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.4px',
              marginBottom: 8,
              lineHeight: 1.2,
            }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: 24 }}>
              {user?.role === 'STUDENT'   && "Ready to build something amazing today?"}
              {user?.role === 'TEACHER'   && "Your students are waiting for guidance."}
              {user?.role === 'RECRUITER' && "Discover top talent from our network."}
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/profile" className="btn btn-outline" style={{
                borderColor: 'rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                fontSize: '0.82rem',
              }}>
                Complete Profile
              </Link>
              <Link to="/projects" className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
                Browse Projects <LuArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: 'var(--grad-primary)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 4s ease infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'white',
            flexShrink: 0,
            boxShadow: '0 0 0 3px rgba(99,102,241,0.3), 0 0 32px rgba(99,102,241,0.3)',
            fontFamily: 'var(--font-display)',
          }}>
            {initials}
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────── */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={s.label} style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`stat-icon ${s.cls}`}>
              <s.icon size={20} />
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Content Grid ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 20 }}>

        {/* Recent Projects */}
        <div className="card" style={{ animationDelay: '80ms' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Recent Projects</div>
              <div className="card-subtitle">Your latest work</div>
            </div>
            <Link to="/projects" className="btn btn-ghost btn-sm">
              View All <LuArrowRight size={13} />
            </Link>
          </div>

          {projectsData?.data?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {projectsData.data.map(p => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="list-item"
                >
                  <div className="list-item-icon">
                    <LuFolderGit2 size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 2 }}>
                      by {p.owner?.name}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">◈</div>
              <p>No projects yet</p>
              <Link to="/projects" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
                Create Project
              </Link>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="card" style={{ animationDelay: '120ms' }}>
          <div className="card-header">
            <div>
              <div className="card-title">🏆 Leaderboard</div>
              <div className="card-subtitle">Top performers this week</div>
            </div>
            <Link to="/leaderboard" className="btn btn-ghost btn-sm">
              Full Board <LuArrowRight size={13} />
            </Link>
          </div>

          {leaderboardData?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {leaderboardData.map((u, i) => {
                const medals = ['🥇','🥈','🥉'];
                const rankColors = ['rgba(245,158,11,0.15)','rgba(148,163,184,0.1)','rgba(205,124,47,0.1)'];
                return (
                  <div
                    key={u.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 'var(--r-md)',
                      background: i < 3 ? rankColors[i] : 'transparent',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <span style={{
                      width: 24, textAlign: 'center',
                      fontSize: i < 3 ? '1.1rem' : '0.78rem',
                      fontWeight: 700,
                      color: i < 3 ? undefined : 'var(--text-3)',
                    }}>
                      {i < 3 ? medals[i] : `#${i+1}`}
                    </span>
                    <div className="avatar avatar-sm">{u.name?.[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.83rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>
                        {u.profile?.university || 'University'}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--indigo-light)',
                      background: 'rgba(99,102,241,0.1)',
                      padding: '2px 8px',
                      borderRadius: 99,
                    }}>
                      {u.totalXp} XP
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏆</div>
              <p>No leaderboard data yet</p>
            </div>
          )}
        </div>

        {/* Latest Opportunities */}
        <div className="card" style={{ animationDelay: '160ms' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Opportunities</div>
              <div className="card-subtitle">Latest openings for you</div>
            </div>
            <Link to="/opportunities" className="btn btn-ghost btn-sm">
              Browse <LuArrowRight size={13} />
            </Link>
          </div>

          {opportunitiesData?.data?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {opportunitiesData.data.map(op => (
                <div
                  key={op.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 'var(--r-md)',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    transition: 'all var(--t-fast)',
                  }}
                >
                  <div style={{
                    width: 38, height: 38,
                    borderRadius: 'var(--r-sm)',
                    background: op.type === 'job' ? 'rgba(99,102,241,0.1)'
                      : op.type === 'internship' ? 'rgba(16,185,129,0.1)'
                      : 'rgba(245,158,11,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <LuBriefcase size={16} style={{
                      color: op.type === 'job' ? 'var(--indigo-light)'
                        : op.type === 'internship' ? 'var(--emerald)'
                        : 'var(--amber)',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.83rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {op.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 2 }}>
                      {op.company || 'Open'} · {op.isRemote ? '🌐 Remote' : op.location}
                    </div>
                  </div>
                  <span className={`badge badge-${op.type === 'job' ? 'primary' : op.type === 'internship' ? 'success' : 'warning'}`}>
                    {op.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">◇</div>
              <p>No opportunities yet</p>
            </div>
          )}
        </div>

        {/* My Achievements */}
        <div className="card" style={{ animationDelay: '200ms' }}>
          <div className="card-header">
            <div>
              <div className="card-title">My Achievements</div>
              <div className="card-subtitle">Earned rewards & badges</div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              background: 'rgba(99,102,241,0.1)',
              borderRadius: 99,
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--indigo-light)',
            }}>
              <LuZap size={12} />
              {achievementsData?.totalXp ?? 0} XP
            </div>
          </div>

          {achievementsData?.achievements?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {achievementsData.achievements.slice(0, 5).map(a => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 'var(--r-md)',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{
                    width: 38, height: 38,
                    borderRadius: 'var(--r-sm)',
                    background: 'rgba(245,158,11,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}>
                    {a.type === 'badge' ? '🏅' : a.type === 'certificate' ? '📜' : '🎯'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.83rem' }}>{a.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 2 }}>
                      +{a.xpPoints} XP earned
                    </div>
                  </div>
                  <LuStar size={14} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏅</div>
              <p>No achievements yet</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                Complete projects to earn XP
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    PLANNING:    ['badge-warning',   'Planning'],
    IN_PROGRESS: ['badge-primary',   'In Progress'],
    COMPLETED:   ['badge-success',   'Completed'],
    ARCHIVED:    ['badge-secondary', 'Archived'],
  };
  const [cls, label] = map[status] || ['badge-secondary', status];
  return <span className={`badge ${cls}`}>{label}</span>;
}
