import React from 'react';
import prisma from '@/lib/db';
import OpportunityTable from '@/components/admin/OpportunityTable';

export const dynamic = 'force-dynamic';

export default async function AdminOpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    select: {
      id: true,
      title: true,
      company: true,
      type: true,
      location: true,
      salary: true,
      postedAt: true,
      postedBy: {
        select: {
          fullName: true,
          email: true,
          profileImage: true,
        }
      }
    },
    orderBy: {
      postedAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Opportunities Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor job postings and opportunities.</p>
        </div>
      </div>
      
      <OpportunityTable opportunities={opportunities} />
    </div>
  );
}
