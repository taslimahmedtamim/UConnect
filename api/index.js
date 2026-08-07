const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// We will call connectDB in a middleware to ensure serverless functions wait for it
// connectDB();

const app = express();

// Middleware
app.use(async (req, res, next) => {
    await connectDB();
    next();
});
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Health / Root endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'UConnect Backend API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Import API routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const teamRoutes = require('./routes/teams');
const opportunityRoutes = require('./routes/opportunities');
const messageRoutes = require('./routes/messages');

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/messages', messageRoutes);

// Export for Vercel Serverless Function
module.exports = app;
