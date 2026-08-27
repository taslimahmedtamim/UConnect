import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { getFlashModel, hasApiKey } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, message: 'Topic is required' }, { status: 400 });
    }

    if (!hasApiKey()) {
      return NextResponse.json({ success: false, message: 'API key missing' }, { status: 500 });
    }

    const model = getFlashModel();

    const prompt = `
Generate a short, 3-question multiple-choice quiz about "${topic}" to test a student's knowledge.
Provide the response strictly in raw JSON format (no markdown formatting, no \`\`\`json block markers) using exactly this schema:
[
  {
    "id": 1,
    "question": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswerIndex": 0,
    "explanation": "Short explanation of why this answer is correct."
  }
]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(text);

    return NextResponse.json({ success: true, quiz: parsed });

  } catch (error: any) {
    console.error('AI Quiz Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
