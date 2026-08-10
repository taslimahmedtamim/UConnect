import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '20', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const projects = await prisma.project.findMany({
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true,
          }
        }
      }
    });

    const totalCount = await prisma.project.count();
    const hasMore = skip + take < totalCount;

    return NextResponse.json({ success: true, count: projects.length, total: totalCount, hasMore, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();

    if (!data.title || !data.description) {
      return NextResponse.json(
        { success: false, message: 'Project title and description are required.' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category || 'Web Development',
        tags: data.tags || ['JavaScript', 'HTML/CSS'],
        repoUrl: data.repoUrl || null,
        demoUrl: data.demoUrl || null,
        authorId: user.id,
      },
      include: {
        author: {
          select: { id: true, fullName: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Project created successfully', project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
