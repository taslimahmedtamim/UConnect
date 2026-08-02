// UConnect Dashboard Feature: Network

function renderNetwork() {
  const view = document.getElementById('view-network');
  if (!view) return;

  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Network & Collaboration Hub 🤝</h1>
      <p>Connect with members of the university community, request mentorship, or find partners for hackathons and projects.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="net-btn-users" onclick="switchNetTab('users')">University Directory</button>
      <button class="btn btn--outline" id="net-btn-collabs" onclick="switchNetTab('collabs')">Collab Team Finder</button>
    </div>

    <div id="net-panel-users">
      <div style="display:flex; gap:16px; margin-bottom:20px;">
        <input type="search" id="directorySearch" placeholder="Search people by name, skills or department..." style="flex:1; padding:12px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterDirectory()">
        <select id="directoryRoleFilter" style="padding:12px; border:1px solid var(--gray-200); border-radius:8px;" onchange="filterDirectory()">
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Faculty</option>
          <option value="recruiter">Recruiters</option>
        </select>
      </div>
      <div class="resource-grid" id="directoryGrid"></div>
    </div>

    <div id="net-panel-collabs" style="display:none;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3>Active Squad Openings</h3>
        <button class="btn btn--primary btn--sm" onclick="openCollabModal()">+ Post Collaboration request</button>
      </div>
      <div class="jobs-layout" style="grid-template-columns:1fr; gap:16px;" id="collabsGrid"></div>
    </div>
  `;

  filterDirectory();
}
