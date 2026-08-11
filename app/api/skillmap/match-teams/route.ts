import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Fetch user skills
    const userSkills = await prisma.userSkill.findMany({
      where: { userId: user.id },
      include: { skill: true }
    });

    const userSkillNames = new Set<string>();
    userSkills.forEach(us => {
      if (us.skill?.name) userSkillNames.add(us.skill.name.toLowerCase());
    });

    // Also fetch user's targeted career path skills if available
    const userCareer = await prisma.userCareer.findUnique({
      where: { userId: user.id },
      include: { careerPath: { include: { skills: { include: { skill: true } } } } }
    });

    if (userCareer?.careerPath?.skills) {
      userCareer.careerPath.skills.forEach(cps => {
        if (cps.skill?.name) userSkillNames.add(cps.skill.name.toLowerCase());
      });
    }

    // Fetch teams
    const teams = await prisma.team.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { id: true, fullName: true, profileImage: true } } }
    });

    // Match teams by requiredSkills
    const matchedTeams = teams.map(team => {
      let requiredList: string[] = [];
      if (Array.isArray(team.requiredSkills)) {
        requiredList = team.requiredSkills as string[];
      }
      
      let matchCount = 0;
      requiredList.forEach(sk => {
        if (userSkillNames.has(sk.toLowerCase())) matchCount++;
      });

      const matchScore = requiredList.length > 0 
        ? Math.round((matchCount / requiredList.length) * 100) 
        : 50;

      return {
        ...team,
        matchScore,
        matchingSkills: requiredList.filter(sk => userSkillNames.has(sk.toLowerCase()))
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // Fetch opportunities
    const opportunities = await prisma.opportunity.findMany({
      take: 10,
      orderBy: { postedAt: 'desc' },
      include: { postedBy: { select: { id: true, fullName: true } } }
    });

    const matchedOpportunities = opportunities.map(opp => {
      let reqList: string[] = [];
      if (Array.isArray(opp.requirements)) {
        reqList = opp.requirements as string[];
      }

      let matchCount = 0;
      reqList.forEach(r => {
        if (Array.from(userSkillNames).some(us => r.toLowerCase().includes(us) || us.includes(r.toLowerCase()))) {
          matchCount++;
        }
      });

      const matchScore = reqList.length > 0 
        ? Math.round((matchCount / reqList.length) * 100) 
        : 40;

      return {
        ...opp,
        matchScore,
        matchingRequirements: reqList.filter(r => 
          Array.from(userSkillNames).some(us => r.toLowerCase().includes(us) || us.includes(r.toLowerCase()))
        )
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      teams: matchedTeams,
      opportunities: matchedOpportunities
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
