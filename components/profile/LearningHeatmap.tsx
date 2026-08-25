"use client";

import React, { useMemo } from 'react';

interface LearningHeatmapProps {
  activityLog?: Record<string, number>;
}

export default function LearningHeatmap({ activityLog = {} }: LearningHeatmapProps) {
  // Generate the last 364 days to make it exactly 52 weeks * 7 days
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    // Ensure we end on today
    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      arr.push(d);
    }
    return arr;
  }, []);

  const getColorClass = (count: number) => {
    if (!count || count === 0) return "bg-slate-100 dark:bg-slate-800";
    if (count === 1) return "bg-emerald-200 dark:bg-emerald-900/40";
    if (count === 2) return "bg-emerald-300 dark:bg-emerald-700/60";
    if (count === 3) return "bg-emerald-400 dark:bg-emerald-600/80";
    return "bg-emerald-500 dark:bg-emerald-500";
  };

  // Group by weeks (columns of 7)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Figure out month labels
  const monthLabels: { label: string; colIndex: number }[] = [];
  let currentMonth = -1;
  weeks.forEach((week, wIdx) => {
    // Check the first day of the week
    const firstDay = week[0];
    if (firstDay && firstDay.getMonth() !== currentMonth) {
      currentMonth = firstDay.getMonth();
      const monthStr = firstDay.toLocaleString('default', { month: 'short' });
      // Avoid placing a label too close to the very start if it's a partial month
      if (wIdx > 0 || firstDay.getDate() <= 14) {
        monthLabels.push({ label: monthStr, colIndex: wIdx });
      }
    }
  });

  // Calculate some quick stats
  const totalCommits = Object.values(activityLog).reduce((acc, curr) => acc + (curr || 0), 0);
  
  // Max streak
  let currentStreak = 0;
  let maxStreak = 0;
  let todayCount = 0;
  
  for (let i = days.length - 1; i >= 0; i--) {
    const dateStr = days[i].toISOString().split('T')[0];
    const count = activityLog[dateStr] || 0;
    
    if (i === days.length - 1) {
      todayCount = count;
    }

    if (count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (i !== days.length - 1 || count === 0) {
      break;
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Everyday Learning
          </h2>
          <p className="text-sm text-slate-500">Track your daily learning progress and build a streak.</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider">Total</span>
            <span className="font-bold text-slate-900 dark:text-white">{totalCommits}</span>
          </div>
          <div className="text-right">
            <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider">Streak</span>
            <span className="font-bold text-emerald-500">{currentStreak} days</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="inline-flex flex-col gap-2 min-w-max">
          {/* Month Labels Row */}
          <div className="flex relative h-5 text-xs text-slate-500 font-medium">
            {monthLabels.map((m, idx) => (
              <div 
                key={idx} 
                className="absolute" 
                style={{ left: `calc(${m.colIndex} * (12px + 4px))` }} // 12px box + 4px gap approx
              >
                {m.label}
              </div>
            ))}
          </div>
          
          {/* Heatmap Grid */}
          <div className="flex gap-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const count = activityLog[dateStr] || 0;
                  return (
                    <div
                      key={dIdx}
                      className={`w-3 h-3 sm:w-3 h-3 rounded-sm ${getColorClass(count)} transition-colors hover:ring-2 hover:ring-slate-400 dark:hover:ring-slate-500`}
                      title={`${dateStr}: ${count} activities`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-2 text-xs text-slate-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700/60"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600/80"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500"></div>
        <span>More</span>
      </div>
    </div>
  );
}
