"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, Code, ArrowRight } from "lucide-react";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/teams");
        const data = await res.json();
        if (data.success) {
          setTeams(data.teams);
        }
      } catch (error) {
        console.error("Failed to fetch teams", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" /> Team Matchmaking
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Find and join the perfect project team based on your skills.</p>
        </div>
        <Link 
          href="/teams/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Create a Team
        </Link>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search teams by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-900 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading teams...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div key={team.id} className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{team.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">{team.description}</p>
                  
                  {team.requiredSkills && team.requiredSkills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-500 mb-2 uppercase tracking-wider">
                        <Code className="w-3.5 h-3.5" /> Required Skills
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {team.requiredSkills.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md">
                            {skill}
                          </span>
                        ))}
                        {team.requiredSkills.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-medium rounded-md">
                            +{team.requiredSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    <span className="font-medium text-slate-900 dark:text-white">{team.members.length}</span> Members
                  </div>
                  <Link 
                    href={`/teams/${team.id}`}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl border-dashed">
              No teams found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
