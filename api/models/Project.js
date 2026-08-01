const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'Web Development'
    },
    tags: [String],
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Seeking Members', 'Planning'],
        default: 'In Progress'
    },
    progress: {
        type: Number,
        default: 0
    },
    repoUrl: String,
    demoUrl: String,
    author: {
        id: String,
        name: String,
        avatar: String,
        role: String
    },
    members: [{
        id: String,
        name: String,
        role: String,
        avatar: String
    }],
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
