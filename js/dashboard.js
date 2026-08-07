document.addEventListener('DOMContentLoaded', async () => {
    const api = window.UConnectAPI;
    
    // Redirect to login if not authenticated
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const user = await api.getCurrentUser();
        if (user) {
            // Stats
            const statProjects = document.getElementById('stat-projects');
            const statScore = document.getElementById('stat-score');
            if (statScore) statScore.textContent = user.xp || 0;

            // Fetch projects
            const projectsRes = await api.getProjects();
            const projects = projectsRes.projects || [];
            
            if (statProjects) statProjects.textContent = projects.length;

            const recentProjectsList = document.getElementById('recentProjectsList');
            if (recentProjectsList) {
                recentProjectsList.innerHTML = '';
                // Get up to 3 recent projects
                const recent = projects.slice(0, 3);
                
                if (recent.length === 0) {
                    recentProjectsList.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No projects found. <a href="projects.html">Create one</a>.</td></tr>`;
                } else {
                    recent.forEach(p => {
                        const tr = document.createElement('tr');
                        const progress = p.progress || 0;
                        const statusClass = p.status === 'Completed' ? 'badge-success' : (p.status === 'Review' ? 'badge-warning' : 'badge-primary');
                        tr.innerHTML = `
                            <td>
                                <div style="font-weight: 500;">${p.title}</div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">${p.category}</div>
                            </td>
                            <td><span class="badge ${statusClass}">${p.status || 'In Progress'}</span></td>
                            <td>
                                <div class="progress-mini">
                                    <div class="progress-mini-bar">
                                        <div class="progress-mini-fill" style="width: ${progress}%; background: var(--${statusClass.replace('badge-', '')});"></div>
                                    </div>
                                    <span class="progress-mini-text">${progress}%</span>
                                </div>
                            </td>
                            <td>${p.dueDate || 'Ongoing'}</td>
                        `;
                        recentProjectsList.appendChild(tr);
                    });
                }
            }

            // Fetch teams
            const teamsRes = await api.getTeams();
            const teams = teamsRes.teams || [];
            const statTeams = document.getElementById('stat-teams');
            if (statTeams) statTeams.textContent = teams.length;
            
        }
    } catch (e) {
        console.error('Failed to load dashboard data', e);
    }
});
