"use client";

import React from 'react';
import Link from 'next/link';
import { Crown, Trophy, Award, Zap, CheckCircle2 } from 'lucide-react';

type UserRank = {
  id: string;
  fullName: string;
  username: string;
  role: string;
  profileImage?: string | null;
  university?: string | null;
  uPoints: number;
  tier: string;
  badge: string;
  topSkills: string[];
};

type Props = {
  topThree: UserRank[];
};

export default function LeaderboardPodium({ topThree }: Props) {
  if (!topThree || topThree.length === 0) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

  return (
    <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />

      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4 fill-amber-400" /> Hall of Fame
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Top UConnect Champions</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Highest Rep earners based on peer task reviews and team contributions.
        </p>
      </div>

      {/* 3D Podium Layout */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-3xl mx-auto pt-8 pb-4 relative z-10">
        {/* 2nd Place (Left) */}
        {second ? (
          <div className="flex flex-col items-center group">
            <div className="relative mb-3 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-300 to-slate-100 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                {second.profileImage ? (
                  <img src={second.profileImage} alt={second.fullName} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-slate-800 flex items-center justify-center font-extrabold text-slate-200 text-lg">
                    {getInitials(second.fullName)}
                  </div>
                )}
              </div>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-900 font-black text-xs px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Award className="w-3 h-3 text-slate-900" /> #2
              </span>
            </div>

            <div className="text-center mb-2">
              <h4 className="font-extrabold text-sm sm:text-base truncate max-w-[110px] sm:max-w-[140px] text-white">
                {second.fullName}
              </h4>
              <span className="text-[11px] text-slate-400 font-semibold block truncate max-w-[110px]">
                {second.uPoints.toLocaleString()} Rep
              </span>
            </div>

            {/* Podium Stand 2 */}
            <div className="w-full h-24 sm:h-32 bg-gradient-to-b from-slate-700/60 to-slate-800/80 border-t-2 border-slate-400/50 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-inner">
              <span className="text-2xl font-black text-slate-300">2ND</span>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">SILVER</span>
            </div>
          </div>
        ) : <div />}

        {/* 1st Place (Center - Elevated) */}
        {first ? (
          <div className="flex flex-col items-center group -mt-6">
            <Crown className="w-8 h-8 text-amber-400 animate-bounce mx-auto mb-3 drop-shadow-md z-20" />
            <div className="relative mb-3 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 p-1 shadow-xl group-hover:scale-105 transition-transform ring-4 ring-amber-400/30">
                {first.profileImage ? (
                  <img src={first.profileImage} alt={first.fullName} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center font-black text-amber-400 text-xl">
                    {getInitials(first.fullName)}
                  </div>
                )}
              </div>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 font-black text-xs px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1 z-20">
                <Trophy className="w-3 h-3 text-slate-900 fill-slate-900" /> #1
              </span>
            </div>

            <div className="text-center mb-2">
              <h4 className="font-black text-base sm:text-lg truncate max-w-[130px] sm:max-w-[160px] text-amber-300">
                {first.fullName}
              </h4>
              <span className="text-xs font-bold text-amber-400/90 block">
                {first.uPoints.toLocaleString()} Rep
              </span>
            </div>

            {/* Podium Stand 1 */}
            <div className="w-full h-32 sm:h-40 bg-gradient-to-b from-amber-500/30 to-amber-900/40 border-t-4 border-amber-400 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-2xl">
              <span className="text-3xl font-black text-amber-300">1ST</span>
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-widest">CHAMPION</span>
            </div>
          </div>
        ) : <div />}

        {/* 3rd Place (Right) */}
        {third ? (
          <div className="flex flex-col items-center group">
            <div className="relative mb-3 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-600 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                {third.profileImage ? (
                  <img src={third.profileImage} alt={third.fullName} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-slate-800 flex items-center justify-center font-extrabold text-amber-500 text-lg">
                    {getInitials(third.fullName)}
                  </div>
                )}
              </div>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Award className="w-3 h-3 text-white" /> #3
              </span>
            </div>

            <div className="text-center mb-2">
              <h4 className="font-extrabold text-sm sm:text-base truncate max-w-[110px] sm:max-w-[140px] text-white">
                {third.fullName}
              </h4>
              <span className="text-[11px] text-slate-400 font-semibold block truncate max-w-[110px]">
                {third.uPoints.toLocaleString()} Rep
              </span>
            </div>

            {/* Podium Stand 3 */}
            <div className="w-full h-20 sm:h-28 bg-gradient-to-b from-amber-900/40 to-slate-800/80 border-t-2 border-amber-600/50 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-inner">
              <span className="text-2xl font-black text-amber-600">3RD</span>
              <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">BRONZE</span>
            </div>
          </div>
        ) : <div />}
      </div>
    </div>
  );
}
