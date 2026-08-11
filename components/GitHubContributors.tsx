"use client";

import React, { useEffect, useState } from 'react';
import { Heart, Users } from 'lucide-react';

export type Contributor = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
};

function ContributorAvatar({ contributor }: { contributor: Contributor }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={contributor.html_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`GitHub profile of ${contributor.login}`}
      title={`${contributor.login} (${contributor.contributions} ${contributor.contributions === 1 ? 'commit' : 'commits'})`}
      className="relative group transition-transform hover:scale-115 hover:z-10 focus:outline-none"
    >
      {!imgError ? (
        <img
          src={contributor.avatar_url}
          alt={contributor.login}
          onError={() => setImgError(true)}
          className="w-7 h-7 rounded-full object-cover border-2 border-slate-900 group-hover:border-blue-500 shadow-sm transition-all"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center border-2 border-slate-900 group-hover:border-blue-500 shadow-sm">
          {contributor.login[0]?.toUpperCase()}
        </div>
      )}
    </a>
  );
}

export default function GitHubContributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await fetch('/api/github/contributors');
        const json = await res.json();
        if (json.success && Array.isArray(json.contributors)) {
          setContributors(json.contributors);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 animate-pulse text-slate-500 text-xs">
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        <span>Built with love by</span>
        <div className="flex -space-x-2 overflow-hidden ml-1">
          <div className="w-6 h-6 rounded-full bg-slate-800" />
          <div className="w-6 h-6 rounded-full bg-slate-800" />
          <div className="w-6 h-6 rounded-full bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!contributors || contributors.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
        <span>Crafted with</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        <span>for next-gen university tech talent.</span>
      </div>
    );
  }

  const topContributors = contributors.slice(0, 5);
  const remainingCount = contributors.length - 5;
  const displayedContributors = showAll ? contributors : topContributors;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-slate-400">
      <div className="flex items-center gap-1.5 shrink-0">
        <span>Built with</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
        <span>by</span>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        <div className="flex -space-x-2 overflow-hidden items-center p-0.5">
          {displayedContributors.map((c) => (
            <ContributorAvatar key={c.id} contributor={c} />
          ))}
        </div>

        {remainingCount > 0 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[10px] font-extrabold transition-all border border-slate-700 ml-1"
            title={`View all ${contributors.length} contributors`}
          >
            +{remainingCount} contributors
          </button>
        )}

        {showAll && remainingCount > 0 && (
          <button
            onClick={() => setShowAll(false)}
            className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-extrabold transition-all border border-slate-700 ml-1"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
}
