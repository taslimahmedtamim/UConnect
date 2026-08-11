import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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

    // Create a Nodemailer transporter
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Server is missing EMAIL_USER or EMAIL_PASS environment variables.");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"UConnect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your UConnect Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #2563eb;">UConnect Authentication</h2>
          <p>Your one-time verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #1e293b; background: #f1f5f9; padding: 10px; display: inline-block; border-radius: 8px;">
            ${otp}
          </h1>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: error.message || 'Failed to send OTP.' }, { status: 500 });
  }
}
