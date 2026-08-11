"use client";

import React from 'react';
import { X, Play, ExternalLink, Github, Star, Heart, Eye } from 'lucide-react';

type Props = {
  project: any | null;
  onClose: () => void;
};

export default function ProjectDemoModal({ project, onClose }: Props) {
  if (!project) return null;

  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
              {project.category}
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Graphic Frame */}
        <div className="relative rounded-2xl bg-slate-950 aspect-video flex flex-col items-center justify-center text-white overflow-hidden border border-slate-800 p-6 shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
            alt="Demo player"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center mx-auto shadow-xl ring-4 ring-blue-500/30">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
            <div className="font-extrabold text-sm text-white">Live Demo Simulation</div>
            <p className="text-xs text-slate-300 max-w-sm">
              Watch project architecture walk-through and live interactive feature showcase.
            </p>
          </div>
        </div>

        {/* Description & Links */}
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((t: string, i: number) => (
              <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">Author:</span>
              <span className="text-slate-600 dark:text-slate-400">{project.author.fullName}</span>
            </div>

            <div className="flex items-center gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Github className="w-4 h-4" /> Code Repo
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <ExternalLink className="w-4 h-4" /> Visit Live Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
