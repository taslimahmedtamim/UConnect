import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    const category = (searchParams.get('category') || '').trim();
    const status = (searchParams.get('status') || '').trim();

    const posts = await prisma.helpPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            profileImage: true,
            role: true
          }
        },
        answers: {
          select: { id: true, isAccepted: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const filtered = posts.filter((p) => {
      const matchQ = !query || p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query);
      const matchCat = !category || category === 'All' || p.category.toLowerCase() === category.toLowerCase();
      const matchStatus = !status || status === 'All' || p.status.toLowerCase() === status.toLowerCase();

      return matchQ && matchCat && matchStatus;
    });

    const formatted = filtered.map((p) => ({
      ...p,
      answerCount: p.answers.length,
      hasAcceptedAnswer: p.answers.some((a) => a.isAccepted)
    }));

    return NextResponse.json({ success: true, posts: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();
    const { title, content, category, tags } = data;

    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Title and content are required' }, { status: 400 });
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : String(tags || '').split(',').map((s) => s.trim()).filter(Boolean);

    const post = await prisma.helpPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category ? category.trim() : 'General',
        tags: tagsArray,
        authorId: user.id
      },
      include: {
        author: {
          select: { id: true, fullName: true, profileImage: true }
        }
      }
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
