"use client";

import React, { useMemo } from 'react';
import { Target, Trophy, Briefcase, GraduationCap, Code } from 'lucide-react';

export default function CareerProgressCard({ user }: { user: any }) {
  const stats = useMemo(() => {
    if (!user) return { score: 0, skills: 0, projects: 0, certs: 0, experience: 0 };
    
    // Fallbacks for JSON arrays which might be null/undefined or actual arrays
    const skillsCount = Array.isArray(user.skills) ? user.skills.length : 0;
    const projectsCount = Array.isArray(user.projects) ? user.projects.length : 0;
    const certsCount = Array.isArray(user.certificates) ? user.certificates.length : 0;
    const experienceCount = Array.isArray(user.experience) ? user.experience.length : 0;

    // Calculate a Career Readiness Score based on available data
    // Weighted model: Skills 30%, Projects 30%, Experience 25%, Certifications 15%
    // We assume maximum "readiness" caps out at 20 skills, 5 projects, 3 experiences, 3 certs for this calculation.
    
    const skillsScore = Math.min(skillsCount / 20, 1) * 30;
    const projectsScore = Math.min(projectsCount / 5, 1) * 30;
    const expScore = Math.min(experienceCount / 3, 1) * 25;
    const certsScore = Math.min(certsCount / 3, 1) * 15;

    const totalScore = Math.round(skillsScore + projectsScore + expScore + certsScore);

    return {
      score: totalScore,
      skills: skillsCount,
      projects: projectsCount,
      certs: certsCount,
      experience: experienceCount
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Career Readiness</h2>
          <p className="text-sm text-slate-500">Estimated platform metric</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.score}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out" 
            style={{ width: `${stats.score}%` }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex flex-col items-center text-center">
          <Code className="w-5 h-5 text-emerald-500 mb-1" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.skills}</span>
          <span className="text-xs font-medium text-slate-500">Skills</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex flex-col items-center text-center">
          <Briefcase className="w-5 h-5 text-purple-500 mb-1" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.projects}</span>
          <span className="text-xs font-medium text-slate-500">Projects</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex flex-col items-center text-center">
          <Trophy className="w-5 h-5 text-amber-500 mb-1" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.experience}</span>
          <span className="text-xs font-medium text-slate-500">Experiences</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex flex-col items-center text-center">
          <GraduationCap className="w-5 h-5 text-blue-500 mb-1" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.certs}</span>
          <span className="text-xs font-medium text-slate-500">Certificates</span>
        </div>
      </div>
    </div>
  );
}
