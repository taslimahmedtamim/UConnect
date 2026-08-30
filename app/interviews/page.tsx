"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/components/UserProvider";
import { Target, Plus, Search, BrainCircuit, History, Award, PlayCircle } from "lucide-react";
import InterviewSession from "@/components/interviews/InterviewSession";

export default function InterviewsPage() {
  const { user } = useUser();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [targetRole, setTargetRole] = useState("");

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/interviews");
      const data = await res.json();
      if (data.success) {
        setInterviews(data.interviews);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchInterviews();
  }, [user]);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) return;
    setIsSessionActive(true);
  };

  const handleCompleteSession = () => {
    fetchInterviews();
  };

  if (isSessionActive) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <InterviewSession 
          targetRole={targetRole} 
          onClose={() => setIsSessionActive(false)} 
          onComplete={handleCompleteSession}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <BrainCircuit className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mock Interviews</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Practice real technical and behavioral questions tailored to your career goal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Start New Session</h2>
            <form onSubmit={handleStartSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Frontend Developer, Data Scientist..."
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
              >
                <PlayCircle className="w-5 h-5" /> Start Interview
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">How it works</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex gap-2"><div className="text-indigo-500 font-bold">1.</div> AI analyzes your profile skills and the target role.</li>
                <li className="flex gap-2"><div className="text-indigo-500 font-bold">2.</div> You get 5 customized technical & behavioral questions.</li>
                <li className="flex gap-2"><div className="text-indigo-500 font-bold">3.</div> Answer in detail to receive a score and feedback.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" /> Past Interviews
          </h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"></div>)}
            </div>
          ) : interviews.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center flex flex-col items-center">
              <Award className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No past interviews</h3>
              <p className="text-slate-500 max-w-sm">You haven't completed any mock interviews yet. Start a session to test your readiness.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map(interview => (
                <div key={interview.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{interview.targetRole}</h3>
                    <p className="text-sm text-slate-500">{new Date(interview.createdAt).toLocaleDateString()}</p>
                    {interview.completed && interview.feedback?.strengths && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-1">
                        <strong>Strength:</strong> {interview.feedback.strengths[0]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {interview.completed ? (
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Score</span>
                        <div className={`px-4 py-2 rounded-xl font-bold text-lg border ${
                          interview.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
                          interview.score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                          'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'
                        }`}>
                          {interview.score}/100
                        </div>
                      </div>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold">Incomplete</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
