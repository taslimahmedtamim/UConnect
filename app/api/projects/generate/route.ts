import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { getFlashLargeModel, extractJson } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { prompt } = await req.json();

    const model = getFlashLargeModel();
    
    const basePrompt = `You are an expert career and project advisor. The user wants to build a project with this idea/goal: "${prompt}".
    Generate a highly practical, portfolio-worthy project. Provide a step-by-step task breakdown that acts as scaffolding for the user to complete the project.
    Return ONLY a raw JSON object (no markdown, no backticks, no code blocks) with the following structure:
    {
      "title": "Project Title",
      "problemStatement": "A brief explanation of the problem this solves",
      "description": "A 2-3 sentence description of the project",
      "recommendedStack": ["React", "Node.js", "Python"],
      "tasks": [
        { "title": "Setup repository", "completed": false, "status": "todo" },
        { "title": "Design database schema", "completed": false, "status": "todo" }
      ],
      "difficulty": "Beginner | Intermediate | Advanced",
      "estimatedDuration": "1 week | 2 weeks | 1 month",
      "skillsDemonstrated": ["Skill 1", "Skill 2"]
    }`;

    const result = await model.generateContent(basePrompt);
    const responseText = result.response.text();
    
    let cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const projectData = extractJson(cleanJson);

    return NextResponse.json({ success: true, projectData });
  } catch (error: any) {
    console.error("AI Project Generation Error:", error.message);
    
    // Fallback data for demonstration if API key is invalid or request fails
    const fallbackData = {
      title: "AI-Powered Phishing Detector",
      problemStatement: "Users often fall victim to phishing sites that look identical to real services.",
      description: "A browser extension that analyzes page content and URLs in real-time to warn users of potential phishing threats.",
      recommendedStack: ["React", "Python", "FastAPI", "TensorFlow"],
      tasks: [
        { title: "Set up frontend browser extension skeleton", completed: false, status: "todo" },
        { title: "Develop backend FastAPI service", completed: false, status: "todo" },
        { title: "Train simple ML model for URL classification", completed: false, status: "todo" },
        { title: "Integrate frontend with prediction API", completed: false, status: "todo" },
        { title: "Design warning UI overlays", completed: false, status: "todo" }
      ],
      difficulty: "Advanced",
      estimatedDuration: "1 month",
      skillsDemonstrated: ["Machine Learning", "Browser Extensions", "API Development"]
    };
    
    return NextResponse.json({ success: true, projectData: fallbackData });
  }
}
