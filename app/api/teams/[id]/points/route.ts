import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: teamId } = await params;

    // Get all points for this team
    const teamPoints = await (prisma as any).teamPoint.groupBy({
      by: ['receiverId'],
      where: { teamId },
      _sum: {
        points: true
      },
      orderBy: {
        _sum: {
          points: 'desc'
        }
      }
    });

    // Fetch user details for each receiver
    const users = await prisma.user.findMany({
      where: {
        id: { in: teamPoints.map((tp: any) => tp.receiverId) }
      },
      select: {
        id: true,
        fullName: true,
        profileImage: true,
        title: true
      }
    });

    const leaderboard = teamPoints.map((tp: any) => ({
      receiverId: tp.receiverId,
      points: tp._sum.points || 0,
      user: users.find((u) => u.id === tp.receiverId)
    }));

    return NextResponse.json({ success: true, leaderboard });
  } catch (error: any) {
    console.error("GET points error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id: teamId } = await params;
    const { receiverId } = await req.json();

    if (!receiverId) {
      return NextResponse.json({ success: false, message: "Receiver ID is required" }, { status: 400 });
    }

    if (receiverId === user.id) {
      return NextResponse.json({ success: false, message: "You cannot award points to yourself" }, { status: 400 });
    }

    // Verify both are members of the team (or owner)
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true, owner: true }
    });

    if (!team) return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });

    const isGiverMember = team.ownerId === user.id || team.members.some(m => m.id === user.id);
    const isReceiverMember = team.ownerId === receiverId || team.members.some(m => m.id === receiverId);

    if (!isGiverMember || !isReceiverMember) {
      return NextResponse.json({ success: false, message: "Both users must be members of the team" }, { status: 403 });
    }

    const point = await (prisma as any).teamPoint.create({
      data: {
        teamId,
        giverId: user.id,
        receiverId,
        points: 1
      }
    });

    return NextResponse.json({ success: true, point });
  } catch (error: any) {
    console.error("POST point error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
