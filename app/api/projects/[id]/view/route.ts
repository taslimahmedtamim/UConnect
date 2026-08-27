import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const project = await prisma.project.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({ success: true, views: project.views });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
