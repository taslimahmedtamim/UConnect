"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Briefcase, Zap, ArrowUpRight, CheckCircle } from 'lucide-react';

export default function SkillTeamMatcher() {
  const [matchedTeams, setMatchedTeams] = useState<any[]>([]);
  const [matchedOpps, setMatchedOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/skillmap/match-teams');
        const json = await res.json();
        if (json.success) {
          setMatchedTeams(json.teams || []);
          setMatchedOpps(json.opportunities || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Matching teams and opportunities...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Recommended Teams */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Recommended Teams for Your Skills
            </h3>
            <p className="text-xs text-slate-500">Open project teams in UConnect seeking your exact skill set.</p>
          </div>
          <Link href="/teams" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            View All Teams <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{team.name}</h4>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                    team.matchScore >= 75
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  }`}>
                    {team.matchScore}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{team.description}</p>

                {/* Matching Skill Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {team.matchingSkills?.map((sk: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Owner: {team.owner?.fullName || 'Mentor'}</span>
                <Link
                  href={`/teams`}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Join Team
                </Link>
              </div>
            </div>
          ))}

          {matchedTeams.length === 0 && (
            <div className="col-span-2 text-center py-8 text-xs text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              No matching open teams found.
            </div>
          )}
        </div>
      </div>

      {/* Recommended Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" /> Matched Career Opportunities
            </h3>
            <p className="text-xs text-slate-500">Jobs and internships matching your top skill competencies.</p>
          </div>
          <Link href="/opportunities" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            View All Jobs <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{opp.title}</h4>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{opp.company}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                    {opp.matchScore}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 mb-3">{opp.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{opp.location} • {opp.type}</span>
                <Link
                  href="/opportunities"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}

          {matchedOpps.length === 0 && (
            <div className="col-span-2 text-center py-8 text-xs text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              No matching job opportunities found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
