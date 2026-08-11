import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Increment view count
    await prisma.helpPost.update({
      where: { id },
      data: { views: { increment: 1 } }
    }).catch(() => {});

    const post = await prisma.helpPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            profileImage: true,
            role: true,
            university: true
          }
        },
        answers: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                username: true,
                profileImage: true,
                role: true
              }
            }
          },
          orderBy: [
            { isAccepted: 'desc' },
            { upvotes: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    });

    if (!post) {
      return NextResponse.json({ success: false, message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id: postId } = await params;
    const data = await req.json();
    const { content } = data;

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: 'Answer content required' }, { status: 400 });
    }

    const answer = await prisma.helpAnswer.create({
      data: {
        postId,
        authorId: user.id,
        content: content.trim()
      },
      include: {
        author: {
          select: { id: true, fullName: true, profileImage: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, answer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id: postId } = await params;
    const data = await req.json();
    const { action, answerId, status } = data;

    if (action === 'upvote_post') {
      const updated = await prisma.helpPost.update({
        where: { id: postId },
        data: { upvotes: { increment: 1 } }
      });
      return NextResponse.json({ success: true, upvotes: updated.upvotes });
    }

    if (action === 'upvote_answer' && answerId) {
      const updated = await prisma.helpAnswer.update({
        where: { id: answerId },
        data: { upvotes: { increment: 1 } }
      });
      return NextResponse.json({ success: true, upvotes: updated.upvotes });
    }

    if (action === 'accept_answer' && answerId) {
      const post = await prisma.helpPost.findUnique({ where: { id: postId } });
      if (!post || post.authorId !== user.id) {
        return NextResponse.json({ success: false, message: 'Only question author can accept answers' }, { status: 403 });
      }

      // Reset previous accepted answers
      await prisma.helpAnswer.updateMany({
        where: { postId },
        data: { isAccepted: false }
      });

      // Mark this answer accepted & mark post solved
      await prisma.helpAnswer.update({
        where: { id: answerId },
        data: { isAccepted: true }
      });

      await prisma.helpPost.update({
        where: { id: postId },
        data: { status: 'solved' }
      });

      return NextResponse.json({ success: true, message: 'Answer accepted as solution' });
    }

    if (action === 'toggle_status') {
      const post = await prisma.helpPost.findUnique({ where: { id: postId } });
      if (!post || post.authorId !== user.id) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
      }

      const newStatus = post.status === 'solved' ? 'open' : 'solved';
      const updated = await prisma.helpPost.update({
        where: { id: postId },
        data: { status: newStatus }
      });
      return NextResponse.json({ success: true, status: updated.status });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
