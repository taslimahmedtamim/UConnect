import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration attacks
      return NextResponse.json({ success: true, message: 'If an account exists, a recovery OTP has been sent.' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP
    await prisma.oTP.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    });

    if (process.env.RESEND_API_KEY) {
      const { data, error } = await resend.emails.send({
        from: 'UConnect Security <onboarding@resend.dev>',
        to: email,
        subject: 'UConnect Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; max-width: 500px; margin: 0 auto; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #334155; font-size: 16px; margin-bottom: 30px;">We received a request to reset the password for your UConnect account. Your one-time verification code is:</p>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 2px dashed #cbd5e1; margin-bottom: 30px;">
              <h1 style="font-size: 42px; letter-spacing: 8px; color: #0f172a; margin: 0;">
                ${otp}
              </h1>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">This code will expire in <strong>10 minutes</strong>. If you did not request this password reset, please ignore this email.</p>
          </div>
        `,
      });
      
      if (error) {
        throw new Error(error.message);
      }
    } else {
      console.log(`[DEV MODE] Forgot Password OTP for ${email} is: ${otp}`);
      return NextResponse.json({ success: true, message: 'OTP generated (Dev Mode)', isDev: true, devOtp: otp });
    }

    return NextResponse.json({ success: true, message: 'Recovery OTP sent successfully' });
  } catch (error: any) {
    console.error('Error sending forgot password OTP:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request.' }, { status: 500 });
  }
}
