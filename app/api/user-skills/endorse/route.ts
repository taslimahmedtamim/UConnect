import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const endorser = await getUserFromRequest(req);
    if (!endorser) return unauthorizedResponse();

    const data = await req.json();
    const { userSkillId } = data;

    if (!userSkillId) {
      return NextResponse.json({ success: false, message: 'userSkillId required' }, { status: 400 });
    }

    const targetUserSkill = await prisma.userSkill.findUnique({
      where: { id: userSkillId }
    });

    if (!targetUserSkill) {
      return NextResponse.json({ success: false, message: 'User skill not found' }, { status: 404 });
    }

    if (targetUserSkill.userId === endorser.id) {
      return NextResponse.json({ success: false, message: 'You cannot endorse your own skill' }, { status: 400 });
    }

    // Check if already endorsed
    const existing = await prisma.endorsement.findUnique({
      where: {
        userSkillId_endorserId: {
          userSkillId,
          endorserId: endorser.id
        }
      }
    });

    if (existing) {
      // Toggle off / remove endorsement
      await prisma.endorsement.delete({
        where: { id: existing.id }
      });
      await prisma.userSkill.update({
        where: { id: userSkillId },
        data: { endorsementCnt: { decrement: 1 } }
      });
      return NextResponse.json({ success: true, endorsed: false, message: 'Endorsement removed' });
    } else {
      // Add endorsement
      await prisma.endorsement.create({
        data: {
          userSkillId,
          endorserId: endorser.id
        }
      });
      await prisma.userSkill.update({
        where: { id: userSkillId },
        data: { endorsementCnt: { increment: 1 } }
      });
      return NextResponse.json({ success: true, endorsed: true, message: 'Skill endorsed successfully' });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
