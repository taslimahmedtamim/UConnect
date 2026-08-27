import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';
import { getGenAI, hasApiKey } from '@/lib/ai';
import { getTeamMatchPrompt } from '@/lib/prompts';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: true,
        joinRequests: true
      }
    });

    if (!team) return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });

    // Check if user is already a member
    if (team.members.some((m: any) => m.id === user.id)) {
      return NextResponse.json({ success: false, message: 'Already a member of this team' }, { status: 400 });
    }

    // Check if user already requested
    const existingRequest = team.joinRequests.find((r: any) => r.userId === user.id);
    if (existingRequest) {
      return NextResponse.json({ success: false, message: 'Join request already sent' }, { status: 409 });
    }

    let aiScore = 50;
    let aiFeedback = "AI Matchmaking skipped (No API Key)";

    if (hasApiKey()) {
      try {
        const ai = getGenAI();
        const requiredSkills = team.requiredSkills as string[];
        const userSkills = user.skills as string[];
        
        const prompt = getTeamMatchPrompt(
          team.name,
          team.description,
          requiredSkills,
          user.fullName,
          user.bio,
          userSkills
        );

        if (prompt.length / 4 > 2000) {
          console.warn('[AI_TOKEN_WARNING] Team match prompt exceeds 2000 tokens.');
        }

        const model = ai.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
        const response = await model.generateContent(prompt);
        let jsonText = response.response.text() || "{}";
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const result = JSON.parse(jsonText);
        
        if (typeof result.score !== 'number' || typeof result.feedback !== 'string') {
          throw new Error("Invalid AI response shape");
        }

        aiScore = result.score;
        aiFeedback = result.feedback;
      } catch (e) {
        console.error("Gemini Matchmaking Error:", e);
        aiFeedback = "Failed to process AI Matchmaking due to an error.";
      }
    }

    await prisma.joinRequest.create({
      data: {
        teamId: team.id,
        userId: user.id,
        status: 'pending',
        aiScore,
        aiFeedback
      }
    });

    return NextResponse.json({ success: true, message: 'Join request sent successfully', aiScore, aiFeedback });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, message: 'Join request already sent' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
