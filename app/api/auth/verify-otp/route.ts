import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import { EmailOtpType } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email, otp, type = 'signup' } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: type as EmailOtpType,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message, code: 'AUTH_ERROR' }, { status: 400 });
    }

    let user = authData.user;
    
    // Attempt to fetch the rich profile from Prisma
    const prismaUser = await prisma.user.findUnique({
      where: { email }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'OTP verified successfully',
      user: prismaUser || { id: user?.id, email, fullName: user?.user_metadata?.full_name }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
