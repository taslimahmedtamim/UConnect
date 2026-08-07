document.addEventListener('DOMContentLoaded', async () => {
    const api = window.UConnectAPI;
    if (!api || !api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const projectsGrid = document.getElementById('projectsGrid');
    
    try {
        const res = await api.getProjects();
        const projects = res.projects || [];
        
        if (projectsGrid) {
            projectsGrid.innerHTML = '';
            if (projects.length === 0) {
                projectsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">No projects found. Create one!</div>';
            } else {
                projects.forEach(p => {
                    const progress = p.progress || 0;
                    const statusClass = p.status === 'Completed' ? 'badge-success' : (p.status === 'Review' ? 'badge-warning' : (p.status === 'Planning' ? 'badge-secondary' : 'badge-primary'));
                    const statusBg = p.status === 'Planning' ? 'background: rgba(100, 116, 139, 0.1); color: var(--secondary);' : '';
                    
                    const membersHtml = (p.members || []).map(m => {
                        const init = m.name ? m.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U';
                        return `<div class="avatar avatar-sm" title="${m.name}">${init}</div>`;
                    }).join('');

                    const tagsHtml = (p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('');

                    projectsGrid.innerHTML += `
                        <div class="project-card">
                            <div class="project-card-header">
                                <h3>${p.title}</h3>
                                <p>${p.description}</p>
                            </div>
                            <div class="project-card-body">
                                <div class="project-tags">
                                    ${tagsHtml}
                                </div>
                                <div class="project-meta">
                                    <span><i class="fas fa-calendar"></i> ${p.dueDate || p.createdAt || 'Ongoing'}</span>
                                    <span class="badge ${statusBg ? '' : statusClass}" style="${statusBg}">${p.status || 'In Progress'}</span>
                                </div>
                                <div style="margin-top: 1rem;">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.25rem;">
                                        <span>Progress</span>
                                        <span>${progress}%</span>
                                    </div>
                                    <div style="height: 6px; background: var(--border-color); border-radius: 3px;">
                                        <div style="width: ${progress}%; height: 100%; background: var(--${statusClass.replace('badge-', '')}); border-radius: 3px;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="project-card-footer">
                                <div class="project-members">
                                    ${membersHtml}
                                </div>
                                <a href="#" class="btn btn-sm btn-ghost">View Details</a>
                            </div>
                        </div>
                    `;
                });
            }
        }
    } catch (e) {
        console.error('Failed to load projects', e);
        if (projectsGrid) {
            projectsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--danger);">Failed to load projects.</div>';
        }
    }

    // Modal Logic
    const newProjectBtn = document.getElementById('newProjectBtn');
    const modal = document.getElementById('createProjectModal');
    const closeBtn = document.getElementById('closeProjectModal');
    const form = document.getElementById('createProjectForm');
    const submitBtn = document.getElementById('cpSubmitBtn');

    if (newProjectBtn && modal) {
        newProjectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    }

    if (window.location.hash === '#new-project' && modal) {
        modal.style.display = 'flex';
        // Clean up hash without jumping
        history.replaceState(null, null, 'projects.html');
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
            
            const title = document.getElementById('cpTitle').value.trim();
            const description = document.getElementById('cpDescription').value.trim();
            const category = document.getElementById('cpCategory').value;
            const tagsInput = document.getElementById('cpTags').value;
            const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Creating...';

            try {
                const res = await api.createProject({
                    title,
                    description,
                    category,
                    tags,
                    status: 'Planning',
                    progress: 0,
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                });

                if (res.success) {
                    modal.style.display = 'none';
                    form.reset();
                    // Refresh page to show new project
                    window.location.reload();
                } else {
                    alert(res.message || 'Failed to create project');
                }
            } catch (err) {
                alert('An error occurred while creating the project.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Project';
            }
        });
    }
});
