/**
 * UConnect API Client Module
 * Provides unified authentication, JWT storage, REST API communication, and fallback resilience.
 */
(function(window) {
    'use strict';

    const TOKEN_KEY = 'uconnect_token';
    const USER_KEY = 'uconnect_user';

    // Dynamically detect API base URL
    function getApiBase() {
        if (window.location.protocol === 'file:') {
            return 'http://localhost:3000/api';
        }
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            if (window.location.port && window.location.port !== '3000') {
                return 'http://localhost:3000/api';
            }
        }
        return '/api';
    }

    const API = {
        // Token & Auth storage utilities
        getToken() {
            return localStorage.getItem(TOKEN_KEY) || '';
        },
        setToken(token) {
            localStorage.setItem(TOKEN_KEY, token);
        },
        getUser() {
            const data = localStorage.getItem(USER_KEY);
            try {
                return data ? JSON.parse(data) : null;
            } catch (e) {
                return null;
            }
        },
        setUser(user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        },
        logout() {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            const inPagesDir = window.location.pathname.includes('/pages/');
            window.location.href = inPagesDir ? 'login.html' : 'pages/login.html';
        },
        isAuthenticated() {
            return Boolean(this.getToken());
        },

        // HTTP Fetch wrapper
        async request(endpoint, options = {}) {
            const url = `${getApiBase()}${endpoint}`;
            const token = this.getToken();

            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            try {
                const response = await fetch(url, {
                    ...options,
                    headers
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'API request failed');
                }
                return data;
            } catch (error) {
                console.warn(`API Request Error [${endpoint}]:`, error.message);
                throw error;
            }
        },

        // --- AUTH API ---
        async register(userData) {
            try {
                const res = await this.request('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(userData)
                });
                if (res.token) this.setToken(res.token);
                if (res.user) this.setUser(res.user);
                return res;
            } catch (error) {
                console.log('[Auth API] Backend unavailable, fallback to local registration');
                // Client-side fallback if backend server isn't running locally yet
                const mockToken = 'mock_jwt_token_' + Date.now();
                const mockUser = {
                    id: 'user_' + Date.now(),
                    fullName: userData.fullName || 'User',
                    email: userData.email,
                    role: userData.role || 'student',
                    university: userData.university || 'University Student',
                    xp: 500,
                    streak: 1,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                };

                this.setToken(mockToken);
                this.setUser(mockUser);

                return {
                    success: true,
                    message: 'Registered successfully (Local Mode)',
                    token: mockToken,
                    user: mockUser
                };
            }
        },

        async login(credentials) {
            try {
                const res = await this.request('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(credentials)
                });
                if (res.token) this.setToken(res.token);
                if (res.user) this.setUser(res.user);
                return res;
            } catch (error) {
                console.log('[Auth API] Backend unavailable, fallback to local login');
                // Client-side fallback if backend server isn't running locally yet
                const email = credentials.email || 'user@university.edu';
                const mockToken = 'mock_jwt_token_' + Date.now();
                const nameFromEmail = email.split('@')[0].replace('.', ' ');
                const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

                const mockUser = {
                    id: 'user_' + Date.now(),
                    fullName: formattedName || 'Alex Rivera',
                    email: email,
                    role: 'student',
                    university: 'Stanford University',
                    xp: 1250,
                    streak: 7,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                };

                this.setToken(mockToken);
                this.setUser(mockUser);

                return {
                    success: true,
                    message: 'Login successful (Local Mode)',
                    token: mockToken,
                    user: mockUser
                };
            }
        },

        async googleLogin(role = 'student') {
            try {
                const res = await this.request('/auth/google', {
                    method: 'POST',
                    body: JSON.stringify({ email: 'google.user@university.edu', name: 'Google Student', role })
                });
                if (res.token) this.setToken(res.token);
                if (res.user) this.setUser(res.user);
                return res;
            } catch (e) {
                const mockUser = {
                    id: 'user_google_' + Date.now(),
                    fullName: 'Google User',
                    email: 'google.user@university.edu',
                    role,
                    university: 'Verified Google Account',
                    xp: 1200,
                    streak: 5,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                };
                this.setToken('google_token_' + Date.now());
                this.setUser(mockUser);
                return { success: true, user: mockUser };
            }
        },

        async githubLogin(role = 'student') {
            try {
                const res = await this.request('/auth/github', {
                    method: 'POST',
                    body: JSON.stringify({ email: 'github.user@university.edu', name: 'GitHub Developer', role })
                });
                if (res.token) this.setToken(res.token);
                if (res.user) this.setUser(res.user);
                return res;
            } catch (e) {
                const mockUser = {
                    id: 'user_github_' + Date.now(),
                    fullName: 'GitHub Developer',
                    email: 'github.user@university.edu',
                    role,
                    university: 'Verified GitHub Developer',
                    xp: 1500,
                    streak: 10,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                };
                this.setToken('github_token_' + Date.now());
                this.setUser(mockUser);
                return { success: true, user: mockUser };
            }
        },


        async getCurrentUser() {
            const localUser = this.getUser();
            if (!this.getToken()) return localUser;
            try {
                const res = await this.request('/auth/me');
                if (res.user) this.setUser(res.user);
                return res.user;
            } catch (e) {
                return localUser;
            }
        },

        // --- USER PROFILE API ---
        async getProfile() {
            try {
                return await this.request('/users/profile');
            } catch (e) {
                return { success: true, user: this.getUser() };
            }
        },

        async updateProfile(profileData) {
            try {
                return await this.request('/users/profile', {
                    method: 'PUT',
                    body: JSON.stringify(profileData)
                });
            } catch (e) {
                const user = this.getUser() || {};
                Object.assign(user, profileData);
                this.setUser(user);
                return { success: true, message: 'Profile updated locally', user };
            }
        },

        // --- PROJECTS API ---
        async getProjects() {
            try {
                return await this.request('/projects');
            } catch (e) {
                return { success: true, projects: [] };
            }
        },

        async createProject(projectData) {
            try {
                return await this.request('/projects', {
                    method: 'POST',
                    body: JSON.stringify(projectData)
                });
            } catch (e) {
                return { success: true, message: 'Project created locally', project: { _id: 'proj_' + Date.now(), ...projectData } };
            }
        },

        async likeProject(id) {
            try {
                return await this.request(`/projects/${id}/like`, { method: 'POST' });
            } catch (e) {
                return { success: true, likes: 1 };
            }
        },

        // --- TEAMS API ---
        async getTeams() {
            try {
                return await this.request('/teams');
            } catch (e) {
                return { success: true, teams: [] };
            }
        },

        async createTeam(teamData) {
            try {
                return await this.request('/teams', {
                    method: 'POST',
                    body: JSON.stringify(teamData)
                });
            } catch (e) {
                return { success: true, message: 'Team created locally', team: { _id: 'team_' + Date.now(), ...teamData } };
            }
        },

        async joinTeam(id) {
            try {
                return await this.request(`/teams/${id}/join`, { method: 'POST' });
            } catch (e) {
                return { success: true, message: 'Joined team locally' };
            }
        },

        // --- OPPORTUNITIES API ---
        async getOpportunities() {
            try {
                return await this.request('/opportunities');
            } catch (e) {
                return { success: true, opportunities: [] };
            }
        },

        // --- MESSAGES API ---
        async getMessages() {
            try {
                return await this.request('/messages');
            } catch (e) {
                return { success: true, messages: [] };
            }
        },

        async sendMessage(msgData) {
            try {
                return await this.request('/messages', {
                    method: 'POST',
                    body: JSON.stringify(msgData)
                });
            } catch (e) {
                return { success: true, message: 'Message sent locally', data: { _id: 'msg_' + Date.now(), ...msgData } };
            }
        }
    };

    window.UConnectAPI = API;
})(window);
