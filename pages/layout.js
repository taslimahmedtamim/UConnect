// UConnect Pages Layout Runtime

(function() {
  function applyTheme() {
    const theme = localStorage.getItem('theme') || localStorage.getItem('uconnect-theme') || 'dark';
    document.documentElement.classList.toggle('dark-theme-init', theme === 'dark');
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
    localStorage.setItem('uconnect-theme', theme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      const icon = toggle.querySelector('i');
      if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      localStorage.setItem('uconnect-theme', nextTheme);
      applyTheme();
    });
  }

  function initSidebarControls() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarCollapse = document.getElementById('sidebarCollapse');

    const toggleSidebar = () => {
      if (sidebar) sidebar.classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-collapsed');
    };

    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (sidebarCollapse) sidebarCollapse.addEventListener('click', toggleSidebar);
  }

  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      const href = item.getAttribute('href') || '';
      const matches = href === currentPage;
      item.classList.toggle('active', matches);
    });
  }

  function initChatWidget() {
    const toggle = document.getElementById('chatToggle');
    const bubble = document.getElementById('chatBubble');
    if (!toggle || !bubble) return;

    toggle.addEventListener('click', () => {
      bubble.classList.toggle('open');
      const badge = toggle.querySelector('.notification-badge');
      if (badge) badge.style.display = 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    initThemeToggle();
    initSidebarControls();
    initActiveNav();
    initChatWidget();
  });
})();
