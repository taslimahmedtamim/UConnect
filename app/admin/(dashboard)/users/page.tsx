import React from 'react';
import prisma from '@/lib/db';
import UserTable from '@/components/admin/UserTable';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profileImage: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor your application's users.</p>
        </div>
      </div>
      
      <UserTable users={users} />
    </div>
  );
}
