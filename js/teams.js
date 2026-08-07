document.addEventListener('DOMContentLoaded', async () => {
    const api = window.UConnectAPI;
    if (!api || !api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const myTeamsGrid = document.getElementById('myTeamsGrid');
    
    try {
        const res = await api.getTeams();
        const teams = res.teams || [];
        
        if (myTeamsGrid) {
            myTeamsGrid.innerHTML = '';
            if (teams.length === 0) {
                myTeamsGrid.innerHTML = '<div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-secondary);">No teams found. Create one!</div>';
            } else {
                teams.forEach(t => {
                    const initials = t.name ? t.name.substring(0,2).toUpperCase() : 'TM';
                    
                    const membersHtml = (t.members || []).map(m => {
                        const init = m.name ? m.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U';
                        return `<div class="avatar avatar-sm" title="${m.name}">${init}</div>`;
                    }).join('');

                    const domainHtml = t.domain ? `<span class="badge badge-primary">${t.domain}</span>` : '';

                    myTeamsGrid.innerHTML += `
                        <div class="card">
                            <div class="card-body">
                                <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
                                    <div style="width: 56px; height: 56px; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.25rem;">
                                        ${initials}
                                    </div>
                                    <div style="flex: 1;">
                                        <h3 style="font-size: 1.125rem; margin-bottom: 0.25rem;">${t.name}</h3>
                                        <p style="font-size: 0.875rem; color: var(--text-secondary);">${t.description}</p>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                                    ${domainHtml}
                                    <span class="badge badge-success">Active</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div class="project-members">
                                        ${membersHtml}
                                    </div>
                                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${t.membersCount || t.members?.length || 1} members</span>
                                </div>
                            </div>
                            <div class="card-footer" style="display: flex; gap: 0.5rem; padding: 1rem; border-top: 1px solid var(--border-color);">
                                <a href="#" class="btn btn-sm btn-primary" style="flex: 1;">View Team</a>
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-comment"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
            }
        }
    } catch (e) {
        console.error('Failed to load teams', e);
        if (myTeamsGrid) {
            myTeamsGrid.innerHTML = '<div style="grid-column: 1 / -1; color: var(--danger);">Failed to load teams.</div>';
        }
    }

    // Modal Logic
    const newTeamBtn = document.getElementById('newTeamBtn');
    const modal = document.getElementById('createTeamModal');
    const closeBtn = document.getElementById('closeTeamModal');
    const form = document.getElementById('createTeamForm');
    const submitBtn = document.getElementById('ctSubmitBtn');

    if (newTeamBtn && modal) {
        newTeamBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('ctName').value.trim();
            const description = document.getElementById('ctDescription').value.trim();
            const domain = document.getElementById('ctDomain').value;
            const rolesInput = document.getElementById('ctRoles').value;
            const lookingFor = rolesInput ? rolesInput.split(',').map(t => t.trim()).filter(Boolean) : [];
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Creating...';

            try {
                const res = await api.createTeam({
                    name,
                    description,
                    domain,
                    lookingFor,
                    membersCount: 1,
                    maxMembers: 5
                });

                if (res.success) {
                    modal.style.display = 'none';
                    form.reset();
                    window.location.reload();
                } else {
                    alert(res.message || 'Failed to create team');
                }
            } catch (err) {
                alert('An error occurred while creating the team.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Team';
            }
        });
    }
});
