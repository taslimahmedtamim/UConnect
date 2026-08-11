import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '20', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const opportunities = await prisma.opportunity.findMany({
      take,
      skip,
      orderBy: { postedAt: 'desc' },
      include: {
        postedBy: {
          select: {
            id: true,
            fullName: true,
            role: true,
          }
        },
        applications: {
          select: {
            studentId: true,
            aiScore: true
          }
        }
      }
    });

    const totalCount = await prisma.opportunity.count();
    const hasMore = skip + take < totalCount;

    return NextResponse.json({ success: true, count: opportunities.length, total: totalCount, hasMore, opportunities });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Only teachers or recruiters can post opportunities
    if (user.role === 'student') {
      return NextResponse.json(
        { success: false, message: 'Only recruiters and teachers can post opportunities.' },
        { status: 403 }
      );
    }

    const data = await req.json();

    if (!data.title || !data.company || !data.type || !data.location) {
      return NextResponse.json(
        { success: false, message: 'Title, company, type, and location are required.' },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        title: data.title,
        company: data.company,
        type: data.type,
        location: data.location,
        salary: data.salary || null,
        description: data.description || '',
        requirements: data.requirements || [],
        postedById: user.id,
      },
      include: {
        postedBy: {
          select: { id: true, fullName: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Opportunity posted successfully', opportunity }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
