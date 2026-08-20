import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id: teamId } = await params;
    
    // Verify user is in team
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true, owner: true }
    });

    if (!team) return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });
    
    const isMember = team.ownerId === user.id || team.members.some(m => m.id === user.id);
    if (!isMember) return NextResponse.json({ success: false, message: 'Not a team member' }, { status: 403 });

    const data = await req.json();
    const { title, description, category, tags, features } = data;

    if (!title || !description) {
      return NextResponse.json({ success: false, message: 'Title and description are required' }, { status: 400 });
    }

    const tagsArray = Array.isArray(tags) ? tags : String(tags || '').split(',').map((s) => s.trim()).filter(Boolean);

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category ? category.trim() : 'Web Apps',
        tags: tagsArray,
        features: Array.isArray(features) ? features : [],
        teamId: teamId,
        authorId: user.id // creator
      }
    });

    return NextResponse.json({ success: true, message: 'Team project created!', project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
