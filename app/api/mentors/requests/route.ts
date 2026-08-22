import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';
import { createNotification } from '@/lib/notifications';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const sentRequests = await prisma.mentorshipRequest.findMany({
      where: { studentId: user.id },
      include: {
        mentor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImage: true,
            mentorProfile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const receivedRequests = await prisma.mentorshipRequest.findMany({
      where: { mentorId: user.id },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImage: true,
            university: true,
            department: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      sentRequests,
      receivedRequests
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const student = await getUserFromRequest(req);
    if (!student) return unauthorizedResponse();

    const data = await req.json();
    const { mentorId, topic, message, scheduledAt } = data;

    if (!mentorId || !topic || !message) {
      return NextResponse.json(
        { success: false, message: 'mentorId, topic, and message are required' },
        { status: 400 }
      );
    }

    if (mentorId === student.id) {
      return NextResponse.json(
        { success: false, message: 'You cannot request mentorship from yourself' },
        { status: 400 }
      );
    }

    const mentorUser = await prisma.user.findUnique({
      where: { id: mentorId },
      include: { mentorProfile: true }
    });

    if (!mentorUser) {
      return NextResponse.json({ success: false, message: 'Mentor not found' }, { status: 404 });
    }

    const request = await prisma.mentorshipRequest.create({
      data: {
        mentorId,
        studentId: student.id,
        topic: topic.trim(),
        message: message.trim(),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: 'pending'
      },
      include: {
        mentor: { select: { id: true, fullName: true } },
        student: { select: { id: true, fullName: true } }
      }
    });

    // Notify the mentor
    await createNotification({
      userId: mentorId,
      type: 'mentorship_request',
      title: 'New Mentorship Request',
      message: `${student.fullName} wants mentorship on "${topic.trim()}"`,
      link: '/mentors'
    });

    return NextResponse.json({ success: true, request }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();
    const { requestId, status, meetingUrl } = data;

    if (!requestId || !status) {
      return NextResponse.json({ success: false, message: 'requestId and status required' }, { status: 400 });
    }

    const existing = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId }
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }

    if (existing.mentorId !== user.id && existing.studentId !== user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const updated = await prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: {
        status,
        meetingUrl: meetingUrl ? meetingUrl.trim() : existing.meetingUrl,
        updatedAt: new Date()
      }
    });

    // Notify the student about the decision
    if (status === 'accepted') {
      await createNotification({
        userId: existing.studentId,
        type: 'mentorship_accepted',
        title: 'Session Accepted!',
        message: `${user.fullName} accepted your mentorship request on "${existing.topic}"`,
        link: '/mentors'
      });
    } else if (status === 'rejected') {
      await createNotification({
        userId: existing.studentId,
        type: 'mentorship_rejected',
        title: 'Session Declined',
        message: `Your mentorship request on "${existing.topic}" was declined.`,
        link: '/mentors'
      });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
