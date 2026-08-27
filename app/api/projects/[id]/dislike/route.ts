import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();
    
    const userId = user.id;

    const existingLike = await prisma.projectLike.findUnique({
      where: {
        projectId_userId: { projectId: id, userId }
      }
    });

    if (!existingLike) {
      return NextResponse.json({ success: false, message: "Not liked yet" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.projectLike.delete({
        where: {
          projectId_userId: { projectId: id, userId }
        }
      }),
      prisma.project.update({
        where: { id },
        data: { likes: { decrement: 1 } }
      })
    ]);
    
    const project = await prisma.project.findUnique({ where: { id }, select: { likes: true } });

    return NextResponse.json({ success: true, likes: project?.likes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
