import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: teamId } = await params;
    
    // In a real app we'd verify the user via session/token
    // For now, we will trust the client or maybe pass a user ID, but GET is fine.
    
    const messages = await prisma.message.findMany({
      where: { teamId },
      include: {
        sender: {
          select: { id: true, fullName: true, profileImage: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error('Error fetching team messages:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch messages.' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id: teamId } = await params;
    const { content, senderId } = await req.json();

    if (!content || !senderId) {
      return NextResponse.json({ success: false, message: 'Missing content or senderId' }, { status: 400 });
    }

    // Verify team exists and sender is a member/owner
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { owner: true, members: true }
    });

    if (!team) {
      return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });
    }

    const isOwner = team.owner.id === senderId;
    const isMember = team.members.some(m => m.id === senderId);

    if (!isOwner && !isMember) {
      return NextResponse.json({ success: false, message: 'You are not a member of this team' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        teamId
      },
      include: {
        sender: {
          select: { id: true, fullName: true, profileImage: true }
        }
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error('Error sending team message:', error);
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 });
  }
}
