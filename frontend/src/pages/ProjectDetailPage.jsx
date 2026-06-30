import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '../services/api';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getById(id).then(r => r.data.data),
  });

  if (isLoading) return <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>;
  if (!project) return <div className="empty-state"><div className="empty-state-icon">⚠</div><h3>Project not found</h3></div>;

  const statusColors = { PLANNING: 'warning', IN_PROGRESS: 'primary', COMPLETED: 'success', ARCHIVED: 'secondary' };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="/projects" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>← Back to Projects</Link>
      </div>

      <div className="card mb-4">
        <div className="flex-between mb-4">
          <span className={`badge badge-${statusColors[project.status]}`}>{project.status.replace('_', ' ')}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Created {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{project.title}</h1>
        {project.description && (
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{project.description}</p>
        )}
        <div className="flex gap-2">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Owner:</span>
          <Link to={`/profile/${project.owner?.id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>
            {project.owner?.name}
          </Link>
        </div>
      </div>

      <div className="grid-2">
        {/* Skills */}
        <div className="card">
          <div className="card-title mb-3">Technologies</div>
          <div className="skills-wrap">
            {project.skills?.length ? project.skills.map(ps => (
              <span key={ps.skillId} className="skill-tag">{ps.skill.name}</span>
            )) : <p className="text-muted text-sm">No skills listed</p>}
          </div>
        </div>

        {/* Team Members */}
        <div className="card">
          <div className="card-title mb-3">Team ({project.teamMembers?.length || 0} members)</div>
          {project.teamMembers?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {project.teamMembers.map(tm => (
                <div key={tm.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar avatar-sm">{tm.user?.name[0]}</div>
                  <div>
                    <Link to={`/profile/${tm.user?.id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>
                      {tm.user?.name}
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tm.role}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-muted text-sm">No team members</p>}
        </div>
      </div>
    </div>
  );
}
