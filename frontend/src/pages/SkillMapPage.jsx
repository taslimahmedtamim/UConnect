import React from 'react';
import { Link } from 'react-router-dom';

export default function SkillMapPage() {
  return (
    <div className="landing-page">
      
    <div className="app-container">
        {/*  Sidebar  */}
        <aside className="sidebar" id="sidebar">
            {/*  Sidebar Toggle Handle  */}
            <div className="sidebar-toggle" id="sidebarToggle" title="Toggle sidebar">
                <i className="fas fa-chevron-left"></i>
            </div>
            <div className="sidebar-header">
                <a href="../index.html" className="logo">
                    <div className="logo-icon">U</div>
                    <div className="logo-text">
                        <span className="logo-title">UConnect</span>
                        <span className="logo-subtitle">University Ecosystem</span>
                    </div>
                </a>
                <button className="sidebar-collapse-btn" id="sidebarCollapse">
                    <i className="fas fa-chevron-left"></i>
                </button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-section-title">Main</div>
                    <a href="dashboard.html" className="nav-item">
                        <i className="fas fa-th-large"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="projects.html" className="nav-item">
                        <i className="fas fa-folder-open"></i>
                        <span>Projects</span>
                    </a>
                    <a href="teams.html" className="nav-item">
                        <i className="fas fa-users"></i>
                        <span>Teams</span>
                    </a>
                    <a href="opportunities.html" className="nav-item">
                        <i className="fas fa-briefcase"></i>
                        <span>Opportunities</span>
                        <span className="nav-badge">24</span>
                    </a>
                </div>

                <div className="nav-section">
                    <div className="nav-section-title">Career Tools</div>
                    <a href="profile.html" className="nav-item">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </a>
                    <a href="resume.html" className="nav-item">
                        <i className="fas fa-file-alt"></i>
                        <span>U-Resume</span>
                    </a>
                    <a href="skillmap.html" className="nav-item active">
                        <i className="fas fa-layer-group"></i>
                        <span>U-SkillMap</span>
                    </a>
                </div>

                <div className="nav-section">
                    <div className="nav-section-title">Community</div>
                    <a href="showcase.html" className="nav-item">
                        <i className="fas fa-desktop"></i>
                        <span>Showcase</span>
                    </a>
                    <a href="leaderboard.html" className="nav-item">
                        <i className="fas fa-trophy"></i>
                        <span>Leaderboard</span>
                    </a>
                    <a href="mentors.html" className="nav-item">
                        <i className="fas fa-user-graduate"></i>
                        <span>Mentors</span>
                    </a>
                </div>

                <div className="nav-section">
                    <div className="nav-section-title">Support</div>
                    <a href="messages.html" className="nav-item">
                        <i className="fas fa-comment-dots"></i>
                        <span>Messages</span>
                        <span className="nav-badge">3</span>
                    </a>
                    <a href="help.html" className="nav-item">
                        <i className="fas fa-question-circle"></i>
                        <span>Help Board</span>
                    </a>
                </div>
            </nav>
        </aside>

        <div className="main-wrapper">
            <header className="top-header">
                <div className="header-left">
                    <button className="mobile-menu-btn" id="mobileMenuBtn">
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="header-title">
                        <h1>U-SkillMap</h1>
                        <p>Track your skills and learning progress</p>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-chart-line"></i>
                        Skill Analytics
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i>
                        Add Skill
                    </button>
                </div>

                <div className="header-right">
                    <button className="icon-btn theme-toggle" id="themeToggle">
                        <i className="fas fa-moon"></i>
                    </button>
                    <button className="icon-btn notification-btn">
                        <i className="fas fa-bell"></i>
                        <span className="notification-dot"></span>
                    </button>
                    <div className="user-dropdown" id="userDropdown">
                        <button className="user-btn">
                            <div className="user-avatar">TT</div>
                            <span className="user-name">Taslim Ahmed</span>
                            <i className="fas fa-chevron-down"></i>
                        </button>
                        <div className="dropdown-menu">
                            <a href="profile.html" className="dropdown-item">
                                <i className="fas fa-user-circle"></i>
                                My Profile
                            </a>
                            <a href="resume.html" className="dropdown-item">
                                <i className="fas fa-file-alt"></i>
                                U-Resume
                            </a>
                            <a href="skillmap.html" className="dropdown-item">
                                <i className="fas fa-layer-group"></i>
                                U-SkillMap
                            </a>
                            <a href="#" className="dropdown-item">
                                <i className="fas fa-cog"></i>
                                Settings
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="login.html" className="dropdown-item logout">
                                <i className="fas fa-sign-out-alt"></i>
                                Log Out
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-content">
                {/*  Stats Overview  */}
                <div className="stats-grid" style={{"marginBottom":"1.5rem"}}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{"background":"rgba(37, 99, 235, 0.1)","color":"var(--primary)"}}>
                            <i className="fas fa-layer-group"></i>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">24</span>
                            <span className="stat-label">Total Skills</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{"background":"rgba(16, 185, 129, 0.1)","color":"var(--success)"}}>
                            <i className="fas fa-star"></i>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">8</span>
                            <span className="stat-label">Expert Level</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{"background":"rgba(245, 158, 11, 0.1)","color":"var(--warning)"}}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">+12%</span>
                            <span className="stat-label">Growth This Month</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{"background":"rgba(139, 92, 246, 0.1)","color":"var(--accent)"}}>
                            <i className="fas fa-certificate"></i>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">5</span>
                            <span className="stat-label">Certifications</span>
                        </div>
                    </div>
                </div>

                <div style={{"display":"grid","gridTemplateColumns":"1fr 350px","gap":"1.5rem"}}>
                    {/*  Skills by Category  */}
                    <div style={{"display":"flex","flexDirection":"column","gap":"1.5rem"}}>
                        {/*  Frontend Skills  */}
                        <div className="card">
                            <div className="card-header" style={{"padding":"1rem","borderBottom":"1px solid var(--border-color)","display":"flex","justifyContent":"space-between","alignItems":"center"}}>
                                <h3 style={{"fontSize":"1rem","display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <i className="fas fa-palette" style={{"color":"var(--primary)"}}></i>
                                    Frontend Development
                                </h3>
                                <span className="badge badge-primary">8 Skills</span>
                            </div>
                            <div className="card-body">
                                <div style={{"display":"grid","gap":"1rem"}}>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>JavaScript</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--success)"}}>Expert • 90%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"90%","background":"var(--success)"}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>React</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--success)"}}>Expert • 85%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"85%","background":"var(--success)"}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>TypeScript</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--primary)"}}>Advanced • 75%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"75%"}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>CSS/Tailwind</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--primary)"}}>Advanced • 80%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"80%"}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Backend Skills  */}
                        <div className="card">
                            <div className="card-header" style={{"padding":"1rem","borderBottom":"1px solid var(--border-color)","display":"flex","justifyContent":"space-between","alignItems":"center"}}>
                                <h3 style={{"fontSize":"1rem","display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <i className="fas fa-server" style={{"color":"var(--success)"}}></i>
                                    Backend Development
                                </h3>
                                <span className="badge badge-success">6 Skills</span>
                            </div>
                            <div className="card-body">
                                <div style={{"display":"grid","gap":"1rem"}}>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>Node.js</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--success)"}}>Expert • 85%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"85%","background":"var(--success)"}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>Python</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--primary)"}}>Advanced • 75%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"75%"}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>PostgreSQL</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--primary)"}}>Advanced • 70%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"70%"}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>MongoDB</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--warning)"}}>Intermediate • 60%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"60%","background":"var(--warning)"}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  AI/ML Skills  */}
                        <div className="card">
                            <div className="card-header" style={{"padding":"1rem","borderBottom":"1px solid var(--border-color)","display":"flex","justifyContent":"space-between","alignItems":"center"}}>
                                <h3 style={{"fontSize":"1rem","display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <i className="fas fa-brain" style={{"color":"var(--accent)"}}></i>
                                    AI & Machine Learning
                                </h3>
                                <span className="badge" style={{"background":"rgba(139, 92, 246, 0.1)","color":"var(--accent)"}}>5 Skills</span>
                            </div>
                            <div className="card-body">
                                <div style={{"display":"grid","gap":"1rem"}}>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>TensorFlow</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--warning)"}}>Intermediate • 55%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"55%","background":"var(--warning)"}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>PyTorch</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--warning)"}}>Intermediate • 50%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"50%","background":"var(--warning)"}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.5rem"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>NLP</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--warning)"}}>Intermediate • 45%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"45%","background":"var(--warning)"}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Sidebar  */}
                    <div style={{"display":"flex","flexDirection":"column","gap":"1rem"}}>
                        {/*  Skill Recommendations  */}
                        <div className="card">
                            <div className="card-header" style={{"padding":"1rem","borderBottom":"1px solid var(--border-color)"}}>
                                <h3 style={{"fontSize":"1rem","display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <i className="fas fa-magic" style={{"color":"var(--accent)"}}></i>
                                    AI Recommendations
                                </h3>
                            </div>
                            <div className="card-body">
                                <p style={{"fontSize":"0.75rem","color":"var(--text-secondary)","marginBottom":"1rem"}}>Based on your projects and goals:</p>
                                <div style={{"display":"grid","gap":"0.75rem"}}>
                                    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem","padding":"0.75rem","background":"var(--surface-elevated)","borderRadius":"0.5rem"}}>
                                        <div style={{"width":"32px","height":"32px","background":"rgba(37, 99, 235, 0.1)","borderRadius":"0.375rem","display":"flex","alignItems":"center","justifyContent":"center"}}>
                                            <i className="fab fa-docker" style={{"color":"var(--primary)"}}></i>
                                        </div>
                                        <div style={{"flex":"1"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>Docker</span>
                                            <p style={{"fontSize":"0.65rem","color":"var(--text-secondary)"}}>High demand skill</p>
                                        </div>
                                        <button className="btn btn-sm btn-primary">Learn</button>
                                    </div>
                                    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem","padding":"0.75rem","background":"var(--surface-elevated)","borderRadius":"0.5rem"}}>
                                        <div style={{"width":"32px","height":"32px","background":"rgba(245, 158, 11, 0.1)","borderRadius":"0.375rem","display":"flex","alignItems":"center","justifyContent":"center"}}>
                                            <i className="fab fa-aws" style={{"color":"var(--warning)"}}></i>
                                        </div>
                                        <div style={{"flex":"1"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>AWS</span>
                                            <p style={{"fontSize":"0.65rem","color":"var(--text-secondary)"}}>Career booster</p>
                                        </div>
                                        <button className="btn btn-sm btn-primary">Learn</button>
                                    </div>
                                    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem","padding":"0.75rem","background":"var(--surface-elevated)","borderRadius":"0.5rem"}}>
                                        <div style={{"width":"32px","height":"32px","background":"rgba(16, 185, 129, 0.1)","borderRadius":"0.375rem","display":"flex","alignItems":"center","justifyContent":"center"}}>
                                            <i className="fas fa-code-branch" style={{"color":"var(--success)"}}></i>
                                        </div>
                                        <div style={{"flex":"1"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>GraphQL</span>
                                            <p style={{"fontSize":"0.65rem","color":"var(--text-secondary)"}}>Trending API tech</p>
                                        </div>
                                        <button className="btn btn-sm btn-primary">Learn</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Certifications  */}
                        <div className="card">
                            <div className="card-header" style={{"padding":"1rem","borderBottom":"1px solid var(--border-color)","display":"flex","justifyContent":"space-between","alignItems":"center"}}>
                                <h3 style={{"fontSize":"1rem"}}>Certifications</h3>
                                <button className="btn btn-sm btn-outline-primary"><i className="fas fa-plus"></i></button>
                            </div>
                            <div className="card-body">
                                <div style={{"display":"grid","gap":"0.75rem"}}>
                                    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem","padding":"0.75rem","background":"var(--surface-elevated)","borderRadius":"0.5rem"}}>
                                        <i className="fas fa-certificate" style={{"color":"var(--warning)"}}></i>
                                        <div style={{"flex":"1"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>Meta Frontend Developer</span>
                                            <p style={{"fontSize":"0.65rem","color":"var(--text-secondary)"}}>Coursera • 2024</p>
                                        </div>
                                    </div>
                                    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem","padding":"0.75rem","background":"var(--surface-elevated)","borderRadius":"0.5rem"}}>
                                        <i className="fas fa-certificate" style={{"color":"var(--warning)"}}></i>
                                        <div style={{"flex":"1"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>Google Data Analytics</span>
                                            <p style={{"fontSize":"0.65rem","color":"var(--text-secondary)"}}>Coursera • 2023</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Learning Path  */}
                        <div className="card">
                            <div className="card-header" style={{"padding":"1rem","borderBottom":"1px solid var(--border-color)"}}>
                                <h3 style={{"fontSize":"1rem"}}>Current Learning</h3>
                            </div>
                            <div className="card-body">
                                <div style={{"display":"grid","gap":"0.75rem"}}>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.25rem"}}>
                                            <span style={{"fontSize":"0.875rem"}}>Deep Learning Specialization</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--text-secondary)"}}>65%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"65%"}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{"display":"flex","justifyContent":"space-between","marginBottom":"0.25rem"}}>
                                            <span style={{"fontSize":"0.875rem"}}>System Design Course</span>
                                            <span style={{"fontSize":"0.75rem","color":"var(--text-secondary)"}}>30%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{"width":"30%"}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    {/*  Chat Widget  */}
    <div className="chat-widget" id="chatWidget">
        <div className="chat-bubble" id="chatBubble">
            <div className="chat-bubble-content">
                <span className="wave-emoji">👋</span>
                <span>Hi! How can we help?</span>
            </div>
            <div className="chat-bubble-actions">
                <button className="chat-action-btn">I have a question</button>
                <button className="chat-action-btn">Tell me more</button>
            </div>
        </div>
        <button className="chat-toggle-btn" id="chatToggle">
            <i className="fas fa-comment-dots"></i>
            <span className="notification-badge">1</span>
        </button>
    </div>

    <script src="layout.js"></script>

    </div>
  );
}
