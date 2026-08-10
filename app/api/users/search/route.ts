import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Search query must be at least 2 characters.' },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query.toLowerCase(),
        },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        university: true,
      },
      take: 10,
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
