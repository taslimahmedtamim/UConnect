import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id: teamId } = await params;

    // Verify membership or ownership
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: { select: { id: true } } }
    });

    if (!team) {
      return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });
    }

    const isMember = team.members.some(m => m.id === user.id);
    const isOwner = team.ownerId === user.id;

    if (!isMember && !isOwner) {
      return NextResponse.json({ success: false, message: 'Not authorized to view messages' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { teamId },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            username: true,
            profileImage: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 100 // Fetch last 100 messages for now
    });

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id: teamId } = await params;
    const body = await req.json();

    if (!body.content || !body.content.trim()) {
      return NextResponse.json({ success: false, message: 'Message content is required' }, { status: 400 });
    }

    // Verify membership or ownership
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: { select: { id: true } } }
    });

    if (!team) {
      return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });
    }

    const isMember = team.members.some(m => m.id === user.id);
    const isOwner = team.ownerId === user.id;

    if (!isMember && !isOwner) {
      return NextResponse.json({ success: false, message: 'Not authorized to send messages' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content: body.content.trim(),
        teamId,
        senderId: user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            username: true,
            profileImage: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
