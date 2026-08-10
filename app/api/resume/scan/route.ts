import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getResumeScanPrompt } from '@/lib/prompts';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { message: 'GEMINI_API_KEY is not configured in the environment variables.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { resumeData, targetJobTitle } = body;

    if (!resumeData || !targetJobTitle) {
      return NextResponse.json(
        { message: 'Missing resume data or target job title.' },
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    const prompt = getResumeScanPrompt(resumeData, targetJobTitle);

    if (prompt.length / 4 > 2000) {
      console.warn('[AI_TOKEN_WARNING] Resume scan prompt exceeds 2000 tokens.');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    // Sometimes Gemini wraps JSON in markdown blocks like \`\`\`json ... \`\`\`
    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const analysis = JSON.parse(cleanJson);

    // Validate Response Shape
    if (typeof analysis.score !== 'number' || !Array.isArray(analysis.gaps) || !Array.isArray(analysis.suggestions)) {
      throw new Error("Invalid AI response shape");
    }

    return NextResponse.json({ success: true, result: analysis });

  } catch (error: any) {
    console.error('AI Scan Error:', error);
    
    // Graceful Fallback
    const fallbackResult = {
      score: 50,
      gaps: ["Analysis failed due to an AI error.", "Ensure your API key is active."],
      suggestions: ["Try breaking your resume into smaller sections.", "Try scanning again later."]
    };

    return NextResponse.json(
      { success: true, result: fallbackResult, message: error.message || 'An error occurred during AI analysis.' },
      { status: 200 }
    );
  }
}
