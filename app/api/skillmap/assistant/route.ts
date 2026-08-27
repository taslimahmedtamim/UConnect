import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { getFlashModel, hasApiKey } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { topic, messages } = await req.json();

    if (!topic || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }

    if (!hasApiKey()) {
      return NextResponse.json({ success: false, message: 'API key missing' }, { status: 500 });
    }

    const model = getFlashModel();

    // Format chat history for Gemini. Skip the initial UI greeting to maintain alternating user/model roles.
    let chatHistory = messages.slice(0, -1);
    if (chatHistory.length > 0 && chatHistory[0].role === 'assistant' && chatHistory[0].content.includes('AI Learning Assistant')) {
      chatHistory = chatHistory.slice(1);
    }

    const history = chatHistory.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `You are an AI Learning Assistant for a student. The student is currently studying the following topic: "${topic}". 

CRITICAL INSTRUCTION: If the student asks you to "explain this simply", "give a code example", "give a use case", or asks any other question using pronouns like "this" or "it", you MUST assume they are asking about the topic "${topic}". Do NOT ask them what they want you to explain. Just directly explain the topic "${topic}".

Keep your answers concise, encouraging, and highly relevant. Use simple markdown formatting.` }]
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
