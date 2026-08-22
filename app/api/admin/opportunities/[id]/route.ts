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

    const targetOpp = await prisma.opportunity.findUnique({
      where: { id }
    });

    if (!targetOpp) {
      return NextResponse.json({ success: false, message: 'Opportunity not found' }, { status: 404 });
    }

    await prisma.opportunity.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete opportunity' }, { status: 500 });
  }
}
