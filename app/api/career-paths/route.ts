import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const careerPaths = await prisma.careerPath.findMany({
      include: { skills: { include: { skill: true } } },
      orderBy: { title: 'asc' }
    });
    return NextResponse.json({ success: true, careerPaths });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Only non-students (admins/teachers) can create career paths
    if (user.role === 'student') return NextResponse.json({ success: false, message: 'Insufficient permissions' }, { status: 403 });

    const data = await req.json();
    if (!data.title) return NextResponse.json({ success: false, message: 'title required' }, { status: 400 });

    const cp = await prisma.careerPath.create({
      data: {
        title: data.title,
        description: data.description || null
      }
    });

    // attach skills if provided: [{ skillId, importance }]
    if (Array.isArray(data.skills)) {
      for (const s of data.skills) {
        if (!s.skillId) continue;
        await prisma.careerPathSkill.create({ data: { careerPathId: cp.id, skillId: s.skillId, importance: s.importance || 3 } });
      }
    }

    const careerPath = await prisma.careerPath.findUnique({ where: { id: cp.id }, include: { skills: { include: { skill: true } } } });
    return NextResponse.json({ success: true, careerPath }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
