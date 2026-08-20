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
            members: { select: { id: true } }
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
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
        // Don't select sensitive info like email, passwordHash, etc.
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
