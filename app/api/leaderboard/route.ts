import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const currentUser = await getUserFromRequest(req);

    // Fetch all users with their skills, endorsements, projects, and teams
    const users = await prisma.user.findMany({
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
        }
      }
    });

    // Compute rankings for each user
    const rankedUsers = users.map((u) => {
      // 1. Skill proficiency score (sum of levels * 100)
      const skillScore = u.userSkills.reduce((acc, us) => acc + (us.level || 0) * 100, 0);

      // 2. Endorsements count & score (150 XP per endorsement)
      const totalEndorsements = u.userSkills.reduce((acc, us) => acc + (us.endorsementCnt || us.endorsements?.length || 0), 0);
      const endorsementScore = totalEndorsements * 150;

      // 3. Projects score (50 XP per project + 15 XP per like)
      const projectCount = u.projects.length;
      const totalLikes = u.projects.reduce((acc, p) => acc + (p.likes || 0), 0);
      const projectScore = projectCount * 500 + totalLikes * 25;

      // 4. Team membership score (200 XP per team)
      const teamScore = u.memberTeams.length * 200;

      // Total UConnect XP
      const totalXp = skillScore + endorsementScore + projectScore + teamScore;

      // Assign Tier Badge based on total XP
      let tier = 'Silver';
      let badge = 'Level 1';
      if (totalXp >= 4000) {
        tier = 'Legendary';
        badge = 'Apex';
      } else if (totalXp >= 2500) {
        tier = 'Master';
        badge = 'Master';
      } else if (totalXp >= 1500) {
        tier = 'Diamond';
        badge = 'Pro';
      } else if (totalXp >= 800) {
        tier = 'Gold';
        badge = 'Expert';
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
        skillScore,
        endorsementScore,
        projectScore,
        teamScore,
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
