import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Fetch the last 100 posts to extract hashtags
    const recentPosts = await prisma.feedPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { content: true }
    });

    const hashtagCounts: Record<string, any> = {};

    recentPosts.forEach(post => {
      const hashtags = post.content.match(/#[a-zA-Z0-9_]+/g);
      if (hashtags) {
        hashtags.forEach(tag => {
          const lowerTag = tag.toLowerCase();
          if (!hashtagCounts[lowerTag]) {
            hashtagCounts[lowerTag] = { original: tag, count: 1 };
          } else {
            hashtagCounts[lowerTag].count++;
          }
        });
      }
    });

    const trending = Object.values(hashtagCounts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5)
      .map((item: any) => ({ tag: item.original, count: item.count }));

    return NextResponse.json({ success: true, trending });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
