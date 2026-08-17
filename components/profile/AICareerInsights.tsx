"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AICareerInsights({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [error, setError] = useState('');

  const targetRole = user?.userRoadmap?.careerGoal || user?.title || "Career Goal";

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/profile/insights');
      const data = await res.json();
      if (data.success) {
        setInsights(data.insights);
      } else {
        setError(data.message || 'Failed to fetch insights');
      }
    } catch (err) {
      setError('An error occurred while analyzing your profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-1 shadow-lg overflow-hidden relative">
      {/* Animated border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-20 blur-xl"></div>
      
      <div className="bg-slate-900 rounded-[22px] p-6 sm:p-8 relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Career Insights</h2>
            <p className="text-sm text-slate-400">Powered by Gemini</p>
          </div>
        </div>

        {!insights && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <p className="text-slate-300 mb-6 max-w-sm">
              Get an intelligent analysis of your profile against your target role: <strong className="text-white">{targetRole}</strong>.
            </p>
            <button 
              onClick={fetchInsights}
              className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl transition-all shadow-xl shadow-white/10 flex items-center gap-2"
            >
              Analyze My Profile <Sparkles className="w-4 h-4" />
            </button>
            {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-300 animate-pulse">Analyzing your career profile...</p>
          </div>
        )}

        {insights && !loading && (
          <div className="space-y-6 flex-1">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 font-medium">Target Match: {targetRole}</span>
                <span className="text-2xl font-black text-white">{insights.matchScore}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" 
                  style={{ width: `${insights.matchScore}%` }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {insights.strengths.map((str: string, i: number) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span> {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4" /> Missing / Weak
                </h3>
                <ul className="space-y-2">
                  {insights.weaknesses.map((wk: string, i: number) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span> {wk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" /> Recommendations
              </h3>
              <ul className="space-y-3">
                {insights.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
               <Link href="/skillmap" className="text-sm font-bold text-white hover:text-purple-300 flex items-center gap-2 transition-colors">
                 Explore U-SkillMap <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
