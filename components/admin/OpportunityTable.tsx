'use client';

import React, { useState } from 'react';
import { Search, Trash2, Briefcase, MapPin, DollarSign } from 'lucide-react';
import Image from 'next/image';

type OpportunityAuthor = {
  fullName: string;
  email: string;
  profileImage: string | null;
};

type Opportunity = {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string | null;
  postedAt: Date;
  postedBy: OpportunityAuthor;
};

interface OpportunityTableProps {
  opportunities: Opportunity[];
}

export default function OpportunityTable({ opportunities }: OpportunityTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleDelete = async (opportunityId: string, opportunityTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete the opportunity "${opportunityTitle}"? This action cannot be undone.`)) return;
    
    setUpdatingId(opportunityId);
    try {
      const res = await fetch(`/api/admin/opportunities/${opportunityId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload(); // Refresh to get updated list
      } else {
        alert(data.message || 'Failed to delete opportunity');
      }
    } catch (e) {
      alert('Error deleting opportunity');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOpportunities = opportunities.filter(opportunity => 
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.postedBy.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Opportunities</h2>
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Opportunity</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Posted By</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredOpportunities.map((opportunity) => (
              <tr key={opportunity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-normal min-w-[250px]">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{opportunity.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{opportunity.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {opportunity.postedBy.profileImage ? (
                        <Image src={opportunity.postedBy.profileImage} alt="" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-xs text-gray-500 font-bold">
                          {opportunity.postedBy.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{opportunity.postedBy.fullName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" />
                      {opportunity.location}
                    </div>
                    {opportunity.salary && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                        {opportunity.salary}
                      </div>
                    )}
                    <div className="mt-1">
                       <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        {opportunity.type}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    {updatingId === opportunity.id ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <button onClick={() => handleDelete(opportunity.id, opportunity.title)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete Opportunity">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOpportunities.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No opportunities found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
