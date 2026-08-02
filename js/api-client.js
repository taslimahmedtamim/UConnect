// UConnect Page API Client
// Lightweight local demo data store used by the pages/ folder.

(function() {
  const STORAGE_KEY = 'uconnect_pages_state';

  const DEFAULT_STATE = {
    teams: [
      {
        id: 'team-core',
        name: 'UConnect Core',
        description: 'Building the future of university collaboration.',
        focus: 'Web Dev',
        status: 'Active',
        skills: ['Web Dev', 'React', 'Node.js'],
        members: ['TT', 'SK', 'MI']
      },
      {
        id: 'team-ai',
        name: 'AI Research Lab',
        description: 'Machine learning and NLP projects with research-minded students.',
        focus: 'ML/AI',
        status: 'Active',
        skills: ['Machine Learning', 'Python', 'NLP'],
        members: ['TT', 'MI']
      }
    ],
    teammates: [
      {
        id: 'user-sks',
        name: 'Salman Kabir Sany',
        role: 'Backend Developer',
        score: 780,
        skills: ['Node.js', 'Python', 'PostgreSQL'],
        initials: 'SK',
        color: 'var(--success)'
      },
      {
        id: 'user-mi',
        name: 'Majharul Islam',
        role: 'AI/ML Engineer',
        score: 820,
        skills: ['Python', 'TensorFlow', 'NLP'],
        initials: 'MI',
        color: 'var(--accent)'
      },
      {
        id: 'user-rk',
        name: 'Rafiq Khan',
        role: 'Frontend Developer',
        score: 650,
        skills: ['React', 'Vue.js', 'CSS'],
        initials: 'RK',
        color: 'var(--warning)'
      },
      {
        id: 'user-na',
        name: 'Nadia Ahmed',
        role: 'UI/UX Designer',
        score: 720,
        skills: ['Figma', 'Adobe XD', 'Sketch'],
        initials: 'NA',
        color: 'var(--danger)'
      }
    ],
    invites: []
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return {
        teams: Array.isArray(parsed.teams) ? parsed.teams : clone(DEFAULT_STATE.teams),
        teammates: Array.isArray(parsed.teammates) ? parsed.teammates : clone(DEFAULT_STATE.teammates),
        invites: Array.isArray(parsed.invites) ? parsed.invites : []
      };
    } catch (error) {
      return clone(DEFAULT_STATE);
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getTeams() {
    return loadState().teams;
  }

  function getTeammates() {
    return loadState().teammates;
  }

  function getTeam(teamId) {
    return getTeams().find(team => team.id === teamId) || null;
  }

  function getTeammate(userId) {
    return getTeammates().find(member => member.id === userId) || null;
  }

  function suggestTeammates(query = '', skill = '') {
    const state = loadState();
    const loweredQuery = query.trim().toLowerCase();
    const loweredSkill = skill.trim().toLowerCase();
    const skillAliases = {
      react: ['react'],
      python: ['python'],
      ml: ['machine learning', 'ml'],
      design: ['ui/ux design', 'design', 'figma']
    };
    const allowedSkillTerms = skillAliases[loweredSkill] || (loweredSkill ? [loweredSkill] : []);

    return state.teammates
      .filter(member => {
        const searchable = [member.name, member.role, ...(member.skills || [])].join(' ').toLowerCase();
        if (loweredQuery && !searchable.includes(loweredQuery)) return false;
        if (allowedSkillTerms.length > 0 && !allowedSkillTerms.some(term => searchable.includes(term))) return false;
        return true;
      })
      .sort((left, right) => right.score - left.score);
  }

  function addTeam(team) {
    const state = loadState();
    const created = {
      id: `team-${Date.now()}`,
      name: team.name,
      description: team.description,
      focus: team.focus || 'General',
      status: 'Active',
      skills: team.skills || [],
      members: [team.leadInitials || 'TT']
    };

    state.teams.unshift(created);
    saveState(state);
    return created;
  }

  function inviteTeammate(userId) {
    const state = loadState();
    if (!state.invites.includes(userId)) {
      state.invites.push(userId);
      saveState(state);
      return { invited: true };
    }
    return { invited: false };
  }

  window.UConnectAPI = {
    loadState,
    saveState,
    getTeams,
    getTeammates,
    getTeam,
    getTeammate,
    suggestTeammates,
    addTeam,
    inviteTeammate
  };
})();
