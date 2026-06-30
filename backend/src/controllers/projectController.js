const prisma = require('../config/database');

/**
 * POST /api/projects
 * Create a new project
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description, status, skills } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        status: status || 'PLANNING',
        ownerId: req.user.id,
        ...(skills && skills.length > 0 && {
          skills: {
            create: await Promise.all(
              skills.map(async (skillName) => {
                const skill = await prisma.skill.upsert({
                  where: { name: skillName },
                  update: {},
                  create: { name: skillName },
                });
                return { skillId: skill.id };
              })
            ),
          },
        }),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        skills: { include: { skill: true } },
        teamMembers: { include: { user: { select: { id: true, name: true } } } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects
 * List projects with filtering and pagination
 */
const getProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search, skill } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (skill) {
      where.skills = {
        some: { skill: { name: { contains: skill, mode: 'insensitive' } } },
      };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          owner: { select: { id: true, name: true, email: true } },
          skills: { include: { skill: true } },
          _count: { select: { teamMembers: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    res.json({
      success: true,
      data: projects,
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
 * GET /api/projects/:id
 * Get single project with full details
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
        skills: { include: { skill: true } },
        teamMembers: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            team: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/projects/:id
 * Update project
 */
const updateProject = async (req, res, next) => {
  try {
    const existing = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (existing.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can update this project.',
      });
    }

    const { title, description, status } = req.body;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
      },
      include: {
        owner: { select: { id: true, name: true } },
        skills: { include: { skill: true } },
      },
    });

    res.json({
      success: true,
      message: 'Project updated successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projects/:id
 * Delete project
 */
const deleteProject = async (req, res, next) => {
  try {
    const existing = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (existing.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can delete this project.',
      });
    }

    await prisma.project.delete({ where: { id: req.params.id } });

    res.json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/projects/:id/skills
 * Add skills to a project
 */
const addProjectSkills = async (req, res, next) => {
  try {
    const { skills } = req.body; // Array of skill names

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array of skill names.',
      });
    }

    const results = [];
    for (const skillName of skills) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName },
      });

      const projectSkill = await prisma.projectSkill.upsert({
        where: {
          projectId_skillId: {
            projectId: req.params.id,
            skillId: skill.id,
          },
        },
        update: {},
        create: {
          projectId: req.params.id,
          skillId: skill.id,
        },
        include: { skill: true },
      });

      results.push(projectSkill);
    }

    res.json({
      success: true,
      message: `${results.length} skill(s) added to project.`,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectSkills,
};
