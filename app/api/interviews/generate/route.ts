import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { getFlashLargeModel } from '@/lib/ai';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { targetRole } = await req.json();
    if (!targetRole) {
      return NextResponse.json({ success: false, message: "targetRole is required" }, { status: 400 });
    }

    const fullProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { skills: true }
    });
    const skillsStr = (fullProfile?.skills as string[])?.join(', ') || 'No specific skills listed';

    const model = getFlashLargeModel();
    const prompt = `
      You are an expert technical interviewer hiring for a "${targetRole}" position.
      The candidate claims to have the following skills: ${skillsStr}.
      
      Generate exactly 5 interview questions for this candidate.
      Make them a mix of behavioral and technical questions appropriate for a junior to mid-level role.
      
      Return your response STRICTLY as a JSON array of strings. Do not include markdown blocks like \`\`\`json.
      Example format:
      [
        "Can you describe a challenging bug you fixed?",
        "How does React's virtual DOM work?",
        ...
      ]
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
    
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse AI interview questions:", text);
      return NextResponse.json({ success: false, message: "Failed to generate questions. Please try again." }, { status: 500 });
    }

    // Create the mock interview record in the database
    const mockInterview = await prisma.mockInterview.create({
      data: {
        userId: user.id,
        targetRole,
        qaHistory: questions.map((q: string) => ({ question: q, answer: "", score: 0, feedback: "" }))
      }
    });

    return NextResponse.json({ success: true, interviewId: mockInterview.id, questions });

  } catch (error: any) {
    console.error("Interview Generate Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
