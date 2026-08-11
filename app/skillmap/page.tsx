"use client";

import React from 'react';
import { Layers } from 'lucide-react';
import AIRoadmapGenerator from '@/components/AIRoadmapGenerator';

export default function SkillMapPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-wrap md:flex-nowrap items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
              U-SkillMap <span className="text-blue-600">.</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive skill matrix, target career gap analysis, and Gemini AI learning roadmap.
          </p>
        </div>
      </div>

      {/* AI Roadmap Generator */}
      <div>
        <AIRoadmapGenerator />
      </div>
    </div>
  );
}
