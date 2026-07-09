const prisma = require('../config/database');

/**
 * POST /api/opportunities
 * Create an opportunity (recruiter only)
 */
const createOpportunity = async (req, res, next) => {
  try {
    const { type, title, description, company, location, isRemote, deadline } = req.body;

    const opportunity = await prisma.opportunity.create({
      data: {
        type,
        title,
        description,
        company,
        location,
        isRemote: isRemote || false,
        deadline: deadline ? new Date(deadline) : null,
        postedById: req.user.id,
      },
      include: {
        postedBy: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully.',
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/opportunities
 * List opportunities with filters
 */
const getOpportunities = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, search, isRemote } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (type) where.type = type;
    if (isRemote !== undefined) where.isRemote = isRemote === 'true';
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          postedBy: { select: { id: true, name: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.opportunity.count({ where }),
    ]);

    res.json({
      success: true,
      data: opportunities,
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
 * GET /api/opportunities/:id
 * Get opportunity details
 */
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: req.params.id },
      include: {
        postedBy: { select: { id: true, name: true, email: true } },
        applications: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    res.json({ success: true, data: opportunity });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/opportunities/:id/apply
 * Apply to an opportunity
 */
const applyToOpportunity = async (req, res, next) => {
  try {
    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        opportunityId: req.params.id,
        status: 'PENDING',
      },
      include: {
        opportunity: { select: { id: true, title: true, type: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id/applications
 * Get user's applications
 */
const getUserApplications = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.params.id },
      include: {
        opportunity: {
          select: { id: true, title: true, type: true, company: true, location: true },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/applications/:id/status
 * Update application status
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        user: { select: { id: true, name: true } },
        opportunity: { select: { id: true, title: true } },
      },
    });

    res.json({
      success: true,
      message: `Application status updated to ${status}.`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  applyToOpportunity,
  getUserApplications,
  updateApplicationStatus,
};
