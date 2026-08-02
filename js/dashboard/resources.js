// UConnect Dashboard Feature: Resources

function renderResources() {
  const view = document.getElementById('view-resources');
  if (!view) return;

  const user = window.UConnect.getLoggedInUser();

  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Academic Hub & Notices 📚</h1>
      <p>Access notes, download exam papers, research resources, and stay up to date with official circulars.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="res-btn-board" onclick="switchResTab('board')">University Notices</button>
      <button class="btn btn--outline" id="res-btn-docs" onclick="switchResTab('docs')">Resource Repository</button>
    </div>

    <div id="res-panel-board">
      <div style="display:flex; gap:16px; margin-bottom:20px;">
        <input type="search" id="noticeSearch" placeholder="Search announcements..." style="flex:1; padding:12px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterNotices()">
        <select id="noticeCatFilter" style="padding:12px; border:1px solid var(--gray-200); border-radius:8px;" onchange="filterNotices()">
          <option value="all">All Bulletins</option>
          <option value="official">Official Notices</option>
          <option value="exam">Exam Schedules</option>
          <option value="scholarship">Scholarships</option>
          <option value="emergency">Emergency Alerts</option>
        </select>
        ${user.role === 'teacher' || user.role === 'admin' ? `<button class="btn btn--primary" onclick="openCreateNoticeModal()">+ Publish Notice</button>` : ''}
      </div>
      <div style="display:flex; flex-direction:column; gap:16px;" id="noticesListContainer"></div>
    </div>

    <div id="res-panel-docs" style="display:none;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <input type="search" id="docsSearch" placeholder="Search notes, textbooks, lab papers..." style="width:100%; max-width:400px; padding:12px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterDocs()">
        <button class="btn btn--primary btn--sm" onclick="openUploadResourceModal()">+ Upload Resource</button>
      </div>
      <div class="resource-grid" id="docsGridContainer"></div>
    </div>
  `;

  filterNotices();
}
