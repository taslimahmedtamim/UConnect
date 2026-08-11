import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Fetch user skills & career target
    const [userSkills, userCareer, allMentors] = await Promise.all([
      prisma.userSkill.findMany({ where: { userId: user.id }, include: { skill: true } }),
      prisma.userCareer.findUnique({ where: { userId: user.id }, include: { careerPath: { include: { skills: { include: { skill: true } } } } } }),
      prisma.mentorProfile.findMany({ include: { user: { select: { id: true, fullName: true, profileImage: true } } } })
    ]);

    if (!allMentors.length) {
      return NextResponse.json({ success: true, matches: [], note: 'No mentors registered yet.' });
    }

    const currentSkills = userSkills.map(us => `${us.skill.name} (Lvl ${us.level})`);
    const targetPath = userCareer?.careerPath?.title || 'Software Engineer';
    const requiredSkills = userCareer?.careerPath?.skills.map(cps => cps.skill.name) || [];

    const mentorsSummary = allMentors.map(m => {
      let expList: string[] = [];
      if (Array.isArray(m.expertise)) expList = m.expertise as string[];
      return {
        id: m.id,
        mentorUserId: m.userId,
        name: m.user.fullName,
        title: m.title,
        company: m.company,
        expertise: expList,
        rating: m.rating
      };
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

        const prompt = `
You are an expert AI talent & mentorship matcher.
Match the student with the best mentors from the available mentor list.

STUDENT PROFILE:
- Name: ${user.fullName}
- Target Role: ${targetPath}
- Current Skills: ${currentSkills.join(', ') || 'None'}
- Target Skills Needed: ${requiredSkills.join(', ') || 'General Software Engineering'}

AVAILABLE MENTORS:
${JSON.stringify(mentorsSummary, null, 2)}

Select top 3 matching mentors and output strictly raw JSON (no markdown wrapping) in this format:
{
  "recommendations": [
    {
      "mentorProfileId": "string",
      "matchPercentage": 95,
      "reason": "1-2 sentence tailored explanation of why this mentor is an exceptional match for the student's skill gaps."
    }
  ]
}
`;

        const result = await model.generateContent(prompt);
        let text = (await result.response).text().trim();
        if (text.startsWith('```json')) text = text.replace(/^```json/, '').replace(/```$/, '').trim();
        else if (text.startsWith('```')) text = text.replace(/^```/, '').replace(/```$/, '').trim();

        const parsed = JSON.parse(text);

        const aiMatches = (parsed.recommendations || []).map((rec: any) => {
          const found = allMentors.find(m => m.id === rec.mentorProfileId || m.userId === rec.mentorProfileId);
          return {
            ...found,
            matchPercentage: rec.matchPercentage || 90,
            aiReason: rec.reason
          };
        }).filter(Boolean);

        return NextResponse.json({ success: true, matches: aiMatches });
      } catch (aiErr: any) {
        console.warn('Gemini AI Mentor Match error, falling back to rule-based matcher:', aiErr.message);
      }
    }

    // Heuristic fallback matching
    const reqSet = new Set(requiredSkills.map(s => s.toLowerCase()));
    const heuristicMatches = allMentors.map(m => {
      let expList: string[] = [];
      if (Array.isArray(m.expertise)) expList = m.expertise as string[];

      let count = 0;
      expList.forEach(e => {
        if (reqSet.has(e.toLowerCase()) || Array.from(reqSet).some(r => e.toLowerCase().includes(r))) {
          count++;
        }
      });

      const score = Math.min(98, 65 + count * 12);
      return {
        ...m,
        matchPercentage: score,
        aiReason: `Strong match in ${expList.slice(0, 3).join(', ')} aligning with your ${targetPath} path.`
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);

    return NextResponse.json({ success: true, matches: heuristicMatches });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
