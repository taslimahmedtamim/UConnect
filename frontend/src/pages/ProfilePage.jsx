import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LuGraduationCap, LuBookOpen, LuBriefcase, LuLandmark, LuShapes, LuPencil, LuX, LuTriangleAlert, LuFolderGit2 } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import toast from 'react-hot-toast';

const roleIcon = { STUDENT: LuGraduationCap, TEACHER: LuBookOpen, RECRUITER: LuBriefcase };

export default function ProfilePage() {
  const { user } = useAuth();
  const { id } = useParams();
  const targetId = id || user?.id;
  const isOwn = targetId === user?.id;
  const qc = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [newSkill, setNewSkill] = useState('');

  const { data: profileUser, isLoading } = useQuery({
    queryKey: ['user', targetId],
    queryFn: () => usersAPI.getById(targetId).then(r => r.data.data),
    enabled: !!targetId,
    onSuccess: (d) => {
      setForm({
        headline: d.profile?.headline || '',
        bio: d.profile?.bio || '',
        university: d.profile?.university || '',
        department: d.profile?.department || '',
        yearOfStudy: d.profile?.yearOfStudy || '',
        phone: d.profile?.phone || '',
      });
    }
  });

  const updateProfile = useMutation({
    mutationFn: (data) => usersAPI.updateProfile(targetId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user', targetId] });
      setEditing(false);
      toast.success('Profile updated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const addSkillMut = useMutation({
    mutationFn: (skills) => usersAPI.addSkills(targetId, skills),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['user', targetId] }); setNewSkill(''); toast.success('Skill added!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const removeSkillMut = useMutation({
    mutationFn: (skillId) => usersAPI.removeSkill(targetId, skillId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['user', targetId] }); toast.success('Skill removed'); },
  });

  const initials = profileUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (isLoading) return <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>;
  if (!profileUser) return <div className="empty-state"><div className="empty-state-icon"><LuTriangleAlert /></div><h3>User not found</h3></div>;

  return (
    <div>
      {/* Profile Header */}
      <div className="card mb-4" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div className="avatar avatar-xl" style={{ fontSize: '2rem' }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div className="flex-between">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>{profileUser.name}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 2 }}>
                  {profileUser.profile?.headline || 'No headline set'}
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <span className={`badge badge-${profileUser.role === 'STUDENT' ? 'primary' : profileUser.role === 'TEACHER' ? 'success' : 'accent'}`}>
                    {(() => { const RoleIcon = roleIcon[profileUser.role] || LuGraduationCap; return <RoleIcon size={12} />; })()} {profileUser.role}
                  </span>
                  {profileUser.profile?.university && (
                    <span className="badge badge-secondary"><LuLandmark size={12} /> {profileUser.profile.university}</span>
                  )}
                  {profileUser.profile?.department && (
                    <span className="badge badge-secondary"><LuShapes size={12} /> {profileUser.profile.department}</span>
                  )}
                </div>
              </div>
              {isOwn && (
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(!editing)}>
                  {editing ? <><LuX size={14} /> Cancel</> : <><LuPencil size={14} /> Edit Profile</>}
                </button>
              )}
            </div>

            {profileUser.profile?.bio && (
              <p style={{ marginTop: 14, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                {profileUser.profile.bio}
              </p>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
              {[
                { label: 'Projects', value: profileUser._count?.projects ?? 0 },
                { label: 'Teams', value: profileUser._count?.teamMembers ?? 0 },
                { label: 'Achievements', value: profileUser._count?.achievements ?? 0 },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editing && isOwn && (
        <div className="card mb-4">
          <div className="card-header"><span className="card-title">Edit Profile</span></div>
          <div className="grid-2">
            {[
              ['headline', 'Headline', 'text'],
              ['university', 'University', 'text'],
              ['department', 'Department', 'text'],
              ['yearOfStudy', 'Year of Study', 'number'],
              ['phone', 'Phone', 'text'],
            ].map(([key, label, type]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input
                  type={type}
                  className="form-input"
                  value={form[key] || ''}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              value={form.bio || ''}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => updateProfile.mutate(form)}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}

      <div className="grid-2">
        {/* Skills */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Skills</span>
            <span className="badge badge-secondary">{profileUser.skills?.length || 0} skills</span>
          </div>
          <div className="skills-wrap mb-4">
            {profileUser.skills?.map(us => (
              <div key={us.id} className="skill-tag" style={{ position: 'relative' }}>
                {us.skill.name}
                {us.skill.category && <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>• {us.skill.category}</span>}
                {isOwn && (
                  <button
                    onClick={() => removeSkillMut.mutate(us.skillId)}
                    style={{ marginLeft: 4, color: 'var(--error)', fontSize: '0.7rem', opacity: 0.7 }}
                  >✕</button>
                )}
              </div>
            ))}
            {!profileUser.skills?.length && <p className="text-muted text-sm">No skills added yet</p>}
          </div>
          {isOwn && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                style={{ flex: 1 }}
                placeholder="Add a skill (e.g. React)"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newSkill.trim()) {
                    addSkillMut.mutate([{ name: newSkill.trim(), level: 50 }]);
                  }
                }}
              />
              <button
                className="btn btn-primary btn-sm"
                disabled={!newSkill.trim() || addSkillMut.isPending}
                onClick={() => addSkillMut.mutate([{ name: newSkill.trim(), level: 50 }])}
              >+ Add</button>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="card">
          <div className="card-header"><span className="card-title">Projects</span></div>
          {profileUser.projects?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {profileUser.projects.map(p => (
                <div key={p.id} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.title}</span>
                  <span className={`badge badge-${p.status === 'COMPLETED' ? 'success' : p.status === 'IN_PROGRESS' ? 'primary' : 'warning'}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <div className="empty-state-icon"><LuFolderGit2 /></div>
              <p>No projects yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
