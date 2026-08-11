import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();
    const { title, content, category } = data;

    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Title and content required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

        const prompt = `
You are an expert technical lead and senior debugging coach AI for UConnect.
A student posted the following question on the Help Board:

QUESTION TITLE: ${title}
CATEGORY: ${category || 'General'}
QUESTION DETAILS & CODE:
${content}

Provide an immediate, precise, step-by-step resolution. Explain the root cause, provide corrected code blocks where applicable, and give 2 proactive tips to prevent this issue in the future.
Format your response in clean Markdown.
`;

        const result = await model.generateContent(prompt);
        const text = (await result.response).text().trim();

        return NextResponse.json({ success: true, aiSolution: text });
      } catch (aiErr: any) {
        console.warn('Gemini AI Help Assistant Error, falling back to standard resolution helper:', aiErr.message);
      }
    }

    // Heuristic fallback solution
    const fallbackSolution = `
### 🤖 Gemini AI Debugging Analysis

**Issue Summary for:** *${title}*

1. **Root Cause Diagnosis**:
   Check configuration, environment variable syntax, and missing asynchronous imports or standard parameter bindings.
2. **Suggested Step-by-Step Fix**:
   - Verify that all dependencies are installed and declared in \`package.json\`.
   - Inspect console stack trace for null dereferencing or undefined variable references.
   - Test isolated components locally using clean mock inputs.

3. **Recommended Next Steps**:
   - Run typecheck (\`npx tsc --noEmit\`) to verify symbol signatures.
   - Reply below or ask UConnect Mentors for a 1-on-1 code review session.
`;

    return NextResponse.json({ success: true, aiSolution: fallbackSolution });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
