import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';
import { getFlashModel, hasApiKey, extractJson } from '@/lib/ai';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Fetch full profile data to analyze
    const fullProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        title: true,
        skills: true,
        experience: true,
        certificates: true,
        projects: true,
        userRoadmap: true,
      }
    });

    if (!fullProfile) {
      return NextResponse.json({ success: false, message: 'Profile not found' }, { status: 404 });
    }

    if (!hasApiKey()) {
      return NextResponse.json({ success: false, message: 'Gemini API Key missing' }, { status: 500 });
    }

    const model = getFlashModel();

    const targetRole = fullProfile.userRoadmap?.careerGoal || fullProfile.title || "Software Engineer";

    const prompt = `
You are an expert AI Career Coach. 
Analyze the following user profile and provide career insights relative to their target role: "${targetRole}".

PROFILE DATA:
- Skills: ${JSON.stringify(fullProfile.skills)}
- Experience: ${JSON.stringify(fullProfile.experience)}
- Certifications: ${JSON.stringify(fullProfile.certificates)}
- Projects: ${fullProfile.projects.map(p => p.title + " (" + p.tags + ")").join(", ")}
- Roadmap Progress: ${JSON.stringify(fullProfile.userRoadmap?.progressData)}

Provide your response strictly in raw JSON (no markdown formatting, no \`\`\`json block markers) matching this exact structure:
{
  "matchScore": 85,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Area for improvement 1", "Area for improvement 2"],
  "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"]
}

Keep insights professional, encouraging, and highly specific to their actual data. Do not invent data. If they have no data, encourage them to start building their profile.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    const parsed = extractJson(text);

    return NextResponse.json({ success: true, insights: parsed });

  } catch (error: any) {
    console.error('Insights Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
