import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const fullProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        bio: true,
        university: true,
        department: true,
        skills: true,
        githubUsername: true,
        codeforcesUsername: true,
        title: true,
        location: true,
        profileImage: true,
        experience: true,
        certificates: true,
        projects: true,
        userRoadmap: true,
        activityLog: true,
        ownedTeams: {
          include: { projects: true }
        },
        memberTeams: {
          include: { projects: true }
        },
        createdAt: true,
      }
    });

    const allProjectsMap = new Map();
    if (fullProfile?.projects) {
      fullProfile.projects.forEach((p: any) => allProjectsMap.set(p.id, p));
    }
    if (fullProfile?.ownedTeams) {
      fullProfile.ownedTeams.forEach((t: any) => {
        if (t.projects) t.projects.forEach((p: any) => allProjectsMap.set(p.id, p));
      });
    }
    if (fullProfile?.memberTeams) {
      fullProfile.memberTeams.forEach((t: any) => {
        if (t.projects) t.projects.forEach((p: any) => allProjectsMap.set(p.id, p));
      });
    }

    const combinedProjects = Array.from(allProjectsMap.values()).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const formattedProfile = {
      ...fullProfile,
      projects: combinedProjects
    };

    return NextResponse.json({ success: true, user: formattedProfile });
  } catch (error: any) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();

    // Validate username format if provided
    if (data.username !== undefined && data.username !== null && data.username !== '') {
      const usernameRegex = /^[a-z0-9_]{3,30}$/;
      if (!usernameRegex.test(data.username)) {
        return NextResponse.json(
          { success: false, message: 'Username must be 3-30 characters, lowercase letters, numbers, and underscores only.' },
          { status: 400 }
        );
      }

      // Check uniqueness (exclude current user)
      const existingUser = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { success: false, message: 'This username is already taken.' },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: data.username || null,
        bio: data.bio,
        university: data.university,
        department: data.department,
        skills: data.skills,
        githubUsername: data.githubUsername || null,
        codeforcesUsername: data.codeforcesUsername || null,
        title: data.title,
        location: data.location,
        profileImage: data.profileImage,
        experience: data.experience,
        certificates: data.certificates,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        bio: true,
        university: true,
        department: true,
        skills: true,
        githubUsername: true,
        codeforcesUsername: true,
        title: true,
        location: true,
        profileImage: true,
        experience: true,
        certificates: true,
        projects: true,
        userRoadmap: true,
        ownedTeams: true,
        memberTeams: true,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
