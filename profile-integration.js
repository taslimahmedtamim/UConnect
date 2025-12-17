/* ==========================================
   Profile Integration - API & Dynamic Data
   ========================================== */

// Available domains/interests
const domainOptions = {
    'competitive-programming': {
        name: 'Competitive Programming',
        icon: '🏆',
        color: '#f59e0b',
        sections: ['platforms', 'problemSolving', 'heatmaps', 'contests'],
        skills: [
            { name: 'Data Structures', level: 85, category: 'Core' },
            { name: 'Algorithms', level: 80, category: 'Core' },
            { name: 'Dynamic Programming', level: 75, category: 'Core' },
            { name: 'Graph Theory', level: 70, category: 'Core' },
            { name: 'C++', level: 90, category: 'Language' },
            { name: 'Problem Solving', level: 85, category: 'Skill' }
        ]
    },
    'ai-ml': {
        name: 'AI & Machine Learning',
        icon: '🤖',
        color: '#8b5cf6',
        sections: ['platforms', 'mlProjects', 'research', 'certifications'],
        skills: [
            { name: 'Python', level: 90, category: 'Language' },
            { name: 'TensorFlow', level: 80, category: 'Framework' },
            { name: 'PyTorch', level: 75, category: 'Framework' },
            { name: 'Deep Learning', level: 78, category: 'Core' },
            { name: 'NLP', level: 70, category: 'Specialization' },
            { name: 'Computer Vision', level: 72, category: 'Specialization' }
        ]
    },
    'web-development': {
        name: 'Web Development',
        icon: '🌐',
        color: '#3b82f6',
        sections: ['platforms', 'webProjects', 'techStack'],
        skills: [
            { name: 'JavaScript', level: 90, category: 'Language' },
            { name: 'React', level: 85, category: 'Frontend' },
            { name: 'Node.js', level: 80, category: 'Backend' },
            { name: 'TypeScript', level: 75, category: 'Language' },
            { name: 'CSS/Tailwind', level: 85, category: 'Styling' },
            { name: 'MongoDB', level: 70, category: 'Database' }
        ]
    },
    'cybersecurity': {
        name: 'Cybersecurity',
        icon: '🔐',
        color: '#ef4444',
        sections: ['platforms', 'ctfStats', 'certifications', 'writeups'],
        skills: [
            { name: 'Penetration Testing', level: 80, category: 'Core' },
            { name: 'Network Security', level: 75, category: 'Core' },
            { name: 'Cryptography', level: 70, category: 'Core' },
            { name: 'Python', level: 85, category: 'Language' },
            { name: 'Linux', level: 90, category: 'System' },
            { name: 'Reverse Engineering', level: 65, category: 'Advanced' }
        ]
    },
    'mobile-development': {
        name: 'Mobile Development',
        icon: '📱',
        color: '#10b981',
        sections: ['platforms', 'mobileApps', 'techStack'],
        skills: [
            { name: 'React Native', level: 85, category: 'Framework' },
            { name: 'Flutter', level: 75, category: 'Framework' },
            { name: 'Swift', level: 70, category: 'Language' },
            { name: 'Kotlin', level: 72, category: 'Language' },
            { name: 'Firebase', level: 80, category: 'Backend' },
            { name: 'UI/UX Design', level: 75, category: 'Design' }
        ]
    },
    'data-science': {
        name: 'Data Science',
        icon: '📊',
        color: '#06b6d4',
        sections: ['platforms', 'notebooks', 'datasets', 'visualizations'],
        skills: [
            { name: 'Python', level: 90, category: 'Language' },
            { name: 'Pandas', level: 88, category: 'Library' },
            { name: 'SQL', level: 85, category: 'Database' },
            { name: 'Data Visualization', level: 80, category: 'Skill' },
            { name: 'Statistics', level: 78, category: 'Core' },
            { name: 'Machine Learning', level: 75, category: 'Advanced' }
        ]
    },
    'devops': {
        name: 'DevOps & Cloud',
        icon: '☁️',
        color: '#f97316',
        sections: ['platforms', 'infrastructure', 'certifications'],
        skills: [
            { name: 'Docker', level: 88, category: 'Container' },
            { name: 'Kubernetes', level: 75, category: 'Orchestration' },
            { name: 'AWS', level: 80, category: 'Cloud' },
            { name: 'CI/CD', level: 85, category: 'Pipeline' },
            { name: 'Terraform', level: 70, category: 'IaC' },
            { name: 'Linux', level: 90, category: 'System' }
        ]
    },
    'software-engineering': {
        name: 'Software Engineering',
        icon: '💻',
        color: '#6366f1',
        sections: ['platforms', 'projects', 'contributions', 'techStack'],
        skills: [
            { name: 'System Design', level: 80, category: 'Core' },
            { name: 'Clean Code', level: 85, category: 'Practice' },
            { name: 'Git', level: 90, category: 'Tool' },
            { name: 'Testing', level: 78, category: 'Practice' },
            { name: 'API Design', level: 82, category: 'Skill' },
            { name: 'Agile/Scrum', level: 75, category: 'Process' }
        ]
    }
};

