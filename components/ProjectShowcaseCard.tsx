"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Heart, 
  Eye, 
  MessageSquare, 
  Gamepad2, 
  Bot, 
  Activity, 
  Cpu, 
  Sparkles, 
  Code2, 
  ExternalLink 
} from 'lucide-react';

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
  };
};

type Props = {
  project: Project;
  onLike?: (id: string) => void;
  onSelect?: (project: Project) => void;
};

export default function ProjectShowcaseCard({ project, onLike, onSelect }: Props) {
  const [likes, setLikes] = useState(project.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const tags = Array.isArray(project.tags) ? project.tags : [];
  const rating = project.rating || 4.8;

  const initials = project.author.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Category Icon & Theme Gradient Mapping matching reference image!
  const getTheme = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('web')) {
      return {
        bg: 'from-purple-600 to-indigo-600',
        icon: MessageSquare
      };
    }
    if (c.includes('mobile') || c.includes('health')) {
      return {
        bg: 'from-emerald-400 to-teal-500',
        icon: Activity
      };
    }
    if (c.includes('game')) {
      return {
        bg: 'from-pink-500 to-rose-500',
        icon: Gamepad2
      };
    }
    if (c.includes('ai') || c.includes('ml') || c.includes('bot')) {
      return {
        bg: 'from-cyan-400 to-blue-500',
        icon: Bot
      };
    }
    if (c.includes('iot')) {
      return {
        bg: 'from-amber-400 to-orange-500',
        icon: Cpu
      };
    }
    return {
      bg: 'from-blue-600 to-indigo-600',
      icon: Code2
    };
  };

  const theme = getTheme(project.category);
  const IconComponent = theme.icon;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      onLike?.(project.id);
    }
  };

  return (
    <div
      onClick={() => onSelect?.(project)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Colorful Gradient Header Cover with Icon */}
        <div className={`h-40 bg-gradient-to-tr ${theme.bg} flex items-center justify-center p-6 relative group-hover:scale-102 transition-transform duration-300`}>
          <IconComponent className="w-12 h-12 text-white/90 drop-shadow-md" />
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {project.title}
            </h3>

            <div className="flex items-center gap-1 text-amber-400 font-extrabold text-xs shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {rating.toFixed(1)}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {tags.slice(0, 3).map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info (Author + Likes & Views) */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          {project.author.profileImage ? (
            <img
              src={project.author.profileImage}
              alt={project.author.fullName}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              {initials}
            </div>
          )}

          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
            {project.author.fullName}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${hasLiked ? 'text-rose-500 font-bold' : ''}`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500' : ''}`} /> {likes}
          </button>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {project.views}
          </span>
        </div>
      </div>
    </div>
  );
}
