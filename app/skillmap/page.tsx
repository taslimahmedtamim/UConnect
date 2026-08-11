"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Target, 
  Sparkles, 
  Users, 
  BarChart3, 
  Award, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  PlusCircle,
  BookOpen
} from 'lucide-react';
import SkillRadarChart from '@/components/SkillRadarChart';
import SkillMapMatrix from '@/components/SkillMapMatrix';
import CareerGapAnalysis from '@/components/CareerGapAnalysis';
import AIRoadmapGenerator from '@/components/AIRoadmapGenerator';
import SkillTeamMatcher from '@/components/SkillTeamMatcher';
import LearningHubTab from '@/components/LearningHubTab';

export default function SkillMapPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'matrix' | 'gap' | 'ai' | 'learning' | 'teams'>('overview');
  const [skills, setSkills] = useState<any[]>([]);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [userCareer, setUserCareer] = useState<any>(null);
  const [careerAnalysis, setCareerAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [sRes, uRes, ucRes] = await Promise.all([
        fetch('/api/skills'),
        fetch('/api/user-skills'),
        fetch('/api/user-career')
      ]);

      const sJson = await sRes.json();
      const uJson = await uRes.json();
      const ucJson = await ucRes.json();

      if (sJson.success) setSkills(sJson.skills || []);
      if (uJson.success) setUserSkills(uJson.userSkills || []);
      if (ucJson.success) {
        setUserCareer(ucJson.userCareer);
        setCareerAnalysis(ucJson.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute summary stats
  const totalTracked = userSkills.length;
  const avgLevel = totalTracked > 0
    ? (userSkills.reduce((acc, curr) => acc + (curr.level || 0), 0) / totalTracked).toFixed(1)
    : '0.0';

  const totalEndorsements = userSkills.reduce((acc, curr) => acc + (curr.endorsementCnt || 0), 0);
  const careerMatchScore = careerAnalysis?.matchPercentage || 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading U-SkillMap ecosystem...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              U-SkillMap <span className="text-blue-600">.</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive skill matrix, target career gap analysis, and Gemini AI learning roadmap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('ai')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            Generate AI Roadmap
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Skills Rated</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalTracked}</div>
          <div className="text-[11px] text-slate-500 mt-1">Out of {skills.length} available catalog skills</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Proficiency</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">Lvl {avgLevel}<span className="text-sm font-normal text-slate-400">/5</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Overall technical rating index</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Target Career Match</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{careerMatchScore}%</div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">
            {userCareer?.careerPath?.title || 'No target selected'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Peer Endorsements</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalEndorsements}</div>
          <div className="text-[11px] text-slate-500 mt-1">Verified skill endorsements</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Skill Radar & Overview', icon: BarChart3 },
            { id: 'matrix', label: 'Interactive Matrix & Ratings', icon: Layers },
            { id: 'gap', label: 'Target Career & Gap Analysis', icon: Target },
            { id: 'ai', label: 'Gemini AI Roadmap', icon: Sparkles },
            { id: 'learning', label: 'Skill Learning Hub', icon: BookOpen },
            { id: 'teams', label: 'Team & Career Matcher', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content Panels */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <SkillRadarChart userSkills={userSkills} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Highlight Box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Skill Summary & Recommendations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Your skill matrix is dynamically analyzed against software industry standards and active UConnect team projects.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-1">Top Rated Skills</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {userSkills
                        .filter((us) => us.level >= 3)
                        .map((us) => (
                          <span
                            key={us.id}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> {us.skill?.name} (Lvl {us.level})
                          </span>
                        ))}
                      {userSkills.filter((us) => us.level >= 3).length === 0 && (
                        <span className="text-xs text-slate-400">No skills rated L3 or above yet.</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1">Active Career Target</span>
                    {userCareer ? (
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{userCareer.careerPath?.title}</div>
                        <div className="text-xs text-slate-500 mt-1">Readiness Score: <span className="font-bold text-emerald-600">{careerMatchScore}%</span></div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveTab('gap')}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        Select a Target Career Track <PlusCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Matrix Preview */}
              <SkillMapMatrix skills={skills} userSkills={userSkills} onRefresh={loadData} />
            </div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <SkillMapMatrix skills={skills} userSkills={userSkills} onRefresh={loadData} />
        )}

        {activeTab === 'gap' && (
          <CareerGapAnalysis onCareerChange={loadData} />
        )}

        {activeTab === 'ai' && (
          <AIRoadmapGenerator />
        )}

        {activeTab === 'learning' && (
          <LearningHubTab skills={skills} />
        )}

        {activeTab === 'teams' && (
          <SkillTeamMatcher />
        )}
      </div>
    </div>
  );
}
