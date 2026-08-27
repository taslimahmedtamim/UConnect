import { NextResponse } from 'next/server';
import { getFlashModel, hasApiKey } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { taskName } = await req.json();
    
    if (!hasApiKey()) {
      return NextResponse.json({ success: false, message: 'Gemini API Key missing' }, { status: 500 });
    }
    
    const model = getFlashModel();
    
    const prompt = `Extract the single most important technical skill name from this learning task description. 
Return ONLY the short, professional skill name (e.g. "HTML/CSS", "React.js", "Python", "Docker"). 
Do not include any other text or punctuation.

Task: "${taskName}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let skillName = response.text().trim();
    
    // Remove quotes if the AI added them
    skillName = skillName.replace(/^["']|["']$/g, '');
    
    return NextResponse.json({ success: true, skillName });
  } catch (error: any) {
    console.error('Skill extraction error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
