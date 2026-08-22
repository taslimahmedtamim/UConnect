import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function PATCH(
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

    const body = await request.json();
    const { role } = body;

    if (!['admin', 'student', 'teacher', 'recruiter', 'mentor'].includes(role)) {
      return NextResponse.json({ success: false, message: 'Invalid role provided' }, { status: 400 });
    }

    // Prevent removing the last admin (optional, but good practice. We'll skip complex logic for now and just allow it)
    
    const { id } = await params;
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ success: false, message: 'Failed to update user role' }, { status: 500 });
  }
}
