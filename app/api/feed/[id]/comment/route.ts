import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { content } = await req.json();
    if (!content) return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });

    const comment = await prisma.feedComment.create({
      data: {
        content,
        postId: params.id,
        authorId: user.id
      },
      include: {
        author: {
          select: { id: true, fullName: true, role: true, profileImage: true }
        }
      }
    });

    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
