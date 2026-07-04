import React from 'react';
import { Link } from 'react-router-dom';

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

    <script src="layout.js"></script>
    <script>
        // ========================================
        // Certificates Data
        // ========================================
        let certificates = [
            {
                id: 1,
                title: 'AWS Cloud Practitioner',
                issuer: 'Amazon Web Services',
                issueDate: '2025-12',
                expiryDate: '2028-12',
                category: 'professional',
                icon: 'fab fa-aws',
                verified: true,
                featured: true,
                credentialId: 'AWS-CCP-2025-001',
                credentialUrl: 'https://aws.amazon.com/verification/...',
                skills: ['Cloud Computing', 'AWS', 'Cloud Architecture']
            },
            {
                id: 2,
                title: 'Google Data Analytics',
                issuer: 'Google Career Certificates',
                issueDate: '2025-11',
                category: 'course',
                icon: 'fab fa-google',
                verified: true,
                featured: true,
                credentialId: 'GDA-2025-789',
                credentialUrl: 'https://coursera.org/verify/...',
                skills: ['Data Analysis', 'SQL', 'Tableau', 'R Programming']
            },
            {
                id: 3,
                title: 'Meta Frontend Developer',
                issuer: 'Meta (Coursera)',
                issueDate: '2025-10',
                category: 'professional',
                icon: 'fab fa-meta',
                verified: true,
                featured: true,
                credentialId: 'META-FE-456',
                skills: ['React', 'JavaScript', 'HTML/CSS', 'UI/UX']
            },
            {
                id: 4,
                title: 'ICPC Regional Finalist',
                issuer: 'ACM ICPC',
                issueDate: '2025-09',
                category: 'competition',
                icon: 'fas fa-trophy',
                verified: false,
                featured: false,
                skills: ['Competitive Programming', 'Algorithms', 'Problem Solving']
            },
            {
                id: 5,
                title: 'Python for Data Science',
                issuer: 'IBM (edX)',
                issueDate: '2025-08',
                category: 'course',
                icon: 'fab fa-python',
                verified: true,
                featured: false,
                credentialId: 'IBM-PDS-123',
                skills: ['Python', 'Data Science', 'Pandas', 'NumPy']
            },
            {
                id: 6,
                title: 'Hackathon Winner - CodeFest 2025',
                issuer: 'Green University',
                issueDate: '2025-07',
                category: 'competition',
                icon: 'fas fa-code',
                verified: true,
                featured: false,
                skills: ['Full Stack', 'Innovation', 'Team Collaboration']
            },
            {
                id: 7,
                title: 'Machine Learning Specialization',
                issuer: 'Stanford Online (Coursera)',
                issueDate: '2025-06',
                category: 'course',
                icon: 'fas fa-brain',
                verified: false,
                featured: false,
                skills: ['Machine Learning', 'Neural Networks', 'TensorFlow']
            },
            {
                id: 8,
                title: 'Web Development Workshop',
                issuer: 'Computer Science Club',
                issueDate: '2025-05',
                category: 'workshop',
                icon: 'fas fa-laptop-code',
                verified: true,
                featured: false,
                skills: ['HTML', 'CSS', 'JavaScript', 'React']
            }
        ];

        let currentFilter = 'all';

        // ========================================
        // Initialize
        // ========================================
        document.addEventListener('DOMContentLoaded', function() {
            renderCertificates();
            updateStats();
            initFilterTabs();
        });

        // ========================================
        // Render Functions
        // ========================================
        function renderCertificates() {
            const grid = document.getElementById('certificatesGrid');
            if (!grid) return;

            let filteredCerts = certificates;
            if (currentFilter !== 'all') {
                if (currentFilter === 'verified') {
                    filteredCerts = certificates.filter(c => c.verified);
                } else if (currentFilter === 'pending') {
                    filteredCerts = certificates.filter(c => !c.verified);
                } else {
                    filteredCerts = certificates.filter(c => c.category === currentFilter);
                }
            }

            let html = filteredCerts.map(cert => {
                const issueDate = new Date(cert.issueDate + '-01');
                const formattedDate = issueDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                
                let expiryHtml = '';
                if (cert.expiryDate) {
                    const expiryDate = new Date(cert.expiryDate + '-01');
                    expiryHtml = expiryDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                }

                const skillsHtml = (cert.skills || []).slice(0, 4).map(skill => 
                    `<span className="cert-skill-tag">${skill}</span>`
                ).join('');

                return `
                    <div className="certificate-card" data-id="${cert.id}">
                        <div className="cert-card-header">
                            <span className="certificate-badge ${cert.verified ? 'verified' : 'pending'}">
                                <i className="fas fa-${cert.verified ? 'check-circle' : 'clock'}"></i>
                                ${cert.verified ? 'Verified' : 'Pending'}
                            </span>
                            <div className="cert-icon-wrapper">
                                <i className="${cert.icon}"></i>
                            </div>
                            <h3 className="cert-title">${cert.title}</h3>
                            <p className="cert-issuer">${cert.issuer}</p>
                        </div>
                        <div className="cert-card-body">
                            <div className="cert-details">
                                <div className="cert-detail-item">
                                    <span className="cert-detail-label">Issue Date</span>
                                    <span className="cert-detail-value">${formattedDate}</span>
                                </div>
                                <div className="cert-detail-item">
                                    <span className="cert-detail-label">${cert.expiryDate ? 'Expires' : 'Status'}</span>
                                    <span className="cert-detail-value">${expiryHtml || (cert.verified ? 'Active' : 'Pending')}</span>
                                </div>
                            </div>
                            <div className="cert-skills">
                                ${skillsHtml}
                            </div>
                        </div>
                        <div className="cert-card-footer">
                            ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" className="cert-credential-link"><i className="fas fa-external-link-alt"></i> View Credential</a>` : '<span></span>'}
                            <div className="cert-actions">
                                <button className="cert-action-btn" title="View Details" onclick="viewCertificate(${cert.id})">
                                    <i className="fas fa-eye"></i>
                                </button>
                                <button className="cert-action-btn" title="Download">
                                    <i className="fas fa-download"></i>
                                </button>
                                <button className="cert-action-btn delete" title="Delete" onclick="deleteCertificate(${cert.id})">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Add Certificate Card
            html += `
                <div className="add-certificate-card" onclick="openAddCertificateModal()">
                    <div className="add-cert-icon">
                        <i className="fas fa-plus"></i>
                    </div>
                    <h4>Add New Certificate</h4>
                    <p>Upload and showcase your achievements</p>
                </div>
            `;

            grid.innerHTML = html;
        }

        function updateStats() {
            const total = certificates.length;
            const verified = certificates.filter(c => c.verified).length;
            const pending = certificates.filter(c => !c.verified).length;
            const featured = certificates.filter(c => c.featured).length;

            document.getElementById('totalCerts').textContent = total;
            document.getElementById('verifiedCerts').textContent = verified;
            document.getElementById('pendingCerts').textContent = pending;
            document.getElementById('featuredCerts').textContent = featured;
        }

        // ========================================
        // Filter Functions
        // ========================================
        function initFilterTabs() {
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    renderCertificates();
                });
            });
        }

        // ========================================
        // Modal Functions
        // ========================================
        function openAddCertificateModal() {
            document.getElementById('addCertificateModal').classList.add('active');
            document.getElementById('addCertificateForm').reset();
            document.getElementById('certificatePreview').classList.remove('active');
        }

        function closeAddCertificateModal() {
            document.getElementById('addCertificateModal').classList.remove('active');
        }

        function previewCertificate(input) {
            const preview = document.getElementById('certificatePreview');
            const uploadArea = input.previousElementSibling;
            
            if (input.files && input.files[0]) {
                const file = input.files[0];
                
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.classList.add('active');
                        uploadArea.innerHTML = `
                            <i className="fas fa-check-circle" style={{"color":"var(--success)"}}></i>
                            <p style={{"color":"var(--success)"}}>File selected: ${file.name}</p>
                            <p style={{"fontSize":"0.75rem"}}>Click to change</p>
                        `;
                    };
                    reader.readAsDataURL(file);
                } else if (file.type === 'application/pdf') {
                    preview.classList.remove('active');
                    uploadArea.innerHTML = `
                        <i className="fas fa-file-pdf" style={{"color":"#ef4444","fontSize":"2rem"}}></i>
                        <p style={{"color":"var(--success)"}}>PDF selected: ${file.name}</p>
                        <p style={{"fontSize":"0.75rem"}}>Click to change</p>
                    `;
                }
            }
        }

        function saveCertificate() {
            const title = document.getElementById('certTitle').value;
            const issuer = document.getElementById('certIssuer').value;
            const issueDate = document.getElementById('certIssueDate').value;
            const category = document.getElementById('certCategory').value;
            const skills = document.getElementById('certSkills').value;
            const featured = document.getElementById('certFeatured').checked;

            if (!title || !issuer || !issueDate) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            const newCert = {
                id: Date.now(),
                title: title,
                issuer: issuer,
                issueDate: issueDate,
                expiryDate: document.getElementById('certExpiryDate').value || null,
                category: category,
                icon: 'fas fa-award',
                verified: false,
                featured: featured,
                credentialId: document.getElementById('certCredentialId').value || null,
                credentialUrl: document.getElementById('certCredentialUrl').value || null,
                skills: skills ? skills.split(',').map(s => s.trim()) : []
            };

            certificates.unshift(newCert);
            renderCertificates();
            updateStats();
            closeAddCertificateModal();
            showNotification('Certificate added successfully!', 'success');
        }

        function viewCertificate(id) {
            const cert = certificates.find(c => c.id === id);
            if (!cert) return;

            const issueDate = new Date(cert.issueDate + '-01');
            const formattedDate = issueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            let expiryHtml = 'No Expiry';
            if (cert.expiryDate) {
                const expiryDate = new Date(cert.expiryDate + '-01');
                expiryHtml = expiryDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            }

            const skillsHtml = (cert.skills || []).map(skill => 
                `<span className="cert-skill-tag">${skill}</span>`
            ).join('');

            const content = document.getElementById('viewCertificateContent');
            content.innerHTML = `
                <div style={{"textAlign":"center","padding":"2rem","background":"linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))","borderRadius":"1rem","marginBottom":"1.5rem"}}>
                    <div style={{"width":"80px","height":"80px","background":"linear-gradient(135deg, var(--primary), var(--accent))","borderRadius":"1rem","display":"flex","alignItems":"center","justifyContent":"center","margin":"0 auto 1rem","color":"white","fontSize":"2rem"}}>
                        <i className="${cert.icon}"></i>
                    </div>
                    <h2 style={{"marginBottom":"0.5rem","fontSize":"1.25rem"}}>${cert.title}</h2>
                    <p style={{"color":"var(--text-secondary)","marginBottom":"1rem"}}>${cert.issuer}</p>
                    <span className="certificate-badge ${cert.verified ? 'verified' : 'pending'}" style={{"position":"static"}}>
                        <i className="fas fa-${cert.verified ? 'check-circle' : 'clock'}"></i>
                        ${cert.verified ? 'Verified' : 'Pending Verification'}
                    </span>
                </div>

                <div style={{"display":"grid","gridTemplateColumns":"repeat(2, 1fr)","gap":"1rem","marginBottom":"1.5rem"}}>
                    <div style={{"padding":"1rem","background":"var(--bg-secondary)","borderRadius":"0.75rem"}}>
                        <div style={{"fontSize":"0.7rem","color":"var(--text-secondary)","marginBottom":"0.25rem","textTransform":"uppercase"}}>Issue Date</div>
                        <div style={{"fontWeight":"600"}}>${formattedDate}</div>
                    </div>
                    <div style={{"padding":"1rem","background":"var(--bg-secondary)","borderRadius":"0.75rem"}}>
                        <div style={{"fontSize":"0.7rem","color":"var(--text-secondary)","marginBottom":"0.25rem","textTransform":"uppercase"}}>Expiry</div>
                        <div style={{"fontWeight":"600"}}>${expiryHtml}</div>
                    </div>
                    ${cert.credentialId ? `
                    <div style={{"padding":"1rem","background":"var(--bg-secondary)","borderRadius":"0.75rem"}}>
                        <div style={{"fontSize":"0.7rem","color":"var(--text-secondary)","marginBottom":"0.25rem","textTransform":"uppercase"}}>Credential ID</div>
                        <div style={{"fontWeight":"600","fontSize":"0.9rem"}}>${cert.credentialId}</div>
                    </div>
                    ` : ''}
                    <div style={{"padding":"1rem","background":"var(--bg-secondary)","borderRadius":"0.75rem"}}>
                        <div style={{"fontSize":"0.7rem","color":"var(--text-secondary)","marginBottom":"0.25rem","textTransform":"uppercase"}}>Category</div>
                        <div style={{"fontWeight":"600","textTransform":"capitalize"}}>${cert.category}</div>
                    </div>
                </div>

                ${cert.skills && cert.skills.length ? `
                <div style={{"marginBottom":"1rem"}}>
                    <div style={{"fontSize":"0.8rem","fontWeight":"600","marginBottom":"0.5rem"}}>Skills Gained</div>
                    <div style={{"display":"flex","flexWrap":"wrap","gap":"0.5rem"}}>
                        ${skillsHtml}
                    </div>
                </div>
                ` : ''}

                ${cert.credentialUrl ? `
                <a href="${cert.credentialUrl}" target="_blank" className="btn btn-outline-primary" style={{"width":"100%","justifyContent":"center"}}>
                    <i className="fas fa-external-link-alt"></i> Verify Credential
                </a>
                ` : ''}
            `;

            document.getElementById('viewCertificateModal').classList.add('active');
        }

        function closeViewCertificateModal() {
            document.getElementById('viewCertificateModal').classList.remove('active');
        }

        function deleteCertificate(id) {
            if (confirm('Are you sure you want to delete this certificate?')) {
                certificates = certificates.filter(c => c.id !== id);
                renderCertificates();
                updateStats();
                showNotification('Certificate deleted', 'info');
            }
        }

        function downloadCertificate() {
            showNotification('Download started...', 'info');
            closeViewCertificateModal();
        }

        function shareCertificate() {
            showNotification('Share link copied to clipboard!', 'success');
        }

        // ========================================
        // Notification Function
        // ========================================
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'success' ? 'var(--success)' : type === 'error' ? '#ef4444' : 'var(--primary)'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            notification.innerHTML = `
                <span>${message}</span>
                <button onclick="this.parentElement.remove()" style={{"background":"none","border":"none","color":"white","cursor":"pointer","fontSize":"1.25rem"}}>&times;</button>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100px)';
                notification.style.transition = 'all 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    </script>

    </div>
  );
}
