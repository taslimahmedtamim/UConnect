"use client";

import { useEffect, useState } from "react";
import { GitCommit, Star, GitFork, Loader2 } from "lucide-react";

interface GitHubStats {
  commits: number;
  stars: number;
  forks: number;
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
    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300" title="Commits">
        <GitCommit className="w-3.5 h-3.5 text-blue-500" />
        {stats.commits}
      </div>
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300" title="Stars">
        <Star className="w-3.5 h-3.5 text-amber-500" />
        {stats.stars}
      </div>
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300" title="Forks">
        <GitFork className="w-3.5 h-3.5 text-emerald-500" />
        {stats.forks}
      </div>
    </div>
  );
}
