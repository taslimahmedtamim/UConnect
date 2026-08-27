import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ success: false, message: 'Username is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        fullName: true,
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
        createdAt: true,
        ownedTeams: {
          select: {
            id: true,
            name: true,
            description: true,
            requiredSkills: true,
            members: { select: { id: true } },
            projects: {
              select: {
                id: true,
                title: true,
                description: true,
                tags: true,
                likes: true,
                views: true,
                repoUrl: true,
                demoUrl: true,
                createdAt: true,
                isPrivate: true
              },
              where: { isPrivate: false }
            }
          }
        },
        memberTeams: {
          select: {
            id: true,
            name: true,
            description: true,
            requiredSkills: true,
            members: { select: { id: true } },
            projects: {
              select: {
                id: true,
                title: true,
                description: true,
                tags: true,
                likes: true,
                views: true,
                repoUrl: true,
                demoUrl: true,
                createdAt: true,
                isPrivate: true
              },
              where: { isPrivate: false }
            }
          }
        },
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            tags: true,
            likes: true,
            views: true,
            repoUrl: true,
            demoUrl: true,
            createdAt: true,
            isPrivate: true
          },
          where: { isPrivate: false },
          orderBy: { createdAt: 'desc' }
        }
        // Don't select sensitive info like email, passwordHash, etc.
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const allProjectsMap = new Map();
    if (user.projects) {
      user.projects.forEach((p: any) => allProjectsMap.set(p.id, p));
    }
    if (user.ownedTeams) {
      user.ownedTeams.forEach((t: any) => {
        if (t.projects) t.projects.forEach((p: any) => allProjectsMap.set(p.id, p));
      });
    }
    if (user.memberTeams) {
      user.memberTeams.forEach((t: any) => {
        if (t.projects) t.projects.forEach((p: any) => allProjectsMap.set(p.id, p));
      });
    }

    const combinedProjects = Array.from(allProjectsMap.values()).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const formattedUser = {
      ...user,
      projects: combinedProjects
    };

    return NextResponse.json({ success: true, user: formattedUser });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
