import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found', code: 'NO_REFRESH_TOKEN' }, { status: 401 });
    }

    const secret = getJwtSecret();
    
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, secret) as any;
    
    // Issue a new short-lived access token
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role, email: decoded.email },
      secret,
      { expiresIn: '15m' }
    );

    // Set the new access token cookie
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid or expired refresh token', code: 'INVALID_REFRESH_TOKEN' }, { status: 401 });
  }
}
