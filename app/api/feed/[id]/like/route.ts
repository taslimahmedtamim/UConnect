import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const existingLike = await prisma.feedLike.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: user.id
        }
      }
    });

    if (existingLike) {
      await prisma.feedLike.delete({
        where: { id: existingLike.id }
      });
      return NextResponse.json({ success: true, liked: false });
    } else {
      await prisma.feedLike.create({
        data: {
          postId: id,
          userId: user.id
        }
      });
      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
