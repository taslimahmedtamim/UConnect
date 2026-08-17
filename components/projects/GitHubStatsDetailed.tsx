"use client";

import { useEffect, useState } from "react";
import { GitCommit, Star, GitFork, AlertCircle, Loader2, GitPullRequest, Code2, Users } from "lucide-react";

interface GitHubStats {
  commits: number;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  languages: string[];
  contributors?: {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
  }[];
}

export default function GitHubStatsDetailed({ repoUrl }: { repoUrl: string }) {
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
      <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin mr-2" />
        <span className="text-slate-500 text-sm">Fetching live GitHub stats...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-800/50 text-sm">
        <AlertCircle className="w-4 h-4" /> Failed to load GitHub stats. Is the repository public?
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-slate-500" /> Live GitHub Contributions
        </h3>
        <a href={repoUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          View Repository
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-200 dark:divide-slate-800">
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <GitCommit className="w-5 h-5 text-blue-500 mb-2" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.commits}</span>
          <span className="text-xs text-slate-500 uppercase font-semibold">Commits</span>
        </div>
        
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <Star className="w-5 h-5 text-amber-500 mb-2" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.stars}</span>
          <span className="text-xs text-slate-500 uppercase font-semibold">Stars</span>
        </div>
        
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <GitFork className="w-5 h-5 text-emerald-500 mb-2" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.forks}</span>
          <span className="text-xs text-slate-500 uppercase font-semibold">Forks</span>
        </div>
        
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-5 h-5 text-rose-500 mb-2" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.openIssues}</span>
          <span className="text-xs text-slate-500 uppercase font-semibold">Issues</span>
        </div>
      </div>

      {stats.languages && stats.languages.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Code2 className="w-4 h-4" /> Top Languages
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.languages.map((lang, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.contributors && stats.contributors.length > 0 && (
        <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Users className="w-4 h-4 text-indigo-500" /> Top Contributors
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.contributors.map((contrib, idx) => (
              <a 
                key={idx} 
                href={contrib.html_url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors group"
              >
                <img src={contrib.avatar_url} alt={contrib.login} className="w-6 h-6 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{contrib.login}</span>
                  <span className="text-[10px] text-slate-500">{contrib.contributions} commits</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
