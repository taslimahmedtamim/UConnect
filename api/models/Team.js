const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    domain: String,
    lookingFor: [String],
    membersCount: {
        type: Number,
        default: 1
    },
    maxMembers: {
        type: Number,
        default: 5
    },
    leader: {
        id: String,
        name: String,
        avatar: String
    },
    members: [{
        id: String,
        name: String,
        role: String,
        avatar: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Team || mongoose.model('Team', TeamSchema);
