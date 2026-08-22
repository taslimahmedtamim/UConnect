import React from 'react';
import prisma from '@/lib/db';
import ProjectTable from '@/components/admin/ProjectTable';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      status: true,
      likes: true,
      views: true,
      createdAt: true,
      author: {
        select: {
          fullName: true,
          email: true,
          profileImage: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Project Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor projects on the platform.</p>
        </div>
      </div>
      
      <ProjectTable projects={projects} />
    </div>
  );
}
