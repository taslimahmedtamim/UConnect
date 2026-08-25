import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { activityLog: true }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const log = (dbUser.activityLog as Record<string, number>) || {};
    const today = new Date().toISOString().split('T')[0];
    
    log[today] = (log[today] || 0) + 1;

    await prisma.user.update({
      where: { id: user.id },
      data: { activityLog: log }
    });

    return NextResponse.json({ success: true, activityLog: log });
  } catch (error: any) {
    console.error('Activity Log Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
