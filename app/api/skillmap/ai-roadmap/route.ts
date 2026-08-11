import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const userCareer = await prisma.userCareer.findUnique({
      where: { userId: user.id },
      include: {
        careerPath: {
          include: {
            skills: { include: { skill: true } }
          }
        }
      }
    });

    if (!userCareer || !userCareer.careerPath) {
      return NextResponse.json(
        { success: false, message: 'Please choose a target career path first.' },
        { status: 400 }
      );
    }

    const userSkills = await prisma.userSkill.findMany({
      where: { userId: user.id },
      include: { skill: true }
    });

    const currentSkillList = userSkills.map(us => `${us.skill.name} (Level ${us.level}/5)`).join(', ');
    const requiredSkillsList = userCareer.careerPath.skills
      .map(cps => `${cps.skill.name} (Required Importance: ${cps.importance}/5)`)
      .join(', ');

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

        const prompt = `
You are an elite career mentor and AI tech coach.
Generate a structured, high-impact multi-phase learning roadmap for a student aiming to become a "${userCareer.careerPath.title}".

STUDENT CURRENT SKILLS:
${currentSkillList || 'None listed yet'}

TARGET ROLE REQUIREMENTS:
${requiredSkillsList}

Create a personalized 4-phase learning roadmap. Provide your response strictly in raw JSON (no markdown formatting, no code block markers) with this exact schema:
{
  "targetRole": "${userCareer.careerPath.title}",
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
        "Actionable item 1",
        "Actionable item 2",
        "Actionable item 3"
      ],
      "recommendedProject": "Hands-on mini project idea to practice these skills"
    }
  ],
  "recommendedResources": [
    { "title": "Resource Name", "type": "Documentation/Course/Book", "focus": "What it covers" }
  ]
}
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
    const missingOrWeak = userCareer.careerPath.skills.map(s => s.skill.name);
    const fallbackRoadmap = {
      targetRole: userCareer.careerPath.title,
      estimatedWeeks: 6,
      overview: `A targeted 6-week curriculum to bridge your skill gap towards becoming a ${userCareer.careerPath.title}.`,
      phases: [
        {
          phase: 1,
          title: "Foundations & Core Prerequisites",
          duration: "Weeks 1-2",
          objective: "Strengthen core fundamentals and essential tooling.",
          skillsToFocus: missingOrWeak.slice(0, 2),
          actionItems: [
            `Deep dive into ${missingOrWeak[0] || 'core concepts'} syntax, patterns, and standard practices.`,
            `Build 2 small standalone exercises focusing on modular code design.`,
            `Configure local development environment and version control workflows.`
          ],
          recommendedProject: `Build a CLI or lightweight prototype utilizing ${missingOrWeak[0] || 'core stack'}.`
        },
        {
          phase: 2,
          title: "Advanced Concepts & Implementation",
          duration: "Weeks 3-4",
          objective: "Master intermediate techniques and integrate key libraries.",
          skillsToFocus: missingOrWeak.slice(2, 4),
          actionItems: [
            `Implement data integration and state architecture.`,
            `Study standard design patterns and asynchronous execution.`,
            `Write unit tests and error handling logic.`
          ],
          recommendedProject: `Create a responsive interactive web app connected to a REST/GraphQL API.`
        },
        {
          phase: 3,
          title: "Full Ecosystem Integration & Project Build",
          duration: "Weeks 5-6",
          objective: "Assemble all skills into a comprehensive portfolio project.",
          skillsToFocus: missingOrWeak,
          actionItems: [
            `Architect a full-stack portfolio application for the ${userCareer.careerPath.title} domain.`,
            `Implement authentication, database storage, and deployment pipelines.`,
            `Publish project repository and write a detailed README.`
          ],
          recommendedProject: `Capstone: Production-ready ${userCareer.careerPath.title} showcase application.`
        }
      ],
      recommendedResources: [
        { title: "Official Documentation & MDN", type: "Docs", focus: "Language & framework references" },
        { title: "GitHub Community Projects", type: "Open Source", focus: "Real-world code architecture" },
        { title: "UConnect Team Collaboration", type: "Platform", focus: "Join open teams to practice peer coding" }
      ]
    };

    return NextResponse.json({ success: true, roadmap: fallbackRoadmap, note: 'Generated with standard curriculum builder' });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
