const prisma = require('../config/database');

/**
 * POST /api/resumes/generate
 * Generate a resume from the user's profile data
 */
const generateResume = async (req, res, next) => {
  try {
    const { templateName } = req.body;

    // Fetch user's full profile data for resume generation
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        skills: { include: { skill: true } },
        projects: {
          where: { status: { in: ['COMPLETED', 'IN_PROGRESS'] } },
          include: { skills: { include: { skill: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        achievements: { orderBy: { awardedAt: 'desc' } },
        teamMembers: {
          include: {
            team: true,
            project: { select: { title: true } },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Build resume data structure (for frontend rendering or AI processing)
    const resumeData = {
      personalInfo: {
        name: user.name,
        email: user.email,
        phone: user.profile?.phone,
        headline: user.profile?.headline,
        bio: user.profile?.bio,
        university: user.profile?.university,
        department: user.profile?.department,
        yearOfStudy: user.profile?.yearOfStudy,
      },
      skills: user.skills.map((us) => ({
        name: us.skill.name,
        category: us.skill.category,
        level: us.level,
      })),
      projects: user.projects.map((p) => ({
        title: p.title,
        description: p.description,
        status: p.status,
        skills: p.skills.map((ps) => ps.skill.name),
        createdAt: p.createdAt,
      })),
      achievements: user.achievements.map((a) => ({
        title: a.title,
        type: a.type,
        xpPoints: a.xpPoints,
        awardedAt: a.awardedAt,
      })),
      teamExperience: user.teamMembers.map((tm) => ({
        teamName: tm.team.name,
        role: tm.role,
        project: tm.project?.title,
        joinedAt: tm.joinedAt,
      })),
    };

    // Create resume record
    const resume = await prisma.resume.create({
      data: {
        userId: req.user.id,
        templateName: templateName || 'professional',
        // fileUrl will be populated when PDF/DOCX generation is added (Phase 4)
      },
    });

    res.status(201).json({
      success: true,
      message: 'Resume data generated successfully.',
      data: {
        resume,
        resumeData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id/resumes
 * List user's generated resumes
 */
const getUserResumes = async (req, res, next) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.params.id },
      orderBy: { generatedDate: 'desc' },
    });

    res.json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resumes/:id
 * Get a specific resume
 */
const getResumeById = async (req, res, next) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          include: {
            profile: true,
            skills: { include: { skill: true } },
            projects: {
              include: { skills: { include: { skill: true } } },
              orderBy: { createdAt: 'desc' },
            },
            achievements: true,
          },
        },
      },
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateResume, getUserResumes, getResumeById };
