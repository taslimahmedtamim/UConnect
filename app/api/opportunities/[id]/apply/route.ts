import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';
import { getFlashLargeModel, hasApiKey, extractJson } from '@/lib/ai';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id: opportunityId } = await params;

    // Fetch opportunity details
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId }
    });

    if (!opportunity) {
      return NextResponse.json({ success: false, message: 'Opportunity not found' }, { status: 404 });
    }

    // Check if already applied (we'll update it instead of blocking)
    const existingApplication = await prisma.opportunityApplication.findUnique({
      where: {
        opportunityId_studentId: {
          opportunityId,
          studentId: user.id
        }
      }
    });

    const bodyText = await req.text();
    let customResumeText = "";
    let pdfData = "";
    if (bodyText) {
      try {
        const body = JSON.parse(bodyText);
        if (body.resumeText) customResumeText = body.resumeText;
        if (body.pdfData) pdfData = body.pdfData;
      } catch(e) {}
    }

    // Prepare resume text from user profile or custom input
    const resumeText = customResumeText ? customResumeText : `
Name: ${user.fullName}
Role: ${user.role}
University: ${user.university || 'N/A'}
Department: ${user.department || 'N/A'}
Bio: ${user.bio || 'N/A'}

Skills:
${Array.isArray(user.skills) ? user.skills.join(', ') : 'N/A'}

Experience:
${Array.isArray(user.experience) ? user.experience.map((e: any) => `- ${e.title} at ${e.company} (${e.duration}): ${e.description}`).join('\n') : 'None'}

Certifications:
${Array.isArray(user.certificates) ? user.certificates.map((c: any) => `- ${c.name} by ${c.issuer}`).join('\n') : 'None'}
    `.trim();

    const jobDescription = `
Title: ${opportunity.title}
Company: ${opportunity.company}
Type: ${opportunity.type}
Description: ${opportunity.description}
Requirements: ${Array.isArray(opportunity.requirements) ? opportunity.requirements.join(', ') : ''}
    `.trim();

    // AI Evaluation
    const model = getFlashLargeModel();
    const promptText = `You are an expert technical recruiter and ATS. Evaluate the following candidate profile against the job opportunity details.
Provide a match score out of 100, and a short 2-3 sentence feedback explaining why they are a good or bad fit.

Format exactly as JSON (no markdown block):
{
  "score": <number>,
  "feedback": "<string>"
}

Candidate Profile:
${resumeText}

Opportunity Details:
${jobDescription}`;

    let promptParts: any[] = [promptText];

    if (pdfData) {
      const base64Content = pdfData.includes('base64,') ? pdfData.split('base64,')[1] : pdfData;
      promptParts = [
        {
          inlineData: {
            data: base64Content,
            mimeType: 'application/pdf'
          }
        },
        `You are an expert technical recruiter and ATS. Evaluate the attached PDF resume against the job opportunity details below.
Provide a match score out of 100, and a short 2-3 sentence feedback explaining why they are a good or bad fit.

Format exactly as JSON (no markdown block):
{
  "score": <number>,
  "feedback": "<string>"
}

Opportunity Details:
${jobDescription}`
      ];
    }

    let aiScore = 50;
    let aiFeedback = "Automated AI evaluation could not complete. Application submitted manually.";

    if (hasApiKey()) {
      try {
        const result = await model.generateContent(promptParts);
        const text = result.response.text();
        const analysis = extractJson(text);
        if (typeof analysis.score === 'number' && typeof analysis.feedback === 'string') {
          aiScore = analysis.score;
          aiFeedback = analysis.feedback;
        }
      } catch (aiError) {
        console.error('AI Application Error:', aiError);
      }
    }

    // Save or Update Application
    let application;
    if (existingApplication) {
      application = await prisma.opportunityApplication.update({
        where: { id: existingApplication.id },
        data: {
          aiScore,
          aiFeedback,
          status: 'pending'
        }
      });
    } else {
      application = await prisma.opportunityApplication.create({
        data: {
          opportunityId,
          studentId: user.id,
          aiScore,
          aiFeedback,
          status: 'pending'
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Application submitted successfully!', application }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
