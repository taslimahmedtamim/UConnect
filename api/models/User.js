const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'recruiter'],
        default: 'student'
    },
    university: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: 'Student developer passionate about technology and collaboration.'
    },
    avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    skills: [{
        name: String,
        level: Number,
        category: String
    }],
    xp: {
        type: Number,
        default: 1250
    },
    streak: {
        type: Number,
        default: 7
    },
    badges: [{
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
