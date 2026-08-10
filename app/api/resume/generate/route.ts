import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getResumeGeneratePrompt } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Fallback if no API key is provided
      const fallbackResume = `
# ${user.fullName}
**Email:** ${user.email}
**University:** ${user.university || 'N/A'} | **Department:** ${user.department || 'N/A'}

## Professional Summary
${user.bio || 'A highly motivated professional looking for new opportunities.'}

## Skills
${(user.skills as string[]) && (user.skills as string[]).length > 0 ? (user.skills as string[]).map((s: any) => `- ${s}`).join('\n') : 'No skills listed yet.'}

*(Note: This is a fallback resume. Add a GEMINI_API_KEY to your .env to enable the AI Resume Builder!)*
      `;
      return NextResponse.json({ success: true, resume: fallbackResume });
    }

    const ai = new GoogleGenerativeAI(apiKey);
    
    const prompt = getResumeGeneratePrompt(
      user.fullName,
      user.email,
      user.bio,
      user.university,
      user.department,
      user.skills as string[]
    );

    if (prompt.length / 4 > 2000) {
      console.warn('[AI_TOKEN_WARNING] Resume generate prompt exceeds 2000 tokens.');
    }

    const model = ai.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
    const response = await model.generateContent(prompt);
    const resumeContent = response.response.text();

    return NextResponse.json({ success: true, resume: resumeContent });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
