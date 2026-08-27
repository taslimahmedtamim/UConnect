import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, fullName: true, email: true, role: true } },
        members: { select: { id: true, fullName: true, email: true, bio: true, skills: true, role: true } },
        joinRequests: {
          include: {
            user: { select: { id: true, fullName: true, email: true, bio: true, skills: true, role: true } }
          }
        },
        projects: true
      }
    });

    if (!team) {
      return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
