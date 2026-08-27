import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    const body = await req.json();
    const { memberId, action } = body;

    if (!memberId || !['add', 'remove'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id },
      include: { members: true }
    });

    if (!team) {
      return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });
    }

    // Only the team owner can manage assistants
    if (team.ownerId !== user.id) {
      return NextResponse.json({ success: false, message: 'Only team owner can manage assistants' }, { status: 403 });
    }

    // Verify the user being modified is actually a member of the team
    const isMember = team.members.some(m => m.id === memberId);
    if (!isMember) {
      return NextResponse.json({ success: false, message: 'User is not a member of this team' }, { status: 400 });
    }

    let currentAssistants = Array.isArray(team.assistantIds) ? team.assistantIds as string[] : [];

    if (action === 'add') {
      if (!currentAssistants.includes(memberId)) {
        currentAssistants.push(memberId);
      }
    } else if (action === 'remove') {
      currentAssistants = currentAssistants.filter(id => id !== memberId);
    }

    await prisma.team.update({
      where: { id },
      data: { assistantIds: currentAssistants }
    });

    return NextResponse.json({ success: true, assistantIds: currentAssistants });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
