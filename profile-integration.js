/* ==========================================
   Profile Integration - API & Dynamic Data
   ========================================== */

// Profile Data (simulating database)
let profileData = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Taslim Ahmed Tamim',
    bio: 'Passionate full-stack developer with a keen interest in AI/ML and building products that make a difference. Competitive programmer with a love for algorithmic problem-solving.',
    handles: {
        github: 'taslimahmedtamim',
        codeforces: 'tourist',
        leetcode: 'tamim',
        vjudge: 'tamim_vjudge'
    }
};

// Platform configurations
const platforms = {
    github: {
        name: 'GitHub',
        color: '#333',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        profileUrl: 'https://github.com/'
    },
    codeforces: {
        name: 'Codeforces',
        color: '#1da09c',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"/></svg>',
        profileUrl: 'https://codeforces.com/profile/'
    },
    leetcode: {
        name: 'LeetCode',
        color: '#ffa116',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>',
        profileUrl: 'https://leetcode.com/'
    },
    vjudge: {
        name: 'VJudge',
        color: '#4e6ef2',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
        profileUrl: 'https://vjudge.net/user/'
    }
};

// Simulated/cached API data (in production, fetch from actual APIs)
let apiData = {
    github: { repos: 45, followers: 128, contributions: 1247, stars: 89 },
    codeforces: { rating: 1650, maxRating: 1723, rank: 'Expert', solved: 534, contests: 42 },
    leetcode: { solved: 387, easy: 145, medium: 189, hard: 53, ranking: 45231, streak: 23 },
    vjudge: { solved: 892, submissions: 2145, accepted: 1678 }
};

// Initialize profile when DOM is ready
function initProfileIntegration() {
    loadProfile();
    renderPlatforms();
    renderCodingStats();
    renderSkillsShowcase();
    renderProblemStats();
    renderActivityHeatmap();
    renderProjects();
    renderAchievements();
    renderContactLinks();
}

// Check if we're on the profile page
if (document.getElementById('profileName')) {
    document.addEventListener('DOMContentLoaded', initProfileIntegration);
}

function loadProfile() {
    const nameEl = document.getElementById('profileName');
    const bioEl = document.getElementById('profileBio');
    const avatarEl = document.getElementById('profileAvatar');
    
    if (nameEl) nameEl.textContent = profileData.name;
    if (bioEl) bioEl.textContent = profileData.bio;
    if (avatarEl) avatarEl.textContent = profileData.name.split(' ').map(n => n[0]).join('');
    
    // Populate edit form
    const editName = document.getElementById('editName');
    const editBio = document.getElementById('editBio');
    const editGithub = document.getElementById('editGithub');
    const editCodeforces = document.getElementById('editCodeforces');
    const editLeetcode = document.getElementById('editLeetcode');
    const editVjudge = document.getElementById('editVjudge');
    
    if (editName) editName.value = profileData.name;
    if (editBio) editBio.value = profileData.bio;
    if (editGithub) editGithub.value = profileData.handles.github || '';
    if (editCodeforces) editCodeforces.value = profileData.handles.codeforces || '';
    if (editLeetcode) editLeetcode.value = profileData.handles.leetcode || '';
    if (editVjudge) editVjudge.value = profileData.handles.vjudge || '';
}

function renderPlatforms() {
    const container = document.getElementById('platformsList');
    if (!container) return;
    
    let html = '';
    
    Object.keys(platforms).forEach(key => {
        const platform = platforms[key];
        const handle = profileData.handles[key];
        
        if (handle) {
            html += `
                <div class="platform-item" style="display: flex; align-items: center; padding: 1rem; border-bottom: 1px solid var(--gray-100);">
                    <div style="width: 40px; height: 40px; background: ${platform.color}15; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: ${platform.color};">
                        ${platform.icon}
                    </div>
                    <div style="flex: 1; margin-left: 0.75rem;">
                        <div style="font-weight: 500; font-size: 0.875rem;">${platform.name}</div>
                        <a href="${platform.profileUrl}${handle}" target="_blank" style="font-size: 0.75rem; color: var(--primary);">@${handle}</a>
                    </div>
                    <span class="badge badge-success">Connected</span>
                </div>
            `;
        }
    });
    
    if (!html) {
        html = '<div style="padding: 1.5rem; text-align: center; color: var(--gray-500);">No platforms linked yet</div>';
    }
    
    container.innerHTML = html;
}

