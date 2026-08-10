import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // Fetch Teams the user is part of
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { members: { some: { id: user.id } } }
        ]
      },
      select: {
        id: true,
        name: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true, sender: { select: { fullName: true } } }
        }
      }
    });

    // Fetch distinct users the user has DMs with
    // Because Prisma doesn't have a great way to group by "the other user" simply,
    // we fetch all DMs involving the user and process in memory (fine for small apps)
    const directMessages = await prisma.message.findMany({
      where: {
        teamId: null,
        OR: [
          { senderId: user.id },
          { receiverId: user.id }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, fullName: true } },
        receiver: { select: { id: true, fullName: true } }
      }
    });

    const dmConversationsMap = new Map();
    for (const msg of directMessages) {
      const otherUser = msg.senderId === user.id ? msg.receiver : msg.sender;
      if (otherUser && !dmConversationsMap.has(otherUser.id)) {
        dmConversationsMap.set(otherUser.id, {
          id: otherUser.id,
          name: otherUser.fullName,
          type: 'user',
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          isRead: msg.isRead
        });
      }
    }

    const teamConversations = teams.map(t => ({
      id: t.id,
      name: t.name,
      type: 'team',
      lastMessage: t.messages[0] ? `${t.messages[0].sender.fullName}: ${t.messages[0].content}` : 'No messages yet',
      lastMessageAt: t.messages[0] ? t.messages[0].createdAt : null,
      isRead: true // For simplicity, team msgs are treated as read
    }));

    const allConversations = [...Array.from(dmConversationsMap.values()), ...teamConversations];
    
    // Sort by most recent message
    allConversations.sort((a, b) => {
      const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, conversations: allConversations });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { content, receiverId, teamId } = await req.json();

    if (!content) {
      return NextResponse.json({ success: false, message: 'Message content required' }, { status: 400 });
    }
    
    if (!receiverId && !teamId) {
      return NextResponse.json({ success: false, message: 'Must specify receiverId or teamId' }, { status: 400 });
    }

    // If it's a team message, verify membership
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { members: true }
      });
      
      if (!team) return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });
      
      const isMember = team.ownerId === user.id || team.members.some(m => m.id === user.id);
      if (!isMember) return NextResponse.json({ success: false, message: 'Not a member of this team' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        receiverId: receiverId || null,
        teamId: teamId || null
      },
      include: {
        sender: { select: { id: true, fullName: true } }
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
