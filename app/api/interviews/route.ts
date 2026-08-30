import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const interviews = await prisma.mockInterview.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, interviews });

  } catch (error: any) {
    console.error("Fetch Interviews Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
