import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const userSkills = await prisma.userSkill.findMany({
      where: { userId: user.id },
      include: {
        skill: true,
        endorsements: {
          select: { id: true, endorserId: true, createdAt: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ success: true, userSkills });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();
    if (!data.skillId && !data.skillName) {
      return NextResponse.json({ success: false, message: 'skillId or skillName required' }, { status: 400 });
    }

    let skillId = data.skillId;
    const category = data.category ? String(data.category).trim() : null;

    // If skillName provided, try to find or create it
    if (!skillId && data.skillName) {
      const name = data.skillName.trim();
      const existing = await prisma.skill.findUnique({ where: { name } });
      if (existing) {
        skillId = existing.id;
        if (category && !existing.category) {
          await prisma.skill.update({ where: { id: existing.id }, data: { category } });
        }
      } else {
        const created = await prisma.skill.create({ data: { name, category: category || 'General' } });
        skillId = created.id;
      }
    }

    // Upsert user skill
    const level = parseInt(String(data.level || 1), 10);
    const upserted = await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: user.id, skillId } },
      create: { userId: user.id, skillId, level: Math.max(1, Math.min(5, level)) },
      update: { level: Math.max(1, Math.min(5, level)), updatedAt: new Date() },
      include: { skill: true, endorsements: true }
    });

    return NextResponse.json({ success: true, userSkill: upserted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get('skillId');
    if (!skillId) return NextResponse.json({ success: false, message: 'skillId required' }, { status: 400 });

    await prisma.userSkill.deleteMany({ where: { userId: user.id, skillId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
