import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { topic, messages } = await req.json();

    if (!topic || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, message: 'API key missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    // Format chat history for Gemini
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `You are an AI Learning Assistant for a student. The student is currently studying: "${topic}". Keep your answers concise, encouraging, and highly relevant to this topic. Use simple markdown formatting.` }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am ready to help the student learn about this topic.' }]
        },
        ...history
      ]
    });

    const latestMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, reply: text });

  } catch (error: any) {
    console.error('AI Assistant Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
