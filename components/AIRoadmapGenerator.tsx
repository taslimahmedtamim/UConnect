"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, CheckSquare, Square, Rocket, BookOpen, Clock, Target, CheckCircle2, Award } from 'lucide-react';

export default function AIRoadmapGenerator() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [topicInput, setTopicInput] = useState('');
  const [claiming, setClaiming] = useState(false);

  // Load saved progress when a roadmap is loaded
  useEffect(() => {
    if (roadmap?.targetRole) {
      const saved = localStorage.getItem(`roadmap_progress_${roadmap.targetRole}`);
      if (saved) {
        try {
          setCompletedItems(JSON.parse(saved));
        } catch(e) {}
      } else {
        setCompletedItems({});
      }
    }
  }, [roadmap]);

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/skillmap/ai-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicInput })
      });
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
    const nextState = { ...completedItems, [key]: !completedItems[key] };
    setCompletedItems(nextState);
    if (roadmap?.targetRole) {
      localStorage.setItem(`roadmap_progress_${roadmap.targetRole}`, JSON.stringify(nextState));
    }
  };

  const claimSkill = async () => {
    if (!roadmap?.targetRole) return;
    setClaiming(true);
    try {
      const profileRes = await fetch('/api/users/profile');
      const profileData = await profileRes.json();
      if (profileData.success) {
        const currentSkills = profileData.user.skills || [];
        if (!currentSkills.includes(roadmap.targetRole)) {
          currentSkills.push(roadmap.targetRole);
          const updateRes = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...profileData.user, skills: currentSkills })
          });
          if (updateRes.ok) {
            alert(`🎉 "${roadmap.targetRole}" has been added to your Profile Skills!`);
          } else {
            alert('Failed to update profile.');
          }
        } else {
          alert('This skill is already on your profile!');
        }
      }
    } catch (error) {
      console.error('Error claiming skill:', error);
      alert('Error adding skill to profile.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini AI
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">Personalized AI Learning Roadmap</h3>
          <p className="text-sm text-blue-100 mt-1 max-w-xl mb-4">
            Enter a specific field, role, or technology you want to learn. The AI will generate a highly sequential curriculum with free resources.
          </p>
          
          <div className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Target className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Full Stack Web3, Python Data Science..."
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full pl-9 pr-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-blue-200"
              />
            </div>
          </div>
        </div>

        <button
          onClick={generateRoadmap}
          disabled={loading || (!topicInput && !roadmap)} // allow generating if user has default target role? better to require input if no roadmap, but we let API fallback if empty
          className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-75 h-12"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-blue-600" />
              Generate Roadmap
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

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button 
                onClick={claimSkill} 
                disabled={claiming}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-emerald-600/20"
              >
                 <Award className="w-4 h-4" /> {claiming ? 'Adding...' : 'Add Skill to Profile'}
              </button>
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
                <div className="space-y-3 mb-6">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wider">
                    Key Action Items & Resources:
                  </span>
                  {phase.actionItems?.map((item: any, i: number) => {
                    const key = `${phase.phase}-${i}`;
                    const isChecked = !!completedItems[key];
                    return (
                      <div
                        key={i}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                          isChecked
                            ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/50'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <button onClick={() => toggleItem(key)} className="mt-0.5 shrink-0 hover:scale-110 transition-transform">
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                            )}
                          </button>
                          <div>
                            <span className={`text-sm font-semibold block ${isChecked ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                              {typeof item === 'string' ? item : item.task}
                            </span>
                            
                            {/* Inline Free Resource Link */}
                            {item.resourceUrl && !isChecked && (
                              <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-slate-500">Resource:</span>
                                <a href={item.resourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                                  {item.resourceTitle}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="pl-8 sm:pl-0">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${isChecked ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                             {isChecked ? 'Completed' : 'Pending'}
                           </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recommended Project Box */}
                {phase.recommendedProject && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/70 border border-blue-100 dark:border-slate-700 flex items-start gap-3 mt-4">
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
        </div>
      )}
    </div>
  );
}
