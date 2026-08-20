import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            profileImage: true,
            role: true,
            department: true,
            university: true
          }
        },
        team: {
          include: {
            members: { select: { id: true, fullName: true, profileImage: true } },
            owner: { select: { id: true, fullName: true, profileImage: true } }
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const data = await req.json();
    const { id } = await params;
    
    // Fetch the project to ensure the user is the author or a team member
    const project = await prisma.project.findUnique({
      where: { id },
      include: { team: { include: { members: true } } }
    });

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    const isAuthor = project.authorId === user.id;
    const isTeamMember = project.team && (project.team.ownerId === user.id || project.team.members.some(m => m.id === user.id));

    if (!isAuthor && !isTeamMember) {
      return NextResponse.json({ success: false, message: 'Unauthorized to update this project' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};
    if (data.repoUrl !== undefined) updateData.repoUrl = data.repoUrl;
    if (data.demoUrl !== undefined) updateData.demoUrl = data.demoUrl;
    if (data.features !== undefined) {
      updateData.features = data.features;
      
      // Auto-calculate progress if features are provided
      if (Array.isArray(data.features) && data.features.length > 0) {
        const total = data.features.length;
        const completed = data.features.filter((f: any) => f.completed).length;
        updateData.progress = Math.round((completed / total) * 100);
        
        if (updateData.progress === 100) {
          updateData.status = 'Completed';
        } else if (updateData.progress > 0) {
          updateData.status = 'In Progress';
        } else {
          updateData.status = 'Planning';
        }
      }
    }
    
    if (data.status !== undefined) updateData.status = data.status;
    if (data.progress !== undefined) updateData.progress = data.progress;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    
    // Fetch the project to ensure the user is the author
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    if (project.authorId !== user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized to delete this project' }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
