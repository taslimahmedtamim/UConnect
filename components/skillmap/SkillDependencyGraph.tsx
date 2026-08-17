"use client";

import React from 'react';
import { Target, CheckCircle2, Lock, Zap } from 'lucide-react';

export default function SkillDependencyGraph({
  roadmap,
  completedTasks
}: {
  roadmap: any;
  completedTasks: string[];
}) {
  if (!roadmap?.roadmap) return null;

  const phases = roadmap.roadmap;

  // Determine status of each phase
  const getPhaseStatus = (phase: any) => {
    if (!phase.actionItems) return 'locked';
    const total = phase.actionItems.length;
    let completed = 0;
    phase.actionItems.forEach((t: any) => {
      if (completedTasks.includes(t.taskId)) completed++;
    });
    
    if (completed === 0) return 'locked';
    if (completed === total) return 'completed';
    return 'in-progress';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
      <div className="min-w-[600px] py-4">
        <div className="flex items-center justify-between relative">
          
          {/* Connecting Line Background */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full" />

          {/* Iterate over phases */}
          {phases.map((phase: any, index: number) => {
            const status = getPhaseStatus(phase);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in-progress';
            const isLocked = status === 'locked';

            return (
              <div key={index} className="relative z-10 flex flex-col items-center group w-32 shrink-0">
                
                {/* Node */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md border-2
                  ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-600 dark:text-emerald-400' : ''}
                  ${isInProgress ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400 scale-110 shadow-blue-500/20' : ''}
                  ${isLocked ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400' : ''}
                `}>
                  {isCompleted && <CheckCircle2 className="w-8 h-8" />}
                  {isInProgress && <Zap className="w-8 h-8" />}
                  {isLocked && <Lock className="w-6 h-6" />}
                </div>

                {/* Info */}
                <div className="text-center mt-4">
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isInProgress ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                    Phase {index + 1}
                  </p>
                  <p className={`text-sm font-semibold truncate w-32 px-2 ${isLocked ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {phase.title}
                  </p>
                </div>
                
                {/* Connecting Line Progress Overlay */}
                {index < phases.length - 1 && (
                  <div className={`absolute top-8 left-[50%] w-[100%] h-1 -translate-y-1/2 -z-10 transition-all duration-1000
                    ${isCompleted ? 'bg-emerald-500' : 'bg-transparent'}
                  `} />
                )}
              </div>
            );
          })}

          {/* Goal Node */}
          <div className="relative z-10 flex flex-col items-center w-32 shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 border-4 border-white dark:border-slate-900">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-center mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">
                Goal
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate w-32 px-2">
                {roadmap.targetRole || "Career Role"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
