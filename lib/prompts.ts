export const getTeamMatchPrompt = (
  teamName: string,
  teamDescription: string,
  requiredSkills: string[],
  userFullName: string,
  userBio: string | null,
  userSkills: string[]
) => `
You are an expert technical recruiter AI evaluating a student's eligibility to join a project team.

TEAM REQUIREMENTS:
- Project Name: ${teamName}
- Project Description: ${teamDescription}
- Required Skills: ${requiredSkills?.join(', ') || 'None'}

STUDENT PROFILE:
- Name: ${userFullName}
- Bio: ${userBio || 'N/A'}
- Student Skills: ${userSkills?.join(', ') || 'N/A'}

Task: Evaluate how well the student matches the team's required skills.
Provide your response strictly in the following JSON format:
{
  "score": <number between 1 and 100>,
  "feedback": "<A concise 1-2 sentence explanation of why they received this score>"
}
Do not include markdown blocks or any other text. Return ONLY raw JSON.
`;

export const getResumeScanPrompt = (
  resumeData: any,
  targetJobTitle: string
) => `
You are an expert technical recruiter and an advanced ATS (Applicant Tracking System).
Analyze the following resume data against the target job title: "${targetJobTitle}".

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Provide your analysis in the following strict JSON format (do not include markdown block formatting, just the raw JSON object):
{
  "score": <A number out of 100 representing the ATS match, e.g., 85>,
  "gaps": ["List of 3-5 specific missing skills, keywords, or experiences required for this role"],
  "suggestions": ["List of 3-5 actionable suggestions to improve the resume for this specific role"]
}
`;

export const getResumeGeneratePrompt = (
  userFullName: string,
  userEmail: string,
  userBio: string | null,
  userUniversity: string | null,
  userDepartment: string | null,
  userSkills: string[]
) => `
You are an expert technical recruiter and resume writer. 
Generate a professional, clean, and highly effective resume in Markdown format for the following user.
Do not include any chat filler, just output the raw Markdown.

User Data:
- Name: ${userFullName}
- Email: ${userEmail}
- Bio: ${userBio || 'None provided'}
- Education: ${userUniversity || 'None provided'} - ${userDepartment || 'None provided'}
- Skills: ${userSkills?.join(', ') || 'None provided'}

Structure the markdown resume beautifully with sections for Summary, Education, Skills, and Experience (create a placeholder for experience if none is provided).
`;
