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
      // 1. Peer Recognition Points (Each point awarded by peers = 100 XP)
      const totalPeerPoints = u.pointsReceived?.reduce((acc, pt) => acc + (pt.points || 0), 0) || 0;
      const peerScore = totalPeerPoints * 100;

      // 2. Skill proficiency score (sum of levels * 50)
      const skillScore = u.userSkills.reduce((acc, us) => acc + (us.level || 0) * 50, 0);

      // 3. Endorsements count & score (100 XP per endorsement)
      const totalEndorsements = u.userSkills.reduce((acc, us) => acc + (us.endorsementCnt || us.endorsements?.length || 0), 0);
      const endorsementScore = totalEndorsements * 100;

      // 4. Projects score (200 XP per project + 15 XP per like)
      const projectCount = u.projects.length;
      const totalLikes = u.projects.reduce((acc, p) => acc + (p.likes || 0), 0);
      const projectScore = projectCount * 200 + totalLikes * 15;

      // Total UConnect XP - If they have no points/activity, it will be 0
      const totalXp = peerScore + skillScore + endorsementScore + projectScore;

      // Assign Tier Badge based on total XP
      let tier = 'Bronze';
      let badge = 'Novice';
      if (totalXp >= 4000) {
        tier = 'Legendary';
        badge = 'Apex';
      } else if (totalXp >= 2500) {
        tier = 'Master';
        badge = 'Master';
      } else if (totalXp >= 1000) {
        tier = 'Diamond';
        badge = 'Pro';
      } else if (totalXp >= 300) {
        tier = 'Gold';
        badge = 'Expert';
      } else if (totalXp >= 100) {
        tier = 'Silver';
        badge = 'Intermediate';
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
        peerScore,
        totalPeerPoints,
        skillScore,
        endorsementScore,
        projectScore,
        totalEndorsements,
        projectCount,
        totalLikes,
        totalXp,
        tier,
        badge,
        topSkills
      };
    });

    // Category Leaderboards
    const overallLeaderboard = [...rankedUsers].sort((a, b) => b.totalXp - a.totalXp);
    const skillsLeaderboard = [...rankedUsers].sort((a, b) => b.skillScore - a.skillScore);
    const endorsementLeaderboard = [...rankedUsers].sort((a, b) => b.totalEndorsements - a.totalEndorsements);
    const projectsLeaderboard = [...rankedUsers].sort((a, b) => b.projectScore - a.projectScore);

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

    return NextResponse.json({
      success: true,
      leaderboards: {
        overall: overallLeaderboard,
        skills: skillsLeaderboard,
        endorsements: endorsementLeaderboard,
        projects: projectsLeaderboard
      },
      currentUserRank
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
