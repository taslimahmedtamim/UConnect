"use client";

import React from 'react';
import { CalendarDays, PlayCircle, Trophy, CheckCircle2 } from 'lucide-react';

export default function DailyPlanWidget({
  roadmap,
  completedTasks,
  onStartTask
}: {
  roadmap: any;
  completedTasks: string[];
  onStartTask: (taskId: string) => void;
}) {
  if (!roadmap?.roadmap) return null;

  // Find the next available task
  let nextTask: any = null;
  let currentPhaseTitle = '';

  for (const phase of roadmap.roadmap) {
    if (!phase.actionItems) continue;
    const incompleteTask = phase.actionItems.find((t: any) => !completedTasks.includes(t.taskId));
    if (incompleteTask) {
      nextTask = incompleteTask;
      currentPhaseTitle = phase.title;
      break;
    }
  }

  // Calculate learning streak (mocked for now, but could be pulled from DB)
  const streak = 3; 

  if (!nextTask) {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-emerald-200" /> You're all caught up!
          </h3>
          <p className="text-emerald-100 text-sm">You have completed all tasks in this roadmap.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-br-full pointer-events-none" />
      
      <div className="relative z-10 flex-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold mb-4">
          <CalendarDays className="w-3.5 h-3.5" /> Today's Learning Goal
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {nextTask.task}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Up next from <span className="font-semibold text-slate-700 dark:text-slate-300">{currentPhaseTitle}</span>
        </p>
        
        <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-amber-500" /> {streak} Day Streak</span>
          <span>•</span>
          <span>Est: {nextTask.estimatedTime}</span>
        </div>
      </div>

      <button 
        onClick={() => onStartTask(nextTask.taskId)}
        className="relative z-10 w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
      >
        <PlayCircle className="w-5 h-5" /> Start Learning
      </button>
    </div>
  );
}