function renderCodingStats() {
    const container = document.getElementById('codingStatsGrid');
    if (!container) return;
    
    const cf = apiData.codeforces;
    const lc = apiData.leetcode;
    const gh = apiData.github;
    const vj = apiData.vjudge;
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon" style="background: #1da09c15; color: #1da09c;">
                ${platforms.codeforces.icon}
            </div>
            <div class="stat-info">
                <div class="stat-value">${cf.rating}</div>
                <div class="stat-label">CF Rating</div>
            </div>
            <span class="badge" style="background: #1da09c15; color: #1da09c;">${cf.rank}</span>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background: #ffa11615; color: #ffa116;">
                ${platforms.leetcode.icon}
            </div>
            <div class="stat-info">
                <div class="stat-value">${lc.solved}</div>
                <div class="stat-label">LC Solved</div>
            </div>
            <span class="badge badge-warning">${lc.streak} Day Streak</span>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background: #33333315; color: #333;">
                ${platforms.github.icon}
            </div>
            <div class="stat-info">
                <div class="stat-value">${gh.contributions}</div>
                <div class="stat-label">Contributions</div>
            </div>
            <span class="badge badge-success">${gh.repos} Repos</span>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background: #4e6ef215; color: #4e6ef2;">
                ${platforms.vjudge.icon}
            </div>
            <div class="stat-info">
                <div class="stat-value">${vj.solved}</div>
                <div class="stat-label">VJ Solved</div>
            </div>
            <span class="badge badge-primary">Active</span>
        </div>
    `;
}

function renderSkillsShowcase() {
    const container = document.getElementById('skillsShowcase');
    if (!container) return;
    
    const skills = [
        { name: 'Data Structures', level: 85, category: 'DSA' },
        { name: 'Algorithms', level: 80, category: 'DSA' },
        { name: 'Dynamic Programming', level: 75, category: 'DSA' },
        { name: 'Graph Theory', level: 70, category: 'DSA' },
        { name: 'JavaScript', level: 90, category: 'Language' },
        { name: 'Python', level: 85, category: 'Language' },
        { name: 'C++', level: 80, category: 'Language' },
        { name: 'React', level: 85, category: 'Framework' },
        { name: 'Node.js', level: 80, category: 'Framework' },
        { name: 'Machine Learning', level: 65, category: 'Domain' }
    ];
    
    const categories = [...new Set(skills.map(s => s.category))];
    
    let html = '<div class="skill-categories">';
    
    categories.forEach(cat => {
        html += `<div class="skill-category">
            <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--gray-500); margin-bottom: 0.75rem; letter-spacing: 0.05em;">${cat}</h4>`;
        
        skills.filter(s => s.category === cat).forEach(skill => {
            const color = skill.level >= 80 ? 'var(--success)' : skill.level >= 60 ? 'var(--primary)' : 'var(--warning)';
            html += `
                <div class="skill-item" style="margin-bottom: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                        <span style="font-size: 0.875rem;">${skill.name}</span>
                        <span style="font-size: 0.75rem; color: var(--gray-500);">${skill.level}%</span>
                    </div>
                    <div class="skill-bar" style="height: 6px; background: var(--gray-200); border-radius: 3px; overflow: hidden;">
                        <div class="skill-progress" style="width: ${skill.level}%; height: 100%; background: ${color}; border-radius: 3px; transition: width 0.5s ease;"></div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function renderProblemStats() {
    const container = document.getElementById('problemStats');
    if (!container) return;
    
    const lc = apiData.leetcode;
    const total = lc.easy + lc.medium + lc.hard;
    
    container.innerHTML = `
        <div class="problem-breakdown" style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
            <div class="problem-ring" style="width: 150px; height: 150px; position: relative;">
                <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--gray-200)" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#00b8a3" stroke-width="3" stroke-dasharray="${(lc.easy/total*100)}, 100"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffc01e" stroke-width="3" stroke-dasharray="${(lc.medium/total*100)}, 100" stroke-dashoffset="-${(lc.easy/total*100)}"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ff375f" stroke-width="3" stroke-dasharray="${(lc.hard/total*100)}, 100" stroke-dashoffset="-${((lc.easy+lc.medium)/total*100)}"/>
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 700;">${total}</div>
                    <div style="font-size: 0.75rem; color: var(--gray-500);">Solved</div>
                </div>
            </div>
            <div class="problem-details" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div class="problem-type" style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #00b8a3;"></span>
                    <span style="flex: 1;">Easy</span>
                    <span style="font-weight: 600;">${lc.easy}</span>
                </div>
                <div class="problem-type" style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #ffc01e;"></span>
                    <span style="flex: 1;">Medium</span>
                    <span style="font-weight: 600;">${lc.medium}</span>
                </div>
                <div class="problem-type" style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #ff375f;"></span>
                    <span style="flex: 1;">Hard</span>
                    <span style="font-weight: 600;">${lc.hard}</span>
                </div>
            </div>
        </div>
        <div class="problem-extra-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
            <div style="text-align: center;">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${apiData.codeforces.solved}</div>
                <div style="font-size: 0.75rem; color: var(--gray-500);">Codeforces</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${apiData.vjudge.solved}</div>
                <div style="font-size: 0.75rem; color: var(--gray-500);">VJudge</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${apiData.codeforces.contests}</div>
                <div style="font-size: 0.75rem; color: var(--gray-500);">Contests</div>
            </div>
        </div>
    `;
}

function renderActivityHeatmap() {
    const container = document.getElementById('activityHeatmap');
    if (!container) return;
    
    const weeks = 20;
    const days = 7;
    const colors = ['var(--gray-100)', '#c6e48b', '#7bc96f', '#449945', '#196127'];
    
    let html = '<div class="heatmap" style="display: flex; gap: 3px;">';
    
    for (let w = 0; w < weeks; w++) {
        html += '<div class="heatmap-week" style="display: flex; flex-direction: column; gap: 3px;">';
        for (let d = 0; d < days; d++) {
            const level = Math.floor(Math.random() * 5);
            html += `<div class="heatmap-day" style="width: 12px; height: 12px; background: ${colors[level]}; border-radius: 2px;" title="${level} contributions"></div>`;
        }
        html += '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function renderProjects() {
    const container = document.getElementById('projectsList');
    if (!container) return;
    
    const projects = [
        { name: 'UConnect Platform', desc: 'AI-driven university ecosystem', status: 'In Progress', tech: 'React, Node.js, PostgreSQL', color: 'linear-gradient(135deg, var(--primary), var(--accent))' },
        { name: 'AI Resume Builder', desc: 'Automated resume generation using ML', status: 'Completed', tech: 'Python, TensorFlow, FastAPI', color: 'linear-gradient(135deg, var(--success), #059669)' },
        { name: 'CP Problem Tracker', desc: 'Track competitive programming progress', status: 'In Progress', tech: 'React, Chart.js, Firebase', color: 'linear-gradient(135deg, var(--warning), #d97706)' }
    ];
    
    container.innerHTML = projects.map(p => `
        <div style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--gray-100);">
            <div style="width: 48px; height: 48px; background: ${p.color}; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; flex-shrink: 0;">
                ${p.name[0]}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 500;">${p.name}</div>
                <div style="font-size: 0.75rem; color: var(--gray-500); margin-bottom: 0.5rem;">${p.desc}</div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span class="badge ${p.status === 'Completed' ? 'badge-success' : 'badge-primary'}">${p.status}</span>
                    <span style="font-size: 0.75rem; color: var(--gray-400);">• ${p.tech}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    
    const achievements = [
        { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>', name: 'Problem Master', desc: '500+ problems solved' },
        { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', name: 'Expert Coder', desc: 'CF Expert rank' },
        { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>', name: 'Streak King', desc: '30+ day streak' },
        { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>', name: 'Open Source', desc: '100+ contributions' },
        { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>', name: 'Precision', desc: '90% accuracy' }
    ];
    
    container.innerHTML = achievements.map(a => `
        <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: 0.75rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${a.icon}</div>
            <div style="font-weight: 500; font-size: 0.875rem;">${a.name}</div>
            <div style="font-size: 0.75rem; color: var(--gray-500);">${a.desc}</div>
        </div>
    `).join('');
}

function renderContactLinks() {
    const container = document.getElementById('contactLinks');
    if (!container) return;
    
    let html = `
        <a href="mailto:taslimahmedtamim4u@gmail.com" style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-600);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
            taslimahmedtamim4u@gmail.com
        </a>
    `;
    
    if (profileData.handles.github) {
        html += `
        <a href="https://github.com/${profileData.handles.github}" target="_blank" style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-600);">
            ${platforms.github.icon}
            github.com/${profileData.handles.github}
        </a>`;
    }
    
    if (profileData.handles.codeforces) {
        html += `
        <a href="https://codeforces.com/profile/${profileData.handles.codeforces}" target="_blank" style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-600);">
            ${platforms.codeforces.icon}
            codeforces.com/${profileData.handles.codeforces}
        </a>`;
    }
    
    if (profileData.handles.leetcode) {
        html += `
        <a href="https://leetcode.com/${profileData.handles.leetcode}" target="_blank" style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-600);">
            ${platforms.leetcode.icon}
            leetcode.com/${profileData.handles.leetcode}
        </a>`;
    }
    
    container.innerHTML = html;
}

// Modal functions
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.add('active');
}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.remove('active');
}

function saveProfile() {
    profileData.name = document.getElementById('editName').value;
    profileData.bio = document.getElementById('editBio').value;
    profileData.handles.github = document.getElementById('editGithub').value;
    profileData.handles.codeforces = document.getElementById('editCodeforces').value;
    profileData.handles.leetcode = document.getElementById('editLeetcode').value;
    profileData.handles.vjudge = document.getElementById('editVjudge').value;
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    loadProfile();
    renderPlatforms();
    renderContactLinks();
    closeEditProfileModal();
    
    if (typeof showToast === 'function') {
        showToast('Profile updated successfully!', 'success');
    }
}

async function syncAllPlatforms() {
    if (typeof showToast === 'function') {
        showToast('Syncing platforms...', 'info');
    }
    
    // Simulate API calls
    try {
        // In production, these would be actual API calls
        await fetchGitHubData();
        await fetchCodeforcesData();
        await fetchLeetCodeData();
        await fetchVJudgeData();
        
        renderCodingStats();
        renderSkillsShowcase();
        renderProblemStats();
        renderActivityHeatmap();
        
        if (typeof showToast === 'function') {
            showToast('All platforms synced!', 'success');
        }
    } catch (error) {
        if (typeof showToast === 'function') {
            showToast('Error syncing some platforms', 'error');
        }
    }
}

// API fetch functions (simulated - replace with actual API calls in production)
async function fetchGitHubData() {
    return new Promise(resolve => {
        setTimeout(() => {
            // Would fetch from: https://api.github.com/users/{username}
            apiData.github = {
                repos: Math.floor(Math.random() * 10) + 40,
                followers: Math.floor(Math.random() * 50) + 100,
                contributions: Math.floor(Math.random() * 200) + 1100,
                stars: Math.floor(Math.random() * 30) + 70
            };
            resolve();
        }, 500);
    });
}

async function fetchCodeforcesData() {
    return new Promise(resolve => {
        setTimeout(() => {
            // Would fetch from: https://codeforces.com/api/user.info?handles={handle}
            apiData.codeforces = {
                rating: Math.floor(Math.random() * 100) + 1600,
                maxRating: Math.floor(Math.random() * 100) + 1700,
                rank: 'Expert',
                solved: Math.floor(Math.random() * 50) + 500,
                contests: Math.floor(Math.random() * 10) + 40
            };
            resolve();
        }, 500);
    });
}

async function fetchLeetCodeData() {
    return new Promise(resolve => {
        setTimeout(() => {
            // Would fetch from: https://leetcode.com/graphql or third-party API
            apiData.leetcode = {
                solved: Math.floor(Math.random() * 50) + 370,
                easy: Math.floor(Math.random() * 20) + 140,
                medium: Math.floor(Math.random() * 30) + 180,
                hard: Math.floor(Math.random() * 10) + 50,
                ranking: Math.floor(Math.random() * 10000) + 40000,
                streak: Math.floor(Math.random() * 10) + 20
            };
            resolve();
        }, 500);
    });
}

async function fetchVJudgeData() {
    return new Promise(resolve => {
        setTimeout(() => {
            // Would fetch from: https://vjudge.net/user/{username}
            apiData.vjudge = {
                solved: Math.floor(Math.random() * 100) + 850,
                submissions: Math.floor(Math.random() * 200) + 2000,
                accepted: Math.floor(Math.random() * 150) + 1600
            };
            resolve();
        }, 500);
    });
}

// Export for use in other files
window.profileData = profileData;
window.openEditProfileModal = openEditProfileModal;
window.closeEditProfileModal = closeEditProfileModal;
window.saveProfile = saveProfile;
window.syncAllPlatforms = syncAllPlatforms;
