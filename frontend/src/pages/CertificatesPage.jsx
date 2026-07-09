import { Link } from 'react-router-dom';
import logoIcon from '../assets/UConnect.png';

export default function CertificatesPage() {
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
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <img src={logoIcon} alt="UConnect Logo" />
                    </div>
                    <div className="logo-text">
                        <span className="logo-title">UConnect</span>
                        <span className="logo-subtitle">University Ecosystem</span>
                    </div>
                </Link>
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
                    <a href="certificates.html" className="nav-item active">
                        <i className="fas fa-certificate"></i>
                        <span>Certificates</span>
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
                        <h1>My Certificates</h1>
                        <p>Manage and showcase your achievements</p>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn btn-primary" onclick="openAddCertificateModal()">
                        <i className="fas fa-plus"></i>
                        Add Certificate
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
                            <a href="certificates.html" className="dropdown-item">
                                <i className="fas fa-certificate"></i>
                                Certificates
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
                {/*  Stats Cards  */}
                <div className="certificates-stats">
                    <div className="cert-stat-card">
                        <div className="cert-stat-icon" style={{"background":"rgba(59, 130, 246, 0.1)","color":"var(--primary)"}}>
                            <i className="fas fa-certificate"></i>
                        </div>
                        <div className="cert-stat-value" id="totalCerts">8</div>
                        <div className="cert-stat-label">Total Certificates</div>
                    </div>
                    <div className="cert-stat-card">
                        <div className="cert-stat-icon" style={{"background":"rgba(16, 185, 129, 0.1)","color":"var(--success)"}}>
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="cert-stat-value" id="verifiedCerts">6</div>
                        <div className="cert-stat-label">Verified</div>
                    </div>
                    <div className="cert-stat-card">
                        <div className="cert-stat-icon" style={{"background":"rgba(245, 158, 11, 0.1)","color":"#f59e0b"}}>
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="cert-stat-value" id="pendingCerts">2</div>
                        <div className="cert-stat-label">Pending Verification</div>
                    </div>
                    <div className="cert-stat-card">
                        <div className="cert-stat-icon" style={{"background":"rgba(139, 92, 246, 0.1)","color":"var(--accent)"}}>
                            <i className="fas fa-star"></i>
                        </div>
                        <div className="cert-stat-value" id="featuredCerts">3</div>
                        <div className="cert-stat-label">Featured on Profile</div>
                    </div>
                </div>

                {/*  Filter Tabs  */}
                <div className="filter-tabs">
                    <button className="filter-tab active" data-filter="all">All Certificates</button>
                    <button className="filter-tab" data-filter="verified">Verified</button>
                    <button className="filter-tab" data-filter="pending">Pending</button>
                    <button className="filter-tab" data-filter="course">Courses</button>
                    <button className="filter-tab" data-filter="competition">Competitions</button>
                    <button className="filter-tab" data-filter="workshop">Workshops</button>
                </div>

                {/*  Certificates Grid  */}
                <div className="certificates-grid" id="certificatesGrid">
                    {/*  Certificates will be rendered here  */}
                </div>
            </main>
        </div>
    </div>

    {/*  Add Certificate Modal  */}
    <div className="modal-overlay" id="addCertificateModal">
        <div className="modal">
            <div className="modal-header">
                <h3><i className="fas fa-certificate" style={{"color":"var(--primary)"}}></i> Add Certificate</h3>
                <button className="icon-btn" onclick="closeAddCertificateModal()">
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="modal-body">
                <form id="addCertificateForm">
                    {/*  Certificate Upload  */}
                    <div className="certificate-upload-area" onclick="document.getElementById('certificateFile').click()">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <p>Click to upload certificate image or PDF</p>
                        <p style={{"fontSize":"0.75rem","color":"var(--text-tertiary)"}}>Supports: JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                    <input type="file" id="certificateFile" accept="image/*,.pdf" style={{"display":"none"}} onchange="previewCertificate(this)" />
                    <img id="certificatePreview" className="certificate-preview" alt="Certificate Preview" />

                    {/*  Certificate Details  */}
                    <div className="form-group">
                        <label className="form-label">Certificate Title *</label>
                        <input type="text" className="form-input" id="certTitle" placeholder="e.g., AWS Cloud Practitioner" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Issuing Organization *</label>
                        <input type="text" className="form-input" id="certIssuer" placeholder="e.g., Amazon Web Services" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-input" id="certCategory">
                            <option value="course">Course Completion</option>
                            <option value="competition">Competition</option>
                            <option value="workshop">Workshop</option>
                            <option value="professional">Professional Certification</option>
                            <option value="academic">Academic Achievement</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div style={{"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"1rem"}}>
                        <div className="form-group">
                            <label className="form-label">Issue Date *</label>
                            <input type="month" className="form-input" id="certIssueDate" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Expiry Date</label>
                            <input type="month" className="form-input" id="certExpiryDate" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Credential ID</label>
                        <input type="text" className="form-input" id="certCredentialId" placeholder="e.g., ABC123XYZ" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Credential URL</label>
                        <input type="url" className="form-input" id="certCredentialUrl" placeholder="https://verify.example.com/..." />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Skills Gained</label>
                        <input type="text" className="form-input" id="certSkills" placeholder="e.g., Cloud Computing, AWS, DevOps" />
                        <small style={{"fontSize":"0.7rem","color":"var(--text-secondary)"}}>Separate skills with commas</small>
                    </div>

                    <div className="form-group">
                        <label style={{"display":"flex","alignItems":"center","gap":"0.5rem","cursor":"pointer"}}>
                            <input type="checkbox" id="certFeatured" />
                            <span className="form-label" style={{"margin":"0"}}>Feature on profile</span>
                        </label>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button className="btn btn-ghost" onclick="closeAddCertificateModal()">Cancel</button>
                <button className="btn btn-primary" onclick="saveCertificate()">
                    <i className="fas fa-plus"></i> Add Certificate
                </button>
            </div>
        </div>
    </div>

    {/*  View Certificate Modal  */}
    <div className="modal-overlay" id="viewCertificateModal">
        <div className="modal" style={{"maxWidth":"650px"}}>
            <div className="modal-header">
                <h3><i className="fas fa-certificate" style={{"color":"var(--primary)"}}></i> Certificate Details</h3>
                <button className="icon-btn" onclick="closeViewCertificateModal()">
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="modal-body" id="viewCertificateContent">
                {/*  Dynamic content  */}
            </div>
            <div className="modal-footer">
                <button className="btn btn-ghost" onclick="closeViewCertificateModal()">Close</button>
                <button className="btn btn-outline-primary" onclick="shareCertificate()">
                    <i className="fas fa-share-alt"></i> Share
                </button>
                <button className="btn btn-primary" onclick="downloadCertificate()">
                    <i className="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    </div>


    </div>
  );
}
