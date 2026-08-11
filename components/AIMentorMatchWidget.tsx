"use client";

import React, { useEffect, useState } from 'react';
import { Sparkles, MessageSquare, Star, ArrowUpRight } from 'lucide-react';
import MentorCard from './MentorCard';

type Props = {
  onBookSession: (mentor: any) => void;
};

export default function AIMentorMatchWidget({ onBookSession }: Props) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/mentors/ai-match');
        const json = await res.json();
        if (json.success) {
          setMatches(json.matches || []);
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
    return (
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Gemini AI is matching your skill gaps with top mentors...
        </span>
      </div>
    );
  }

  if (!matches.length) return null;

  return (
    <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2 backdrop-blur-md border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 fill-blue-300" /> Gemini AI Skill Gap Matching
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">Recommended Mentors for You</h3>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Matched directly against your target career path and unmastered skills on U-SkillMap.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matches.map((m, idx) => (
          <div
            key={m.id || idx}
            className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-400/50 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-500 text-white shadow-sm">
                  {m.matchPercentage || 95}% Match
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {m.rating || 5.0}
                </span>
              </div>

              <h4 className="font-extrabold text-white text-base truncate">{m.user?.fullName || m.title}</h4>
              <div className="text-xs text-blue-300 font-medium truncate mb-2">
                {m.title} {m.company ? `@ ${m.company}` : ''}
              </div>

              <p className="text-xs text-blue-100/80 line-clamp-3 mb-4">
                "{m.aiReason || 'Tailored match for your current technical career trajectory.'}"
              </p>
            </div>

            <button
              onClick={() => onBookSession(m)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
