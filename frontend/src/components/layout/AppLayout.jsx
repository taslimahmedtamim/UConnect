import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LuLayoutGrid, LuUserRound, LuFolderGit2, LuUsers, LuBriefcase, LuFileText,
  LuMessageCircle, LuGraduationCap, LuTrophy, LuMenu, LuSun, LuMoon, LuLogOut,
  LuAward, LuMap, LuSearch, LuBell, LuX, LuChevronRight,
} from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logoIcon from '../../assets/UConnect.png';

const navItems = [
  { to: '/dashboard',    icon: LuLayoutGrid,   label: 'Dashboard' },
  { to: '/profile',      icon: LuUserRound,    label: 'My Profile' },
  { to: '/projects',     icon: LuFolderGit2,   label: 'Projects' },
  { to: '/teams',        icon: LuUsers,        label: 'Teams' },
  { to: '/opportunities',icon: LuBriefcase,    label: 'Opportunities' },
  { to: '/resume',       icon: LuFileText,     label: 'Resume' },
  { to: '/certificates', icon: LuAward,        label: 'Certificates' },
  { to: '/skillmap',     icon: LuMap,          label: 'Skill Map' },
];

const communityItems = [
  { to: '/messages',   icon: LuMessageCircle, label: 'Messages' },
  { to: '/mentors',    icon: LuGraduationCap, label: 'Mentors' },
  { to: '/leaderboard',icon: LuTrophy,        label: 'Leaderboard' },
];

const pageTitles = {
  '/dashboard':    'Dashboard',
  '/profile':      'My Profile',
  '/projects':     'Projects',
  '/teams':        'Teams',
  '/opportunities':'Opportunities',
  '/resume':       'Resume Builder',
  '/messages':     'Messages',
  '/mentors':      'Mentors',
  '/leaderboard':  'Leaderboard',
  '/certificates': 'Certificates',
  '/skillmap':     'Skill Map',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentTitle = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'UConnect';

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <img src={logoIcon} alt="UConnect Logo" />
          </div>
          <span className="sidebar-logo-text">Connect</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="nav-icon" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: 8 }}>Community</div>
          {communityItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="nav-icon" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role?.toLowerCase()}</div>
            </div>
            <LuChevronRight
              size={14}
              style={{ color: 'var(--text-3)', flexShrink: 0 }}
            />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="flex gap-3" style={{ alignItems: 'center' }}>
            <button
              className="theme-btn mobile-menu-btn"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <LuX /> : <LuMenu />}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="topbar-title">{currentTitle}</span>
            </div>
          </div>

          <div className="topbar-actions">
            {/* Search */}
            <button
              className="theme-btn"
              title="Search"
              aria-label="Search"
            >
              <LuSearch />
            </button>

            {/* Notifications */}
            <button
              className="theme-btn"
              title="Notifications"
              aria-label="Notifications"
              style={{ position: 'relative' }}
            >
              <LuBell />
              {/* Notification dot */}
              <span style={{
                position: 'absolute',
                top: 8, right: 8,
                width: 7, height: 7,
                borderRadius: '50%',
                background: 'var(--indigo)',
                border: '1.5px solid var(--bg-base)',
              }} />
            </button>

            {/* Theme toggle */}
            <button
              className="theme-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title="Toggle theme"
            >
              {theme === 'dark' ? <LuSun /> : <LuMoon />}
            </button>

            {/* Avatar */}
            <div
              className="avatar avatar-md"
              style={{ cursor: 'pointer' }}
              title={user?.name}
            >
              {initials}
            </div>

            {/* Logout */}
            <button className="topbar-logout" onClick={logout}>
              <LuLogOut />
              <span style={{ display: 'none' }}>Logout</span>
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="page-content" key={location.pathname}>
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 199,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
