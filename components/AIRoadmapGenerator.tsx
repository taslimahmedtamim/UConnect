"use client";

import React, { useState } from 'react';
import { Sparkles, Calendar, CheckSquare, Square, Rocket, BookOpen, Clock, ArrowRight } from 'lucide-react';

export default function AIRoadmapGenerator() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/skillmap/ai-roadmap', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setRoadmap(json.roadmap);
      } else {
        alert(json.message || 'Failed to generate AI roadmap');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating roadmap');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (key: string) => {
    setCompletedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini AI
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">Personalized AI Skill Roadmap</h3>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            Generate an adaptive step-by-step learning plan tailored specifically to your target career path and current skill level.
          </p>
        </div>

        <button
          onClick={generateRoadmap}
          disabled={loading}
          className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-75"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-blue-600" />
              {roadmap ? 'Regenerate AI Plan' : 'Generate AI Learning Plan'}
            </>
          )}
        </button>
      </div>

      {/* Roadmap Output */}
      {roadmap && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Target Role Curriculum
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{roadmap.targetRole}</h4>
              <p className="text-xs text-slate-500 mt-1">{roadmap.overview}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-blue-600" />
                Est. {roadmap.estimatedWeeks} Weeks
              </div>
            </div>
          </div>

          {/* Phase Cards */}
          <div className="space-y-4">
            {roadmap.phases?.map((phase: any, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/20">
                      {phase.phase}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{phase.title}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {phase.duration}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {phase.skillsToFocus?.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-4">{phase.objective}</p>

                {/* Action Items List */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wider">
                    Key Action Items:
                  </span>
                  {phase.actionItems?.map((item: string, i: number) => {
                    const key = `${phase.phase}-${i}`;
                    const isChecked = !!completedItems[key];
                    return (
                      <div
                        key={i}
                        onClick={() => toggleItem(key)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50/60 dark:bg-emerald-900/20 text-slate-500 line-through'
                            : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-xs font-medium">{item}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Recommended Project Box */}
                {phase.recommendedProject && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/70 border border-blue-100 dark:border-slate-700 flex items-start gap-3">
                    <Rocket className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Recommended Mini-Project:</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{phase.recommendedProject}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Resources */}
          {roadmap.recommendedResources?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-blue-600" /> Curated Learning Resources
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roadmap.recommendedResources.map((res: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">{res.type}</span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{res.title}</h5>
                    <p className="text-xs text-slate-500 mt-1">{res.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
