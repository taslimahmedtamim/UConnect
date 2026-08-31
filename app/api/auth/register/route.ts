import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password, fullName, role } = await req.json();

    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: 'Missing required fields', code: 'MISSING_FIELDS' }, { status: 400 });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character', code: 'WEAK_PASSWORD' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists', code: 'EMAIL_EXISTS' }, { status: 400 });
    }

    const supabase = await createClient();

    // Sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message, code: 'AUTH_ERROR' }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user in authentication provider', code: 'AUTH_ERROR' }, { status: 500 });
    }

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
        id: authData.user.id, // Store the Supabase Auth User ID in Prisma
        email,
        fullName,
        username,
        role
      }
    });

    if (role.toLowerCase() === 'mentor') {
      await prisma.mentorProfile.create({
        data: {
          userId: user.id,
          title: "Educator / Mentor",
          company: "University",
          expertise: ["Education", "Software Engineering"],
          experienceYears: 5,
          availability: "Flexible",
          bio: "I am a mentor here to guide students.",
          featured: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please verify your email if required.',
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
