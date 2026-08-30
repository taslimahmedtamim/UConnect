import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save OTP to the database
    await prisma.oTP.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    });

    if (process.env.BREVO_API_KEY && process.env.EMAIL_USER) {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'UConnect', email: process.env.EMAIL_USER },
          to: [{ email: email }],
          subject: 'Your UConnect Verification Code',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <h2 style="color: #2563eb;">UConnect Authentication</h2>
              <p>Your one-time verification code is:</p>
              <h1 style="font-size: 32px; letter-spacing: 4px; color: #1e293b; background: #f1f5f9; padding: 10px; display: inline-block; border-radius: 8px;">
                ${otp}
              </h1>
              <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes.</p>
            </div>
          `
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email via Brevo');
      }
    } else {
      console.log(`[DEV MODE] OTP for ${email} is: ${otp}`);
      return NextResponse.json({ success: true, message: 'OTP generated (Dev Mode)', isDev: true, devOtp: otp });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: error.message || 'Failed to send OTP.' }, { status: 500 });
  }
}