// Profile Data (simulating database)
let profileData = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Taslim Ahmed Tamim',
    bio: 'Passionate full-stack developer with a keen interest in AI/ML and building products that make a difference. Competitive programmer with a love for algorithmic problem-solving.',
    // User's selected domains (can have multiple)
    domains: ['competitive-programming', 'web-development'],
    primaryDomain: 'competitive-programming',
    handles: {
        github: 'taslimahmedtamim',
        codeforces: 'tourist',
        leetcode: 'tamim',
        vjudge: 'tamim_vjudge',
        atcoder: '',
        hackerrank: '',
        codechef: '',
        kaggle: '',
        hackerone: '',
        tryhackme: ''
    },
    // User-selected platforms to display
    visiblePlatforms: {
        github: true,
        codeforces: true,
        leetcode: true,
        vjudge: false,
        atcoder: false,
        hackerrank: false,
        codechef: false,
        kaggle: false,
        hackerone: false,
        tryhackme: false
    },
    // Custom skills (user can add their own)
    customSkills: []
};

// Platform configurations
const platforms = {
    github: {
        name: 'GitHub',
        color: '#333',
        heatmapColors: ['var(--gray-100)', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        profileUrl: 'https://github.com/',
        statsLabel: 'contributions in the last year'
    },
    codeforces: {
        name: 'Codeforces',
        color: '#1da09c',
        heatmapColors: ['var(--gray-100)', '#b3e5fc', '#4fc3f7', '#03a9f4', '#0277bd'],
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"/></svg>',
        profileUrl: 'https://codeforces.com/profile/',
        statsLabel: 'problems solved'
    },
    leetcode: {
        name: 'LeetCode',
        color: '#ffa116',
        heatmapColors: ['var(--gray-100)', '#ffecd2', '#ffcc80', '#ffa726', '#ef6c00'],
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>',
        profileUrl: 'https://leetcode.com/',
        statsLabel: 'problems solved'
    },
    vjudge: {
        name: 'VJudge',
        color: '#4e6ef2',
        heatmapColors: ['var(--gray-100)', '#c5cae9', '#7986cb', '#5c6bc0', '#3949ab'],
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
        profileUrl: 'https://vjudge.net/user/',
        statsLabel: 'problems solved'
    },
    atcoder: {
        name: 'AtCoder',
        color: '#222222',
        heatmapColors: ['var(--gray-100)', '#d4edda', '#a8d5ba', '#6abf69', '#2e7d32'],
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text></svg>',
        profileUrl: 'https://atcoder.jp/users/',
        statsLabel: 'problems solved'
    },
    hackerrank: {
        name: 'HackerRank',
        color: '#00ea64',
        heatmapColors: ['var(--gray-100)', '#b9f6ca', '#69f0ae', '#00e676', '#00c853'],
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908h.701c.141 0 .254-.115.254-.258 0-.094-.049-.176-.123-.221L9.223 4.896c-.142-.09-.314.024-.314.197v2.109h-.344c-.141 0-.258.115-.258.258v5.082c0 .141.115.258.258.258h.344v2.109c0 .17.172.287.314.196l1.572-1.531c.074-.047.123-.129.123-.222 0-.143-.113-.258-.254-.258h-.701v-3.93h4.074v3.93h-.344c-.143 0-.258.115-.258.258 0 .093.049.176.123.222l1.572 1.531c.141.09.314-.025.314-.196v-2.109h.701c.141 0 .258-.115.258-.258V7.057c0-.143-.115-.258-.258-.258h-4.074z"/></svg>',
        profileUrl: 'https://www.hackerrank.com/',
        statsLabel: 'badges earned'
    },
    codechef: {
        name: 'CodeChef',
        color: '#5B4638',
        heatmapColors: ['var(--gray-100)', '#d7ccc8', '#a1887f', '#795548', '#4e342e'],
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.257.004c-.092.008-.297.062-.458.12C9.021.758 7.513 2.202 6.945 3.837c-.09.253-.103.996-.103 5.688 0 5.512.003 5.584.163 5.584.09 0 .233-.073.32-.163.142-.147.153-.383.173-3.852l.02-3.696.29-.503c.537-.93 1.3-1.5 2.323-1.733.406-.093.584-.093 5.727-.093h5.303l-.238-.287c-.764-.926-1.943-1.737-3.074-2.116-.733-.247-1.186-.344-2.073-.447-.66-.077-4.285-.15-4.52-.122zm3.257 5.092c-1.324.173-2.378.778-3.103 1.779-.534.737-.808 1.583-.879 2.717-.074 1.175.148 2.123.703 2.99.64 1 1.714 1.723 2.877 1.936.36.065 1.181.065 1.54 0 .998-.184 1.832-.645 2.524-1.398.303-.327.696-.905.862-1.264l.086-.19h-2.873l-.206.216c-.352.367-.622.486-1.121.497-.64.014-1.095-.2-1.424-.672-.158-.227-.39-.756-.39-.895 0-.027 1.461-.04 3.248-.028l3.247.022-.022-.574c-.095-2.397-1.31-4.152-3.353-4.845-.6-.203-.979-.262-1.716-.29zm.72 1.643c.64.086 1.142.472 1.438 1.108l.12.257H13.38l.078-.195c.265-.668.898-1.14 1.575-1.175l.2-.004z"/></svg>',
        profileUrl: 'https://www.codechef.com/users/',
        statsLabel: 'problems solved'
    }
};

// Simulated/cached API data (in production, fetch from actual APIs)
let apiData = {
    github: { repos: 45, followers: 128, contributions: 1247, stars: 89 },
    codeforces: { rating: 1650, maxRating: 1723, rank: 'Expert', solved: 534, contests: 42 },
    leetcode: { solved: 387, easy: 145, medium: 189, hard: 53, ranking: 45231, streak: 23 },
    vjudge: { solved: 892, submissions: 2145, accepted: 1678 },
    atcoder: { rating: 1200, rank: '5 Kyu', solved: 156, contests: 28 },
    hackerrank: { badges: 12, stars: 5, solved: 234 },
    codechef: { rating: 1756, stars: 3, solved: 189, contests: 15 }
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
    updateQuickStats();
}

// Update quick stats bar
function updateQuickStats() {
    const userDomains = profileData.domains || ['competitive-programming'];
    const primaryDomain = profileData.primaryDomain || userDomains[0];
    
    // For CP domain, calculate from linked platforms
    if (primaryDomain === 'competitive-programming') {
        let totalProblems = 0;
        let totalContests = 0;
        
        if (profileData.visiblePlatforms?.codeforces && profileData.handles?.codeforces) {
            totalProblems += apiData.codeforces.solved;
            totalContests += apiData.codeforces.contests;
        }
        if (profileData.visiblePlatforms?.leetcode && profileData.handles?.leetcode) {
            totalProblems += apiData.leetcode.solved;
        }
        if (profileData.visiblePlatforms?.vjudge && profileData.handles?.vjudge) {
            totalProblems += apiData.vjudge.solved;
        }
        if (profileData.visiblePlatforms?.atcoder && profileData.handles?.atcoder) {
            totalProblems += apiData.atcoder.solved;
            totalContests += apiData.atcoder.contests;
        }
        if (profileData.visiblePlatforms?.hackerrank && profileData.handles?.hackerrank) {
            totalProblems += apiData.hackerrank.solved;
        }
        if (profileData.visiblePlatforms?.codechef && profileData.handles?.codechef) {
            totalProblems += apiData.codechef.solved;
            totalContests += apiData.codechef.contests;
        }
        
        // Update DOM elements for CP
        const totalProblemsEl = document.getElementById('totalProblems');
        const totalContestsEl = document.getElementById('totalContests');
        const currentStreakEl = document.getElementById('currentStreak');
        const globalRankEl = document.getElementById('globalRank');
        
        if (totalProblemsEl) totalProblemsEl.textContent = totalProblems.toLocaleString();
        if (totalContestsEl) totalContestsEl.textContent = totalContests;
        if (currentStreakEl) currentStreakEl.textContent = apiData.leetcode.streak;
        if (globalRankEl) globalRankEl.textContent = 'Top 5%';
    }
    
    // Update labels based on domain
    updateQuickStatsForDomain();
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
    const editAtcoder = document.getElementById('editAtcoder');
    const editHackerrank = document.getElementById('editHackerrank');
    const editCodechef = document.getElementById('editCodechef');
    
    if (editName) editName.value = profileData.name;
    if (editBio) editBio.value = profileData.bio;
    if (editGithub) editGithub.value = profileData.handles.github || '';
    if (editCodeforces) editCodeforces.value = profileData.handles.codeforces || '';
    if (editLeetcode) editLeetcode.value = profileData.handles.leetcode || '';
    if (editVjudge) editVjudge.value = profileData.handles.vjudge || '';
    if (editAtcoder) editAtcoder.value = profileData.handles.atcoder || '';
    if (editHackerrank) editHackerrank.value = profileData.handles.hackerrank || '';
    if (editCodechef) editCodechef.value = profileData.handles.codechef || '';
    
    // Populate visibility toggles and initialize platform UI
    const platformKeys = ['github', 'codeforces', 'leetcode', 'vjudge', 'atcoder', 'hackerrank', 'codechef'];
    
    platformKeys.forEach(key => {
        const toggle = document.getElementById(`show${key.charAt(0).toUpperCase() + key.slice(1)}`);
        const isLinked = profileData.visiblePlatforms?.[key] ?? false;
        
        if (toggle) {
            toggle.checked = isLinked;
            // Initialize the UI state
            setTimeout(() => togglePlatformInput(key, false), 0);
        }
    });
    
    // Load domain selections
    loadDomainSelections();
    
    // Update sections visibility based on domains
    updateDomainSections();
}

// Load domain selections in the edit modal
function loadDomainSelections() {
    const domainMap = {
        'competitive-programming': 'domainCP',
        'ai-ml': 'domainAI',
        'web-development': 'domainWeb',
        'cybersecurity': 'domainCyber',
        'mobile-development': 'domainMobile',
        'data-science': 'domainData',
        'devops': 'domainDevOps',
        'software-engineering': 'domainSE'
    };
    
    const userDomains = profileData.domains || ['competitive-programming'];
    
    Object.keys(domainMap).forEach(domain => {
        const checkbox = document.getElementById(domainMap[domain]);
        if (checkbox) {
            checkbox.checked = userDomains.includes(domain);
        }
    });
}

// Update visible sections based on selected domains
function updateDomainSections() {
    const userDomains = profileData.domains || ['competitive-programming'];
    
    // Get all domain sections
    const domainSections = document.querySelectorAll('.domain-section');
    
    domainSections.forEach(section => {
        const sectionDomains = section.dataset.domains?.split(',') || [];
        const shouldShow = sectionDomains.some(d => userDomains.includes(d.trim()));
        
        if (shouldShow) {
            section.classList.remove('hidden-section');
            section.style.display = '';
        } else {
            section.classList.add('hidden-section');
        }
    });
    
    // Update quick stats based on primary domain
    updateQuickStatsForDomain();
}

// Update quick stats labels and values based on domain
function updateQuickStatsForDomain() {
    const userDomains = profileData.domains || ['competitive-programming'];
    const primaryDomain = profileData.primaryDomain || userDomains[0];
    
    const quickStatsConfig = {
        'competitive-programming': {
            primary: { value: 'totalProblems', label: 'Problems Solved' },
            secondary: { value: 'totalContests', label: 'Contests' },
            tertiary: { value: 'currentStreak', label: 'Day Streak 🔥' },
            quaternary: { value: 'globalRank', label: 'Global Rank' }
        },
        'ai-ml': {
            primary: { value: '12', label: 'ML Models' },
            secondary: { value: '5', label: 'Research Papers' },
            tertiary: { value: '3', label: 'Kaggle Medals' },
            quaternary: { value: 'Top 15%', label: 'Kaggle Rank' }
        },
        'web-development': {
            primary: { value: '24', label: 'Projects Built' },
            secondary: { value: '1.2k', label: 'GitHub Stars' },
            tertiary: { value: '89', label: 'NPM Downloads' },
            quaternary: { value: '45', label: 'Contributions' }
        },
        'cybersecurity': {
            primary: { value: '42', label: 'CTFs Played' },
            secondary: { value: '156', label: 'Challenges' },
            tertiary: { value: '12', label: 'Writeups' },
            quaternary: { value: 'Top 10%', label: 'CTFtime Rank' }
        },
        'mobile-development': {
            primary: { value: '8', label: 'Apps Published' },
            secondary: { value: '15k', label: 'Downloads' },
            tertiary: { value: '4.5', label: 'Avg Rating ⭐' },
            quaternary: { value: '3', label: 'Platforms' }
        },
        'data-science': {
            primary: { value: '34', label: 'Notebooks' },
            secondary: { value: '89', label: 'Datasets' },
            tertiary: { value: '2.3k', label: 'Views' },
            quaternary: { value: 'Silver', label: 'Kaggle Tier' }
        },
        'devops': {
            primary: { value: '56', label: 'Deployments' },
            secondary: { value: '12', label: 'Pipelines' },
            tertiary: { value: '99.9%', label: 'Uptime' },
            quaternary: { value: '3', label: 'Certifications' }
        },
        'software-engineering': {
            primary: { value: '1.2k', label: 'Contributions' },
            secondary: { value: '45', label: 'Repositories' },
            tertiary: { value: '89', label: 'PRs Merged' },
            quaternary: { value: '23', label: 'Day Streak' }
        }
    };
    
    const config = quickStatsConfig[primaryDomain] || quickStatsConfig['competitive-programming'];
    
    // Update primary stat
    const primaryLabel = document.getElementById('primaryStatLabel');
    if (primaryLabel) primaryLabel.textContent = config.primary.label;
    
    // Update secondary stat
    const secondaryLabel = document.getElementById('secondaryStatLabel');
    if (secondaryLabel) secondaryLabel.textContent = config.secondary.label;
    
    // Update tertiary stat
    const tertiaryLabel = document.getElementById('tertiaryStatLabel');
    if (tertiaryLabel) tertiaryLabel.textContent = config.tertiary.label;
    
    // Update quaternary stat
    const quaternaryLabel = document.getElementById('quaternaryStatLabel');
    if (quaternaryLabel) quaternaryLabel.textContent = config.quaternary.label;
    
    // For non-CP domains, set static values
    if (primaryDomain !== 'competitive-programming') {
        const totalProblems = document.getElementById('totalProblems');
        const totalContests = document.getElementById('totalContests');
        const currentStreak = document.getElementById('currentStreak');
        const globalRank = document.getElementById('globalRank');
        
        if (totalProblems) totalProblems.textContent = config.primary.value;
        if (totalContests) totalContests.textContent = config.secondary.value;
        if (currentStreak) currentStreak.textContent = config.tertiary.value;
        if (globalRank) globalRank.textContent = config.quaternary.value;
    }
}

// Toggle platform input visibility and update status
function togglePlatformInput(platform, animate = true) {
    const capitalizedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
    const toggle = document.getElementById(`show${capitalizedPlatform}`);
    const input = document.getElementById(`edit${capitalizedPlatform}`);
    const item = document.getElementById(`platformItem_${platform}`);
    
    if (!toggle || !input) return;
    
    const isChecked = toggle.checked;
    
    if (isChecked) {
        input.style.display = 'block';
        if (item) item.classList.add('linked');
        if (animate) input.focus();
    } else {
        input.style.display = 'none';
        if (item) item.classList.remove('linked');
    }
    
    updatePlatformStatus(platform);
}

// Update platform status text
function updatePlatformStatus(platform) {
    const capitalizedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
    const toggle = document.getElementById(`show${capitalizedPlatform}`);
    const input = document.getElementById(`edit${capitalizedPlatform}`);
    const statusEl = document.getElementById(`${platform}Status`);
    
    if (!statusEl) return;
    
    const isLinked = toggle?.checked;
    const hasHandle = input?.value?.trim();
    
    if (isLinked && hasHandle) {
        statusEl.textContent = `Linked as @${hasHandle}`;
        statusEl.style.color = 'var(--success)';
    } else if (isLinked && !hasHandle) {
        statusEl.textContent = 'Enter username to complete linking';
        statusEl.style.color = 'var(--warning)';
    } else {
        statusEl.textContent = 'Not linked';
        statusEl.style.color = 'var(--gray-500)';
    }
}

function renderPlatforms() {
    const container = document.getElementById('platformsList');
    if (!container) return;
    
    let html = '';
    
    Object.keys(platforms).forEach(key => {
        const platform = platforms[key];
        const handle = profileData.handles[key];
        const isVisible = profileData.visiblePlatforms?.[key];
        
        if (handle && isVisible) {
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
    const ac = apiData.atcoder;
    const hr = apiData.hackerrank;
    const cc = apiData.codechef;
    
    let html = '';
    
    // Only show stats for linked platforms
    if (profileData.visiblePlatforms?.codeforces && profileData.handles?.codeforces) {
        html += `
            <div class="stat-card platform-card" style="--platform-color: #1da09c;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #1da09c20, #1da09c10); color: #1da09c;">
                    ${platforms.codeforces.icon}
                </div>
                <div class="stat-info">
                    <div class="stat-value">${cf.rating}</div>
                    <div class="stat-label">Codeforces</div>
                </div>
                <span class="badge" style="background: linear-gradient(135deg, #1da09c, #17a09c); color: white;">${cf.rank}</span>
            </div>
        `;
    }
    
    if (profileData.visiblePlatforms?.leetcode && profileData.handles?.leetcode) {
        html += `
            <div class="stat-card platform-card" style="--platform-color: #ffa116;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #ffa11620, #ffa11610); color: #ffa116;">
                    ${platforms.leetcode.icon}
                </div>
                <div class="stat-info">
                    <div class="stat-value">${lc.solved}</div>
                    <div class="stat-label">LeetCode</div>
                </div>
                <span class="badge" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white;">${lc.streak}🔥</span>
            </div>
        `;
    }
    
    if (profileData.visiblePlatforms?.github && profileData.handles?.github) {
        html += `
            <div class="stat-card platform-card" style="--platform-color: #333;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #33333320, #33333310); color: #333;">
                    ${platforms.github.icon}
                </div>
                <div class="stat-info">
                    <div class="stat-value">${gh.contributions}</div>
                    <div class="stat-label">GitHub</div>
                </div>
                <span class="badge" style="background: linear-gradient(135deg, #10b981, #059669); color: white;">${gh.repos} Repos</span>
            </div>
        `;
    }
    
    if (profileData.visiblePlatforms?.vjudge && profileData.handles?.vjudge) {
        html += `
            <div class="stat-card platform-card" style="--platform-color: #4e6ef2;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4e6ef220, #4e6ef210); color: #4e6ef2;">
                    ${platforms.vjudge.icon}
                </div>
                <div class="stat-info">
                    <div class="stat-value">${vj.solved}</div>
                    <div class="stat-label">VJudge</div>
                </div>
                <span class="badge" style="background: linear-gradient(135deg, #4e6ef2, #3b5bdb); color: white;">Active</span>
            </div>
        `;
    }
    
    if (profileData.visiblePlatforms?.atcoder && profileData.handles?.atcoder) {
        html += `
            <div class="stat-card platform-card" style="--platform-color: #222;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #22222220, #22222210); color: #222;">
                    ${platforms.atcoder.icon}
                </div>
                <div class="stat-info">
                    <div class="stat-value">${ac.rating}</div>
                    <div class="stat-label">AtCoder</div>
                </div>
                <span class="badge" style="background: linear-gradient(135deg, #333, #222); color: white;">${ac.rank}</span>
            </div>
        `;
    }
    
    if (profileData.visiblePlatforms?.hackerrank && profileData.handles?.hackerrank) {
        html += `
            <div class="stat-card platform-card" style="--platform-color: #00ea64;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #00ea6420, #00ea6410); color: #00c853;">
                    ${platforms.hackerrank.icon}
                </div>
                <div class="stat-info">
                    <div class="stat-value">${hr.badges}</div>
                    <div class="stat-label">HackerRank</div>
                </div>
                <span class="badge" style="background: linear-gradient(135deg, #00ea64, #00c853); color: #003d21;">${hr.stars}★</span>
            </div>
        `;
    }
    
    if (profileData.visiblePlatforms?.codechef && profileData.handles?.codechef) {
        html += `
            <div class="stat-card platform-card" style="--platform-color: #5B4638;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #5B463820, #5B463810); color: #5B4638;">
                    ${platforms.codechef.icon}
                </div>
                <div class="stat-info">
                    <div class="stat-value">${cc.rating}</div>
                    <div class="stat-label">CodeChef</div>
                </div>
                <span class="badge" style="background: linear-gradient(135deg, #5B4638, #4e3b2f); color: white;">${cc.stars}★</span>
            </div>
        `;
    }
    
    // Show empty state if no platforms linked
    if (!html) {
        html = `
            <div class="empty-state-card">
                <div class="empty-icon">🔗</div>
                <h4>No Platforms Linked</h4>
                <p>Connect your coding platforms to showcase your achievements</p>
                <button class="btn btn-primary btn-sm" onclick="openEditProfileModal()">Link Platforms</button>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function renderSkillsShowcase() {
    const container = document.getElementById('skillsShowcase');
    if (!container) return;
    
    // Get skills based on user's selected domains
    let skills = [];
    const userDomains = profileData.domains || ['competitive-programming'];
    
    // Collect skills from all selected domains
    userDomains.forEach(domainKey => {
        const domain = domainOptions[domainKey];
        if (domain && domain.skills) {
            domain.skills.forEach(skill => {
                // Avoid duplicates
                if (!skills.find(s => s.name === skill.name)) {
                    skills.push(skill);
                }
            });
        }
    });
    
    // Add custom skills from user
    if (profileData.customSkills && profileData.customSkills.length > 0) {
        profileData.customSkills.forEach(skill => {
            if (!skills.find(s => s.name === skill.name)) {
                skills.push(skill);
            }
        });
    }
    
    // Fallback if no domains selected
    if (skills.length === 0) {
        skills = [
            { name: 'Programming', level: 75, category: 'General' },
            { name: 'Problem Solving', level: 70, category: 'General' }
        ];
    }
    
    const categories = [...new Set(skills.map(s => s.category))];
    
    // Domain badges display
    let domainBadgesHtml = '<div class="domain-badges" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">';
    userDomains.forEach(domainKey => {
        const domain = domainOptions[domainKey];
        if (domain) {
            domainBadgesHtml += `
                <span class="domain-badge" style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; background: ${domain.color}15; color: ${domain.color}; border-radius: 999px; font-size: 0.75rem; font-weight: 600; border: 1px solid ${domain.color}30;">
                    <span>${domain.icon}</span>
                    <span>${domain.name}</span>
                </span>
            `;
        }
    });
    domainBadgesHtml += '</div>';
    
    let html = domainBadgesHtml + '<div class="skill-categories">';
    
    categories.forEach(cat => {
        html += `<div class="skill-category">
            <h4 style="font-size: 0.7rem; text-transform: uppercase; color: var(--gray-500); margin-bottom: 1rem; letter-spacing: 0.1em; font-weight: 600;">${cat}</h4>`;
        
        skills.filter(s => s.category === cat).forEach(skill => {
            const color = skill.level >= 80 ? '#10b981' : skill.level >= 60 ? '#3b82f6' : '#f59e0b';
            html += `
                <div class="skill-item" style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.375rem;">
                        <span style="font-size: 0.875rem; font-weight: 500;">${skill.name}</span>
                        <span style="font-size: 0.8rem; color: ${color}; font-weight: 600;">${skill.level}%</span>
                    </div>
                    <div class="skill-bar" style="height: 8px; background: var(--gray-100); border-radius: 4px; overflow: hidden;">
                        <div class="skill-progress" style="width: ${skill.level}%; height: 100%; background: linear-gradient(90deg, ${color}dd, ${color}); border-radius: 4px; transition: width 0.5s ease;"></div>
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
    
    // Check if LeetCode is linked
    const lcLinked = profileData.visiblePlatforms?.leetcode && profileData.handles?.leetcode;
    const cfLinked = profileData.visiblePlatforms?.codeforces && profileData.handles?.codeforces;
    const vjLinked = profileData.visiblePlatforms?.vjudge && profileData.handles?.vjudge;
    
    // If no platforms linked, show empty state
    if (!lcLinked && !cfLinked && !vjLinked) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📈</div>
                <p>Link LeetCode, Codeforces, or VJudge to see problem stats</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="problem-breakdown" style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">';
    
    // Show LeetCode ring chart if linked
    if (lcLinked) {
        const lc = apiData.leetcode;
        const total = lc.easy + lc.medium + lc.hard;
        
        html += `
            <div class="problem-ring" style="width: 150px; height: 150px; position: relative;">
                <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--gray-200)" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#00b8a3" stroke-width="3" stroke-dasharray="${(lc.easy/total*100)}, 100"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffc01e" stroke-width="3" stroke-dasharray="${(lc.medium/total*100)}, 100" stroke-dashoffset="-${(lc.easy/total*100)}"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ff375f" stroke-width="3" stroke-dasharray="${(lc.hard/total*100)}, 100" stroke-dashoffset="-${((lc.easy+lc.medium)/total*100)}"/>
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 700;">${total}</div>
                    <div style="font-size: 0.75rem; color: var(--gray-500);">LeetCode</div>
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
        `;
    }
    
    html += '</div>';
    
    // Show extra stats for linked platforms
    let extraStats = [];
    if (cfLinked) {
        extraStats.push({ value: apiData.codeforces.solved, label: 'Codeforces' });
    }
    if (vjLinked) {
        extraStats.push({ value: apiData.vjudge.solved, label: 'VJudge' });
    }
    if (cfLinked) {
        extraStats.push({ value: apiData.codeforces.contests, label: 'Contests' });
    }
    
    if (extraStats.length > 0) {
        html += `<div class="problem-extra-stats" style="display: grid; grid-template-columns: repeat(${extraStats.length}, 1fr); gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">`;
        extraStats.forEach(stat => {
            html += `
                <div style="text-align: center;">
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${stat.value}</div>
                    <div style="font-size: 0.75rem; color: var(--gray-500);">${stat.label}</div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function renderActivityHeatmap() {
    const container = document.getElementById('platformHeatmapsContainer');
    if (!container) return;
    
    let html = '';
    
    // Iterate through all platforms and render heatmaps for visible ones
    Object.keys(platforms).forEach(key => {
        const platform = platforms[key];
        const handle = profileData.handles[key];
        const isVisible = profileData.visiblePlatforms?.[key];
        
        if (handle && isVisible) {
            const data = apiData[key];
            let statsText = '';
            
            // Generate stats text based on platform
            switch(key) {
                case 'github':
                    statsText = `${data.contributions.toLocaleString()} ${platform.statsLabel}`;
                    break;
                case 'codeforces':
                    statsText = `${data.solved} problems solved • ${data.contests} contests`;
                    break;
                case 'leetcode':
                    statsText = `${data.solved} problems solved • ${data.streak} day streak 🔥`;
                    break;
                case 'vjudge':
                    statsText = `${data.solved} problems solved`;
                    break;
                case 'atcoder':
                    statsText = `${data.solved} problems solved • ${data.contests} contests`;
                    break;
                case 'hackerrank':
                    statsText = `${data.badges} badges earned • ${data.solved} problems`;
                    break;
                case 'codechef':
                    statsText = `${data.solved} problems solved • ${data.stars}★ rating`;
                    break;
                default:
                    statsText = `${data.solved || 0} ${platform.statsLabel}`;
            }
            
            html += `
                <div class="card platform-heatmap-card" style="margin-top: 1.5rem;" data-platform="${key}">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 1.125rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: ${platform.color};">${platform.icon}</span>
                            ${platform.name} Activity
                        </h3>
                        <a href="${platform.profileUrl}${handle}" target="_blank" style="font-size: 0.875rem; color: var(--primary); text-decoration: none; font-weight: 500;">View Profile →</a>
                    </div>
                    <div class="card-body">
                        <div class="heatmap-container" id="${key}Heatmap"></div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-100);">
                            <span style="font-size: 0.875rem; color: var(--gray-600); font-weight: 500;">${statsText}</span>
                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--gray-500);">
                                <span>Less</span>
                                <div style="display: flex; gap: 3px;">
                                    ${platform.heatmapColors.map(color => 
                                        `<div style="width: 14px; height: 14px; background: ${color}; border-radius: 3px;"></div>`
                                    ).join('')}
                                </div>
                                <span>More</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    if (!html) {
        html = `
            <div class="card" style="margin-top: 1.5rem;">
                <div class="card-body" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                    <h3 style="margin-bottom: 0.5rem;">No Platforms Selected</h3>
                    <p style="color: var(--gray-500); margin-bottom: 1rem;">Select platforms to display in your profile settings</p>
                    <button class="btn btn-primary" onclick="openEditProfileModal()">Configure Platforms</button>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Now render the actual heatmaps
    Object.keys(platforms).forEach(key => {
        const handle = profileData.handles[key];
        const isVisible = profileData.visiblePlatforms?.[key];
        
        if (handle && isVisible) {
            renderPlatformHeatmap(`${key}Heatmap`, platforms[key].heatmapColors, 52);
        }
    });
}

function renderPlatformHeatmap(containerId, colors, weeks) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const days = 7;
    const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    
    let html = '<div style="display: flex; gap: 3px;">';
    
    // Day labels column
    html += '<div style="display: flex; flex-direction: column; gap: 3px; margin-right: 4px;">';
    for (let d = 0; d < days; d++) {
        html += `<div style="width: 20px; height: 12px; font-size: 9px; color: var(--gray-500); display: flex; align-items: center;">${dayLabels[d]}</div>`;
    }
    html += '</div>';
    
    // Heatmap grid
    html += '<div class="heatmap" style="display: flex; gap: 3px; overflow-x: auto;">';
    
    for (let w = 0; w < weeks; w++) {
        html += '<div class="heatmap-week" style="display: flex; flex-direction: column; gap: 3px;">';
        for (let d = 0; d < days; d++) {
            // Generate weighted random data (more likely to have lower activity)
            const rand = Math.random();
            let level;
            if (rand < 0.4) level = 0;
            else if (rand < 0.65) level = 1;
            else if (rand < 0.8) level = 2;
            else if (rand < 0.92) level = 3;
            else level = 4;
            
            const date = new Date();
            date.setDate(date.getDate() - ((weeks - w - 1) * 7 + (6 - d)));
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const contributions = level === 0 ? 0 : Math.floor(Math.random() * (level * 3)) + 1;
            
            html += `<div class="heatmap-day" style="width: 12px; height: 12px; background: ${colors[level]}; border-radius: 2px; cursor: pointer;" title="${contributions} contributions on ${dateStr}"></div>`;
        }
        html += '</div>';
    }
    
    html += '</div></div>';
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
    
    // Save selected domains
    const domainCheckboxes = document.querySelectorAll('input[name="domains"]:checked');
    const selectedDomains = Array.from(domainCheckboxes).map(cb => cb.value);
    profileData.domains = selectedDomains.length > 0 ? selectedDomains : ['competitive-programming'];
    profileData.primaryDomain = profileData.domains[0];
    
    // Save handles
    profileData.handles.github = document.getElementById('editGithub').value;
    profileData.handles.codeforces = document.getElementById('editCodeforces').value;
    profileData.handles.leetcode = document.getElementById('editLeetcode').value;
    profileData.handles.vjudge = document.getElementById('editVjudge').value;
    profileData.handles.atcoder = document.getElementById('editAtcoder')?.value || '';
    profileData.handles.hackerrank = document.getElementById('editHackerrank')?.value || '';
    profileData.handles.codechef = document.getElementById('editCodechef')?.value || '';
    
    // Save visibility settings
    profileData.visiblePlatforms = {
        github: document.getElementById('showGithub')?.checked ?? true,
        codeforces: document.getElementById('showCodeforces')?.checked ?? true,
        leetcode: document.getElementById('showLeetcode')?.checked ?? true,
        vjudge: document.getElementById('showVjudge')?.checked ?? false,
        atcoder: document.getElementById('showAtcoder')?.checked ?? false,
        hackerrank: document.getElementById('showHackerrank')?.checked ?? false,
        codechef: document.getElementById('showCodechef')?.checked ?? false
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    loadProfile();
    renderPlatforms();
    renderCodingStats();
    renderSkillsShowcase();
    renderActivityHeatmap();
    renderContactLinks();
    updateQuickStats();
    updateDomainSections();
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
window.togglePlatformInput = togglePlatformInput;
window.updatePlatformStatus = updatePlatformStatus;
