require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const teamRoutes = require('./routes/teams');
const opportunityRoutes = require('./routes/opportunities');
const achievementRoutes = require('./routes/achievements');
const messageRoutes = require('./routes/messages');
const mentorRoutes = require('./routes/mentors');
const resumeRoutes = require('./routes/resumes');

const app = express();
const PORT = process.env.PORT || 4000;

// ==========================================
// Middleware
// ==========================================

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// API Routes
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'UConnect API is running.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/resumes', resumeRoutes);

// ==========================================
// Error Handling
// ==========================================

app.use(notFound);
app.use(errorHandler);

// ==========================================
// Start Server
// ==========================================

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║     UConnect API Server Started      ║
  ╠══════════════════════════════════════╣
  ║  Port:        ${PORT}                    ║
  ║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(20)}║
  ║  API:         http://localhost:${PORT}/api ║
  ╚══════════════════════════════════════╝
  `);
});

module.exports = app;
