import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { skillName, score, totalQuestions } = await req.json();
    if (!skillName || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= 80;

    if (passed) {
      // Find the skill id
      const skill = await prisma.skill.findUnique({
        where: { name: skillName }
      });

      if (skill) {
        // Upsert UserSkill and mark as verified
        await prisma.userSkill.upsert({
          where: {
            userId_skillId: {
              userId: user.id,
              skillId: skill.id
            }
          },
          update: {
            verified: true
          },
          create: {
            userId: user.id,
            skillId: skill.id,
            level: 3, // default mid level if they passed verification
            verified: true
          }
        });

        // Also ensure the skill string is in the user's `skills` JSON array
        const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (fullUser) {
          const currentSkills = fullUser.skills as string[];
          if (!currentSkills.includes(skillName)) {
            await prisma.user.update({
              where: { id: user.id },
              data: { skills: [...currentSkills, skillName] }
            });
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      passed, 
      message: passed ? "Skill verified successfully!" : "Keep practicing to verify this skill." 
    });

  } catch (error: any) {
    console.error("Skill Verify Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
