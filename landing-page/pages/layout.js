// UConnect Shared Layout JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainWrapper = document.querySelector('.main-wrapper');

    // Load saved sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState === 'true') {
        sidebar?.classList.add('collapsed');
        mainWrapper?.classList.add('sidebar-collapsed');
    }

    // Toggle sidebar function
    function toggleSidebar() {
        sidebar?.classList.toggle('collapsed');
        mainWrapper?.classList.toggle('sidebar-collapsed');
        // Save state
        localStorage.setItem('sidebarCollapsed', sidebar?.classList.contains('collapsed'));
    }

    sidebarCollapse?.addEventListener('click', toggleSidebar);
    sidebarToggle?.addEventListener('click', toggleSidebar);

    mobileMenuBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
    });

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (sidebar && mobileMenuBtn && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });

    // User Dropdown
    const userDropdown = document.getElementById('userDropdown');
    const userBtn = userDropdown?.querySelector('.user-btn');

    userBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
        userDropdown?.classList.remove('open');
    });

    // Chat Widget
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatBubble = document.getElementById('chatBubble');

    chatToggle?.addEventListener('click', () => {
        chatBubble.classList.toggle('show');
    });

    // Close chat bubble when clicking outside
    document.addEventListener('click', (e) => {
        if (chatWidget && !chatWidget.contains(e.target)) {
            chatBubble?.classList.remove('show');
        }
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('uconnect-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeIcon(true);
    }

    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('uconnect-theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });

    function updateThemeIcon(isDark) {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon', 'fa-sun');
            icon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
        }
    }

    // Set active navigation item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        } else if (currentPage === 'dashboard.html' && href === 'dashboard.html') {
            item.classList.add('active');
        }
    });

    // Scroll sidebar to top on load
    if (sidebar) {
        sidebar.scrollTop = 0;
    }
});
