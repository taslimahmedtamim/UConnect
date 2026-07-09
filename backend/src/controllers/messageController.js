const prisma = require('../config/database');

/**
 * POST /api/messages
 * Send a message
 */
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;

    if (req.user.id === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a message to yourself.',
      });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.id,
        receiverId,
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Message sent.',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/messages/conversations
 * List all conversations for the current user
 */
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all unique conversation partners
    const sentTo = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const receivedFrom = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    // Merge unique partner IDs
    const partnerIds = [
      ...new Set([
        ...sentTo.map((m) => m.receiverId),
        ...receivedFrom.map((m) => m.senderId),
      ]),
    ];

    // Get last message and partner info for each conversation
    const conversations = await Promise.all(
      partnerIds.map(async (partnerId) => {
        const partner = await prisma.user.findUnique({
          where: { id: partnerId },
          select: {
            id: true,
            name: true,
            profile: { select: { headline: true, avatarUrl: true } },
          },
        });

        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: partnerId },
              { senderId: partnerId, receiverId: userId },
            ],
          },
          orderBy: { sentAt: 'desc' },
        });

        const unreadCount = await prisma.message.count({
          where: {
            senderId: partnerId,
            receiverId: userId,
            isRead: false,
          },
        });

        return { partner, lastMessage, unreadCount };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      const timeA = a.lastMessage?.sentAt || 0;
      const timeB = b.lastMessage?.sentAt || 0;
      return new Date(timeB) - new Date(timeA);
    });

    res.json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/messages/:userId
 * Get messages with a specific user
 */
const getMessagesWithUser = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const partnerId = req.params.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: partnerId },
          { senderId: partnerId, receiverId: req.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true } },
      },
      orderBy: { sentAt: 'desc' },
      skip,
      take: parseInt(limit),
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: req.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({
      success: true,
      data: messages.reverse(), // Return in chronological order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getConversations, getMessagesWithUser };
