// UConnect Dashboard Feature: Jobs

function renderJobs(user) {
  const view = document.getElementById('view-jobs');
  if (!view) return;

  if (user.role === 'recruiter') {
    renderRecruiterJobs(user);
    return;
  }

  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Job & Internship Portal 💼</h1>
      <p>Discover roles tailored to your skills, track your ongoing applications, and verify matching scores.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="job-btn-list" onclick="switchJobTab('list')">Find Jobs</button>
      <button class="btn btn--outline" id="job-btn-tracker" onclick="switchJobTab('tracker')">Application Tracker</button>
    </div>

    <div id="job-panel-list">
      <div class="jobs-layout">
        <aside class="filter-sidebar">
          <div class="filter-group">
            <h4>Search</h4>
            <input type="text" id="jobSearchQuery" placeholder="Keywords..." style="width:100%; padding:10px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterJobsList()">
          </div>
          <div class="filter-group">
            <h4>Job Type</h4>
            <label class="filter-label"><input type="checkbox" class="job-type-filter" value="Full-time" onchange="filterJobsList()"> Full-time</label>
            <label class="filter-label"><input type="checkbox" class="job-type-filter" value="Part-time" onchange="filterJobsList()"> Part-time</label>
            <label class="filter-label"><input type="checkbox" class="job-type-filter" value="Internship" onchange="filterJobsList()"> Internship</label>
          </div>
          <div class="filter-group">
            <h4>Location</h4>
            <label class="filter-label"><input type="checkbox" class="job-loc-filter" value="Remote" onchange="filterJobsList()"> Remote</label>
            <label class="filter-label"><input type="checkbox" class="job-loc-filter" value="Dhaka" onchange="filterJobsList()"> Dhaka / Local</label>
          </div>
        </aside>
        <main class="job-cards-grid" id="jobsGridContainer"></main>
      </div>
    </div>

    <div id="job-panel-tracker" style="display:none;">
      <div class="app-tracker" style="margin-top:0;">
        <h3>My Submitted Applications</h3>
        <div class="dashboard-table" style="margin-top:16px;">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Matching Score</th>
                <th>Status</th>
                <th>Applied Date</th>
              </tr>
            </thead>
            <tbody id="appliedJobsTrackerBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  filterJobsList();
}
