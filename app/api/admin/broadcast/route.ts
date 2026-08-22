import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as any;
    
    // Verify requester is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, link } = body;

    if (!title || !message) {
      return NextResponse.json({ success: false, message: 'Title and message are required' }, { status: 400 });
    }

    // Fetch all users to create notifications
    // In a very large production environment, this should be done in chunks or via a queue (e.g. Redis/BullMQ)
    // For MVP, we can fetch all user IDs and use createMany
    const users = await prisma.user.findMany({ select: { id: true } });

    const notifications = users.map(user => ({
      userId: user.id,
      type: 'system_broadcast',
      title,
      message,
      link: link || null,
      read: false
    }));

    // createMany is supported by MySQL and creates all records in a single query
    await prisma.notification.createMany({
      data: notifications
    });

    return NextResponse.json({ 
      success: true, 
      message: `Broadcast successfully sent to ${users.length} users.` 
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    return NextResponse.json({ success: false, message: 'Failed to send broadcast' }, { status: 500 });
  }
}
