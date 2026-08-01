const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Team = require('./models/Team');
const Opportunity = require('./models/Opportunity');

// Seed / In-memory data store for offline / instant dev mode
const memoryStore = {
    users: [
        {
            _id: 'user_demo_1',
            fullName: 'Alex Rivera',
            email: 'alex.rivera@university.edu',
            password: '$2a$10$vO/70GvjLwZ2E6p6B9qE1.X1c61hY.Yw7M2n8U.w/d1ZpG', // hashed 'password123'
            role: 'student',
            university: 'Stanford University',
            department: 'Computer Science',
            bio: 'Full-stack & AI enthusiast building project portfolios on UConnect.',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            skills: [
                { name: 'JavaScript', level: 90, category: 'Web' },
                { name: 'Python', level: 85, category: 'AI/ML' },
                { name: 'React', level: 80, category: 'Web' },
                { name: 'Node.js', level: 75, category: 'Backend' }
            ],
            xp: 1420,
            streak: 12,
            badges: [
                { name: 'First Project', icon: '🚀' },
                { name: 'Team Player', icon: '🤝' },
                { name: 'Top Contributor', icon: '⭐' }
            ]
        }
    ],
    projects: [
        {
            _id: 'proj_1',
            title: 'AI Resume Builder (U-Resume)',
            description: 'Automated ATS-friendly resume generator matching academic accomplishments with real job requirements.',
            category: 'AI & Machine Learning',
            tags: ['Python', 'NLP', 'React', 'FastAPI'],
            status: 'In Progress',
            progress: 75,
            repoUrl: 'https://github.com/uconnect/u-resume',
            demoUrl: 'https://uconnect-resume.demo',
            author: { id: 'user_demo_1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Lead Developer' },
            members: [{ id: 'user_demo_1', name: 'Alex Rivera', role: 'Full Stack Developer' }],
            likes: 42,
            views: 290
        },
        {
            _id: 'proj_2',
            title: 'Campus Event Hub',
            description: 'A platform connecting university students for hackathons, workshops, and study groups.',
            category: 'Web Development',
            tags: ['Node.js', 'Express', 'MongoDB', 'Tailwind'],
            status: 'Completed',
            progress: 100,
            repoUrl: 'https://github.com/uconnect/campus-hub',
            demoUrl: 'https://campus-hub.demo',
            author: { id: 'user_demo_1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Fullstack' },
            members: [{ id: 'user_demo_1', name: 'Alex Rivera', role: 'Creator' }],
            likes: 28,
            views: 185
        }
    ],
    teams: [
        {
            _id: 'team_1',
            name: 'Neural Network Knights',
            description: 'Working on deep learning applications for computer vision challenges.',
            domain: 'AI & Machine Learning',
            lookingFor: ['PyTorch Specialist', 'Frontend Developer'],
            membersCount: 3,
            maxMembers: 5,
            leader: { id: 'user_demo_1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
            members: [{ id: 'user_demo_1', name: 'Alex Rivera', role: 'Team Lead' }]
        },
        {
            _id: 'team_2',
            name: 'CyberShield Lab',
            description: 'CTF team competing in global university cybersecurity challenges.',
            domain: 'Cybersecurity',
            lookingFor: ['Reverse Engineer', 'Network Security'],
            membersCount: 2,
            maxMembers: 4,
            leader: { id: 'user_demo_2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
            members: [{ id: 'user_demo_2', name: 'Sarah Chen', role: 'Security Analyst' }]
        }
    ],
    opportunities: [
        {
            _id: 'opp_1',
            title: 'AI Research Intern',
            company: 'TechVision AI Labs',
            logo: '🤖',
            type: 'Internship',
            location: 'Remote / San Francisco',
            stipend: '$35 - $45 / hr',
            description: 'Collaborate with senior researchers on NLP models and computer vision applications.',
            skills: ['Python', 'PyTorch', 'TensorFlow'],
            deadline: '2025-09-30'
        },
        {
            _id: 'opp_2',
            title: 'Frontend Developer (Part-Time)',
            company: 'EduPulse Technologies',
            logo: '💻',
            type: 'Part-time',
            location: 'Remote',
            stipend: '$25 - $35 / hr',
            description: 'Build modern responsive dashboard components using HTML, CSS, and modern JS frameworks.',
            skills: ['JavaScript', 'HTML5', 'CSS3', 'React'],
            deadline: '2025-10-15'
        }
    ],
    messages: [
        {
            _id: 'msg_1',
            sender: { id: 'user_demo_2', name: 'Sarah Chen' },
            recipient: { id: 'user_demo_1', name: 'Alex Rivera' },
            content: 'Hey Alex! Impressive work on the U-Resume project. Are you looking for team members for the upcoming Hackathon?',
            timestamp: new Date().toISOString()
        }
    ]
};

function isDbConnected() {
    return mongoose.connection && mongoose.connection.readyState === 1;
}

module.exports = {
    isDbConnected,
    memoryStore,
    User,
    Project,
    Team,
    Opportunity
};
