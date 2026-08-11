import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '100', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const skills = await prisma.skill.findMany({
      take,
      skip,
      orderBy: { name: 'asc' }
    });

    const total = await prisma.skill.count();
    return NextResponse.json({ success: true, count: skills.length, total, skills });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Only non-students can create global skills
    if (user.role === 'student') {
      return NextResponse.json({ success: false, message: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await req.json();
    if (!data.name) {
      return NextResponse.json({ success: false, message: 'Skill name required' }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        name: data.name.trim(),
        category: data.category || null,
        tags: data.tags || []
      }
    });

    return NextResponse.json({ success: true, skill }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
