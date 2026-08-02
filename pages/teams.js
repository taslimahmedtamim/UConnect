// UConnect Pages Feature: Teams

(function() {
  function formatInitials(name) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  function getApi() {
    return window.UConnectAPI;
  }

  function getState() {
    const api = getApi();
    return api ? api.loadState() : { teams: [], teammates: [], invites: [] };
  }

  function saveState(state) {
    const api = getApi();
    if (api) api.saveState(state);
  }

  function showToast(message) {
    let toast = document.querySelector('.teams-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'teams-toast';
      toast.style.cssText = 'position:fixed; right:24px; bottom:24px; padding:14px 18px; border-radius:12px; background:var(--primary, #4f46e5); color:#fff; font-weight:600; box-shadow:0 16px 40px rgba(0,0,0,.18); z-index:9999; opacity:0; transform:translateY(12px); transition:all .25s ease;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 2200);
  }

  function ensureModal() {
    let overlay = document.getElementById('teamModalOverlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'teamModalOverlay';
    overlay.className = 'teams-modal-overlay';
    overlay.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,.58); backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:24px; z-index:9998;';
    overlay.innerHTML = `
      <div class="card" style="width:min(100%, 640px); background:var(--white, #fff); border-radius:18px; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,.2);">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid rgba(148,163,184,.2);">
          <strong id="teamModalTitle" style="font-size:1.125rem;">Team</strong>
          <button type="button" id="teamModalClose" class="icon-btn" aria-label="Close modal">×</button>
        </div>
        <div id="teamModalBody" style="padding:24px;"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', event => {
      if (event.target === overlay) closeModal();
    });
    overlay.querySelector('#teamModalClose').addEventListener('click', closeModal);
    return overlay;
  }

  function openModal(title, bodyHtml) {
    const overlay = ensureModal();
    overlay.querySelector('#teamModalTitle').textContent = title;
    overlay.querySelector('#teamModalBody').innerHTML = bodyHtml;
    overlay.style.display = 'flex';
  }

  function closeModal() {
    const overlay = document.getElementById('teamModalOverlay');
    if (overlay) overlay.style.display = 'none';
  }

  function renderTeams() {
    const grid = document.getElementById('teamMyTeamsGrid');
    if (!grid) return;

    const { teams } = getState();
    grid.innerHTML = teams.map(team => `
      <article class="card" data-team-id="${team.id}">
        <div class="card-body">
          <div style="display:flex; align-items:flex-start; gap:1rem; margin-bottom:1rem;">
            <div style="width:56px; height:56px; background:linear-gradient(135deg, var(--primary, #4f46e5), var(--accent, #7c3aed)); border-radius:0.75rem; display:flex; align-items:center; justify-content:center; color:white; font-weight:600; font-size:1.25rem;">
              ${formatInitials(team.name)}
            </div>
            <div style="flex:1;">
              <h3 style="font-size:1.125rem; margin-bottom:0.25rem;">${team.name}</h3>
              <p style="font-size:0.875rem; color:var(--text-secondary, #64748b);">${team.description}</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
            ${team.skills.map(skill => `<span class="badge badge-primary">${skill}</span>`).join('')}
            <span class="badge badge-success">${team.status}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="project-members">
              ${team.members.map(member => `<div class="avatar avatar-sm">${member}</div>`).join('')}
            </div>
            <span style="font-size:0.75rem; color:var(--text-secondary, #64748b);">${team.members.length} members</span>
          </div>
        </div>
        <div class="card-footer" style="display:flex; gap:0.5rem; padding:1rem; border-top:1px solid var(--border-color, rgba(148,163,184,.2));">
          <button type="button" class="btn btn-sm btn-primary" style="flex:1;" data-action="view-team" data-team-id="${team.id}">View Team</button>
          <button type="button" class="btn btn-sm btn-outline-primary" data-action="message-team" data-team-id="${team.id}" aria-label="Message team">
            <i class="fas fa-comment"></i>
          </button>
        </div>
      </article>
    `).join('');

    bindTeamActions();
  }

  function getFilteredTeammates() {
    const api = getApi();
    const search = document.getElementById('teamSearchInput');
    const filter = document.getElementById('teamSkillFilter');
    const query = search ? search.value.trim() : '';
    const skill = filter ? filter.value.trim() : '';
    return api ? api.suggestTeammates(query, skill) : [];
  }

  function renderTeammates() {
    const grid = document.getElementById('teamTeammatesGrid');
    if (!grid) return;

    const state = getState();
    const invitedIds = new Set(state.invites || []);
    const teammates = getFilteredTeammates();

    if (teammates.length === 0) {
      grid.innerHTML = '<div class="card" style="grid-column:1 / -1;"><div class="card-body" style="padding:1.5rem; text-align:center; color:var(--text-secondary, #64748b);">No teammates matched your search.</div></div>';
      return;
    }

    grid.innerHTML = teammates.map(member => `
      <article class="card" data-user-id="${member.id}">
        <div class="card-body" style="text-align:center; padding:1.5rem;">
          <div class="avatar avatar-lg" style="margin:0 auto 1rem; width:64px; height:64px; font-size:1.25rem; background:${member.color};">${member.initials}</div>
          <h3 style="font-size:1rem; margin-bottom:0.25rem;">${member.name}</h3>
          <p style="font-size:0.875rem; color:var(--text-secondary, #64748b); margin-bottom:0.75rem;">${member.role}</p>
          <div style="display:flex; justify-content:center; gap:0.5rem; margin-bottom:1rem;">
            <span style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.75rem; color:var(--text-secondary, #64748b);">
              <i class="fas fa-star" style="color:var(--warning, #f59e0b);"></i>
              U-Score: ${member.score}
            </span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.25rem; justify-content:center; margin-bottom:1rem;">
            ${member.skills.map(skill => `<span class="project-tag">${skill}</span>`).join('')}
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button type="button" class="btn btn-sm btn-primary" style="flex:1;" data-action="invite-teammate" data-user-id="${member.id}" ${invitedIds.has(member.id) ? 'disabled' : ''}>${invitedIds.has(member.id) ? 'Invited' : 'Invite'}</button>
            <button type="button" class="btn btn-sm btn-outline-primary" data-action="profile-teammate" data-user-id="${member.id}">Profile</button>
          </div>
        </div>
      </article>
    `).join('');

    bindTeammateActions();
  }

  function bindTeamActions() {
    document.querySelectorAll('[data-action="view-team"]').forEach(button => {
      button.addEventListener('click', () => {
        const teamId = button.dataset.teamId;
        const team = getApi().getTeam(teamId);
        if (!team) return;

        openModal(
          team.name,
          `
            <p style="color:var(--text-secondary, #64748b); margin-bottom:16px;">${team.description}</p>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:16px;">
              <span class="badge badge-primary">${team.focus}</span>
              <span class="badge badge-success">${team.status}</span>
              ${team.skills.map(skill => `<span class="badge" style="background:rgba(79,70,229,.1); color:var(--primary, #4f46e5);">${skill}</span>`).join('')}
            </div>
            <div style="display:grid; gap:12px;">
              <div><strong>Members</strong><div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">${team.members.map(member => `<span class="project-tag">${member}</span>`).join('')}</div></div>
              <div><strong>Focus Area</strong><p style="margin-top:4px; color:var(--text-secondary, #64748b);">${team.focus}</p></div>
            </div>
          `
        );
      });
    });

    document.querySelectorAll('[data-action="message-team"]').forEach(button => {
      button.addEventListener('click', () => {
        showToast('Team chat is ready to wire next.');
      });
    });
  }

  function bindTeammateActions() {
    document.querySelectorAll('[data-action="invite-teammate"]').forEach(button => {
      button.addEventListener('click', () => {
        const userId = button.dataset.userId;
        const result = getApi().inviteTeammate(userId);
        if (result.invited) {
          button.textContent = 'Invited';
          button.disabled = true;
          showToast('Invite sent successfully.');
        } else {
          showToast('This teammate was already invited.');
        }
      });
    });

    document.querySelectorAll('[data-action="profile-teammate"]').forEach(button => {
      button.addEventListener('click', () => {
        const teammate = getApi().getTeammate(button.dataset.userId);
        if (!teammate) return;

        openModal(
          teammate.name,
          `
            <p style="color:var(--text-secondary, #64748b); margin-bottom:16px;">${teammate.role}</p>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:16px;">
              <span class="badge badge-primary">U-Score ${teammate.score}</span>
              ${teammate.skills.map(skill => `<span class="project-tag">${skill}</span>`).join('')}
            </div>
            <p style="line-height:1.6; color:var(--text-secondary, #64748b);">Great fit for team work, quick collaboration, and project delivery. Use Invite to request participation.</p>
          `
        );
      });
    });
  }

  function bindPageControls() {
    const suggestBtn = document.getElementById('teamAiSuggestBtn');
    const createBtn = document.getElementById('teamCreateBtn');
    const searchInput = document.getElementById('teamSearchInput');
    const skillFilter = document.getElementById('teamSkillFilter');

    if (suggestBtn) {
      suggestBtn.addEventListener('click', () => {
        const teammates = getFilteredTeammates().slice(0, 3);
        openModal(
          'AI Suggested Team',
          `
            <p style="color:var(--text-secondary, #64748b); margin-bottom:16px;">These members match your current team needs best.</p>
            <div style="display:grid; gap:12px;">
              ${teammates.map(member => `
                <div style="padding:14px; border:1px solid rgba(148,163,184,.2); border-radius:14px;">
                  <strong style="display:block; margin-bottom:4px;">${member.name}</strong>
                  <span style="font-size:0.875rem; color:var(--text-secondary, #64748b);">${member.role} · U-Score ${member.score}</span>
                  <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-top:10px;">${member.skills.map(skill => `<span class="project-tag">${skill}</span>`).join('')}</div>
                </div>
              `).join('')}
            </div>
          `
        );
      });
    }

    if (createBtn) {
      createBtn.addEventListener('click', () => {
        openModal(
          'Create Team',
          `
            <form id="createTeamForm" style="display:grid; gap:14px;">
              <div>
                <label style="display:block; font-weight:600; margin-bottom:6px;">Team Name</label>
                <input type="text" name="name" class="form-input" placeholder="e.g. Hackathon Builders" required style="width:100%; padding:0.75rem 1rem;">
              </div>
              <div>
                <label style="display:block; font-weight:600; margin-bottom:6px;">Description</label>
                <textarea name="description" class="form-input" rows="4" placeholder="What is your team building?" required style="width:100%; padding:0.75rem 1rem;"></textarea>
              </div>
              <div>
                <label style="display:block; font-weight:600; margin-bottom:6px;">Focus Area</label>
                <input type="text" name="focus" class="form-input" placeholder="e.g. Web Dev, AI/ML, UI/UX" style="width:100%; padding:0.75rem 1rem;">
              </div>
              <div>
                <label style="display:block; font-weight:600; margin-bottom:6px;">Skills Needed</label>
                <input type="text" name="skills" class="form-input" placeholder="React, Python, Figma" required style="width:100%; padding:0.75rem 1rem;">
              </div>
              <div style="display:flex; gap:10px; justify-content:flex-end;">
                <button type="button" class="btn btn-outline-primary" id="cancelCreateTeam">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Team</button>
              </div>
            </form>
          `
        );

        const form = document.getElementById('createTeamForm');
        const cancel = document.getElementById('cancelCreateTeam');
        if (cancel) cancel.addEventListener('click', closeModal);

        if (form) {
          form.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(form);
            const created = getApi().addTeam({
              name: formData.get('name'),
              description: formData.get('description'),
              focus: formData.get('focus'),
              skills: String(formData.get('skills')).split(',').map(item => item.trim()).filter(Boolean),
              leadInitials: 'TT'
            });
            closeModal();
            renderTeams();
            showToast(`Team "${created.name}" created.`);
          });
        }
      });
    }

    if (searchInput) searchInput.addEventListener('input', renderTeammates);
    if (skillFilter) skillFilter.addEventListener('change', renderTeammates);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!window.UConnectAPI) return;
    bindPageControls();
    renderTeams();
    renderTeammates();
  });
})();
