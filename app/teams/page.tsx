"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, Code, ArrowRight, Target, Sparkles, Filter, CheckCircle2, AlertCircle } from "lucide-react";
import { useUser } from "@/components/UserProvider";

export default function TeamsPage() {
  const { user } = useUser();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "matches" | "my_teams">("all");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/teams");
        const data = await res.json();
        if (data.success) {
          // Compute match percentage if user is logged in
          const processedTeams = data.teams.map((t: any) => {
            if (!user) return { ...t, matchPercent: 0, missing: [] };
            const reqSkills = t.requiredSkills || [];
            if (reqSkills.length === 0) return { ...t, matchPercent: 50, missing: [] }; // Neutral if no requirements
            
            const overlap = reqSkills.filter((s: string) => user.skills.includes(s));
            const matchPercent = Math.round((overlap.length / reqSkills.length) * 100);
            const missing = reqSkills.filter((s: string) => !user.skills.includes(s));
            
            const isOwner = t.ownerId === user.id;
            const isMember = isOwner || (t.members && t.members.some((m: any) => m.id === user.id));
            
            return { ...t, matchPercent, missing, isMember, isOwner };
          });
          
          setTeams(processedTeams);
        }
      } catch (error) {
        console.error("Failed to fetch teams", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [user]);

  let filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  if (filterMode === "matches") {
    filteredTeams = filteredTeams.filter(t => t.matchPercent > 0).sort((a, b) => b.matchPercent - a.matchPercent);
  } else if (filterMode === "my_teams") {
    filteredTeams = filteredTeams.filter(t => t.isMember);
  } else {
    filteredTeams = filteredTeams.sort((a, b) => (b.isMember ? 1 : 0) - (a.isMember ? 1 : 0));
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" /> Team Matchmaking
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Find your ideal team, combine your skills, and build amazing projects together.</p>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <Link 
                href="/teams/discover" 
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 shadow-lg shadow-pink-500/20 text-white px-5 py-2.5 rounded-lg font-bold transition-all hover:scale-105 whitespace-nowrap"
              >
                <Sparkles className="w-5 h-5" /> Discover Matches
              </Link>
              <Link 
                href="/teams/create" 
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap border border-slate-200 dark:border-slate-700"
              >
                <Plus className="w-5 h-5" /> Create a Team
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search teams by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
          <button 
            onClick={() => setFilterMode("my_teams")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${filterMode === "my_teams" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <Users className="w-4 h-4" /> My Teams
          </button>
          <button 
            onClick={() => setFilterMode("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterMode === "all" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            All Teams
          </button>
          <button 
            onClick={() => setFilterMode("matches")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${filterMode === "matches" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <Filter className="w-4 h-4" /> Recommended
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">No teams found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">We couldn't find any teams matching your current filters. Try adjusting your search or create your own team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{team.name}</h2>
                  {team.isMember && (
                    <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <Users className="w-3.5 h-3.5" /> My Team
                    </span>
                  )}
                </div>
                {user && (
                  <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${
                    team.matchPercent >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800' :
                    team.matchPercent >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800' :
                    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}>
                    {team.matchPercent}% Match
                  </div>
                )}
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 min-h-[40px]">
                {team.description}
              </p>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {team.requiredSkills && team.requiredSkills.slice(0, 4).map((skill: string, idx: number) => {
                    const hasSkill = user?.skills.includes(skill);
                    return (
                      <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
                        hasSkill 
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                      }`}>
                        {hasSkill && <CheckCircle2 className="w-3 h-3" />}
                        {skill}
                      </span>
                    );
                  })}
                  {team.requiredSkills?.length > 4 && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700">
                      +{team.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {user && team.missing && team.missing.length > 0 && filterMode === "matches" && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-400">Missing Skills</p>
                    <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-0.5 line-clamp-1">{team.missing.join(", ")}</p>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {team.members?.slice(0, 3).map((member: any) => (
                      <div key={member.id} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                        {member.fullName.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500 ml-2">{team.members?.length} / {team.maxMembers || 4} Members</span>
                </div>
                <Link 
                  href={`/teams/${team.id}`}
                  className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 dark:bg-slate-800 dark:hover:bg-blue-900/30 dark:text-slate-300 dark:hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800"
                >
                  View <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
