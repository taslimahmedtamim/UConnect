import React from 'react';
import prisma from '@/lib/db';
import { Users, Briefcase, FileText, Activity } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [userCount, projectCount, opportunityCount, teamCount, recentUsers, recentProjects] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.opportunity.count(),
    prisma.team.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: { id: true, fullName: true, role: true, createdAt: true, profileImage: true }
    }),
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: { id: true, title: true, category: true, createdAt: true }
    })
  ]);

  const stats = [
    { name: 'Total Users', value: userCount, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Total Projects', value: projectCount, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Opportunities', value: opportunityCount, icon: FileText, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Active Teams', value: teamCount, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome to the UConnect admin panel.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:-rotate-12`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Registrations */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">New Users</h3>
              <div className="space-y-4">
                {recentUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="" className="object-cover w-full h-full" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-sm font-medium text-gray-500">
                          {user.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.role} • {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">New Projects</h3>
              <div className="space-y-4">
                {recentProjects.map(project => (
                  <div key={project.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{project.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project.category} • {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/users" className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-700 dark:text-gray-200">Manage Users</span>
              </div>
              <span className="text-gray-400 group-hover:text-blue-500 transition-colors">→</span>
            </Link>
            <Link href="/admin/projects" className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-gray-700 dark:text-gray-200">Review Projects</span>
              </div>
              <span className="text-gray-400 group-hover:text-purple-500 transition-colors">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
