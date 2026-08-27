import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Only allow recruiters/mentors to manage opportunities
    if (user.role === 'student') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const opportunities = await prisma.opportunity.findMany({
      where: {
        postedById: user.id
      },
      include: {
        applications: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                username: true,
                profileImage: true,
                university: true,
                department: true
              }
            }
          },
          orderBy: {
            aiScore: 'desc' // Order by highest AI score
          }
        }
      },
      orderBy: {
        postedAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, opportunities });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
