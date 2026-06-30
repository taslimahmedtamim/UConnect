import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusOptions = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];
const statusLabels = { PLANNING: 'Planning', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', ARCHIVED: 'Archived' };
const statusColors = { PLANNING: 'warning', IN_PROGRESS: 'primary', COMPLETED: 'success', ARCHIVED: 'secondary' };

export default function ProjectsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState({ status: '', search: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'PLANNING', skills: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['projects', filter],
    queryFn: () => projectsAPI.getAll({ ...filter, limit: 50 }).then(r => r.data),
  });

  const createProject = useMutation({
    mutationFn: (data) => projectsAPI.create(data),
    onSuccess: () => {
      qc.invalidateQueries(['projects']);
      setShowCreate(false);
      setForm({ title: '', description: '', status: 'PLANNING', skills: '' });
      toast.success('Project created!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  const deleteProject = useMutation({
    mutationFn: (id) => projectsAPI.delete(id),
    onSuccess: () => { qc.invalidateQueries(['projects']); toast.success('Project deleted'); },
  });

  const handleCreate = () => {
    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    createProject.mutate(payload);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Projects</h1>
          <p>Explore and manage university projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '✕ Cancel' : '+ New Project'}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="card mb-4">
          <div className="card-title mb-4">Create New Project</div>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="Project title" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="What is this project about?"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Skills (comma-separated)</label>
              <input className="form-input" placeholder="React, Node.js, Python..."
                value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleCreate} disabled={!form.title || createProject.isPending}>
            {createProject.isPending ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-input" style={{ maxWidth: 260 }} placeholder="Search projects…"
          value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        <select className="form-select" style={{ maxWidth: 160 }} value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
        {data && <span className="badge badge-secondary" style={{ alignSelf: 'center' }}>{data.pagination?.total || 0} projects</span>}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
      ) : data?.data?.length ? (
        <div className="grid-auto">
          {data.data.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex-between mb-2">
                <span className={`badge badge-${statusColors[p.status]}`}>{statusLabels[p.status]}</span>
                {p.ownerId === user?.id && (
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', padding: '4px 8px' }}
                    onClick={() => { if (confirm('Delete this project?')) deleteProject.mutate(p.id); }}>✕</button>
                )}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{p.title}</h3>
              {p.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 12, flex: 1, lineHeight: 1.6 }}>
                {p.description.slice(0, 120)}{p.description.length > 120 ? '…' : ''}
              </p>}
              <div className="skills-wrap mb-3">
                {p.skills?.slice(0, 4).map(ps => (
                  <span key={ps.skillId} className="skill-tag">{ps.skill.name}</span>
                ))}
              </div>
              <div className="flex-between" style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  by {p.owner?.name} • {p._count?.teamMembers || 0} members
                </span>
                <Link to={`/projects/${p.id}`} className="btn btn-ghost btn-sm">View →</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">◈</div>
          <h3>No projects found</h3>
          <p>Create the first project or adjust your filters</p>
        </div>
      )}
    </div>
  );
}
