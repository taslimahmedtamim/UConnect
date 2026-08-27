import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * PATCH /api/skillmap/ai-roadmap/progress
 * 
 * Persists completed task IDs and learning streak data
 * to the UserRoadmap.progressData column.
 */
export async function PATCH(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { completedTasks, completedPhases = [] } = await req.json();

    if (!Array.isArray(completedTasks)) {
      return NextResponse.json(
        { success: false, message: 'completedTasks must be an array of task IDs' },
        { status: 400 }
      );
    }

    if (!Array.isArray(completedPhases)) {
      return NextResponse.json(
        { success: false, message: 'completedPhases must be an array of numbers' },
        { status: 400 }
      );
    }

    // Fetch existing roadmap
    const existingRoadmap = await prisma.userRoadmap.findUnique({
      where: { userId: user.id }
    });

    if (!existingRoadmap) {
      return NextResponse.json(
        { success: false, message: 'No roadmap found. Generate one first.' },
        { status: 404 }
      );
    }

    // Calculate learning streak
    const existingProgress = (existingRoadmap.progressData as any) || {};
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastLearningDate = existingProgress.lastLearningDate || null;
    let learningStreak = existingProgress.learningStreak || 0;

    if (lastLearningDate !== today) {
      // Check if this is a consecutive day
      if (lastLearningDate) {
        const lastDate = new Date(lastLearningDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day — increment streak
          learningStreak += 1;
        } else if (diffDays > 1) {
          // Streak broken — reset to 1
          learningStreak = 1;
        }
        // diffDays === 0 means same day, streak stays the same
      } else {
        // First learning day
        learningStreak = 1;
      }
    }

    // Update the progress data
    const updatedProgress = {
      ...existingProgress,
      completedTasks,
      completedPhases,
      learningStreak,
      lastLearningDate: today,
    };

    const updated = await prisma.userRoadmap.update({
      where: { userId: user.id },
      data: {
        progressData: updatedProgress,
      },
    });

    return NextResponse.json({
      success: true,
      progressData: updated.progressData,
    });

  } catch (error: any) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
