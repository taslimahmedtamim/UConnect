import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

// GET — Fetch user's notifications
export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Auto-generate daily reminder if needed
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const reminderSentToday = await prisma.notification.findFirst({
      where: { 
        userId: user.id,
        type: 'daily_reminder',
        createdAt: { gte: todayStart }
      }
    });

    if (!reminderSentToday) {
      // Find user's roadmap to get their commitment
      const roadmap = await prisma.userRoadmap.findUnique({
        where: { userId: user.id }
      });

      const learningTime = roadmap?.learningTime || '1 hour daily';
      
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'daily_reminder',
          title: 'Daily Learning Goal 🚀',
          message: `Reminder: You committed to learning for ${learningTime}. Have you completed it today?`,
          link: '/dashboard'
        }
      });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH — Mark notifications as read
export async function PATCH(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { notificationId, markAllRead } = await req.json();

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true }
      });
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Provide notificationId or markAllRead' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
