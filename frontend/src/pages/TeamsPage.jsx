import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function TeamsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['teams', search],
    queryFn: () => teamsAPI.getAll({ search, limit: 50 }).then(r => r.data),
  });

  const createTeam = useMutation({
    mutationFn: (d) => teamsAPI.create(d),
    onSuccess: () => {
      qc.invalidateQueries(['teams']);
      setShowCreate(false);
      setForm({ name: '' });
      toast.success('Team created!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const joinTeam = useMutation({
    mutationFn: ({ teamId }) => teamsAPI.addMember(teamId, { userId: user.id, role: 'member' }),
    onSuccess: () => { qc.invalidateQueries(['teams']); toast.success('Joined team!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to join'),
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Teams</h1>
          <p>Collaborate with others on exciting projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '✕ Cancel' : '+ Create Team'}
        </button>
      </div>

      {showCreate && (
        <div className="card mb-4">
          <div className="card-title mb-4">Create Team</div>
          <div className="form-group">
            <label className="form-label">Team Name *</label>
            <input className="form-input" placeholder="e.g. Team Alpha" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <button className="btn btn-primary" onClick={() => createTeam.mutate(form)}
            disabled={!form.name || createTeam.isPending}>
            {createTeam.isPending ? 'Creating…' : 'Create Team'}
          </button>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input className="form-input" style={{ maxWidth: 300 }} placeholder="Search teams…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
      ) : data?.data?.length ? (
        <div className="grid-auto">
          {data.data.map(team => {
            const isMember = team.members?.some(m => m.userId === user?.id);
            return (
              <div key={team.id} className="card">
                <div className="flex-between mb-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                    {team.name[0]}
                  </div>
                  {isMember ? (
                    <span className="badge badge-success">✓ Joined</span>
                  ) : (
                    <button className="btn btn-outline btn-sm"
                      onClick={() => joinTeam.mutate({ teamId: team.id })}
                      disabled={joinTeam.isPending}>
                      Join
                    </button>
                  )}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{team.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  {team._count?.members || 0} member{team._count?.members !== 1 ? 's' : ''}
                </p>
                {/* Member Avatars */}
                <div style={{ display: 'flex', gap: -4 }}>
                  {team.members?.slice(0, 5).map(m => (
                    <div key={m.id} className="avatar avatar-sm" title={m.user?.name}
                      style={{ border: '2px solid var(--surface)', marginLeft: -6, firstChild: { marginLeft: 0 } }}>
                      {m.user?.name?.[0]}
                    </div>
                  ))}
                  {(team._count?.members || 0) > 5 && (
                    <div className="avatar avatar-sm" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '2px solid var(--surface)', marginLeft: -6, fontSize: '0.65rem' }}>
                      +{team._count.members - 5}
                    </div>
                  )}
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 12, paddingTop: 10 }}>
                  {team.members?.slice(0, 3).map(m => (
                    <div key={m.id} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 2 }}>
                      {m.user?.name} · <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <h3>No teams found</h3>
          <p>Create a team and invite collaborators</p>
        </div>
      )}
    </div>
  );
}
