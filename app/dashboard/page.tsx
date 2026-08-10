"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FolderOpen, 
  Users, 
  Briefcase, 
  FileText, 
  Search,
  Plus
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        // Fetch projects
        const projRes = await fetch("/api/projects");
        const projData = await projRes.json();
        if (projData.success) {
          const userProjects = projData.projects.filter((p: any) => p.authorId === parsedUser.id);
          setProjects(userProjects);
        }

        // Fetch teams
        const teamRes = await fetch("/api/teams");
        const teamData = await teamRes.json();
        if (teamData.success) {
          // Count teams where the user is a member
          const userTeams = teamData.teams.filter((t: any) => 
            t.members.some((m: any) => m.id === parsedUser.id)
          );
          setTeamCount(userTeams.length);
        }

        // Fetch opportunities
        const oppRes = await fetch("/api/opportunities");
        const oppData = await oppRes.json();
        if (oppData.success) {
          setOpportunitiesCount(oppData.opportunities.length);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user.fullName.split(' ')[0]}! Here's your overview.</p>
        </div>
        <Link 
          href="/projects" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors w-fit"
        >
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {loading ? "..." : projects.length}
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">My Projects</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {loading ? "..." : teamCount}
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">My Teams</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {loading ? "..." : opportunitiesCount}
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Jobs</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Projects</h2>
              <Link href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View All</Link>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr><td colSpan={3} className="p-8 text-center text-slate-500">Loading...</td></tr>
                  ) : projects.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">
                        No projects yet. <Link href="/projects" className="text-blue-500 hover:underline">Create one!</Link>
                      </td>
                    </tr>
                  ) : (
                    projects.slice(0, 5).map(project => (
                      <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{project.title}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{project.category}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {project.status || "In Progress"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 max-w-[150px]">
                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.progress || 10}%` }}></div>
                            </div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{project.progress || 10}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-3">
              <Link href="/resume" className="flex items-center gap-3 w-full p-3 bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-700 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400 transition-colors group">
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="font-medium text-sm">Generate Resume</span>
              </Link>
              <Link href="/teams" className="flex items-center gap-3 w-full p-3 bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-700 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400 transition-colors group">
                <Users className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="font-medium text-sm">Find Team Members</span>
              </Link>
              <Link href="/opportunities" className="flex items-center gap-3 w-full p-3 bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-700 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400 transition-colors group">
                <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="font-medium text-sm">Browse Jobs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
