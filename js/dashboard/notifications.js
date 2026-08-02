// UConnect Dashboard Feature: Notifications

function renderNotificationsList() {
  const view = document.getElementById('view-notifications');
  if (!view) return;

  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const myNotifs = db.notifications.filter(n => n.userId === user.id);

  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Smart System Notifications 🔔</h1>
      <p>Stay updated on peer activities, recruiter comments, exam schedules, and grading announcements.</p>
    </section>
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${myNotifs.map(n => `
        <div class="planner-task" style="border-left-color:${n.read ? 'var(--gray-400)' : 'var(--blue)'}; background:#fff; padding:16px;">
          <div>
            <strong style="font-size:0.9375rem; color:var(--navy);">${n.title}</strong>
            <span style="font-size:0.875rem; color:#475569; display:block; margin:4px 0;">${n.message}</span>
            <span style="font-size:0.75rem; color:var(--gray-400);">${n.timestamp}</span>
          </div>
        </div>
      `).join('')}
      ${myNotifs.length === 0 ? '<p style="text-align:center; color:var(--gray-400); padding:20px;">No new alerts.</p>' : ''}
    </div>
  `;

  myNotifs.forEach(n => n.read = true);
  window.UConnect.saveDb(db);

  const badge = document.getElementById('sidebarNotifBadge');
  if (badge) badge.style.display = 'none';
}
