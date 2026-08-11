import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    const skillFilter = (searchParams.get('skill') || '').toLowerCase().trim();

    const mentors = await prisma.mentorProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImage: true,
            githubUsername: true,
            bio: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Filter by query or skill
    const filtered = mentors.filter((m) => {
      const nameMatch = m.user.fullName.toLowerCase().includes(query);
      const titleMatch = m.title.toLowerCase().includes(query);
      const companyMatch = (m.company || '').toLowerCase().includes(query);
      
      let expertiseList: string[] = [];
      if (Array.isArray(m.expertise)) {
        expertiseList = m.expertise as string[];
      }
      
      const skillMatch = !skillFilter || expertiseList.some(s => s.toLowerCase().includes(skillFilter));
      
      if (query) {
        return (nameMatch || titleMatch || companyMatch || expertiseList.some(s => s.toLowerCase().includes(query))) && skillMatch;
      }
      return skillMatch;
    });

    return NextResponse.json({ success: true, mentors: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();
    const { title, company, expertise, experienceYears, availability, bio } = data;

    if (!title) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }

    const expertiseArray = Array.isArray(expertise) 
      ? expertise 
      : String(expertise || '').split(',').map(s => s.trim()).filter(Boolean);

    const upserted = await prisma.mentorProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        title: title.trim(),
        company: company ? company.trim() : null,
        expertise: expertiseArray,
        experienceYears: parseInt(String(experienceYears || 3), 10),
        availability: availability ? availability.trim() : 'Flexible',
        bio: bio ? bio.trim() : null,
        featured: true
      },
      update: {
        title: title.trim(),
        company: company ? company.trim() : null,
        expertise: expertiseArray,
        experienceYears: parseInt(String(experienceYears || 3), 10),
        availability: availability ? availability.trim() : 'Flexible',
        bio: bio ? bio.trim() : null
      },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, profileImage: true }
        }
      }
    });

    // Also update User role if student
    if (user.role === 'student') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'mentor' }
      });
    }

    return NextResponse.json({ success: true, mentor: upserted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
