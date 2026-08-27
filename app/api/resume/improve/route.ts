import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { getFlashModel, hasApiKey } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { text, type, context } = await req.json();

    if (!text) {
      return NextResponse.json({ success: false, message: 'Text to improve is required' }, { status: 400 });
    }

    if (!hasApiKey()) {
      return NextResponse.json({ success: false, message: 'Gemini API Key missing' }, { status: 500 });
    }

    const model = getFlashModel();

    let prompt = `You are an expert Resume Writer and Career Coach. Rewrite the following text to make it more professional, impactful, and action-oriented.`;

    if (type === 'summary') {
      prompt += `\nThis is a resume summary. Make it compelling and concise (3-4 sentences max).\nContext: ${context || 'General profile'}`;
    } else if (type === 'experience') {
      prompt += `\nThis is a job experience description. Use strong action verbs, quantify achievements where possible, and format as bullet points.\nContext: ${context || 'General role'}`;
    }

    prompt += `\n\nOriginal Text:\n"${text}"\n\nProvide ONLY the improved text, without any conversational filler or introductory phrases.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedText = response.text().trim();

    return NextResponse.json({ success: true, result: improvedText });

  } catch (error: any) {
    console.error('Resume Improve Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
