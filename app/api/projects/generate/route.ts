import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    
    const basePrompt = `You are an expert career and project advisor. The user wants to build a project with this idea/goal: "${prompt}".
    Generate a highly practical, portfolio-worthy project.
    Return ONLY a raw JSON object (no markdown, no backticks, no code blocks) with the following structure:
    {
      "title": "Project Title",
      "problemStatement": "A brief explanation of the problem this solves",
      "description": "A 2-3 sentence description of the project",
      "recommendedStack": ["React", "Node.js", "Python"],
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "difficulty": "Beginner | Intermediate | Advanced",
      "estimatedDuration": "1 week | 2 weeks | 1 month",
      "skillsDemonstrated": ["Skill 1", "Skill 2"]
    }`;

    const result = await model.generateContent(basePrompt);
    const responseText = result.response.text();
    
    let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const projectData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, projectData });
  } catch (error: any) {
    console.error("AI Project Generation Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
