"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Trophy, Award, CheckCircle2, ExternalLink, Shield, Zap, Crown } from 'lucide-react';

type UserRank = {
  id: string;
  fullName: string;
  username: string;
  role: string;
  profileImage?: string | null;
  university?: string | null;
  department?: string | null;
  totalXp: number;
  tier: string;
  badge: string;
  topSkills: string[];
  totalEndorsements?: number;
  projectCount?: number;
};

type Props = {
  users: UserRank[];
  startIndex?: number;
};

export default function LeaderboardTable({ users, startIndex = 3 }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.university || '').toLowerCase().includes(q)
    );
  });

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter ranked users by name or university..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white shadow-sm"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4 w-16 text-center">Rank</th>
                <th className="p-4">Developer Profile</th>
                <th className="p-4">Top Skills</th>
                <th className="p-4 text-center">Tier</th>
                <th className="p-4 text-right">UConnect XP</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map((user, idx) => {
                const rankNumber = startIndex + idx + 1;
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Rank Badge */}
                    <td className="p-4 text-center font-extrabold text-slate-500 dark:text-slate-400">
                      #{rankNumber}
                    </td>

                    {/* User Profile */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-sm">
                            {getInitials(user.fullName)}
                          </div>
                        )}

                        <div className="flex flex-col">
                          <Link
                            href={`/u/${user.username}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                          >
                            {user.fullName}
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          </Link>
                          <span className="text-[11px] text-slate-500">
                            {user.university}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Top Skills */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {user.topSkills?.map((sk, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {sk}
                          </span>
                        ))}
                        {(!user.topSkills || user.topSkills.length === 0) && (
                          <span className="text-[11px] text-slate-400 italic">No skills listed</span>
                        )}
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="p-4 text-center">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {user.badge} {user.tier}
                      </span>
                    </td>

                    {/* XP Score */}
                    <td className="p-4 text-right font-black text-sm text-blue-600 dark:text-blue-400">
                      {user.totalXp.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No ranked users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
