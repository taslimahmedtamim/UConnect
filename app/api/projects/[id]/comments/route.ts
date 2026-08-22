import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';
import { createNotification } from '@/lib/notifications';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;

    const comments = await prisma.projectComment.findMany({
      where: { projectId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profileImage: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id: projectId } = await params;
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: 'Comment content is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    const comment = await prisma.projectComment.create({
      data: {
        content: content.trim(),
        projectId,
        authorId: user.id
      },
      include: {
        author: {
          select: { id: true, fullName: true, profileImage: true, role: true }
        }
      }
    });

    // Notify the project author if someone else comments on their project
    if (project.authorId !== user.id) {
      await createNotification({
        userId: project.authorId,
        type: 'project_comment',
        title: 'New Comment on your Project',
        message: `${user.fullName} commented on "${project.title}"`,
        link: '/projects'
      });
    }

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
