const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isDbConnected, memoryStore, Project } = require('../store');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'uconnect_secret_jwt_key_2025_safe_hash';

const getOptionalUser = (req) => {
    // If auth middleware already set req.user, use it
    if (req.user) return req.user;
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const token = authHeader.split(' ')[1];
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
};

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', async (req, res) => {
    try {
        if (isDbConnected()) {
            const projects = await Project.find().sort({ createdAt: -1 });
            return res.json({ success: true, count: projects.length, projects });
        } else {
            return res.json({ success: true, count: memoryStore.projects.length, projects: memoryStore.projects });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching projects', error: error.message });
    }
});

// @route   POST /api/projects
// @desc    Create a new project
router.post('/', auth, async (req, res) => {
    try {
        const user = getOptionalUser(req);
        const { title, description, category, tags, repoUrl, demoUrl } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Project title and description are required.' });
        }

        const projectData = {
            title,
            description,
            category: category || 'Web Development',
            tags: tags || ['JavaScript', 'HTML/CSS'],
            status: 'In Progress',
            progress: 10,
            repoUrl: repoUrl || '',
            demoUrl: demoUrl || '',
            author: {
                id: user ? user.id : 'user_demo_1',
                name: user ? (user.fullName || user.email.split('@')[0]) : 'Alex Rivera',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                role: 'Project Creator'
            },
            members: [
                {
                    id: user ? user.id : 'user_demo_1',
                    name: user ? (user.fullName || user.email.split('@')[0]) : 'Alex Rivera',
                    role: 'Lead',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
            ],
            likes: 0,
            views: 1
        };

        if (isDbConnected()) {
            const project = await Project.create(projectData);
            return res.status(201).json({ success: true, message: 'Project created successfully', project });
        } else {
            const newProject = { _id: 'proj_' + Date.now(), ...projectData, createdAt: new Date().toISOString() };
            memoryStore.projects.unshift(newProject);
            return res.status(201).json({ success: true, message: 'Project created successfully (Dev Mode)', project: newProject });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating project', error: error.message });
    }
});

// @route   POST /api/projects/:id/like
// @desc    Like a project
router.post('/:id/like', auth, async (req, res) => {
    try {
        const { id } = req.params;

        if (isDbConnected()) {
            const project = await Project.findById(id);
            if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
            project.likes += 1;
            await project.save();
            return res.json({ success: true, likes: project.likes });
        } else {
            const project = memoryStore.projects.find(p => p._id === id);
            if (project) {
                project.likes = (project.likes || 0) + 1;
                return res.json({ success: true, likes: project.likes });
            }
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error liking project', error: error.message });
    }
});

module.exports = router;
