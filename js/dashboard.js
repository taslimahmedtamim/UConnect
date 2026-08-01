// UConnect — Dashboard Base
// Handles sidebar toggle and logout only.
// All user/session and dynamic view init is handled by dashboard-controllers.js

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initLogout();
});

function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

function initLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    sessionStorage.removeItem('uconnect_user');
    window.location.href = '../login.html';
  });
}


function initUser() {
  const stored = sessionStorage.getItem('uconnect_user');
  if (!stored) {
    window.location.href = '../login.html';
    return;
  }

  const user = JSON.parse(stored);
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  const fields = {
    userName: user.name,
    welcomeName: user.name,
    userAvatar: initial,
    postAvatar: initial
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) {
      if (id.includes('Avatar')) {
        el.textContent = value;
      } else {
        el.textContent = value;
      }
    }
  });

  const roleLabel = document.querySelector('.topbar__user span');
  if (roleLabel && user.role) {
    roleLabel.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  }
}

function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

function initLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    sessionStorage.removeItem('uconnect_user');
    window.location.href = '../login.html';
  });
}

function initPostActions() {
  document.querySelectorAll('.post-action').forEach(btn => {
    if (btn.textContent.includes('Like')) {
      btn.addEventListener('click', () => {
        btn.classList.toggle('liked');
        const icon = btn.querySelector('span');
        if (btn.classList.contains('liked')) {
          icon.textContent = '❤️';
        } else {
          icon.textContent = '👍';
        }
      });
    }
  });
}
