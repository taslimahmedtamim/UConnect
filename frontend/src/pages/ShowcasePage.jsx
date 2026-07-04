import React from 'react';
import { Link } from 'react-router-dom';

export default function ShowcasePage() {
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
                    <a href="skillmap.html" className="nav-item">
                        <i className="fas fa-layer-group"></i>
                        <span>U-SkillMap</span>
                    </a>
                </div>

                <div className="nav-section">
                    <div className="nav-section-title">Community</div>
                    <a href="showcase.html" className="nav-item active">
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
                        <h1>Showcase</h1>
                        <p>Discover inspiring projects from the community</p>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i>
                        Submit Project
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
                {/*  Filter Tabs  */}
                <div className="card" style={{"marginBottom":"1.5rem"}}>
                    <div className="card-body" style={{"padding":"0.75rem 1rem"}}>
                        <div style={{"display":"flex","gap":"0.5rem","flexWrap":"wrap"}}>
                            <button className="btn btn-primary btn-sm">All</button>
                            <button className="btn btn-outline-primary btn-sm">Web Apps</button>
                            <button className="btn btn-outline-primary btn-sm">Mobile</button>
                            <button className="btn btn-outline-primary btn-sm">AI/ML</button>
                            <button className="btn btn-outline-primary btn-sm">Games</button>
                            <button className="btn btn-outline-primary btn-sm">IoT</button>
                            <button className="btn btn-outline-primary btn-sm">Design</button>
                        </div>
                    </div>
                </div>

                {/*  Featured Project  */}
                <div className="card" style={{"marginBottom":"1.5rem","overflow":"hidden"}}>
                    <div style={{"display":"grid","gridTemplateColumns":"1fr 1fr","minHeight":"300px"}}>
                        <div style={{"background":"linear-gradient(135deg, var(--primary), var(--accent))","padding":"2rem","display":"flex","flexDirection":"column","justifyContent":"center","color":"white"}}>
                            <span className="badge" style={{"background":"rgba(255,255,255,0.2)","color":"white","width":"fit-content","marginBottom":"1rem"}}>🏆 Featured Project</span>
                            <h2 style={{"fontSize":"1.75rem","marginBottom":"0.5rem"}}>EcoTrack - Carbon Footprint Monitor</h2>
                            <p style={{"opacity":"0.9","marginBottom":"1rem","lineHeight":"1.6"}}>An AI-powered mobile app that helps users track and reduce their carbon footprint through daily activity monitoring and personalized recommendations.</p>
                            <div style={{"display":"flex","gap":"0.5rem","flexWrap":"wrap","marginBottom":"1.5rem"}}>
                                <span className="project-tag" style={{"background":"rgba(255,255,255,0.2)","color":"white"}}>React Native</span>
                                <span className="project-tag" style={{"background":"rgba(255,255,255,0.2)","color":"white"}}>TensorFlow</span>
                                <span className="project-tag" style={{"background":"rgba(255,255,255,0.2)","color":"white"}}>Firebase</span>
                            </div>
                            <div style={{"display":"flex","alignItems":"center","gap":"1rem"}}>
                                <div className="avatar avatar-sm" style={{"border":"2px solid white"}}>AR</div>
                                <div>
                                    <span style={{"fontWeight":"500"}}>Anika Rahman</span>
                                    <p style={{"fontSize":"0.75rem","opacity":"0.8"}}>CSE 2022 Batch</p>
                                </div>
                            </div>
                        </div>
                        <div style={{"background":"url('https","position":"relative"}}>
                            <div style={{"position":"absolute","inset":"0","background":"rgba(0,0,0,0.3)","display":"flex","alignItems":"center","justifyContent":"center"}}>
                                <button className="btn" style={{"background":"white","color":"var(--primary)","padding":"1rem 2rem"}}>
                                    <i className="fas fa-play"></i> Watch Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Project Grid  */}
                <div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fill, minmax(320px, 1fr))","gap":"1.5rem"}}>
                    {/*  Project 1  */}
                    <div className="card" style={{"overflow":"hidden"}}>
                        <div style={{"height":"180px","background":"linear-gradient(135deg, #667eea, #764ba2)","display":"flex","alignItems":"center","justifyContent":"center"}}>
                            <i className="fas fa-comments" style={{"fontSize":"3rem","color":"white","opacity":"0.5"}}></i>
                        </div>
                        <div className="card-body">
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"start","marginBottom":"0.75rem"}}>
                                <h3 style={{"fontSize":"1.125rem"}}>StudyBuddy AI</h3>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.25rem","color":"var(--warning)"}}>
                                    <i className="fas fa-star"></i>
                                    <span style={{"fontSize":"0.875rem"}}>4.8</span>
                                </div>
                            </div>
                            <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>AI-powered study companion that creates personalized learning paths and quizzes.</p>
                            <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                <span className="project-tag">Python</span>
                                <span className="project-tag">GPT-4</span>
                                <span className="project-tag">React</span>
                            </div>
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","paddingTop":"1rem","borderTop":"1px solid var(--border-color)"}}>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <div className="avatar avatar-sm" style={{"background":"var(--success)"}}>SK</div>
                                    <span style={{"fontSize":"0.875rem"}}>Salman Kabir</span>
                                </div>
                                <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                    <span><i className="fas fa-heart"></i> 234</span>
                                    <span><i className="fas fa-eye"></i> 1.2k</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Project 2  */}
                    <div className="card" style={{"overflow":"hidden"}}>
                        <div style={{"height":"180px","background":"linear-gradient(135deg, #11998e, #38ef7d)","display":"flex","alignItems":"center","justifyContent":"center"}}>
                            <i className="fas fa-heartbeat" style={{"fontSize":"3rem","color":"white","opacity":"0.5"}}></i>
                        </div>
                        <div className="card-body">
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"start","marginBottom":"0.75rem"}}>
                                <h3 style={{"fontSize":"1.125rem"}}>HealthSync</h3>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.25rem","color":"var(--warning)"}}>
                                    <i className="fas fa-star"></i>
                                    <span style={{"fontSize":"0.875rem"}}>4.6</span>
                                </div>
                            </div>
                            <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>Wearable integration app for comprehensive health monitoring and analytics.</p>
                            <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                <span className="project-tag">Flutter</span>
                                <span className="project-tag">Firebase</span>
                                <span className="project-tag">IoT</span>
                            </div>
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","paddingTop":"1rem","borderTop":"1px solid var(--border-color)"}}>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <div className="avatar avatar-sm" style={{"background":"var(--accent)"}}>MI</div>
                                    <span style={{"fontSize":"0.875rem"}}>Majharul Islam</span>
                                </div>
                                <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                    <span><i className="fas fa-heart"></i> 189</span>
                                    <span><i className="fas fa-eye"></i> 856</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Project 3  */}
                    <div className="card" style={{"overflow":"hidden"}}>
                        <div style={{"height":"180px","background":"linear-gradient(135deg, #f093fb, #f5576c)","display":"flex","alignItems":"center","justifyContent":"center"}}>
                            <i className="fas fa-gamepad" style={{"fontSize":"3rem","color":"white","opacity":"0.5"}}></i>
                        </div>
                        <div className="card-body">
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"start","marginBottom":"0.75rem"}}>
                                <h3 style={{"fontSize":"1.125rem"}}>CodeQuest</h3>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.25rem","color":"var(--warning)"}}>
                                    <i className="fas fa-star"></i>
                                    <span style={{"fontSize":"0.875rem"}}>4.9</span>
                                </div>
                            </div>
                            <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>Gamified coding platform where learning algorithms becomes an adventure.</p>
                            <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                <span className="project-tag">Unity</span>
                                <span className="project-tag">C#</span>
                                <span className="project-tag">WebGL</span>
                            </div>
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","paddingTop":"1rem","borderTop":"1px solid var(--border-color)"}}>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <div className="avatar avatar-sm" style={{"background":"var(--warning)"}}>RK</div>
                                    <span style={{"fontSize":"0.875rem"}}>Rafiq Khan</span>
                                </div>
                                <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                    <span><i className="fas fa-heart"></i> 312</span>
                                    <span><i className="fas fa-eye"></i> 2.1k</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Project 4  */}
                    <div className="card" style={{"overflow":"hidden"}}>
                        <div style={{"height":"180px","background":"linear-gradient(135deg, #4facfe, #00f2fe)","display":"flex","alignItems":"center","justifyContent":"center"}}>
                            <i className="fas fa-robot" style={{"fontSize":"3rem","color":"white","opacity":"0.5"}}></i>
                        </div>
                        <div className="card-body">
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"start","marginBottom":"0.75rem"}}>
                                <h3 style={{"fontSize":"1.125rem"}}>AutoDoc AI</h3>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.25rem","color":"var(--warning)"}}>
                                    <i className="fas fa-star"></i>
                                    <span style={{"fontSize":"0.875rem"}}>4.7</span>
                                </div>
                            </div>
                            <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>Automatic code documentation generator using advanced NLP models.</p>
                            <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                <span className="project-tag">Python</span>
                                <span className="project-tag">NLP</span>
                                <span className="project-tag">VS Code</span>
                            </div>
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","paddingTop":"1rem","borderTop":"1px solid var(--border-color)"}}>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <div className="avatar avatar-sm">TT</div>
                                    <span style={{"fontSize":"0.875rem"}}>Taslim Tamim</span>
                                </div>
                                <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                    <span><i className="fas fa-heart"></i> 156</span>
                                    <span><i className="fas fa-eye"></i> 934</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Project 5  */}
                    <div className="card" style={{"overflow":"hidden"}}>
                        <div style={{"height":"180px","background":"linear-gradient(135deg, #fa709a, #fee140)","display":"flex","alignItems":"center","justifyContent":"center"}}>
                            <i className="fas fa-shopping-cart" style={{"fontSize":"3rem","color":"white","opacity":"0.5"}}></i>
                        </div>
                        <div className="card-body">
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"start","marginBottom":"0.75rem"}}>
                                <h3 style={{"fontSize":"1.125rem"}}>CampusMarket</h3>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.25rem","color":"var(--warning)"}}>
                                    <i className="fas fa-star"></i>
                                    <span style={{"fontSize":"0.875rem"}}>4.5</span>
                                </div>
                            </div>
                            <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>Peer-to-peer marketplace for university students to buy/sell used items.</p>
                            <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                <span className="project-tag">React</span>
                                <span className="project-tag">Node.js</span>
                                <span className="project-tag">MongoDB</span>
                            </div>
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","paddingTop":"1rem","borderTop":"1px solid var(--border-color)"}}>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <div className="avatar avatar-sm" style={{"background":"var(--danger)"}}>NA</div>
                                    <span style={{"fontSize":"0.875rem"}}>Nadia Ahmed</span>
                                </div>
                                <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                    <span><i className="fas fa-heart"></i> 98</span>
                                    <span><i className="fas fa-eye"></i> 567</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Project 6  */}
                    <div className="card" style={{"overflow":"hidden"}}>
                        <div style={{"height":"180px","background":"linear-gradient(135deg, #a8edea, #fed6e3)","display":"flex","alignItems":"center","justifyContent":"center"}}>
                            <i className="fas fa-calendar-alt" style={{"fontSize":"3rem","color":"#667eea","opacity":"0.5"}}></i>
                        </div>
                        <div className="card-body">
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"start","marginBottom":"0.75rem"}}>
                                <h3 style={{"fontSize":"1.125rem"}}>SmartScheduler</h3>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.25rem","color":"var(--warning)"}}>
                                    <i className="fas fa-star"></i>
                                    <span style={{"fontSize":"0.875rem"}}>4.4</span>
                                </div>
                            </div>
                            <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>AI-powered class scheduling system optimizing student preferences and constraints.</p>
                            <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                <span className="project-tag">Python</span>
                                <span className="project-tag">OR-Tools</span>
                                <span className="project-tag">Vue.js</span>
                            </div>
                            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","paddingTop":"1rem","borderTop":"1px solid var(--border-color)"}}>
                                <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                    <div className="avatar avatar-sm" style={{"background":"#667eea"}}>FA</div>
                                    <span style={{"fontSize":"0.875rem"}}>Fahim Ahmed</span>
                                </div>
                                <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                    <span><i className="fas fa-heart"></i> 76</span>
                                    <span><i className="fas fa-eye"></i> 423</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Load More  */}
                <div style={{"textAlign":"center","marginTop":"2rem"}}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-arrow-down"></i> Load More Projects
                    </button>
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
