const prisma = require('../config/database');

/**
 * GET /api/users
 * List all users (with pagination and role filtering)
 */
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          profile: {
            select: {
              headline: true,
              university: true,
              department: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
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
 * GET /api/users/:id
 * Get single user with full profile and skills
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
        skills: { include: { skill: true } },
        projects: {
          select: { id: true, title: true, status: true, createdAt: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        achievements: true,
        _count: {
          select: {
            projects: true,
            teamMembers: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Update user basic info
 */
const updateUser = async (req, res, next) => {
  try {
    // Only allow users to update themselves (or admin)
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own account.',
      });
    }

    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'User updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Delete user account
 */
const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own account.',
      });
    }

    await prisma.user.delete({ where: { id: req.params.id } });

    res.json({
      success: true,
      message: 'Account deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
