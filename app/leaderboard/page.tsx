"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, Zap, Award, FolderOpen, Crown, Star, Flame, Shield, ArrowUpRight, Search } from 'lucide-react';
import LeaderboardPodium from '@/components/LeaderboardPodium';
import LeaderboardTable from '@/components/LeaderboardTable';

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState<'overall' | 'skills' | 'endorsements' | 'projects'>('overall');
  const [leaderboards, setLeaderboards] = useState<any | null>(null);
  const [topProjects, setTopProjects] = useState<any[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const json = await res.json();
        if (json.success) {
          setLeaderboards(json.leaderboards);
          setTopProjects(json.topProjects || []);
          setCurrentUserRank(json.currentUserRank);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500">Calculating global Rep standings...</p>
      </div>
    );
  }

  const currentList: any[] = leaderboards?.[activeCategory] || [];
  
  // Apply Global Search Filter
  const filteredList = currentList.filter((u) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.university || '').toLowerCase().includes(q)
    );
  });

  const topThree = filteredList.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5 fill-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              UConnect Leaderboard <span className="text-amber-500">.</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gamified rankings based on verified skill levels, peer endorsements, and showcase projects.
          </p>
        </div>

        {/* Current User Rank Badge Banner */}
        {currentUserRank && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md font-black text-xl">
              #{currentUserRank.rank}
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 block">
                Your Current Rank
              </span>
              <div className="font-bold text-sm flex items-center gap-1.5">
                {currentUserRank.userData?.fullName}
                <span>{currentUserRank.userData?.badge}</span>
              </div>
              <div className="text-xs text-blue-100 font-semibold mt-0.5">
                {currentUserRank.userData?.uPoints?.toLocaleString()} Rep • {currentUserRank.userData?.tier}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'overall', label: 'Overall Rep', icon: Trophy },
            { id: 'skills', label: 'Skill Proficiency Ranks', icon: Zap },
            { id: 'endorsements', label: 'Most Endorsed Peers', icon: Award },
            { id: 'projects', label: 'Top Projects', icon: FolderOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Global Search Bar */}
      <div className="relative max-w-xl mx-auto md:mx-0">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search global ranks by name, username, or university..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white shadow-sm"
        />
      </div>

      {/* Top 3 Podium */}
      <LeaderboardPodium topThree={topThree} />

      {/* Full Standings Table / Projects List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" /> {searchTerm ? "Search Results" : (activeCategory === 'projects' ? 'Top Projects by Likes' : 'Full Standings')}
        </h3>
        
        {activeCategory === 'projects' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topProjects.filter(p => !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((project, idx) => (
              <div key={project.id} className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex gap-4">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center font-bold text-lg bg-amber-50 text-amber-600 rounded-lg border border-amber-200">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">{project.title}</h4>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{project.category}</span>
                    <span>By {project.author?.fullName}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {project.likes}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <LeaderboardTable 
            users={filteredList} 
            startIndex={0} 
          />
        )}
      </div>
    </div>
  );
}
