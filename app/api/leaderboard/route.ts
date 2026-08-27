import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const currentUser = await getUserFromRequest(req);

    // Fetch all real users (excluding common demo domains) with their skills, endorsements, projects, teams, and points
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          email: {
            in: ['sarah.lin@tech.org', 'elena.rostova@ai.edu', 'alex.rivera@cloud.io']
          }
        }
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        profileImage: true,
        university: true,
        department: true,
        githubUsername: true,
        codeforcesUsername: true,
        userSkills: {
          include: {
            skill: true,
            endorsements: true
          }
        },
        projects: {
          select: { id: true, likes: true, views: true }
        },
        memberTeams: {
          select: { id: true }
        },
        pointsReceived: {
          select: { points: true }
        }
      }
    });

    // Compute rankings for each user based on actual points
    const rankedUsers = users.map((u) => {
      // U Points: Points awarded by team members and mentors through tasks
      const uPoints = u.pointsReceived?.reduce((acc, pt) => acc + (pt.points || 0), 0) || 0;

      // Assign Tier Badge based on U Points
      let tier = 'Member';
      let badge = 'Seed';
      if (uPoints >= 100) {
        tier = 'Legendary';
        badge = 'Apex';
      } else if (uPoints >= 50) {
        tier = 'Diamond';
        badge = 'Master';
      } else if (uPoints >= 20) {
        tier = 'Gold';
        badge = 'Expert';
      } else if (uPoints >= 5) {
        tier = 'Silver';
        badge = 'Contributor';
      } else if (uPoints >= 1) {
        tier = 'Bronze';
        badge = 'Novice';
      }

      // Extract top 3 skill names
      const topSkills = u.userSkills
        .sort((a, b) => b.level - a.level)
        .slice(0, 3)
        .map((us) => us.skill?.name)
        .filter(Boolean);

      return {
        id: u.id,
        fullName: u.fullName,
        username: u.username || u.fullName.toLowerCase().replace(/\s+/g, '_'),
        role: u.role,
        profileImage: u.profileImage,
        university: u.university || 'UConnect Member',
        department: u.department,
        githubUsername: u.githubUsername,
        codeforcesUsername: u.codeforcesUsername,
        uPoints,
        tier,
        badge,
        topSkills
      };
    });

    // Category Leaderboards
    const overallLeaderboard = [...rankedUsers].sort((a, b) => b.uPoints - a.uPoints);
    const skillsLeaderboard = [...rankedUsers].sort((a, b) => b.uPoints - a.uPoints); // Keeping for backward compatibility with UI if needed
    const endorsementLeaderboard = [...rankedUsers].sort((a, b) => b.uPoints - a.uPoints);
    const projectsLeaderboard = [...rankedUsers].sort((a, b) => b.uPoints - a.uPoints);

    // Current user position
    let currentUserRank = null;
    if (currentUser) {
      const idx = overallLeaderboard.findIndex(u => u.id === currentUser.id);
      if (idx !== -1) {
        currentUserRank = {
          rank: idx + 1,
          userData: overallLeaderboard[idx]
        };
      }
    }

    // Top Projects
    const topProjects = await prisma.project.findMany({
      where: { isPrivate: false },
      orderBy: { likes: 'desc' },
      take: 20,
      include: {
        author: {
          select: { fullName: true, username: true, profileImage: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      leaderboards: {
        overall: overallLeaderboard,
        skills: skillsLeaderboard,
        endorsements: endorsementLeaderboard,
        projects: projectsLeaderboard
      },
      topProjects,
      currentUserRank
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
