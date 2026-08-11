"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, PlayCircle, Code2, Users, Sparkles, X, GraduationCap, ArrowUpRight } from 'lucide-react';

type SkillInfo = {
  name: string;
  category?: string | null;
  level?: number;
};

type Props = {
  skill: SkillInfo | null;
  onClose: () => void;
};

export default function SkillLearningModal({ skill, onClose }: Props) {
  if (!skill) return null;

  const skillName = skill.name;
  const lower = skillName.toLowerCase();

  // Generate curated learning links based on skill name
  const getDocUrl = () => {
    if (lower.includes('react')) return 'https://react.dev/learn';
    if (lower.includes('typescript')) return 'https://www.typescriptlang.org/docs/';
    if (lower.includes('javascript')) return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript';
    if (lower.includes('python')) return 'https://docs.python.org/3/tutorial/';
    if (lower.includes('docker')) return 'https://docs.docker.com/get-started/';
    if (lower.includes('kubernetes')) return 'https://kubernetes.io/docs/tutorials/';
    if (lower.includes('node')) return 'https://nodejs.org/en/docs/guides';
    if (lower.includes('sql') || lower.includes('postgres') || lower.includes('mysql')) return 'https://www.postgresql.org/docs/';
    if (lower.includes('mongo')) return 'https://www.mongodb.com/docs/manual/tutorial/';
    if (lower.includes('machine') || lower.includes('tensor') || lower.includes('pytorch')) return 'https://www.tensorflow.org/tutorials';
    if (lower.includes('wazuh') || lower.includes('security')) return 'https://documentation.wazuh.com/';
    if (lower.includes('css') || lower.includes('tailwind')) return 'https://tailwindcss.com/docs';
    return `https://devdocs.io/#q=${encodeURIComponent(skillName)}`;
  };

  const getTutorialUrl = () => {
    return `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skillName)}`;
  };

  const getYouTubeUrl = () => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' tutorial for beginners full course')}`;
  };

  const getProjectIdea = () => {
    if (lower.includes('react') || lower.includes('vue') || lower.includes('next')) {
      return 'Build a real-time dashboard or kanban board with dark mode and local persistence.';
    }
    if (lower.includes('node') || lower.includes('express') || lower.includes('django') || lower.includes('python')) {
      return 'Build a RESTful API with JWT authentication, role-based access, and database integration.';
    }
    if (lower.includes('docker') || lower.includes('kubernetes') || lower.includes('devops')) {
      return 'Containerize a multi-container app (Frontend + Backend + DB) with Docker Compose and CI/CD pipelines.';
    }
    if (lower.includes('data') || lower.includes('machine') || lower.includes('python')) {
      return 'Perform exploratory data analysis (EDA) and train a predictive model using Scikit-Learn or PyTorch.';
    }
    if (lower.includes('security') || lower.includes('wazuh')) {
      return 'Set up a local SIEM lab using Wazuh/Elastic and simulate log detection rules.';
    }
    return `Build a hands-on portfolio application incorporating ${skillName} best practices.`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Learning Hub & Resources
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Learn {skillName}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Curated documentation, courses, hands-on project ideas, and community mentors.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resources Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Recommended Learning Paths
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Official Docs */}
            <a
              href={getDocUrl()}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-blue-500 dark:hover:border-blue-400 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    Official Documentation
                  </div>
                  <div className="text-[10px] text-slate-500">Guides & API reference</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </a>

            {/* FreeCodeCamp / Interactive */}
            <a
              href={getTutorialUrl()}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Free Tutorials & Articles
                  </div>
                  <div className="text-[10px] text-slate-500">FreeCodeCamp & Dev guides</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </a>

            {/* YouTube Courses */}
            <a
              href={getYouTubeUrl()}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-red-500 dark:hover:border-red-400 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                  <PlayCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                    Video Crash Courses
                  </div>
                  <div className="text-[10px] text-slate-500">YouTube full tutorials</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
            </a>

            {/* Community Mentors */}
            <Link
              href="/mentors"
              onClick={onClose}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-purple-500 dark:hover:border-purple-400 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Ask UConnect Mentors
                  </div>
                  <div className="text-[10px] text-slate-500">Peer 1-on-1 mentorship</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Practice Project Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/70 border border-blue-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">Recommended Practice Project</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {getProjectIdea()}
          </p>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/teams"
            onClick={onClose}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" /> Join a Team project to practice {skillName}
          </Link>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
