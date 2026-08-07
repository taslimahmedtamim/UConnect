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

    // Logout handling
    const logoutBtns = document.querySelectorAll('.logout-btn, a[href*="login.html"]');
    logoutBtns.forEach(btn => {
        if (btn.classList.contains('logout-btn') || btn.textContent.toLowerCase().includes('log out') || btn.textContent.toLowerCase().includes('sign out')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.UConnectAPI) {
                    window.UConnectAPI.logout();
                } else {
                    localStorage.removeItem('uconnect_token');
                    localStorage.removeItem('uconnect_user');
                    window.location.href = 'login.html';
                }
            });
        }
    });

    // Populate user profile info from API or LocalStorage
    async function syncUserProfile() {
        if (!window.UConnectAPI) return;
        try {
            const user = await window.UConnectAPI.getCurrentUser();
            if (user) {
                const nameEls = document.querySelectorAll('.user-name, .profile-name, .user-info .name, .sidebar-user-name');
                const emailEls = document.querySelectorAll('.user-email, .profile-email, .user-info .email, .sidebar-user-email');
                const roleEls = document.querySelectorAll('.user-role, .profile-role, .sidebar-user-role');
                const avatarEls = document.querySelectorAll('.user-avatar img, .profile-avatar img, .user-btn img, .sidebar-user-avatar img');
                const sidebarAvatars = document.querySelectorAll('.sidebar-user-avatar'); // for non-img avatars (text initials)

                nameEls.forEach(el => { if (user.fullName) el.textContent = user.fullName; });
                emailEls.forEach(el => { if (user.email) el.textContent = user.email; });
                roleEls.forEach(el => { if (user.role) el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1); });
                avatarEls.forEach(img => { if (user.avatar) img.src = user.avatar; });
                sidebarAvatars.forEach(av => { 
                    if (user.fullName && !av.querySelector('img')) {
                        av.textContent = user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    }
                });
            }
        } catch (e) {
            console.log('[Layout] User sync notice:', e.message);
        }
    }
    syncUserProfile();

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

    // Sync with script.js key ('theme') and layout key ('uconnect-theme')
    // Default to dark if nothing is saved
    function getTheme() {
        return localStorage.getItem('theme') || localStorage.getItem('uconnect-theme') || 'dark';
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        // Keep both keys in sync
        localStorage.setItem('theme', theme);
        localStorage.setItem('uconnect-theme', theme);
        updateThemeIcon(theme === 'dark');
    }

    // Apply immediately on load
    applyTheme(getTheme());

    themeToggle?.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        applyTheme(isDark ? 'light' : 'dark');
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

