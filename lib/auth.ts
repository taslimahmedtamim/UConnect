import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from './db';

/**
 * Returns the JWT secret from environment variables.
 * Throws an error if JWT_SECRET is not set — this prevents
 * tokens from being signed with a known/guessable string.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'your_secret_key_here') {
    throw new Error('JWT_SECRET environment variable is not set. Please configure it in your .env file.');
  }
  return secret;
}

export async function getUserFromRequest(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function unauthorizedResponse() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
}
