"use client";

import React from 'react';
import { Play, Trophy, Sparkles, ExternalLink, Code2 } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: any;
  repoUrl?: string | null;
  demoUrl?: string | null;
  likes: number;
  views: number;
  rating?: number;
  author: {
    id: string;
    fullName: string;
    username?: string | null;
    profileImage?: string | null;
    department?: string | null;
    university?: string | null;
  };
};

type Props = {
  project: Project;
  onWatchDemo: (project: Project) => void;
};

export default function FeaturedProjectHero({ project, onWatchDemo }: Props) {
  if (!project) return null;

  const tags = Array.isArray(project.tags) ? project.tags : [];
  const initials = project.author.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-2">
      {/* Left Details Panel (Gradient Background) */}
      <div className="bg-gradient-to-tr from-emerald-600 via-blue-600 to-indigo-600 p-8 sm:p-10 text-white flex flex-col justify-between space-y-6">
        <div>
          {/* Featured Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-extrabold mb-4 border border-white/20">
            <Trophy className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> Featured Project
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3 leading-tight">
            {project.title}
          </h2>

          <p className="text-sm text-blue-100/90 leading-relaxed max-w-xl line-clamp-3">
            {project.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            {tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-white/15 backdrop-blur-md text-white border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/20">
          {project.author.profileImage ? (
            <img
              src={project.author.profileImage}
              alt={project.author.fullName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center border-2 border-white/40 shadow-sm">
              {initials}
            </div>
          )}

          <div>
            <div className="font-extrabold text-sm text-white">{project.author.fullName}</div>
            <div className="text-[11px] text-blue-200">
              {project.author.department || project.author.university || 'Developer Community'}
            </div>
          </div>
        </div>
      </div>

      {/* Right Media Preview Panel */}
      <div className="relative min-h-[260px] bg-slate-900 flex items-center justify-center p-8 overflow-hidden group">
        {/* Background Circuit/Tech Overlay Image */}
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
          alt="Tech background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Watch Demo Play Button */}
        <button
          onClick={() => onWatchDemo(project)}
          className="relative z-10 px-6 py-3.5 bg-white text-slate-900 hover:bg-emerald-400 hover:text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-2xl transition-all flex items-center gap-2.5 group/btn"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center group-hover/btn:bg-slate-950 transition-colors">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
          <span>Watch Demo</span>
        </button>
      </div>
    </div>
  );
}
