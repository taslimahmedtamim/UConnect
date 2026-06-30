const prisma = require('../config/database');

/**
 * GET /api/users/:id/profile
 * Get user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            skills: { include: { skill: true } },
            _count: {
              select: { projects: true, achievements: true },
            },
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found.',
      });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id/profile
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile.',
      });
    }

    const { headline, bio, university, department, yearOfStudy, phone, avatarUrl } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId: req.params.id },
      update: {
        ...(headline !== undefined && { headline }),
        ...(bio !== undefined && { bio }),
        ...(university !== undefined && { university }),
        ...(department !== undefined && { department }),
        ...(yearOfStudy !== undefined && { yearOfStudy: parseInt(yearOfStudy) }),
        ...(phone !== undefined && { phone }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      create: {
        userId: req.params.id,
        headline,
        bio,
        university,
        department,
        yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : null,
        phone,
        avatarUrl,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/:id/skills
 * Add skills to user
 */
const addSkills = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only manage your own skills.',
      });
    }

    const { skills } = req.body; // [{ name, category, level }]

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array of { name, category?, level? }.',
      });
    }

    const results = [];

    for (const skillData of skills) {
      // Upsert the skill (create if doesn't exist)
      const skill = await prisma.skill.upsert({
        where: { name: skillData.name },
        update: {},
        create: {
          name: skillData.name,
          category: skillData.category || null,
        },
      });

      // Create or update the user-skill connection
      const userSkill = await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: req.params.id,
            skillId: skill.id,
          },
        },
        update: {
          level: skillData.level || 50,
        },
        create: {
          userId: req.params.id,
          skillId: skill.id,
          level: skillData.level || 50,
        },
        include: { skill: true },
      });

      results.push(userSkill);
    }

    res.json({
      success: true,
      message: `${results.length} skill(s) added/updated.`,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id/skills/:skillId
 * Remove a skill from user
 */
const removeSkill = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only manage your own skills.',
      });
    }

    await prisma.userSkill.deleteMany({
      where: {
        userId: req.params.id,
        skillId: req.params.skillId,
      },
    });

    res.json({
      success: true,
      message: 'Skill removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, addSkills, removeSkill };
