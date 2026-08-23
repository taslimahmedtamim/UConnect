import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const posts = await prisma.feedPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, fullName: true, role: true, profileImage: true }
        },
        likes: true,
        _count: {
          select: { comments: true, likes: true }
        }
      },
      take: 50
    });

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { content } = await req.json();
    if (!content) return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });

    const post = await prisma.feedPost.create({
      data: {
        content,
        authorId: user.id
      },
      include: {
        author: {
          select: { id: true, fullName: true, role: true, profileImage: true }
        },
        likes: true,
        _count: {
          select: { comments: true, likes: true }
        }
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
