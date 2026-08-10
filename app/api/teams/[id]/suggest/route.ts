import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caller = await getUserFromRequest(req);
    if (!caller) return unauthorizedResponse();
    
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: true,
        joinRequests: true
      }
    });

    if (!team) return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });

    // Only owner can see suggestions
    if (team.ownerId !== caller.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const requiredSkills = team.requiredSkills as string[];
    if (!requiredSkills || requiredSkills.length === 0) {
      return NextResponse.json({ success: true, suggestions: [] });
    }

    const currentMemberIds = team.members.map((m: any) => m.id);
    const requestedUserIds = team.joinRequests.map((r: any) => r.userId);
    const excludeIds = [...currentMemberIds, ...requestedUserIds];

    const requiredSkillsLower = requiredSkills.map((s: string) => s.toLowerCase());
    
    const allStudents = await prisma.user.findMany({ 
      where: {
        role: 'student',
        id: { notIn: excludeIds }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        skills: true,
        bio: true
      }
    });

    const scoredStudents = allStudents.map((student: any) => {
      let matchCount = 0;
      const studentSkills = (student.skills as string[]) || [];
      studentSkills.forEach((s: any) => {
        if (requiredSkillsLower.includes(s.toLowerCase())) matchCount++;
      });
      return {
        user: { _id: student.id, ...student }, // _id for backward compatibility in UI
        matchCount,
        matchPercentage: Math.round((matchCount / requiredSkills.length) * 100)
      };
    }).filter((s: any) => s.matchCount > 0);

    scoredStudents.sort((a: any, b: any) => b.matchCount - a.matchCount);

    return NextResponse.json({ 
      success: true, 
      suggestions: scoredStudents.slice(0, 5)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
