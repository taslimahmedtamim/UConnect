import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('uconnect_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — auto logout on expired token, but NOT on auth pages
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthPage = ['/login', '/register'].some(p =>
        window.location.pathname.startsWith(p)
      );
      if (!isAuthPage) {
        localStorage.removeItem('uconnect_token');
        localStorage.removeItem('uconnect_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getProfile: (id) => api.get(`/users/${id}/profile`),
  updateProfile: (id, data) => api.put(`/users/${id}/profile`, data),
  addSkills: (id, skills) => api.post(`/users/${id}/skills`, { skills }),
  removeSkill: (id, skillId) => api.delete(`/users/${id}/skills/${skillId}`),
  getApplications: (id) => api.get(`/users/${id}/applications`),
  getAchievements: (id) => api.get(`/users/${id}/achievements`),
  getMentors: (id) => api.get(`/users/${id}/mentors`),
  getResumes: (id) => api.get(`/users/${id}/resumes`),
};

// ─── Projects ───────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addSkills: (id, skills) => api.post(`/projects/${id}/skills`, { skills }),
};

// ─── Teams ───────────────────────────────────────────────────────────────────
export const teamsAPI = {
  getAll: (params) => api.get('/teams', { params }),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  addMember: (id, data) => api.post(`/teams/${id}/members`, data),
  updateMember: (id, userId, data) => api.put(`/teams/${id}/members/${userId}`, data),
  removeMember: (id, userId) => api.delete(`/teams/${id}/members/${userId}`),
};

// ─── Opportunities ───────────────────────────────────────────────────────────
export const opportunitiesAPI = {
  getAll: (params) => api.get('/opportunities', { params }),
  getById: (id) => api.get(`/opportunities/${id}`),
  create: (data) => api.post('/opportunities', data),
  apply: (id) => api.post(`/opportunities/${id}/apply`),
  updateApplicationStatus: (id, status) => api.put(`/opportunities/applications/${id}/status`, { status }),
};

// ─── Achievements ────────────────────────────────────────────────────────────
export const achievementsAPI = {
  award: (data) => api.post('/achievements', data),
  getLeaderboard: (params) => api.get('/achievements/leaderboard', { params }),
};

// ─── Messages ────────────────────────────────────────────────────────────────
export const messagesAPI = {
  send: (data) => api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getWithUser: (userId, params) => api.get(`/messages/${userId}`, { params }),
};

// ─── Mentors ─────────────────────────────────────────────────────────────────
export const mentorsAPI = {
  getAll: (params) => api.get('/mentors', { params }),
  connect: (data) => api.post('/mentors', data),
};

// ─── Resumes ─────────────────────────────────────────────────────────────────
export const resumesAPI = {
  generate: (data) => api.post('/resumes/generate', data),
  getById: (id) => api.get(`/resumes/${id}`),
};
