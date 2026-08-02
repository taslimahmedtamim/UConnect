// UConnect Dashboard Feature: Courses

function renderCourses(user) {
  const view = document.getElementById('view-courses');
  if (!view) return;

  if (user.role === 'teacher') {
    renderTeacherCourses(user);
    return;
  }

  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Course Management Workspace 🎓</h1>
      <p>Attend quizzes, review attendance logs, check term grade sheets, and upload class assignment solutions.</p>
    </section>

    <div class="jobs-layout" style="grid-template-columns: 280px 1fr;">
      <aside class="filter-sidebar" style="padding:16px;">
        <h4 style="margin-bottom:12px;">Active Course Load</h4>
        <div style="display:flex; flex-direction:column; gap:6px;" id="courseSideNavList"></div>
      </aside>
      <main id="activeCourseMainView">
        <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius); padding:40px; text-align:center; color:var(--gray-500);">
          Select an enrolled course code from the load panel to review curriculum status.
        </div>
      </main>
    </div>
  `;

  renderStudentCoursesSideNav();
}
