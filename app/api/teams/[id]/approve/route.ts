import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caller = await getUserFromRequest(req);
    if (!caller) return unauthorizedResponse();

    const { requestId, status } = await req.json(); // status: 'approved' or 'rejected'

    if (!requestId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid request parameters' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id }
    });

    if (!team) return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });

    // Only owner can approve/reject
    if (team.ownerId !== caller.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId }
    });

    if (!joinRequest || joinRequest.teamId !== team.id) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }

    if (joinRequest.status !== 'pending') {
      return NextResponse.json({ success: false, message: 'Request already processed' }, { status: 400 });
    }

    await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status }
    });

    if (status === 'approved') {
      await prisma.team.update({
        where: { id: team.id },
        data: {
          members: {
            connect: { id: joinRequest.userId }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: `Request ${status} successfully` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
