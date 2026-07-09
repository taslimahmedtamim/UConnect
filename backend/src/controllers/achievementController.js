const prisma = require('../config/database');

/**
 * GET /api/users/:id/achievements
 * Get user achievements
 */
const getUserAchievements = async (req, res, next) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { userId: req.params.id },
      orderBy: { awardedAt: 'desc' },
    });

    // Calculate total XP
    const totalXp = achievements.reduce((sum, a) => sum + a.xpPoints, 0);

    res.json({
      success: true,
      data: {
        achievements,
        totalXp,
        count: achievements.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/achievements
 * Award an achievement to a user
 */
const awardAchievement = async (req, res, next) => {
  try {
    const { userId, type, title, xpPoints } = req.body;

    const achievement = await prisma.achievement.create({
      data: {
        userId,
        type,
        title,
        xpPoints: xpPoints || 0,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Achievement awarded.',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leaderboard
 * Get XP leaderboard
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    // Aggregate XP per user
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        profile: { select: { headline: true, avatarUrl: true, university: true } },
        achievements: {
          select: { xpPoints: true },
        },
        _count: {
          select: { projects: true, achievements: true },
        },
      },
      take: parseInt(limit),
    });

    // Calculate and sort by total XP
    const ranked = leaderboard
      .map((user) => ({
        id: user.id,
        name: user.name,
        profile: user.profile,
        totalXp: user.achievements.reduce((sum, a) => sum + a.xpPoints, 0),
        projectCount: user._count.projects,
        achievementCount: user._count.achievements,
      }))
      .sort((a, b) => b.totalXp - a.totalXp)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    res.json({
      success: true,
      data: ranked,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserAchievements, awardAchievement, getLeaderboard };
