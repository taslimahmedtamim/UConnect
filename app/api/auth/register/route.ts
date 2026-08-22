import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password, fullName, role, otp } = await req.json();

    if (!email || !password || !fullName || !role || !otp) {
      return NextResponse.json({ error: 'Missing required fields, including OTP', code: 'MISSING_FIELDS' }, { status: 400 });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character', code: 'WEAK_PASSWORD' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists', code: 'EMAIL_EXISTS' }, { status: 400 });
    }

    // Verify OTP
    const validOtp = await prisma.oTP.findFirst({
      where: {
        email,
        code: otp,
        expiresAt: { gt: new Date() }
      }
    });

    if (!validOtp) {
      return NextResponse.json({ error: 'Invalid or expired OTP', code: 'INVALID_OTP' }, { status: 400 });
    }

    // Delete the OTP as it's been used
    await prisma.oTP.delete({ where: { id: validOtp.id } });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const baseUsername = fullName.toLowerCase().replace(/[^a-z0-9_]/g, '').substring(0, 20) || 'user';
    let username = baseUsername;
    let isUnique = false;
    let counter = 0;
    while (!isUnique) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (!existing) {
        isUnique = true;
      } else {
        counter++;
        username = `${baseUsername}${counter}`;
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        username,
        role
      }
    });

    if (role.toLowerCase() === 'teacher') {
      await prisma.mentorProfile.create({
        data: {
          userId: user.id,
          title: "Educator / Teacher",
          company: "University",
          expertise: ["Education", "Software Engineering"],
          experienceYears: 5,
          availability: "Flexible",
          bio: "I am a teacher here to guide students.",
          featured: true
        }
      });
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    
    const accessToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

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
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
