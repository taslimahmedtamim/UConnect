import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as any;
    
    // Verify requester is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const targetTeam = await prisma.team.findUnique({
      where: { id }
    });

    if (!targetTeam) {
      return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });
    }

    await prisma.team.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete team' }, { status: 500 });
  }
}
