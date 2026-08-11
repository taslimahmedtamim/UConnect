"use client";

import React, { useState } from 'react';
import { BookOpen, ExternalLink, PlayCircle, Code2, Users, Sparkles, Search, GraduationCap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
  skills: any[];
};

export default function LearningHubTab({ skills }: Props) {
  const [selectedSkillName, setSelectedSkillName] = useState(skills[0]?.name || 'React');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const lower = selectedSkillName.toLowerCase();

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
    return `https://devdocs.io/#q=${encodeURIComponent(selectedSkillName)}`;
  };

  const getTutorialUrl = () => `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(selectedSkillName)}`;
  const getYouTubeUrl = () => `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedSkillName + ' tutorial for beginners full course')}`;

  const getProjectIdea = () => {
    if (lower.includes('react') || lower.includes('vue') || lower.includes('next')) {
      return 'Build a real-time collaborative dashboard or Kanban board with theme customization and state persistence.';
    }
    if (lower.includes('node') || lower.includes('express') || lower.includes('django') || lower.includes('python')) {
      return 'Architect a RESTful microservice API with JWT auth, rate limiting, and relational database queries.';
    }
    if (lower.includes('docker') || lower.includes('kubernetes') || lower.includes('devops')) {
      return 'Containerize a full-stack web application with Docker Compose and automated GitHub Actions CI/CD.';
    }
    if (lower.includes('data') || lower.includes('machine') || lower.includes('python')) {
      return 'Perform data cleaning, exploratory analysis (EDA), and train a supervised machine learning model.';
    }
    if (lower.includes('security') || lower.includes('wazuh')) {
      return 'Set up a SOC SIEM log analysis server using Wazuh/Elastic and author custom threat detection rules.';
    }
    return `Build a full portfolio project demonstrating advanced production patterns in ${selectedSkillName}.`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">UConnect Skill Learning Hub</span>
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Self-Paced Learning & Documentation Center
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Select any technical skill below to access official documentation, free interactive courses, video playlists, practice project blueprints, and mentor help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Skill Selector */}
        <div className="lg:col-span-1 space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm h-fit">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search skill to learn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1 max-h-[420px] overflow-y-auto no-scrollbar pt-1">
            {filteredSkills.map((s) => {
              const isSelected = s.name === selectedSkillName;
              return (
                <button
                  key={s.id || s.name}
                  onClick={() => setSelectedSkillName(s.name)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{s.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {s.category || 'Skill'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Skill Resource Center */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Resource Hub
                </span>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{selectedSkillName}</h4>
              </div>

              <a
                href={getDocUrl()}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                Official Docs <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Resource Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Official Docs */}
              <a
                href={getDocUrl()}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 hover:border-blue-500 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors">
                      Official Documentation & API
                    </h5>
                    <span className="text-[11px] text-slate-500">Core reference guide</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Read official manuals, API specifications, and standard syntax guides for {selectedSkillName}.
                </p>
              </a>

              {/* Card 2: Interactive Tutorials */}
              <a
                href={getTutorialUrl()}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 hover:border-emerald-500 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 transition-colors">
                      Free Interactive Courses
                    </h5>
                    <span className="text-[11px] text-slate-500">FreeCodeCamp & Community</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Step-by-step articles, hands-on code sandboxes, and beginner-to-advanced learning tracks.
                </p>
              </a>

              {/* Card 3: Video Tutorials */}
              <a
                href={getYouTubeUrl()}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 hover:border-red-500 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-red-600 transition-colors">
                      Video Crash Courses
                    </h5>
                    <span className="text-[11px] text-slate-500">YouTube Video Playlists</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Full-length video courses, code-alongs, and architectural walkthroughs.
                </p>
              </a>

              {/* Card 4: Peer Mentorship */}
              <Link
                href="/mentors"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 hover:border-purple-500 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-purple-600 transition-colors">
                      UConnect Mentors
                    </h5>
                    <span className="text-[11px] text-slate-500">1-on-1 Peer Mentorship</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Connect with verified community mentors who specialize in {selectedSkillName}.
                </p>
              </Link>
            </div>

            {/* Practice Project Box */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/70 border border-blue-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-1.5 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold uppercase tracking-wider">Hands-On Practice Project Blueprint</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                {getProjectIdea()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
