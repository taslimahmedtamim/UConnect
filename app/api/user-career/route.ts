import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

async function getCareerGapAnalysis(userId: string) {
  const userCareer = await prisma.userCareer.findUnique({
    where: { userId },
    include: {
      careerPath: {
        include: {
          skills: {
            include: { skill: true }
          }
        }
      }
    }
  });

  if (!userCareer || !userCareer.careerPath) {
    return { userCareer: null, analysis: null };
  }

  const userSkills = await prisma.userSkill.findMany({
    where: { userId },
    include: { skill: true }
  });

  const userSkillMap = new Map<string, number>();
  // Map both by skillId and by lowercase skillName for robust matching
  userSkills.forEach(us => {
    userSkillMap.set(us.skillId, us.level);
    if (us.skill?.name) {
      userSkillMap.set(us.skill.name.toLowerCase(), us.level);
    }
  });

  const required = userCareer.careerPath.skills;
  let weightedAchieved = 0;
  let weightedTotalNeeded = 0;

  const skillsAnalysis = required.map((cps) => {
    const skillName = cps.skill.name;
    const requiredLevel = Math.max(1, Math.min(5, cps.importance));
    const userLevel = userSkillMap.get(cps.skillId) || userSkillMap.get(skillName.toLowerCase()) || 0;

    const importanceWeight = cps.importance || 3;
    weightedTotalNeeded += requiredLevel * importanceWeight;
    weightedAchieved += Math.min(userLevel, requiredLevel) * importanceWeight;

    let status: 'mastered' | 'upgrade_needed' | 'missing' = 'missing';
    if (userLevel >= requiredLevel) {
      status = 'mastered';
    } else if (userLevel > 0) {
      status = 'upgrade_needed';
    }

    return {
      skillId: cps.skillId,
      skillName,
      category: cps.skill.category || 'General',
      requiredImportance: cps.importance,
      requiredLevel,
      userLevel,
      status,
      gap: Math.max(0, requiredLevel - userLevel)
    };
  });

  const matchPercentage = weightedTotalNeeded > 0 
    ? Math.min(100, Math.round((weightedAchieved / weightedTotalNeeded) * 100))
    : 100;

  const masteredCount = skillsAnalysis.filter(s => s.status === 'mastered').length;
  const upgradeCount = skillsAnalysis.filter(s => s.status === 'upgrade_needed').length;
  const missingCount = skillsAnalysis.filter(s => s.status === 'missing').length;

  return {
    userCareer,
    analysis: {
      matchPercentage,
      totalRequired: required.length,
      masteredCount,
      upgradeCount,
      missingCount,
      skillsAnalysis
    }
  };
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { userCareer, analysis } = await getCareerGapAnalysis(user.id);
    return NextResponse.json({ success: true, userCareer, analysis });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();
    if (!data.careerPathId) return NextResponse.json({ success: false, message: 'careerPathId required' }, { status: 400 });

    await prisma.userCareer.upsert({
      where: { userId: user.id },
      create: { userId: user.id, careerPathId: data.careerPathId },
      update: { careerPathId: data.careerPathId, chosenAt: new Date() }
    });

    const { userCareer, analysis } = await getCareerGapAnalysis(user.id);
    return NextResponse.json({ success: true, userCareer, analysis });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    await prisma.userCareer.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
