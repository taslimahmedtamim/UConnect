import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const email = "test@university.edu";
    const existing = await prisma.user.findUnique({ where: { email } });
    
    if (existing) {
      return NextResponse.json({ success: true, message: "Second demo user already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("test1234", salt);
    
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: "Test Applicant",
        role: "student",
        bio: "I am a security enthusiast looking to join a SOC team. I have experience with analyzing logs and setting up SIEMs.",
        university: "Security Institute",
        department: "Cyber Security",
        skills: ["Wazuh", "Python", "Network Security", "Linux"], 
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Second demo user created! Email: test@university.edu | Password: test1234" 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
