import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();

    const { title, description, tools } = data;

    if (!title || !description) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const existingProject = await prisma.project.findFirst({
      where: {
        authorId: user.id,
        title: title
      }
    });

    if (existingProject) {
      return NextResponse.json({ success: true, exists: true, project: existingProject });
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        category: 'Personal',
        tags: tools || [],
        status: 'Completed',
        progress: 100,
        authorId: user.id
      }
    });

    return NextResponse.json({ success: true, project: newProject });

  } catch (error: any) {
    console.error('Add Project Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
