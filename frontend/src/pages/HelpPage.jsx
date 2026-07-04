import React from 'react';
import { Link } from 'react-router-dom';

export default function HelpPage() {
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
                    <a href="help.html" className="nav-item active">
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
                        <h1>Help Board</h1>
                        <p>Ask questions and help your peers</p>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i>
                        Ask Question
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
                <div style={{"display":"grid","gridTemplateColumns":"1fr 300px","gap":"1.5rem"}}>
                    {/*  Questions List  */}
                    <div style={{"display":"flex","flexDirection":"column","gap":"1rem"}}>
                        {/*  Filter Tabs  */}
                        <div className="card">
                            <div className="card-body" style={{"padding":"0.75rem 1rem"}}>
                                <div style={{"display":"flex","gap":"0.5rem","flexWrap":"wrap"}}>
                                    <button className="btn btn-primary btn-sm">All Questions</button>
                                    <button className="btn btn-outline-primary btn-sm">Unanswered</button>
                                    <button className="btn btn-outline-primary btn-sm">My Questions</button>
                                    <button className="btn btn-outline-primary btn-sm">Bookmarked</button>
                                </div>
                            </div>
                        </div>

                        {/*  Question 1  */}
                        <div className="card">
                            <div className="card-body">
                                <div style={{"display":"flex","gap":"1rem"}}>
                                    {/*  Votes  */}
                                    <div style={{"display":"flex","flexDirection":"column","alignItems":"center","gap":"0.25rem","minWidth":"50px"}}>
                                        <button className="icon-btn" style={{"width":"32px","height":"32px"}}><i className="fas fa-chevron-up"></i></button>
                                        <span style={{"fontWeight":"600","fontSize":"1.25rem"}}>12</span>
                                        <button className="icon-btn" style={{"width":"32px","height":"32px"}}><i className="fas fa-chevron-down"></i></button>
                                    </div>
                                    
                                    {/*  Content  */}
                                    <div style={{"flex":"1"}}>
                                        <div style={{"display":"flex","alignItems":"start","justifyContent":"space-between","gap":"1rem","marginBottom":"0.5rem"}}>
                                            <a href="#" style={{"fontSize":"1.125rem","fontWeight":"600","color":"var(--text-primary)","textDecoration":"none"}}>How to implement JWT authentication in Node.js with refresh tokens?</a>
                                            <span className="badge badge-success" style={{"flexShrink":"0"}}>Solved</span>
                                        </div>
                                        <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>I'm building a REST API and need to implement secure authentication. What's the best approach for handling refresh tokens and storing them securely?</p>
                                        <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                            <span className="project-tag">Node.js</span>
                                            <span className="project-tag">JWT</span>
                                            <span className="project-tag">Authentication</span>
                                        </div>
                                        <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","flexWrap":"wrap","gap":"1rem"}}>
                                            <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                                <div className="avatar avatar-sm" style={{"background":"var(--warning)"}}>RK</div>
                                                <span style={{"fontSize":"0.875rem"}}>Rafiq Khan</span>
                                                <span style={{"fontSize":"0.75rem","color":"var(--text-secondary)"}}>• 2 hours ago</span>
                                            </div>
                                            <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                                <span><i className="fas fa-comment"></i> 5 answers</span>
                                                <span><i className="fas fa-eye"></i> 234 views</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Question 2  */}
                        <div className="card">
                            <div className="card-body">
                                <div style={{"display":"flex","gap":"1rem"}}>
                                    <div style={{"display":"flex","flexDirection":"column","alignItems":"center","gap":"0.25rem","minWidth":"50px"}}>
                                        <button className="icon-btn" style={{"width":"32px","height":"32px"}}><i className="fas fa-chevron-up"></i></button>
                                        <span style={{"fontWeight":"600","fontSize":"1.25rem"}}>8</span>
                                        <button className="icon-btn" style={{"width":"32px","height":"32px"}}><i className="fas fa-chevron-down"></i></button>
                                    </div>
                                    
                                    <div style={{"flex":"1"}}>
                                        <div style={{"display":"flex","alignItems":"start","justifyContent":"space-between","gap":"1rem","marginBottom":"0.5rem"}}>
                                            <a href="#" style={{"fontSize":"1.125rem","fontWeight":"600","color":"var(--text-primary)","textDecoration":"none"}}>Best practices for React state management in 2024?</a>
                                            <span className="badge badge-primary" style={{"flexShrink":"0"}}>Open</span>
                                        </div>
                                        <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>With so many options like Redux, Zustand, Jotai, and React Query, what's the recommended approach for a medium-sized application?</p>
                                        <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                            <span className="project-tag">React</span>
                                            <span className="project-tag">State Management</span>
                                            <span className="project-tag">Redux</span>
                                        </div>
                                        <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","flexWrap":"wrap","gap":"1rem"}}>
                                            <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                                <div className="avatar avatar-sm" style={{"background":"var(--danger)"}}>NA</div>
                                                <span style={{"fontSize":"0.875rem"}}>Nadia Ahmed</span>
                                                <span style={{"fontSize":"0.75rem","color":"var(--text-secondary)"}}>• 5 hours ago</span>
                                            </div>
                                            <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                                <span><i className="fas fa-comment"></i> 3 answers</span>
                                                <span><i className="fas fa-eye"></i> 156 views</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Question 3  */}
                        <div className="card">
                            <div className="card-body">
                                <div style={{"display":"flex","gap":"1rem"}}>
                                    <div style={{"display":"flex","flexDirection":"column","alignItems":"center","gap":"0.25rem","minWidth":"50px"}}>
                                        <button className="icon-btn" style={{"width":"32px","height":"32px"}}><i className="fas fa-chevron-up"></i></button>
                                        <span style={{"fontWeight":"600","fontSize":"1.25rem"}}>5</span>
                                        <button className="icon-btn" style={{"width":"32px","height":"32px"}}><i className="fas fa-chevron-down"></i></button>
                                    </div>
                                    
                                    <div style={{"flex":"1"}}>
                                        <div style={{"display":"flex","alignItems":"start","justifyContent":"space-between","gap":"1rem","marginBottom":"0.5rem"}}>
                                            <a href="#" style={{"fontSize":"1.125rem","fontWeight":"600","color":"var(--text-primary)","textDecoration":"none"}}>TensorFlow vs PyTorch for NLP projects?</a>
                                            <span className="badge" style={{"background":"rgba(245, 158, 11, 0.1)","color":"var(--warning)","flexShrink":"0"}}>Discussing</span>
                                        </div>
                                        <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>Starting a new NLP project for sentiment analysis. Which framework would you recommend and why?</p>
                                        <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                            <span className="project-tag">Machine Learning</span>
                                            <span className="project-tag">NLP</span>
                                            <span className="project-tag">Python</span>
                                        </div>
                                        <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","flexWrap":"wrap","gap":"1rem"}}>
                                            <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                                <div className="avatar avatar-sm" style={{"background":"var(--accent)"}}>MI</div>
                                                <span style={{"fontSize":"0.875rem"}}>Majharul Islam</span>
                                                <span style={{"fontSize":"0.75rem","color":"var(--text-secondary)"}}>• 1 day ago</span>
                                            </div>
                                            <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                                <span><i className="fas fa-comment"></i> 7 answers</span>
                                                <span><i className="fas fa-eye"></i> 289 views</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Question 4  */}
                        <div className="card">
                            <div className="card-body">
                                <div style={{"display":"flex","gap":"1rem"}}>
                                    <div style={{"display":"flex","flexDirection":"column","alignItems":"center","gap":"0.25rem","minWidth":"50px"}}>
                                        <button className="icon-btn" style={{"width":"32px","height":"32px"}}><i className="fas fa-chevron-up"></i></button>
                                        <span style={{"fontWeight":"600","fontSize":"1.25rem"}}>3</span>
                                        <button className="icon-btn" style={{"width":"32px","height":"32px"}}><i className="fas fa-chevron-down"></i></button>
                                    </div>
                                    
                                    <div style={{"flex":"1"}}>
                                        <div style={{"display":"flex","alignItems":"start","justifyContent":"space-between","gap":"1rem","marginBottom":"0.5rem"}}>
                                            <a href="#" style={{"fontSize":"1.125rem","fontWeight":"600","color":"var(--text-primary)","textDecoration":"none"}}>How to prepare for FAANG interviews as a CSE student?</a>
                                            <span className="badge badge-primary" style={{"flexShrink":"0"}}>Open</span>
                                        </div>
                                        <p style={{"fontSize":"0.875rem","color":"var(--text-secondary)","marginBottom":"1rem","lineHeight":"1.5"}}>I'm a 3rd year student looking to apply for internships. What resources and timeline would you recommend?</p>
                                        <div style={{"display":"flex","flexWrap":"wrap","gap":"0.25rem","marginBottom":"1rem"}}>
                                            <span className="project-tag">Career</span>
                                            <span className="project-tag">Interview</span>
                                            <span className="project-tag">DSA</span>
                                        </div>
                                        <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","flexWrap":"wrap","gap":"1rem"}}>
                                            <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                                                <div className="avatar avatar-sm" style={{"background":"#667eea"}}>FA</div>
                                                <span style={{"fontSize":"0.875rem"}}>Fahim Ahmed</span>
                                                <span style={{"fontSize":"0.75rem","color":"var(--text-secondary)"}}>• 2 days ago</span>
                                            </div>
                                            <div style={{"display":"flex","gap":"1rem","fontSize":"0.75rem","color":"var(--text-secondary)"}}>
                                                <span><i className="fas fa-comment"></i> 12 answers</span>
                                                <span><i className="fas fa-eye"></i> 567 views</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Sidebar  */}
                    <div style={{"display":"flex","flexDirection":"column","gap":"1rem"}}>
                        {/*  Popular Tags  */}
                        <div className="card">
                            <div className="card-header" style={{"padding":"1rem","borderBottom":"1px solid var(--border-color)"}}>
                                <h3 style={{"fontSize":"1rem"}}>Popular Tags</h3>
                            </div>
                            <div className="card-body">
                                <div style={{"display":"flex","flexWrap":"wrap","gap":"0.5rem"}}>
                                    <span className="project-tag" style={{"cursor":"pointer"}}>React <span style={{"opacity":"0.6"}}>×45</span></span>
                                    <span className="project-tag" style={{"cursor":"pointer"}}>Node.js <span style={{"opacity":"0.6"}}>×38</span></span>
                                    <span className="project-tag" style={{"cursor":"pointer"}}>Python <span style={{"opacity":"0.6"}}>×34</span></span>
                                    <span className="project-tag" style={{"cursor":"pointer"}}>Machine Learning <span style={{"opacity":"0.6"}}>×28</span></span>
                                    <span className="project-tag" style={{"cursor":"pointer"}}>DSA <span style={{"opacity":"0.6"}}>×25</span></span>
                                    <span className="project-tag" style={{"cursor":"pointer"}}>Career <span style={{"opacity":"0.6"}}>×22</span></span>
                                    <span className="project-tag" style={{"cursor":"pointer"}}>Database <span style={{"opacity":"0.6"}}>×18</span></span>
                                    <span className="project-tag" style={{"cursor":"pointer"}}>CSS <span style={{"opacity":"0.6"}}>×15</span></span>
                                </div>
                            </div>
                        </div>

                        {/*  Top Contributors  */}
                        <div className="card">
                            <div className="card-header" style={{"padding":"1rem","borderBottom":"1px solid var(--border-color)"}}>
                                <h3 style={{"fontSize":"1rem"}}>Top Contributors</h3>
                            </div>
                            <div className="card-body">
                                <div style={{"display":"grid","gap":"0.75rem"}}>
                                    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem"}}>
                                        <span style={{"fontWeight":"600","color":"var(--warning)","width":"20px"}}>1</span>
                                        <div className="avatar avatar-sm" style={{"background":"linear-gradient(135deg, var(--primary), var(--accent))"}}>AR</div>
                                        <div style={{"flex":"1"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>Anika Rahman</span>
                                            <p style={{"fontSize":"0.7rem","color":"var(--text-secondary)"}}>56 answers</p>
                                        </div>
                                    </div>
                                    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem"}}>
                                        <span style={{"fontWeight":"600","color":"#C0C0C0","width":"20px"}}>2</span>
                                        <div className="avatar avatar-sm" style={{"background":"var(--success)"}}>SK</div>
                                        <div style={{"flex":"1"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>Salman Kabir</span>
                                            <p style={{"fontSize":"0.7rem","color":"var(--text-secondary)"}}>48 answers</p>
                                        </div>
                                    </div>
                                    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem"}}>
                                        <span style={{"fontWeight":"600","color":"#CD7F32","width":"20px"}}>3</span>
                                        <div className="avatar avatar-sm" style={{"background":"var(--accent)"}}>MI</div>
                                        <div style={{"flex":"1"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>Majharul Islam</span>
                                            <p style={{"fontSize":"0.7rem","color":"var(--text-secondary)"}}>42 answers</p>
                                        </div>
                                    </div>
                                    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem"}}>
                                        <span style={{"fontWeight":"600","width":"20px"}}>4</span>
                                        <div className="avatar avatar-sm">TT</div>
                                        <div style={{"flex":"1"}}>
                                            <span style={{"fontSize":"0.875rem","fontWeight":"500"}}>Taslim Tamim</span>
                                            <p style={{"fontSize":"0.7rem","color":"var(--text-secondary)"}}>35 answers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Your Stats  */}
                        <div className="card">
                            <div className="card-header" style={{"padding":"1rem","borderBottom":"1px solid var(--border-color)"}}>
                                <h3 style={{"fontSize":"1rem"}}>Your Stats</h3>
                            </div>
                            <div className="card-body">
                                <div style={{"display":"grid","gap":"0.75rem"}}>
                                    <div style={{"display":"flex","justifyContent":"space-between"}}>
                                        <span style={{"fontSize":"0.875rem"}}>Questions Asked</span>
                                        <span style={{"fontWeight":"600"}}>8</span>
                                    </div>
                                    <div style={{"display":"flex","justifyContent":"space-between"}}>
                                        <span style={{"fontSize":"0.875rem"}}>Answers Given</span>
                                        <span style={{"fontWeight":"600"}}>35</span>
                                    </div>
                                    <div style={{"display":"flex","justifyContent":"space-between"}}>
                                        <span style={{"fontSize":"0.875rem"}}>Best Answers</span>
                                        <span style={{"fontWeight":"600","color":"var(--success)"}}>12</span>
                                    </div>
                                    <div style={{"display":"flex","justifyContent":"space-between"}}>
                                        <span style={{"fontSize":"0.875rem"}}>Reputation</span>
                                        <span style={{"fontWeight":"600","color":"var(--primary)"}}>456</span>
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
