import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    const category = (searchParams.get('category') || '').trim();

    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { likes: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            profileImage: true,
            role: true,
            department: true,
            university: true
          }
        }
      }
    });

    const filtered = projects.filter((p) => {
      const matchQ = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchCat =
        !category ||
        category === 'All' ||
        p.category.toLowerCase().replace(/[^a-z0-9]/g, '') === category.toLowerCase().replace(/[^a-z0-9]/g, '');

      return matchQ && matchCat;
    });

    const featuredProject = projects.find((p) => p.featured) || projects[0] || null;

    return NextResponse.json({
      success: true,
      count: filtered.length,
      featuredProject,
      projects: filtered
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();
    const { title, description, category, tags, repoUrl, demoUrl, rating, lookingForContributors } = data;

    if (!title || !description) {
      return NextResponse.json({ success: false, message: 'Title and description are required' }, { status: 400 });
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : String(tags || '').split(',').map((s) => s.trim()).filter(Boolean);

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category ? category.trim() : 'Web Apps',
        tags: tagsArray,
        repoUrl: repoUrl ? repoUrl.trim() : null,
        demoUrl: demoUrl ? demoUrl.trim() : null,
        lookingForContributors: Boolean(lookingForContributors),
        rating: rating ? Number(rating) : 4.8,
        authorId: user.id
      },
      include: {
        author: {
          select: { id: true, fullName: true, profileImage: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Project published to Showcase!', project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { projectId, action } = data;

    if (!projectId) {
      return NextResponse.json({ success: false, message: 'Project ID required' }, { status: 400 });
    }

    if (action === 'like') {
      const updated = await prisma.project.update({
        where: { id: projectId },
        data: { likes: { increment: 1 } }
      });
      return NextResponse.json({ success: true, likes: updated.likes });
    }

    if (action === 'view') {
      const updated = await prisma.project.update({
        where: { id: projectId },
        data: { views: { increment: 1 } }
      });
      return NextResponse.json({ success: true, views: updated.views });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
