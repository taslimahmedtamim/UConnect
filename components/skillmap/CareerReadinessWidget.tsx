"use client";

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CareerReadinessWidget({
  roadmap,
  completedTasks
}: {
  roadmap: any;
  completedTasks: string[];
}) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [totalSkills, setTotalSkills] = useState(0);
  const [completedSkills, setCompletedSkills] = useState(0);

  useEffect(() => {
    if (!roadmap?.roadmap) return;
    
    let total = 0;
    let completed = 0;

    roadmap.roadmap.forEach((phase: any) => {
      phase.actionItems?.forEach((task: any) => {
        total++;
        if (completedTasks.includes(task.taskId)) {
          completed++;
        }
      });
    });

    setTotalSkills(total);
    setCompletedSkills(completed);
    setScore(total > 0 ? Math.round((completed / total) * 100) : 0);
  }, [roadmap, completedTasks]);

  if (!roadmap) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-8 items-center">
        
        {/* Circular Progress */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="currentColor" 
              className="text-blue-600 dark:text-blue-500 transition-all duration-1000 ease-out" 
              strokeWidth="8" 
              strokeDasharray={`${2 * Math.PI * 45}`} 
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}`} 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{score}%</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ready</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" /> 
            {roadmap.targetRole} Readiness
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            You've mastered {completedSkills} out of {totalSkills} core skills required for this role. Complete the roadmap to reach 100% and start applying!
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button 
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> View Profile
            </button>
            <button 
              onClick={() => router.push('/resume')}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-blue-500" /> Update U-Resume
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
