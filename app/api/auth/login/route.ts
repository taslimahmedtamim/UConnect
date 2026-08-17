import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import jwt from 'jsonwebtoken';

// In-memory rate limiting map
// Key: IP address, Value: { count: number, resetTime: number }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(req: Request) {
  try {
    // Rate Limiting Logic (5 attempts / 15 minutes)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    
    let rateData = rateLimitMap.get(ip);
    if (rateData && rateData.resetTime > now) {
      if (rateData.count >= 5) {
        return NextResponse.json({ error: 'Too many login attempts, please try again later.', code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 });
      }
      rateData.count += 1;
    } else {
      rateData = { count: 1, resetTime: now + windowMs };
    }
    rateLimitMap.set(ip, rateData);

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials', code: 'MISSING_CREDENTIALS' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    // Reset rate limit on successful login
    rateLimitMap.delete(ip);

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    
    // Access token (7d)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    // Long-lived refresh token (7d)
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
