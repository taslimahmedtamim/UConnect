import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';
import { createNotification } from '@/lib/notifications';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id: applicationId } = await params;
    const body = await req.json();
    const { status } = body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    // Verify ownership of the opportunity
    const application = await prisma.opportunityApplication.findUnique({
      where: { id: applicationId },
      include: {
        opportunity: {
          select: { postedById: true }
        }
      }
    });

    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    if (application.opportunity.postedById !== user.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.opportunityApplication.update({
      where: { id: applicationId },
      data: { status }
    });

    if (status === 'accepted') {
      await createNotification({
        userId: application.studentId,
        type: 'application_reviewed',
        title: 'Application Accepted! 🎉',
        message: `Your application for the opportunity was accepted.`,
        link: '/opportunities'
      });
    } else if (status === 'rejected') {
      await createNotification({
        userId: application.studentId,
        type: 'application_reviewed',
        title: 'Application Update',
        message: `Your application for the opportunity was rejected.`,
        link: '/opportunities'
      });
    }

    return NextResponse.json({ success: true, application: updated });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
