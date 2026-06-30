import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { achievementsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const medalColors = ['#f59e0b', '#94a3b8', '#cd7c2f'];
const medalEmoji = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user } = useAuth();

  const { data: leaders, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => achievementsAPI.getLeaderboard({ limit: 50 }).then(r => r.data.data),
  });

  const myRank = leaders?.findIndex(l => l.id === user?.id);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>🏆 Leaderboard</h1>
          <p>Top students ranked by XP points and contributions</p>
        </div>
        {myRank !== undefined && myRank >= 0 && (
          <span className="badge badge-primary" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
            Your rank: #{myRank + 1}
          </span>
        )}
      </div>

      {/* Top 3 Podium */}
      {leaders?.length >= 3 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32, alignItems: 'flex-end' }}>
          {[1, 0, 2].map(idx => {
            const leader = leaders[idx];
            const heights = [120, 160, 90];
            const initials = leader?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={idx} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{medalEmoji[idx]}</div>
                <Link to={`/profile/${leader?.id}`}>
                  <div className="avatar" style={{
                    width: idx === 0 ? 64 : 52, height: idx === 0 ? 64 : 52,
                    fontSize: idx === 0 ? '1.5rem' : '1.1rem',
                    border: `3px solid ${medalColors[idx]}`,
                    marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    color: 'white', fontWeight: 700,
                  }}>{initials}</div>
                </Link>
                <div style={{ fontWeight: 700, fontSize: idx === 0 ? '0.95rem' : '0.85rem', maxWidth: 100 }}>{leader?.name}</div>
                <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>{leader?.totalXp} XP</div>
                <div style={{ height: heights[idx], background: `linear-gradient(to top, ${medalColors[idx]}40, ${medalColors[idx]}20)`, border: `1px solid ${medalColors[idx]}60`, borderRadius: '8px 8px 0 0', width: 80, marginTop: 8, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8 }}>
                  <span style={{ color: medalColors[idx], fontWeight: 800, fontSize: '1.1rem' }}>#{idx === 1 ? 1 : idx === 0 ? 2 : 3}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              {['Rank', 'Student', 'University', 'Projects', 'Achievements', 'Total XP'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: 'auto' }} /></td></tr>
            ) : leaders?.map((leader, i) => {
              const isMe = leader.id === user?.id;
              const initials = leader.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <tr key={leader.id} style={{
                  borderBottom: '1px solid var(--border-color)',
                  background: isMe ? 'var(--primary-glow)' : i % 2 === 0 ? 'var(--surface)' : 'var(--bg-primary)',
                  transition: 'background 0.15s',
                }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: i < 3 ? medalColors[i] : 'var(--text-secondary)', fontSize: i < 3 ? '1.1rem' : '0.9rem' }}>
                    {i < 3 ? medalEmoji[i] : `#${i + 1}`}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link to={`/profile/${leader.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm">{initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: isMe ? 'var(--primary)' : 'var(--text-primary)' }}>
                          {leader.name} {isMe && <span style={{ fontSize: '0.7rem' }}>(You)</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leader.profile?.university}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {leader.profile?.university || '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.875rem' }}>{leader.projectCount}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.875rem' }}>{leader.achievementCount}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>⚡ {leader.totalXp}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
