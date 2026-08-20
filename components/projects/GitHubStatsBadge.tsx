"use client";

import { useEffect, useState } from "react";
import { GitCommit, Star, GitFork, Loader2 } from "lucide-react";

interface GitHubStats {
  commits: number;
  stars: number;
  forks: number;
  languages?: string[];
  contributors?: {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
  }[];
}

export default function GitHubStatsBadge({ repoUrl }: { repoUrl: string }) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!repoUrl) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/github/repo-stats?url=${encodeURIComponent(repoUrl)}`);
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
  }, [repoUrl]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
        <Loader2 className="w-3 h-3 animate-spin" /> Fetching GitHub stats...
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300" title="Commits">
          <GitCommit className="w-3.5 h-3.5 text-blue-500" />
          {stats.commits}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300" title="Stars">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          {stats.stars}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300" title="Forks">
          <GitFork className="w-3.5 h-3.5 text-emerald-500" />
          {stats.forks}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-1">
        {stats.contributors && stats.contributors.length > 0 ? (
          <div className="flex items-center gap-1.5" title={`Top Contributor: ${stats.contributors[0].login}`}>
            <img src={stats.contributors[0].avatar_url} alt={stats.contributors[0].login} className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-none truncate max-w-[80px]">
                {stats.contributors[0].login}
              </span>
              <span className="text-[9px] text-slate-500 leading-none mt-0.5">Top Contributor</span>
            </div>
          </div>
        ) : (
          <div className="text-[10px] text-slate-400">No contributors</div>
        )}

        {stats.languages && stats.languages.length > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md" title="Primary Technology">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {stats.languages[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
