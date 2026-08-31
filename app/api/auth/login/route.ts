import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

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

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || 'Invalid credentials', code: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    // Reset rate limit on successful login
    rateLimitMap.delete(ip);

    // Fetch the enriched profile from Prisma DB
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User profile not found in database', code: 'USER_NOT_FOUND' }, { status: 404 });
    }

    // @supabase/ssr handles setting the session cookies automatically.

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
