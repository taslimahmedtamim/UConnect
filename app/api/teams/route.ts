import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '20', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const teams = await prisma.team.findMany({
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        members: { select: { id: true, fullName: true, email: true } },
        owner: { select: { id: true, fullName: true, email: true } }
      }
    });

    const totalCount = await prisma.team.count();
    const hasMore = skip + take < totalCount;

    return NextResponse.json({ success: true, count: teams.length, total: totalCount, hasMore, teams });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { name, description, requiredSkills } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ success: false, message: 'Name and description are required' }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
        requiredSkills: requiredSkills || [],
        ownerId: user.id,
        members: {
          connect: { id: user.id } // Owner is inherently a member
        }
      }
    });

    return NextResponse.json({ success: true, team }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
