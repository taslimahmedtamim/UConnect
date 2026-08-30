import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Fetch user with their skills
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { skills: true }
    });

    const userSkills = Array.isArray(currentUser?.skills) ? currentUser.skills.map((s: any) => String(s).toLowerCase()) : [];

    // Find all teams where user is NOT owner, NOT member, and NO pending/approved join requests
    const teams = await prisma.team.findMany({
      where: {
        ownerId: { not: user.id },
        members: { none: { id: user.id } },
        joinRequests: { none: { userId: user.id, status: { in: ['pending', 'approved'] } } }
      },
      include: {
        owner: { select: { fullName: true, profileImage: true } },
        members: { select: { id: true } }
      }
    });

    // Calculate match score based on requiredSkills overlap
    const scoredTeams = teams.map(team => {
      let score = 0;
      let matchedSkills = [];
      const requiredSkills = Array.isArray(team.requiredSkills) ? team.requiredSkills.map((s: any) => String(s)) : [];
      
      if (requiredSkills.length > 0 && userSkills.length > 0) {
        requiredSkills.forEach(skill => {
          if (userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))) {
            score += 100 / requiredSkills.length;
            matchedSkills.push(skill);
          }
        });
      } else if (requiredSkills.length === 0) {
        // If team requires no specific skills, it's a generic match
        score = 50; 
      }

      return {
        ...team,
        matchScore: Math.round(score),
        matchedSkills
      };
    });

    // Sort by highest match score, then newest
    scoredTeams.sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Return top 20 matches for the deck
    return NextResponse.json({ success: true, teams: scoredTeams.slice(0, 20) });
  } catch (error: any) {
    console.error("Matchmaking Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
