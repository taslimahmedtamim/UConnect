// UConnect Dashboard Feature: Settings

function renderSettings(user) {
  if (user.role === 'recruiter' && typeof renderRecruiterSettings === 'function') {
    renderRecruiterSettings(user);
    return;
  }

  const view = document.getElementById('view-settings');
  if (!view) return;

  const db = window.UConnect.getDb();
  const skills = (user.skills || ['React', 'CSS', 'JavaScript']).join(', ');

  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Profile & Security Settings ⚙️</h1>
      <p>Edit personal/academic details, toggle authentication security codes, and view active sessions.</p>
    </section>

    <div class="resume-builder" style="grid-template-columns: 1fr 1fr; gap:24px;">
      <div class="resume-builder__form">
        <h3>Edit Personal Information</h3>
        <form onsubmit="saveProfileDetails(event)" style="margin-top:16px;">
          <div class="form-group" style="margin-bottom:12px;">
            <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Full Name</label>
            <input type="text" id="profName" value="${user.name}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
          </div>
          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px;">
            <div class="form-group">
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Department / Company</label>
              <input type="text" id="profDept" value="${user.dept || user.company || ''}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
            <div class="form-group">
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Year / Designation</label>
              <input type="text" id="profYear" value="${user.year || ''}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Skills Tag (Comma separated)</label>
            <input type="text" id="profSkills" value="${skills}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
          </div>
          <button type="submit" class="btn btn--primary" style="width:100%;">Save Changes</button>
        </form>

        ${user.role === 'student' ? `
          <div style="margin-top:24px; border-top:1px solid #E2E8F0; padding-top:20px;">
            <h3>ATS Resume Builder</h3>
            <p style="font-size:0.8125rem; color:var(--gray-500); margin: 6px 0;">Generate structured layout formats for careers scanner.</p>
            <button onclick="launchResumeBuilderModal()" class="btn btn--primary btn--sm">Open Builder Editor</button>
          </div>
        ` : ''}
      </div>

      <div class="app-tracker" style="margin-top:0;">
        <h3>Authentication Security</h3>
        <label class="checkbox-label checkbox-label--block" style="margin-top:16px; font-weight:600;">
          <input type="checkbox" id="twoFactorCheckbox" checked>
          <span>Enable Two-Factor Authentication (2FA)</span>
        </label>
        <span style="font-size:0.75rem; color:var(--gray-400); display:block; margin-top:4px; margin-bottom:24px;">Require 6-digit codes when signing in from unknown browsers.</span>

        <h3>Active Login Sessions</h3>
        <div style="margin-top:16px; display:flex; flex-direction:column; gap:10px;">
          ${db.activeSessions.map(ses => `
            <div class="planner-task" style="border-left-color:var(--green); display:block; padding:12px;">
              <strong style="font-size:0.875rem; color:var(--navy); display:block;">${ses.device}</strong>
              <span style="font-size:0.75rem; color:var(--gray-500);">${ses.location} · ${ses.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="modal-overlay" id="resumeBuilderModal" style="position:fixed; inset:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:2000; display:none; align-items:center; justify-content:center;">
      <div class="modal-content" style="background:#fff; border-radius:12px; padding:32px; width:95%; max-width:1000px; height:90%; display:flex; flex-direction:column; box-shadow:0 12px 40px rgba(0,0,0,0.15); position:relative;" id="resumeBuilderModalContent"></div>
    </div>
  `;
}
