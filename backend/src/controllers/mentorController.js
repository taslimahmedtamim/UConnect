const prisma = require('../config/database');

/**
 * POST /api/mentors
 * Create a mentor connection
 */
const createMentorConnection = async (req, res, next) => {
  try {
    const { mentorId, expertise } = req.body;

    if (req.user.id === mentorId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot mentor yourself.',
      });
    }

    const connection = await prisma.mentorConnection.create({
      data: {
        menteeId: req.user.id,
        mentorId,
        expertise,
      },
      include: {
        mentor: { select: { id: true, name: true, email: true } },
        mentee: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Mentor connection created.',
      data: connection,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mentors
 * List available mentors (teachers + experienced students)
 */
const getMentors = async (req, res, next) => {
  try {
    const { search, expertise } = req.query;

    const where = {
      role: { in: ['TEACHER', 'STUDENT'] },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const mentors = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: {
          select: { headline: true, bio: true, university: true, department: true, avatarUrl: true },
        },
        skills: { include: { skill: true } },
        _count: {
          select: {
            mentorshipsAsMentor: true,
            projects: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: mentors });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id/mentors
 * Get user's mentor connections (both as mentee and mentor)
 */
const getUserMentorConnections = async (req, res, next) => {
  try {
    const [asMentee, asMentor] = await Promise.all([
      prisma.mentorConnection.findMany({
        where: { menteeId: req.params.id },
        include: {
          mentor: {
            select: {
              id: true, name: true, email: true, role: true,
              profile: { select: { headline: true, avatarUrl: true } },
            },
          },
        },
      }),
      prisma.mentorConnection.findMany({
        where: { mentorId: req.params.id },
        include: {
          mentee: {
            select: {
              id: true, name: true, email: true, role: true,
              profile: { select: { headline: true, avatarUrl: true } },
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        myMentors: asMentee,
        myMentees: asMentor,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMentorConnection, getMentors, getUserMentorConnections };
