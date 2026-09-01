import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';
import { hasApiKey, getGenAI, extractJson, getFlashModel } from '@/lib/ai';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { userId: user.id }
    });

    if (!userRoadmap) {
      return NextResponse.json({ success: true, roadmap: null });
    }

    return NextResponse.json({ success: true, roadmap: userRoadmap });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    let body: any = {};
    try { body = await req.json(); } catch(e) {}
    
    // Check if body is passing full assessment or just topic fallback
    const {
      careerGoal,
      currentLevel,
      learningTime,
      learningGoal,
      existingSkills
    } = body;

    let targetRole = careerGoal?.trim() || body.topic?.trim();
    let currentSkillList = existingSkills?.join(', ') || 'None listed yet';
    let requiredSkillsList = 'N/A';

    if (!targetRole) {
      const userCareer = await prisma.userCareer.findUnique({
        where: { userId: user.id },
        include: { careerPath: { include: { skills: { include: { skill: true } } } } }
      });

      if (!userCareer || !userCareer.careerPath) {
        return NextResponse.json(
          { success: false, message: 'Please provide a target career goal first.' },
          { status: 400 }
        );
      }
      targetRole = userCareer.careerPath.title;
      
      const userSkills = await prisma.userSkill.findMany({
        where: { userId: user.id },
        include: { skill: true }
      });
      currentSkillList = userSkills.map(us => `${us.skill.name} (Level ${us.level}/5)`).join(', ');
      requiredSkillsList = userCareer.careerPath.skills.map(cps => `${cps.skill.name} (Required: ${cps.importance}/5)`).join(', ');
    }

    if (!hasApiKey()) {
      return NextResponse.json({ success: false, message: 'Gemini API Key missing' }, { status: 500 });
    }

    try {
      const genAI = getGenAI();
      const model = getFlashModel();

      const prompt = `
You are an elite career mentor and AI tech coach.
Generate a highly sequential, adaptive multi-phase learning roadmap for a student transitioning to "${targetRole}".

ASSESSMENT PROFILE:
- Target Role/Goal: ${targetRole}
- Current Experience Level: ${currentLevel || 'Beginner'}
- Daily Learning Time: ${learningTime || '1-2 hours/day'}
- Primary Goal: ${learningGoal || 'Job Readiness'}
- Already Known Skills: ${currentSkillList}
${requiredSkillsList !== 'N/A' ? `\n- Market Requirements: ${requiredSkillsList}` : ''}

Based on what they ALREADY KNOW, skip those fundamentals. Focus on bridging the gap.

Provide your response strictly in raw JSON (no markdown formatting, no \`\`\`json block markers) matching this exact structure:
{
  "careerGoal": "${targetRole}",
  "readinessScore": 42,
  "skillGaps": [
    { "skill": "Skill Name", "current": 40, "required": 90, "gap": "Large" }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Phase Title",
      "duration": "Estimated Duration",
      "objective": "Primary goal",
      "skillsToFocus": ["Skill 1", "Skill 2"],
      "actionItems": [
        {
          "taskId": "unique-task-id",
          "task": "Specific actionable learning step",
          "estimatedTime": "2 hours",
          "difficulty": "Beginner",
          "resourceTitle": "Resource Title",
          "resourceUrl": "https://working-url-to-free-resource.com"
        }
      ],
      "recommendedProject": {
        "title": "Project Title",
        "description": "Short description",
        "difficulty": "Intermediate",
        "estimatedTime": "1 week",
        "requiredSkills": ["Skill 1", "Skill 2"]
      }
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Make sure 'readinessScore' is an integer 0-100 reflecting how close they are to the goal based on current skills.
For 'actionItems', use a unique 'taskId' (string). 
Make 'resourceUrl' SPECIFIC, FREE, and real. You MUST prioritize up-to-date official documentation and free video playlists (e.g., YouTube tutorials, freeCodeCamp courses).
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      const parsed = extractJson(text);

      // Save to DB
      const savedRoadmap = await prisma.userRoadmap.upsert({
        where: { userId: user.id },
        update: {
          careerGoal: targetRole,
          currentLevel: currentLevel || 'Unknown',
          learningTime: learningTime || 'Unknown',
          learningGoal: learningGoal || 'Unknown',
          roadmapData: parsed,
          // Keep existing progressData or initialize
        },
        create: {
          userId: user.id,
          careerGoal: targetRole,
          currentLevel: currentLevel || 'Unknown',
          learningTime: learningTime || 'Unknown',
          learningGoal: learningGoal || 'Unknown',
          roadmapData: parsed,
          progressData: {
            completedTasks: [],
            completedProjects: [],
            learningStreak: 0,
            lastLearningDate: null
          }
        }
      });

      return NextResponse.json({ success: true, roadmap: savedRoadmap });
    } catch (aiErr: any) {
      console.warn('Gemini AI Roadmap Error:', aiErr.message);
      return NextResponse.json({ success: false, message: 'AI generation failed: ' + aiErr.message }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
