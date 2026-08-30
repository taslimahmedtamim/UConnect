"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/UserProvider";
import Link from "next/link";
import { ArrowLeft, X, Heart, Sparkles, AlertTriangle, Users, Code, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DiscoverTeamsPage() {
  const { user } = useUser();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipingIndex, setSwipingIndex] = useState(-1);
  const [noMoreTeams, setNoMoreTeams] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/teams/matchmaking");
        const data = await res.json();
        if (data.success) {
          setTeams(data.teams);
          if (data.teams.length === 0) setNoMoreTeams(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleAction = async (teamId: string, action: 'skip' | 'request') => {
    // Optimistic UI
    const currentTeam = teams[0];
    setSwipingIndex(0);
    
    // Remove after short delay for animation
    setTimeout(() => {
      const newTeams = [...teams].slice(1);
      setTeams(newTeams);
      setSwipingIndex(-1);
      if (newTeams.length === 0) setNoMoreTeams(true);
    }, 300);

    if (action === 'request') {
      try {
        await fetch(`/api/teams/${teamId}/request`, { method: "POST" });
      } catch (error) {
        console.error("Failed to send join request", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Sparkles className="w-12 h-12 text-indigo-500 animate-pulse mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Finding your perfect match...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Link href="/teams" className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </Link>
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-pink-500" /> Discover
        </h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {noMoreTeams ? (
          <div className="text-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-sm w-full">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">You caught up!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              We couldn't find any more teams looking for your specific skills. Check back later!
            </p>
            <Link href="/teams" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors inline-block w-full">
              Go back to Teams
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            {teams.length > 0 && (
              <motion.div
                key={teams[0].id}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ 
                  x: swipingIndex === 0 ? (Math.random() > 0.5 ? 300 : -300) : 0, 
                  opacity: 0, 
                  scale: 0.9, 
                  rotate: swipingIndex === 0 ? (Math.random() > 0.5 ? 15 : -15) : 0 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute w-full max-w-sm aspect-[3/4] bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex-1 p-8 overflow-y-auto">
                  <div className="mb-6 flex justify-between items-start">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1">
                      🔥 {teams[0].matchScore}% Match
                    </div>
                    <div className="text-slate-400 text-sm flex items-center gap-1">
                      <Users className="w-4 h-4" /> {teams[0].members.length + 1}
                    </div>
                  </div>

                  <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                    {teams[0].name}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-2">
                    <img src={teams[0].owner.profileImage || `https://ui-avatars.com/api/?name=${teams[0].owner.fullName}`} className="w-5 h-5 rounded-full" />
                    Led by {teams[0].owner.fullName}
                  </p>

                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                    {teams[0].description}
                  </p>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" /> Looking For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(teams[0].requiredSkills) && teams[0].requiredSkills.map((skill: string, i: number) => {
                        const isMatched = teams[0].matchedSkills?.includes(skill);
                        return (
                          <span 
                            key={i} 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                              isMatched 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {skill} {isMatched && '✨'}
                          </span>
                        );
                      })}
                      {(!teams[0].requiredSkills || teams[0].requiredSkills.length === 0) && (
                        <span className="text-sm text-slate-500 italic">Anyone can join</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-6">
                  <button 
                    onClick={() => handleAction(teams[0].id, 'skip')}
                    className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-rose-500 hover:scale-110 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all focus:outline-none"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <button 
                    onClick={() => handleAction(teams[0].id, 'request')}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/40 transition-all focus:outline-none"
                  >
                    <Heart className="w-7 h-7 fill-white" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
      
      {!noMoreTeams && teams.length > 0 && (
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-500 text-sm">
          <Info className="w-4 h-4" /> Tap X to skip, Heart to send a join request
        </div>
      )}
    </div>
  );
}
