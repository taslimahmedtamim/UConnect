/* ==========================================
   UConnect - Main JavaScript
   ========================================== */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initForms();
    initDashboard();
    initProfileIntegration();
});

/* ==========================================
   Dark Mode / Theme
   ========================================== */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

/* ==========================================
   Navigation
   ========================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    if (!menuBtn) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        
        // Toggle menu spans for hamburger animation
        const spans = menuBtn.querySelectorAll('span');
        if (menuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }

        // Create mobile menu if it doesn't exist
        let mobileMenu = document.querySelector('.mobile-menu');
        if (!mobileMenu && navLinks && navActions) {
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <div class="mobile-menu-content">
                    ${navLinks.outerHTML}
                    ${navActions.outerHTML}
                </div>
            `;
            document.body.appendChild(mobileMenu);
            
            // Add mobile menu styles dynamically
            const style = document.createElement('style');
            style.textContent = `
                .mobile-menu {
                    position: fixed;
                    top: 64px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    z-index: 999;
                    padding: 1.5rem;
                    display: none;
                    flex-direction: column;
                }
                .mobile-menu.open {
                    display: flex;
                }
                .mobile-menu .nav-links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }
                .mobile-menu .nav-links a {
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                }
                .mobile-menu .nav-links a:hover {
                    background: #f1f5f9;
                }
                .mobile-menu .nav-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
            `;
            document.head.appendChild(style);
        }

        if (mobileMenu) {
            mobileMenu.classList.toggle('open');
        }
    });

    // Close mobile menu on link click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mobile-menu a')) {
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenu) mobileMenu.classList.remove('open');
            if (menuBtn) {
                menuBtn.classList.remove('active');
                const spans = menuBtn.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        }
    });
}

/* ==========================================
   Smooth Scroll
   ========================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 64;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================
   Scroll Animations
   ========================================== */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .step, .stat-card, .testimonial-card, .team-card, .project-card, .opportunity-card'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add styles for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ==========================================
   Form Handling
   ========================================== */
function initForms() {
    // Login Form
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register Form
    const registerForm = document.querySelector('#registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            this.innerHTML = type === 'password' ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
        });
    });

    // Form validation
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearError);
    });
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;

    clearError({ target: input });

    if (input.required && !value) {
        showError(input, 'This field is required');
        return false;
    }

    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        }
    }

    if (name === 'password' && value) {
        if (value.length < 8) {
            showError(input, 'Password must be at least 8 characters');
            return false;
        }
    }

    if (name === 'confirmPassword') {
        const password = document.querySelector('input[name="password"]');
        if (password && value !== password.value) {
            showError(input, 'Passwords do not match');
            return false;
        }
    }

    return true;
}

function showError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;

    let errorEl = group.querySelector('.form-error');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        group.appendChild(errorEl);
    }
    errorEl.textContent = message;
    input.style.borderColor = '#ef4444';
}

function clearError(e) {
    const input = e.target;
    const group = input.closest('.form-group');
    if (!group) return;

    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.remove();
    input.style.borderColor = '';
}

function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;

    // Validate all inputs
    let isValid = true;
    form.querySelectorAll('.form-input').forEach(input => {
        if (!validateInput({ target: input })) {
            isValid = false;
        }
    });

    if (!isValid) return;

    // Simulate login (replace with actual API call)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';

    setTimeout(() => {
        // Simulate successful login
        localStorage.setItem('uconnect_user', JSON.stringify({
            email: email,
            name: email.split('@')[0],
            avatar: email.substring(0, 2).toUpperCase()
        }));
        window.location.href = 'dashboard.html';
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;

    // Validate all inputs
    let isValid = true;
    form.querySelectorAll('.form-input').forEach(input => {
        if (!validateInput({ target: input })) {
            isValid = false;
        }
    });

    if (!isValid) return;

    // Simulate registration
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Creating account...';

    setTimeout(() => {
        // Simulate successful registration
        const formData = new FormData(form);
        localStorage.setItem('uconnect_user', JSON.stringify({
            email: formData.get('email'),
            name: formData.get('fullName'),
            role: formData.get('role'),
            avatar: formData.get('fullName').substring(0, 2).toUpperCase()
        }));
        window.location.href = 'dashboard.html';
    }, 1500);
}

/* ==========================================
   Dashboard Functions
   ========================================== */
function initDashboard() {
    // Check if we're on a dashboard page
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Initialize sidebar toggle for mobile
    initSidebarToggle();

    // Set active nav item
    setActiveNavItem();

    // Initialize user menu
    initUserMenu();

    // Load user data
    loadUserData();
}

function initSidebarToggle() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar on overlay click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                if (!e.target.closest('.sidebar') && !e.target.closest('.sidebar-toggle')) {
                    sidebar.classList.remove('open');
                }
            }
        }
    });
}

function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initUserMenu() {
    const userMenuBtn = document.querySelector('.user-menu-btn');
    const userDropdown = document.querySelector('.user-dropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            userDropdown.classList.remove('open');
        });
    }

    // Logout handler
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('uconnect_user');
            window.location.href = '../index.html';
        });
    }
}

function loadUserData() {
    const userData = localStorage.getItem('uconnect_user');
    if (userData) {
        const user = JSON.parse(userData);
        
        // Update user avatar/name in sidebar
        const userAvatar = document.querySelector('.sidebar-user .avatar');
        const userName = document.querySelector('.sidebar-user .user-name');
        
        if (userAvatar) userAvatar.textContent = user.avatar;
        if (userName) userName.textContent = user.name;

        // Update profile page if exists
        const profileName = document.querySelector('.profile-name');
        const profileAvatar = document.querySelector('.profile-avatar');
        
        if (profileName) profileName.textContent = user.name;
        if (profileAvatar) profileAvatar.textContent = user.avatar;
    }
}

/* ==========================================
   Search Functionality
   ========================================== */
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // Simulate search (replace with actual API call)
    console.log('Searching for:', query);
}

/* ==========================================
   Modal Functions
   ========================================== */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.open');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

/* ==========================================
   Toast Notifications
   ========================================== */
function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    
    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
        .toast-container {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .toast {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(120%);
            transition: transform 0.3s ease;
            min-width: 280px;
        }
        .toast.show {
            transform: translateX(0);
        }
        .toast-info { border-left: 4px solid #3b82f6; }
        .toast-success { border-left: 4px solid #10b981; }
        .toast-warning { border-left: 4px solid #f59e0b; }
        .toast-error { border-left: 4px solid #ef4444; }
        .toast-message { flex: 1; font-size: 14px; }
        .toast-close {
            background: none;
            border: none;
            font-size: 18px;
            color: #64748b;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
    
    return container;
}

/* ==========================================
   Utility Functions
   ========================================== */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other scripts
window.UConnect = {
    openModal,
    closeModal,
    showToast,
    formatDate,
    debounce,
    throttle
};
