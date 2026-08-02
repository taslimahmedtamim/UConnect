// UConnect Dashboard Feature: Events, Planner, and Services

function renderEvents(user) {
  const view = document.getElementById('view-events');
  if (!view) return;

  const db = window.UConnect.getDb();

  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Events, Planner & Services 🏛️📅</h1>
      <p>Attend campus gatherings, track assignment deadlines, set planner targets, and look up bus timings.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="evt-btn-list" onclick="switchEvtTab('list')">Campus Events</button>
      <button class="btn btn--outline" id="evt-btn-calendar" onclick="switchEvtTab('calendar')">Calendar & Planner</button>
      <button class="btn btn--outline" id="evt-btn-services" onclick="switchEvtTab('services')">University Services</button>
    </div>

    <div id="evt-panel-list">
      <div class="jobs-layout" style="grid-template-columns: 1fr 300px; gap:20px;">
        <div class="resource-grid" style="grid-template-columns:1fr 1fr; margin-top:0;" id="eventsGridList"></div>
        <aside style="display:flex; flex-direction:column; gap:16px;">
          <div class="widget" style="margin-top:0;"><h3 class="widget__title">My Event Tickets</h3><div id="myEventTicketsList" style="margin-top:12px;"></div></div>
          <div class="widget">
            <h3 class="widget__title">Clubs Membership</h3>
            <ul class="profile-tips" style="margin-top:10px;">
              ${db.clubs.map(club => {
                const isMember = club.members.includes(user.id);
                return `
                  <li style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span>🛡️ ${club.name}</span>
                    <button class="btn btn--outline btn--sm" style="padding:2px 8px; font-size:0.6875rem;" onclick="toggleClubJoin('${club.id}')">${isMember ? 'Joined' : 'Join'}</button>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <div id="evt-panel-calendar" style="display:none;">
      <div class="jobs-layout" style="grid-template-columns: 1fr 320px; gap:20px;">
        <div class="calendar-widget" style="margin-top:0;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>March 2026 Calendar</h3>
            <div style="display:flex; gap:12px; font-size:0.75rem;">
              <span>🔵 Event</span>
              <span>🔴 Exam</span>
              <span>🟢 Deadline</span>
            </div>
          </div>
          <div class="calendar-grid">
            <div class="calendar-header">S</div><div class="calendar-header">M</div><div class="calendar-header">T</div><div class="calendar-header">W</div><div class="calendar-header">T</div><div class="calendar-header">F</div><div class="calendar-header">S</div>
            <div class="calendar-day" style="opacity:0.3;">22</div><div class="calendar-day" style="opacity:0.3;">23</div><div class="calendar-day" style="opacity:0.3;">24</div><div class="calendar-day" style="opacity:0.3;">25</div><div class="calendar-day" style="opacity:0.3;">26</div><div class="calendar-day" style="opacity:0.3;">27</div><div class="calendar-day" style="opacity:0.3;">28</div>
            ${Array.from({ length: 28 }, (_, i) => {
              const day = i + 1;
              let dayClass = '';
              if (day === 15) dayClass = 'calendar-day--exam';
              if (day === 18) dayClass = 'calendar-day--event';
              if (day === 10) dayClass = 'calendar-day--deadline';
              return `<div class="calendar-day ${dayClass}">${day}</div>`;
            }).join('')}
          </div>
        </div>

        <aside style="display:flex; flex-direction:column; gap:16px;">
          <div class="widget" style="margin-top:0;">
            <h3 class="widget__title">Personal Checklist Planner</h3>
            <div style="display:flex; gap:8px; margin: 12px 0;">
              <input type="text" id="plannerTaskInput" placeholder="Add custom goal..." style="flex:1; padding:8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.8125rem;">
              <button onclick="submitPlannerGoal()" class="btn btn--primary btn--sm">+</button>
            </div>
            <div id="plannerChecklistContainer" style="display:flex; flex-direction:column; gap:8px;"></div>
          </div>
        </aside>
      </div>
    </div>

    <div id="evt-panel-services" style="display:none;"></div>

    <div class="modal-overlay" id="certificateModal" style="position:fixed; inset:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:2000; display:none; align-items:center; justify-content:center;">
      <div class="modal-content" style="background:#fff; border-radius:12px; padding:32px; width:100%; max-width:600px; box-shadow:0 12px 40px rgba(0,0,0,0.15); position:relative;" id="certificateModalContent"></div>
    </div>
  `;

  renderEventsGridList();
  renderMyEventTicketsList();
  renderPlannerChecklist();
}
