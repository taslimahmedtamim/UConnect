import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from './db';

export async function getUserFromRequest(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  
  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET || 'fallback_secret';

  try {
    const decoded = jwt.verify(token, secret) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    return user;
  } catch (error) {
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
}
