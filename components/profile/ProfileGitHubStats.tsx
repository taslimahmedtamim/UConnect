"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, FileCode2, ExternalLink, Loader2, AlertCircle } from "lucide-react";

interface UserStats {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  top_languages?: string[];
}

export default function ProfileGitHubStats({ username, onSyncSkills }: { username: string, onSyncSkills?: (languages: string[]) => void }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/github/user-stats?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex justify-center items-center h-32">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return null; // Fail silently or could show an error state
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-3xl shadow-lg border border-slate-700 p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <img src={stats.avatar_url} alt={stats.login} className="w-14 h-14 rounded-full border-2 border-slate-700" />
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              GitHub Profile
            </h2>
            <a href={stats.html_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-1">
              @{stats.login} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 mb-6">
        <div className="bg-slate-800/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
          <BookOpen className="w-5 h-5 text-emerald-400 mb-2" />
          <span className="text-2xl font-black text-white">{stats.public_repos}</span>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Repositories</span>
        </div>
        
        <div className="bg-slate-800/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
          <Users className="w-5 h-5 text-blue-400 mb-2" />
          <span className="text-2xl font-black text-white">{stats.followers}</span>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Followers</span>
        </div>
        
        <div className="bg-slate-800/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
          <Users className="w-5 h-5 text-purple-400 mb-2" />
          <span className="text-2xl font-black text-white">{stats.following}</span>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Following</span>
        </div>
        
        <div className="bg-slate-800/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
          <FileCode2 className="w-5 h-5 text-amber-400 mb-2" />
          <span className="text-2xl font-black text-white">{stats.public_gists}</span>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Gists</span>
        </div>
      </div>

      {stats.top_languages && stats.top_languages.length > 0 && (
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Top Languages</h3>
            {onSyncSkills && (
              <button 
                onClick={() => onSyncSkills(stats.top_languages || [])}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50 px-2 py-1 rounded transition-colors"
                title="Add these to your Profile Skills"
              >
                + Add to Skills
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.top_languages.map((lang, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold shadow-sm">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
