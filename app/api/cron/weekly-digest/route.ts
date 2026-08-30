import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendWeeklyDigest } from '@/lib/email';
import nodemailer from 'nodemailer';

export async function GET(req: Request) {
  try {
    // 1. Verify Authorization (Cron secret)
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const authHeader = req.headers.get('authorization');
    
    // Check against standard Vercel Cron secret or query param for manual testing
    const cronSecret = process.env.CRON_SECRET || 'test-secret';
    
    if (secret !== cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
      }
    });

    // 3. Get Global Community Stats (Trending Topics)
    const recentPosts = await prisma.feedPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { content: true }
    });

    const hashtagCounts: Record<string, any> = {};
    recentPosts.forEach((post: any) => {
      const hashtags = post.content.match(/#[a-zA-Z0-9_]+/g);
      if (hashtags) {
        hashtags.forEach((tag: string) => {
          const lowerTag = tag.toLowerCase();
          if (!hashtagCounts[lowerTag]) {
            hashtagCounts[lowerTag] = { original: tag, count: 1 };
          } else {
            hashtagCounts[lowerTag].count++;
          }
        });
      }
    });

    const trendingTopics = Object.values(hashtagCounts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 3)
      .map((item: any) => ({ tag: item.original, count: item.count }));
      
    // Fallback if no real trending topics
    if (trendingTopics.length === 0) {
      trendingTopics.push({ tag: '#CareerGoals', count: 42 });
      trendingTopics.push({ tag: '#100DaysOfCode', count: 38 });
    }

    // 4. Send Emails
    const results = [];
    
    // For safety in dev, we will only process a max of 5 users unless in production
    const usersToProcess = process.env.NODE_ENV === 'production' ? users : users.slice(0, 5);

    for (const user of usersToProcess) {
      // Fetch personalized stats (simulated or simplified for digest)
      const verifiedSkillsCount = await prisma.userSkill.count({
        where: { userId: user.id, verified: true }
      });
      
      const postsCount = await prisma.feedPost.count({
        where: { authorId: user.id }
      });
      
      // Calculate a dummy "points earned this week" or fetch from DB if implemented
      const pointsEarned = 15 + Math.floor(Math.random() * 50);
      
      const stats = {
        pointsEarned,
        skillsVerified: verifiedSkillsCount,
        postsMade: postsCount,
        trendingTopics
      };

      const result = await sendWeeklyDigest(user, stats);
      results.push({ userId: user.id, success: result.success });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${usersToProcess.length} users.`,
      results 
    });
    
  } catch (error: any) {
    console.error('Weekly Digest Cron Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
