'use client';

import React, { useState } from 'react';
import { Search, Trash2, Users, LayoutList } from 'lucide-react';
import Image from 'next/image';

type TeamOwner = {
  fullName: string;
  email: string;
  profileImage: string | null;
};

type Team = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  owner: TeamOwner;
  _count: {
    members: number;
    projects: number;
  };
};

interface TeamTableProps {
  teams: Team[];
}

export default function TeamTable({ teams }: TeamTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleDelete = async (teamId: string, teamName: string) => {
    if (!confirm(`Are you sure you want to permanently delete the team "${teamName}"? This action cannot be undone.`)) return;
    
    setUpdatingId(teamId);
    try {
      const res = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload(); // Refresh to get updated list
      } else {
        alert(data.message || 'Failed to delete team');
      }
    } catch (e) {
      alert('Error deleting team');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.owner.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Teams</h2>
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stats</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredTeams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-normal min-w-[250px]">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{team.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {team.owner.profileImage ? (
                        <Image src={team.owner.profileImage} alt="" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-xs text-gray-500 font-bold">
                          {team.owner.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{team.owner.fullName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center" title="Members">
                      <Users className="w-4 h-4 mr-1 text-blue-500" />
                      {team._count.members}
                    </div>
                    <div className="flex items-center" title="Projects">
                      <LayoutList className="w-4 h-4 mr-1 text-green-500" />
                      {team._count.projects}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    {updatingId === team.id ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <button onClick={() => handleDelete(team.id, team.name)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete Team">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTeams.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No teams found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
