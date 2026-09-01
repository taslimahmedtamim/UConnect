import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { getFlashLargeModel, extractJson } from '@/lib/ai';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { interviewId, answers } = await req.json();
    if (!interviewId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    const interview = await prisma.mockInterview.findUnique({
      where: { id: interviewId }
    });

    if (!interview || interview.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Interview not found" }, { status: 404 });
    }

    if (interview.completed) {
      return NextResponse.json({ success: false, message: "Interview already evaluated" }, { status: 400 });
    }

    const qaHistory = interview.qaHistory as any[];
    
    // Combine questions from DB with answers from frontend
    const qaPairStr = qaHistory.map((qa, i) => `Q${i+1}: ${qa.question}\nCandidate Answer: ${answers[i] || 'No answer provided'}`).join('\n\n');

    const model = getFlashLargeModel();
    const prompt = `
      You are an expert technical interviewer evaluating a candidate for a "${interview.targetRole}" position.
      Review the candidate's answers to the following 5 questions:
      
      ${qaPairStr}
      
      Evaluate their performance. Be constructive but honest.
      Return your response STRICTLY as a JSON object matching this exact structure (do not include markdown formatting like \`\`\`json):
      {
        "overallScore": <number 0-100>,
        "overallFeedback": {
          "strengths": ["...", "..."],
          "weaknesses": ["...", "..."],
          "tips": ["...", "..."]
        },
        "questionFeedback": [
          { "score": <number 0-100>, "feedback": "Specific feedback for Q1 answer..." },
          { "score": <number 0-100>, "feedback": "Specific feedback for Q2 answer..." },
          { "score": <number 0-100>, "feedback": "Specific feedback for Q3 answer..." },
          { "score": <number 0-100>, "feedback": "Specific feedback for Q4 answer..." },
          { "score": <number 0-100>, "feedback": "Specific feedback for Q5 answer..." }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    let evaluation;
    try {
      evaluation = extractJson(text);
    } catch (e) {
      console.error("Failed to parse AI evaluation:", text);
      return NextResponse.json({ success: false, message: "Failed to evaluate answers. Please try again." }, { status: 500 });
    }

    // Update the history with scores and feedback
    const updatedHistory = qaHistory.map((qa, i) => ({
      question: qa.question,
      answer: answers[i] || '',
      score: evaluation.questionFeedback[i]?.score || 0,
      feedback: evaluation.questionFeedback[i]?.feedback || "No feedback generated."
    }));

    const updatedInterview = await prisma.mockInterview.update({
      where: { id: interviewId },
      data: {
        completed: true,
        score: evaluation.overallScore,
        feedback: evaluation.overallFeedback,
        qaHistory: updatedHistory
      }
    });

    return NextResponse.json({ success: true, interview: updatedInterview });

  } catch (error: any) {
    console.error("Interview Evaluate Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
