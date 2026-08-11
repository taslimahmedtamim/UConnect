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
    const { resumeData, targetJobTitle, pdfData } = body;

    if (!targetJobTitle) {
      return NextResponse.json(
        { message: 'Missing target job title.' },
        { status: 400 }
      );
    }

    // Initialize the model - 3.5-flash supports PDF inline data natively
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    let promptParts: any[] = [];
    const basePromptText = `You are an expert technical recruiter and an advanced ATS (Applicant Tracking System). Analyze the provided resume against the target job title: "${targetJobTitle}".
Provide your analysis in the following strict JSON format (do not include markdown block formatting, just the raw JSON object):
{
  "score": <A number out of 100 representing the ATS match, e.g., 85>,
  "gaps": ["List of 3-5 specific missing skills, keywords, or experiences required for this role"],
  "suggestions": ["List of 3-5 actionable suggestions to improve the resume for this specific role"]
}`;

    if (pdfData) {
      // The frontend sends base64 data. Ensure prefix is removed if present.
      const base64Content = pdfData.includes('base64,') ? pdfData.split('base64,')[1] : pdfData;
      
      promptParts = [
        {
          inlineData: {
            data: base64Content,
            mimeType: 'application/pdf'
          }
        },
        basePromptText
      ];
    } else if (resumeData) {
      // Fallback to text prompt
      const textPrompt = getResumeScanPrompt(resumeData, targetJobTitle);
      promptParts = [textPrompt];
    } else {
      return NextResponse.json(
        { message: 'Missing resume data or PDF file.' },
        { status: 400 }
      );
    }

    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
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
      gaps: ["Analysis failed due to an AI error.", "Ensure your API key is active and supports PDF parsing if using PDF."],
      suggestions: ["Try breaking your resume into smaller sections.", "Try scanning again later."]
    };

    return NextResponse.json(
      { success: true, result: fallbackResult, message: error.message || 'An error occurred during AI analysis.' },
      { status: 200 }
    );
  }
}
