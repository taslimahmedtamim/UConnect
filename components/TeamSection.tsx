"use client";

import React, { useState } from 'react';
import { Mail, Code2, Sparkles, GitBranch } from 'lucide-react';

export type TeamMember = {
  name: string;
  role: string;
  email: string;
  github: string;
  avatar: string;
  initials: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Taslim Ahmed Tamim",
    role: "Full Stack Developer",
    email: "taslimahmedtamim4u@gmail.com",
    github: "https://github.com/taslimahmedtamim",
    avatar: "https://github.com/taslimahmedtamim.png",
    initials: "TT",
  },
  {
    name: "Salman Kabir Sany",
    role: "Backend Developer",
    email: "salmankabirsany@gmail.com",
    github: "https://github.com/salmankabirsany",
    avatar: "https://github.com/salmankabirsany.png",
    initials: "SK",
  },
  {
    name: "Majharul Islam",
    role: "AI/ML Engineer",
    email: "majharul.cs@gmail.com",
    github: "https://github.com/MrMajharul",
    avatar: "https://github.com/MrMajharul.png",
    initials: "MI",
  },
];

function TeamMemberCard({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all flex flex-col items-center text-center group relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/20 transition-all pointer-events-none" />

      {/* Avatar Container with Image & Initials Fallback */}
      <div className="relative mb-4">
        {!imgError ? (
          <img
            src={member.avatar}
            alt={member.name}
            onError={() => setImgError(true)}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-500/20 dark:border-blue-400/30 group-hover:border-blue-500 shadow-md transition-all shrink-0"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl sm:text-2xl flex items-center justify-center border-4 border-blue-500/20 shadow-md shrink-0">
            {member.initials}
          </div>
        )}
      </div>

      {/* Member Details */}
      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {member.name}
      </h3>
      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-1 mb-4">
        <Code2 className="w-3 h-3" /> {member.role}
      </span>

      {/* Email & GitHub Links */}
      <div className="flex items-center justify-center gap-3 pt-2 w-full border-t border-slate-100 dark:border-slate-800/80">
        <a
          href={`mailto:${member.email}`}
          aria-label={`Email ${member.name}`}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm"
          title={`Send email to ${member.email}`}
        >
          <Mail className="w-4 h-4" />
        </a>

        <a
          href={member.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`GitHub profile of ${member.name}`}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all shadow-sm"
          title={`Visit ${member.name}'s GitHub Profile`}
        >
          <GitBranch className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-slate-50/50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200/50 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5 fill-blue-500" /> Core Engineering Team
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Meet the Builders Behind UConnect 2.0
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The full-stack developers and AI engineers driving innovation, skill mapping, and career matchmaking.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
