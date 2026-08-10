import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { chatId } = await params;
    
    // Check if chatId is a team or a user
    const team = await prisma.team.findUnique({ where: { id: chatId } });
    
    let messages = [];

    if (team) {
      // It's a team chat
      messages = await prisma.message.findMany({
        where: { teamId: chatId },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { id: true, fullName: true } }
        }
      });
    } else {
      // It's a direct message (chatId = receiverId)
      messages = await prisma.message.findMany({
        where: {
          teamId: null,
          OR: [
            { senderId: user.id, receiverId: chatId },
            { senderId: chatId, receiverId: user.id }
          ]
        },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { id: true, fullName: true } }
        }
      });

      // Mark unread messages as read
      await prisma.message.updateMany({
        where: {
          receiverId: user.id,
          senderId: chatId,
          isRead: false
        },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
