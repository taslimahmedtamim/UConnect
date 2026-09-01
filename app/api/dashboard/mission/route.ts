import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { getFlashLargeModel, extractJson } from '@/lib/ai';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Fetch user details for context
    const fullProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        skills: true,
        userRoadmap: true,
        projects: { select: { id: true } },
        memberTeams: { select: { id: true, name: true } },
        role: true,
      }
    });

    if (!fullProfile) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const model = getFlashLargeModel();
    
    // Construct context string
    const contextStr = `
      User Profile Context:
      - Role: ${fullProfile.role}
      - Current Skills: ${(fullProfile.skills as string[])?.join(', ') || 'None'}
      - Number of Projects: ${fullProfile.projects.length}
      - Teams Joined: ${fullProfile.memberTeams.length}
      - Roadmap Goal: ${fullProfile.userRoadmap?.careerGoal || 'Not set'}
      - Roadmap Progress: ${fullProfile.userRoadmap ? 'Active' : 'Not started'}
      
      You are UConnect's Daily Mission AI. Your job is to analyze this student's profile and give them EXACTLY ONE high-impact mission for today.
      If they don't have a roadmap, tell them to start SkillMap.
      If they have a roadmap but no projects, tell them to build a project with their skills.
      If they have skills but no teams, tell them to apply to a team.
      Otherwise, tell them to continue learning their next skill.
      
      Return your response STRICTLY as a JSON object with the following schema:
      {
        "title": "Short, punchy title (e.g., Complete React Hooks Module)",
        "description": "1-2 sentences explaining why this is the best next step.",
        "actionLabel": "Button text (e.g., Start Learning, Build Project)",
        "actionUrl": "Where the button goes (e.g., /skillmap, /projects, /teams)",
        "type": "learning" | "project" | "team" | "resume"
      }
      Do not wrap the response in markdown blocks like \`\`\`json. Return raw JSON.
    `;

    const result = await model.generateContent(contextStr);
    let responseText = result.response.text();
    
    // Clean markdown formatting if AI still includes it
    try {
        const mission = extractJson(responseText);
        return NextResponse.json({ success: true, mission });
    } catch (parseError) {
        console.error("Failed to parse AI mission response:", responseText);
        // Fallback mission
        return NextResponse.json({
            success: true,
            mission: {
                title: "Complete your U-SkillMap",
                description: "Set up your career goals and map your skills to get personalized recommendations.",
                actionLabel: "Go to U-SkillMap",
                actionUrl: "/skillmap",
                type: "learning"
            }
        });
    }

  } catch (error: any) {
    console.error("Daily Mission Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
