import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    let body: any = {};
    try { body = await req.json(); } catch(e) {}
    
    let targetRole = body.topic?.trim();
    let currentSkillList = 'None listed yet';
    let requiredSkillsList = 'N/A';

    if (!targetRole) {
      const userCareer = await prisma.userCareer.findUnique({
        where: { userId: user.id },
        include: { careerPath: { include: { skills: { include: { skill: true } } } } }
      });

      if (!userCareer || !userCareer.careerPath) {
        return NextResponse.json(
          { success: false, message: 'Please provide a topic or choose a target career path first.' },
          { status: 400 }
        );
      }
      targetRole = userCareer.careerPath.title;
      
      const userSkills = await prisma.userSkill.findMany({
        where: { userId: user.id },
        include: { skill: true }
      });
      currentSkillList = userSkills.map(us => `${us.skill.name} (Level ${us.level}/5)`).join(', ');
      requiredSkillsList = userCareer.careerPath.skills.map(cps => `${cps.skill.name} (Required Importance: ${cps.importance}/5)`).join(', ');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

        const prompt = `
You are an elite career mentor and AI tech coach.
Generate a highly sequential, structured multi-phase learning roadmap for a student learning "${targetRole}".

STUDENT CURRENT SKILLS:
${currentSkillList}

TARGET ROLE/SKILL:
${targetRole}
${requiredSkillsList !== 'N/A' ? `\nREQUIREMENTS:\n${requiredSkillsList}` : ''}

Create a personalized 4-phase learning roadmap. Provide your response strictly in raw JSON (no markdown formatting, no code block markers) with this exact schema:
{
  "targetRole": "${targetRole}",
  "estimatedWeeks": 8,
  "overview": "Short summary of the transition strategy and key focus areas",
  "phases": [
    {
      "phase": 1,
      "title": "Phase Title",
      "duration": "2 Weeks",
      "objective": "Primary goal for this phase",
      "skillsToFocus": ["Skill 1", "Skill 2"],
      "actionItems": [
        {
          "task": "Specific actionable learning step (e.g. Learn React Hooks)",
          "resourceTitle": "Title of the free resource to learn this",
          "resourceUrl": "https://working-url-to-free-resource.com"
        }
      ],
      "recommendedProject": "Hands-on mini project idea to practice these skills"
    }
  ]
}

Make sure the 'resourceUrl' for each action item is SPECIFIC, FREE, and contains a real, working URL (e.g., links to freeCodeCamp, specific YouTube tutorials, or official documentation) that exactly matches the task.
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
        return NextResponse.json({ success: true, roadmap: parsed });
      } catch (aiErr: any) {
        console.warn('Gemini AI Roadmap Error, falling back to rule-based roadmap:', aiErr.message);
      }
    }

    // Heuristic fallback roadmap
    const missingOrWeak = [targetRole];
    const fallbackRoadmap = {
      targetRole: targetRole,
      estimatedWeeks: 6,
      overview: `A targeted 6-week curriculum to master ${targetRole}.`,
      phases: [
        {
          phase: 1,
          title: "Foundations & Core Prerequisites",
          duration: "Weeks 1-2",
          objective: "Strengthen core fundamentals and essential tooling.",
          skillsToFocus: missingOrWeak,
          actionItems: [
            { task: `Deep dive into syntax and patterns.`, resourceTitle: "freeCodeCamp", resourceUrl: "https://www.freecodecamp.org/" },
            { task: `Configure local development environment.`, resourceTitle: "MDN Web Docs", resourceUrl: "https://developer.mozilla.org/" }
          ],
          recommendedProject: `Build a CLI or lightweight prototype.`
        }
      ]
    };

    return NextResponse.json({ success: true, roadmap: fallbackRoadmap, note: 'Generated with standard curriculum builder' });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
