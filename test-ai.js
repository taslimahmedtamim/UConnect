const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

const prompt = `You are an expert career and project advisor. The user wants to build a project with this idea/goal: "phishing site detector".
Generate a highly practical, portfolio-worthy project. Provide a step-by-step task breakdown that acts as scaffolding for the user to complete the project.
Return ONLY a raw JSON object (no markdown, no backticks, no code blocks) with the following structure:
{
  "title": "Project Title",
  "problemStatement": "A brief explanation of the problem this solves",
  "description": "A 2-3 sentence description of the project",
  "recommendedStack": ["React", "Node.js", "Python"],
  "tasks": [
    { "title": "Setup repository", "completed": false, "status": "todo" },
    { "title": "Design database schema", "completed": false, "status": "todo" }
  ],
  "difficulty": "Beginner | Intermediate | Advanced",
  "estimatedDuration": "1 week | 2 weeks | 1 month",
  "skillsDemonstrated": ["Skill 1", "Skill 2"]
}`;

model.generateContent(prompt)
  .then(res => {
    const responseText = res.response.text();
    console.log("Raw Output:", responseText);
    
    let cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonStart = cleanJson.indexOf('{');
    const jsonEnd = cleanJson.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
    }
    const data = JSON.parse(cleanJson);
    console.log("Parsed Data:", data);
  })
  .catch(console.error);
