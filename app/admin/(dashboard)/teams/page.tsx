import React from 'react';
import prisma from '@/lib/db';
import TeamTable from '@/components/admin/TeamTable';

export const dynamic = 'force-dynamic';

export default async function AdminTeamsPage() {
  const teams = await prisma.team.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      owner: {
        select: {
          fullName: true,
          email: true,
          profileImage: true,
        }
      },
      _count: {
        select: {
          members: true,
          projects: true
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Teams Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor teams on the platform.</p>
        </div>
      </div>
      
      <TeamTable teams={teams} />
    </div>
  );
}
