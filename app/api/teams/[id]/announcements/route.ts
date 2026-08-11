import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: teamId } = await params;
    const announcements = await (prisma as any).announcement.findMany({
      where: { teamId },
      include: {
        author: {
          select: { id: true, fullName: true, profileImage: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id: teamId } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ success: false, message: "Content is required" }, { status: 400 });
    }

    // Verify user is team owner
    const team = await prisma.team.findUnique({
      where: { id: teamId }
    });

    if (!team) return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    if (team.ownerId !== user.id) {
      return NextResponse.json({ success: false, message: "Only the team owner can post announcements" }, { status: 403 });
    }

    const announcement = await (prisma as any).announcement.create({
      data: {
        content,
        teamId,
        authorId: user.id
      },
      include: {
        author: {
          select: { id: true, fullName: true, profileImage: true }
        }
      }
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
