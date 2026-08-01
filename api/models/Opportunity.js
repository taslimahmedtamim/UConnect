const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: '💼'
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Research', 'Contract'],
        default: 'Internship'
    },
    location: {
        type: String,
        default: 'Remote'
    },
    stipend: String,
    description: String,
    skills: [String],
    deadline: String,
    postedBy: {
        id: String,
        name: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Opportunity || mongoose.model('Opportunity', OpportunitySchema);
