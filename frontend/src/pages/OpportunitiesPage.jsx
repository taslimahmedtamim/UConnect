import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const typeColors = { job: 'primary', internship: 'success', hackathon: 'accent', event: 'cyan' };
const typeIcons = { job: '💼', internship: '🎓', hackathon: '⚡', event: '📅' };

export default function OpportunitiesPage() {
  const { user, isRecruiter } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState({ type: '', search: '', isRemote: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ type: 'job', title: '', description: '', company: '', location: '', isRemote: false });
  const [applied, setApplied] = useState(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ['opportunities', filter],
    queryFn: () => opportunitiesAPI.getAll({ ...filter, limit: 50 }).then(r => r.data),
  });

  const createOpp = useMutation({
    mutationFn: (d) => opportunitiesAPI.create(d),
    onSuccess: () => {
      qc.invalidateQueries(['opportunities']);
      setShowCreate(false);
      setForm({ type: 'job', title: '', description: '', company: '', location: '', isRemote: false });
      toast.success('Opportunity posted!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const applyMut = useMutation({
    mutationFn: (id) => opportunitiesAPI.apply(id),
    onSuccess: (_, id) => {
      setApplied(s => new Set([...s, id]));
      toast.success('Application submitted! ✅');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Already applied or error'),
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Opportunities</h1>
          <p>Discover jobs, internships, and hackathons</p>
        </div>
        {isRecruiter && (
          <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? '✕ Cancel' : '+ Post Opportunity'}
          </button>
        )}
      </div>

      {showCreate && isRecruiter && (
        <div className="card mb-4">
          <div className="card-title mb-4">Post New Opportunity</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {['job', 'internship', 'hackathon', 'event'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="Role title" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-input" placeholder="Company name" value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" placeholder="City, Country" value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="Job description..." value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isRemote} onChange={e => setForm(f => ({ ...f, isRemote: e.target.checked }))} />
            <span style={{ fontSize: '0.875rem' }}>Remote position</span>
          </label>
          <button className="btn btn-primary" onClick={() => createOpp.mutate(form)}
            disabled={!form.title || createOpp.isPending}>
            {createOpp.isPending ? 'Posting…' : 'Post Opportunity'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-input" style={{ maxWidth: 260 }} placeholder="Search opportunities…"
          value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        <select className="form-select" style={{ maxWidth: 140 }} value={filter.type}
          onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
          <option value="">All Types</option>
          {['job', 'internship', 'hackathon', 'event'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: 140 }} value={filter.isRemote}
          onChange={e => setFilter(f => ({ ...f, isRemote: e.target.value }))}>
          <option value="">Any Location</option>
          <option value="true">Remote Only</option>
          <option value="false">On-site</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
      ) : data?.data?.length ? (
        <div className="grid-auto">
          {data.data.map(op => {
            const isApplied = applied.has(op.id);
            return (
              <div key={op.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="flex-between mb-3">
                  <span style={{ fontSize: '1.5rem' }}>{typeIcons[op.type] || '📌'}</span>
                  <span className={`badge badge-${typeColors[op.type] || 'secondary'}`}>{op.type}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{op.title}</h3>
                {op.company && <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{op.company}</p>}
                {op.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: 12, flex: 1 }}>
                  {op.description.slice(0, 100)}{op.description.length > 100 ? '…' : ''}
                </p>}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {op.isRemote && <span className="badge badge-success">🌐 Remote</span>}
                  {op.location && !op.isRemote && <span className="badge badge-secondary">📍 {op.location}</span>}
                  {op.deadline && <span className="badge badge-warning">⏰ {new Date(op.deadline).toLocaleDateString()}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {op._count?.applications || 0} applicant{op._count?.applications !== 1 ? 's' : ''}
                  </span>
                  {!isRecruiter && (
                    <button
                      className={`btn btn-sm ${isApplied ? 'btn-ghost' : 'btn-primary'}`}
                      onClick={() => !isApplied && applyMut.mutate(op.id)}
                      disabled={isApplied || applyMut.isPending}
                    >
                      {isApplied ? '✓ Applied' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">◇</div>
          <h3>No opportunities found</h3>
          <p>Check back later or adjust your filters</p>
        </div>
      )}
    </div>
  );
}
