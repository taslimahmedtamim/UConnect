"use client";

import React, { useEffect, useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, Award, Briefcase, BookOpen } from 'lucide-react';
import SkillLearningModal from './SkillLearningModal';

type Props = {
  onCareerChange?: () => void;
};

export default function CareerGapAnalysis({ onCareerChange }: Props) {
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [userCareerData, setUserCareerData] = useState<any>(null);
  const [learningSkill, setLearningSkill] = useState<{ name: string; category?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchPathsAndAnalysis = async () => {
    try {
      const [cpRes, ucRes] = await Promise.all([
        fetch('/api/career-paths'),
        fetch('/api/user-career')
      ]);
      const cpJson = await cpRes.json();
      const ucJson = await ucRes.json();

      if (cpJson.success) setCareerPaths(cpJson.careerPaths || []);
      if (ucJson.success) setUserCareerData(ucJson);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPathsAndAnalysis();
  }, []);

  const handleSelectCareer = async (careerPathId: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/user-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careerPathId }),
      });
      const json = await res.json();
      if (json.success) {
        setUserCareerData(json);
        onCareerChange?.();
      } else {
        alert(json.message || 'Failed to select career path');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Career Gap Analysis...</div>;
  }

  const analysis = userCareerData?.analysis;
  const chosenPathId = userCareerData?.userCareer?.careerPathId;
  const matchScore = analysis?.matchPercentage || 0;

  return (
    <div className="space-y-8">
      {/* Target Path Selector Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" /> Choose Target Career Path
            </h3>
            <p className="text-xs text-slate-500">Select a career track to benchmark your skills and compute real-time skill gaps.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {careerPaths.map((cp) => {
            const isSelected = cp.id === chosenPathId;
            return (
              <div
                key={cp.id}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/5 dark:bg-blue-900/20 border-blue-600 dark:border-blue-500 shadow-md ring-1 ring-blue-600/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                onClick={() => !isSelected && handleSelectCareer(cp.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`p-2 rounded-xl text-xs font-bold ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    <Briefcase className="w-4 h-4" />
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white uppercase tracking-wider">
                      Active Target
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">{cp.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{cp.description}</p>

                <div className="text-[11px] font-medium text-slate-500">
                  {cp.skills?.length || 0} Key Required Skills
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Score & Gap Overview */}
      {analysis && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-6">
              {/* Circular Gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${
                      matchScore >= 80
                        ? 'text-emerald-500'
                        : matchScore >= 50
                        ? 'text-blue-600'
                        : 'text-amber-500'
                    } transition-all duration-700 ease-out`}
                    strokeDasharray={`${matchScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">{matchScore}%</span>
                  <span className="block text-[9px] font-semibold uppercase text-slate-500">Match</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Target Readiness: {userCareerData?.userCareer?.careerPath?.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Based on weighted importance of target skills vs your verified proficiency matrix.
                </p>
              </div>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Mastered</div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{analysis.masteredCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-center">
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Upgrade</div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{analysis.upgradeCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-center">
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">Missing</div>
                <div className="text-xl font-bold text-rose-700 dark:text-rose-300">{analysis.missingCount}</div>
              </div>
            </div>
          </div>

          {/* Skill Breakdown Table */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Skill Gap Breakdown</h4>

            <div className="space-y-3">
              {analysis.skillsAnalysis?.map((item: any) => {
                const isMastered = item.status === 'mastered';
                const isUpgrade = item.status === 'upgrade_needed';

                return (
                  <div
                    key={item.skillId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {isMastered && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                      {isUpgrade && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                      {!isMastered && !isUpgrade && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}

                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          {item.skillName}
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Required Level: <span className="font-semibold text-slate-700 dark:text-slate-300">Lvl {item.requiredLevel}</span> (Importance: {item.requiredImportance}/5)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Level Progress Bar */}
                      <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full transition-all ${
                            isMastered ? 'bg-emerald-500' : isUpgrade ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, (item.userLevel / item.requiredLevel) * 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setLearningSkill({ name: item.skillName, category: item.category })}
                          className="px-2.5 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Learn
                        </button>
                        <span
                          className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${
                            isMastered
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                              : isUpgrade
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {isMastered && `Lvl ${item.userLevel} (Met)`}
                          {isUpgrade && `Lvl ${item.userLevel} / ${item.requiredLevel}`}
                          {!isMastered && !isUpgrade && `Missing (0/${item.requiredLevel})`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {learningSkill && (
        <SkillLearningModal skill={learningSkill} onClose={() => setLearningSkill(null)} />
      )}
    </div>
  );
}
