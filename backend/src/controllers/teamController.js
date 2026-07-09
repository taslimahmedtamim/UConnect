const prisma = require('../config/database');

/**
 * POST /api/teams
 * Create a new team
 */
const createTeam = async (req, res, next) => {
  try {
    const { name, projectId } = req.body;

    const team = await prisma.team.create({
      data: {
        name,
        members: {
          create: {
            userId: req.user.id,
            role: 'leader',
            ...(projectId && { projectId }),
          },
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully.',
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/teams
 * List teams with pagination
 */
const getTeams = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          members: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
          _count: { select: { members: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.team.count({ where }),
    ]);

    res.json({
      success: true,
      data: teams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/teams/:id
 * Get team details
 */
const getTeamById = async (req, res, next) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: req.params.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profile: { select: { headline: true, avatarUrl: true } },
              },
            },
            project: { select: { id: true, title: true } },
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found.' });
    }

    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/teams/:id/members
 * Add member to team
 */
const addMember = async (req, res, next) => {
  try {
    const { userId, role, projectId } = req.body;

    const member = await prisma.teamMember.create({
      data: {
        userId,
        teamId: req.params.id,
        role: role || 'member',
        ...(projectId && { projectId }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Member added to team.',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/teams/:id/members/:userId
 * Update member role
 */
const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const member = await prisma.teamMember.updateMany({
      where: {
        teamId: req.params.id,
        userId: req.params.userId,
      },
      data: { role },
    });

    if (member.count === 0) {
      return res.status(404).json({ success: false, message: 'Member not found in team.' });
    }

    res.json({
      success: true,
      message: 'Member role updated.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/teams/:id/members/:userId
 * Remove member from team
 */
const removeMember = async (req, res, next) => {
  try {
    const result = await prisma.teamMember.deleteMany({
      where: {
        teamId: req.params.id,
        userId: req.params.userId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, message: 'Member not found in team.' });
    }

    res.json({
      success: true,
      message: 'Member removed from team.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTeam, getTeams, getTeamById, addMember, updateMemberRole, removeMember };
