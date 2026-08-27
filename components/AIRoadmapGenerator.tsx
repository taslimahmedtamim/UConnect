"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Calendar, CheckSquare, Square, Rocket, BookOpen, Clock, Target, CheckCircle2, Award, PlayCircle, BarChart3, TrendingUp, Zap, HelpCircle, Plus, Lock, Loader2 } from 'lucide-react';
import SkillAssessmentModal, { AssessmentData } from './skillmap/SkillAssessmentModal';
import AILearningAssistant from './skillmap/AILearningAssistant';
import AIQuizModal from './skillmap/AIQuizModal';
import DailyPlanWidget from './skillmap/DailyPlanWidget';
import CareerReadinessWidget from './skillmap/CareerReadinessWidget';
import SkillDependencyGraph from './skillmap/SkillDependencyGraph';

export default function AIRoadmapGenerator() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [assistantTopic, setAssistantTopic] = useState<string | null>(null);
  const [quizTopic, setQuizTopic] = useState<{ topic: string, phaseIndex: number, isExam: boolean, taskId?: string } | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchExistingRoadmap();
  }, []);

  const fetchExistingRoadmap = async () => {
    try {
      const res = await fetch('/api/skillmap/ai-roadmap');
      const data = await res.json();
      if (data.success && data.roadmap) {
        setRoadmap(data.roadmap.roadmapData);
        setCompletedTasks(data.roadmap.progressData?.completedTasks || []);
        setCompletedPhases(data.roadmap.progressData?.completedPhases || []);
      }
    } catch (e) {
      console.error("Failed to load existing roadmap", e);
    }
  };

  const generateRoadmap = async (assessmentData: AssessmentData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/skillmap/ai-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData)
      });
      const json = await res.json();
      if (json.success) {
        setRoadmap(json.roadmap.roadmapData);
        setCompletedTasks(json.roadmap.progressData?.completedTasks || []);
        setCompletedPhases(json.roadmap.progressData?.completedPhases || []);
        setIsAssessmentOpen(false);
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

  /**
   * Persists the completed tasks array to the database.
   * Debounced to avoid spamming the API on rapid toggling.
   */
  const persistProgress = (tasks: string[], phases: number[]) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(async () => {
      try {
        await fetch('/api/skillmap/ai-roadmap/progress', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completedTasks: tasks, completedPhases: phases }),
        });
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    }, 500); // 500ms debounce
  };

  const uncheckTask = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      const nextCompleted = completedTasks.filter(id => id !== taskId);
      setCompletedTasks(nextCompleted);
      persistProgress(nextCompleted, completedPhases);
    }
  };

  const addProjectToResume = async (project: any) => {
    try {
      const res = await fetch('/api/skillmap/add-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          tools: project.tools
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          alert(`"${project.title}" is already in your Projects!`);
        } else {
          alert(`✅ "${project.title}" added to Projects!`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const claimSkill = async () => {
    if (!roadmap?.careerGoal) return;
    setClaiming(true);
    try {
      const profileRes = await fetch('/api/users/profile');
      const profileData = await profileRes.json();
      if (profileData.success) {
        const currentSkills = profileData.user.skills || [];
        const exists = currentSkills.some((s: any) => typeof s === 'string' ? s === roadmap.careerGoal : s.name === roadmap.careerGoal);
        if (!exists) {
          currentSkills.push({ name: roadmap.careerGoal, level: 'Beginner', source: 'U-SkillMap Roadmap' });
          const updateRes = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...profileData.user, skills: currentSkills })
          });
          if (updateRes.ok) {
            alert(`🎉 "${roadmap.careerGoal}" added to your Profile Skills!`);
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

  const addPhaseSkillsToProfile = async (skillsToAdd: string[]) => {
    if (!skillsToAdd || skillsToAdd.length === 0) return;
    try {
      setClaiming(true);
      const profileRes = await fetch('/api/users/profile');
      const profileData = await profileRes.json();
      if (profileData.success) {
        let currentSkills = profileData.user.skills || [];
        let addedCount = 0;
        
        for (const skill of skillsToAdd) {
          const exists = currentSkills.some((s: any) => typeof s === 'string' ? s === skill : s.name === skill);
          if (!exists) {
            currentSkills.push({ name: skill, level: 'Intermediate', source: 'U-SkillMap Phase' });
            addedCount++;
          }
        }
        
        if (addedCount > 0) {
          const updateRes = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...profileData.user, skills: currentSkills })
          });
          if (updateRes.ok) {
            alert(`✅ ${addedCount} skills added to your Profile!`);
          }
        } else {
          alert('These skills are already on your profile!');
        }
      }
    } catch (e) {
      console.error(e);
      alert('Error adding skills.');
    } finally {
      setClaiming(false);
    }
  };

  const claimCertificate = async () => {
    try {
      setClaiming(true);
      const profileRes = await fetch('/api/users/profile');
      const profileData = await profileRes.json();
      if (profileData.success) {
        const currentCerts = profileData.user.certificates || [];
        const certName = `${roadmap.careerGoal} Master`;
        const exists = currentCerts.some((c: any) => c.name === certName);
        if (!exists) {
          const txId = '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
          currentCerts.push({ 
            name: certName, 
            issuer: 'UConnect AI', 
            date: new Date().toLocaleDateString(),
            isVerified: true,
            txId
          });
          const updateRes = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...profileData.user, certificates: currentCerts })
          });
          if (updateRes.ok) {
            alert(`🎉 Certificate "${certName}" added to your Profile!`);
          }
        } else {
          alert('You have already claimed this certificate!');
        }
      }
    } catch (e) {
      console.error(e);
      alert('Error claiming certificate.');
    } finally {
      setClaiming(false);
    }
  };

  const renderEmptyState = () => (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-3xl font-extrabold tracking-tight mb-3">Adaptive AI Learning System</h3>
      <p className="text-blue-100 max-w-2xl mb-8 leading-relaxed">
        Don't just get a generic roadmap. Our AI analyzes your current skills, identifies skill gaps, and generates a personalized, interactive curriculum to help you achieve your specific career goal.
      </p>
      <button
        onClick={() => setIsAssessmentOpen(true)}
        className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
      >
        <Target className="w-5 h-5 text-blue-500" /> Start AI Assessment
      </button>
    </div>
  );

  const calculateProgress = () => {
    if (!roadmap?.roadmap) return 0;
    let totalTasks = 0;
    roadmap.roadmap.forEach((phase: any) => {
      totalTasks += phase.actionItems?.length || 0;
    });
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks.length / totalTasks) * 100);
  };

  if (!roadmap) {
    return (
      <div className="space-y-6">
        {renderEmptyState()}
        <SkillAssessmentModal
          isOpen={isAssessmentOpen}
          onClose={() => setIsAssessmentOpen(false)}
          onSubmit={generateRoadmap}
          loading={loading}
        />
      </div>
    );
  }

  const progress = calculateProgress();
  const baseReadiness = roadmap.readinessScore || 0;
  const currentReadiness = Math.round(baseReadiness + ((100 - baseReadiness) * (progress / 100)));

  return (
    <div className="space-y-8">
      {/* Top Dashboard Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold mb-4">
            <Target className="w-3.5 h-3.5" /> Target Career
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{roadmap.careerGoal}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            Complete the interactive curriculum below to master the skills required for this career path.
          </p>
        </div>

        <div className="w-full md:w-auto shrink-0 flex items-center gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider">Overall Progress</div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-blue-600 dark:text-blue-400 leading-none">{progress}%</span>
            </div>
          </div>
          <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider">Tasks Done</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{completedTasks.length}</span>
            </div>
          </div>
        </div>
      </div>

      {progress === 100 && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center shrink-0">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-1">Path Completed!</h3>
              <p className="text-emerald-50">You have successfully mastered all the skills in this roadmap.</p>
            </div>
          </div>
          <button 
            onClick={claimCertificate}
            disabled={claiming}
            className="px-6 py-3 bg-white text-emerald-600 hover:bg-emerald-50 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 relative z-10 disabled:opacity-75"
          >
            {claiming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Award className="w-5 h-5" />}
            Claim Verified Certificate
          </button>
        </div>
      )}

      {/* Skill Gaps Breakdown */}
      {roadmap.skillGaps && roadmap.skillGaps.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" /> Focus Areas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {roadmap.skillGaps.map((gap: any, i: number) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-900 dark:text-white">{gap.skill}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${gap.gap === 'Large' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {gap.gap} Gap
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Current</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{gap.current}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Required</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{gap.required}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendation Banner */}
      {roadmap.recommendations && roadmap.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-1">AI Recommendation</h4>
            <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium leading-relaxed">
              {roadmap.recommendations[0]}
            </p>
          </div>
        </div>
      )}

      {/* Roadmap Phases */}
      <div className="space-y-8">
        
        {/* Daily Plan Widget */}
        <DailyPlanWidget 
          roadmap={roadmap} 
          completedTasks={completedTasks}
          onStartTask={(taskId) => {
            // Simple smooth scroll to the task or open the resource
            const el = document.getElementById(`task-${taskId}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }} 
        />

        {/* Career Readiness Widget */}
        <CareerReadinessWidget 
          roadmap={roadmap}
          completedTasks={completedTasks}
        />

        {/* Visual Graph Map */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Journey Map</h3>
          <SkillDependencyGraph 
            roadmap={roadmap}
            completedTasks={completedTasks}
          />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Curriculum</h3>
          <button onClick={() => setIsAssessmentOpen(true)} className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Regenerate Roadmap
          </button>
        </div>

        <div className="space-y-6">
          {roadmap.roadmap?.map((phase: any, index: number) => {
            const phaseTasks = phase.actionItems || [];
            const phaseCompleted = phaseTasks.filter((t: any) => completedTasks.includes(t.taskId)).length;
            const phaseTotal = phaseTasks.length;
            const isPhaseComplete = phaseTotal > 0 && phaseCompleted === phaseTotal;

            const isPhaseUnlocked = index === 0 || (
              roadmap.roadmap[index - 1]?.actionItems?.every((t: any) => completedTasks.includes(t.taskId))
            );

            return (
              <div
                key={index}
                className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden relative transition-all ${!isPhaseUnlocked ? 'opacity-60 grayscale-[50%] pointer-events-none' : ''}`}
              >
                {!isPhaseUnlocked && (
                  <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 font-bold text-slate-500">
                      <Lock className="w-5 h-5" /> Phase Locked
                    </div>
                  </div>
                )}
                {isPhaseComplete && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full flex items-start justify-end p-3 z-20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 flex items-center justify-center font-black text-xl text-blue-600 dark:text-blue-400 shrink-0">
                      {phase.phase}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">{phase.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{phase.objective}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0 gap-2">
                    <div className="text-xs font-bold text-slate-500">
                      {phase.duration} • {phaseCompleted}/{phaseTotal} Tasks
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                      {phase.skillsToFocus?.map((s: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {isPhaseComplete && phase.skillsToFocus?.length > 0 && (
                        <button 
                          onClick={() => addPhaseSkillsToProfile(phase.skillsToFocus)}
                          className="text-[10px] font-bold px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-3 h-3" /> Add Phase Skills
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {phaseTasks.map((item: any) => {
                    const isChecked = completedTasks.includes(item.taskId);
                    return (
                      <div
                        key={item.taskId}
                        id={`task-${item.taskId}`}
                        className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border transition-all ${
                          isChecked
                            ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/20'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                      >
                        <button onClick={() => isChecked ? uncheckTask(item.taskId) : setQuizTopic({ topic: item.task, phaseIndex: index, isExam: true, taskId: item.taskId })} className="mt-1 sm:mt-0 shrink-0 hover:scale-110 transition-transform focus:outline-none">
                          {isChecked ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <Square className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <span className={`text-sm font-bold block ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                            {item.task}
                          </span>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                            <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3.5 h-3.5" /> {item.estimatedTime}</span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="font-semibold text-slate-500">{item.difficulty}</span>
                            
                            {item.resourceUrl && (
                              <>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <a href={item.resourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
                                  <BookOpen className="w-3.5 h-3.5" /> {item.resourceTitle}
                                </a>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                          <button
                            onClick={() => setAssistantTopic(item.task)}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <HelpCircle className="w-4 h-4 text-blue-500" /> Ask AI
                          </button>
                          {!isChecked ? (
                            <button
                              onClick={() => setQuizTopic({ topic: item.task, phaseIndex: index, isExam: true, taskId: item.taskId })}
                              className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
                            >
                              <Award className="w-4 h-4" /> Take Exam
                            </button>
                          ) : (
                            <div className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" /> Passed
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recommended Project */}
                {phase.recommendedProject && typeof phase.recommendedProject === 'object' && (
                  <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">Recommended Project</div>
                        <h5 className="font-bold text-slate-900 dark:text-white">{phase.recommendedProject.title}</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg">{phase.recommendedProject.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-500">
                          <span>{phase.recommendedProject.difficulty}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span>{phase.recommendedProject.estimatedTime}</span>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <button 
                            onClick={() => addProjectToResume(phase.recommendedProject)}
                            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                          >
                            Add to Projects
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Skill Assessment Modal Component */}
      <SkillAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onSubmit={generateRoadmap}
        loading={loading}
      />

      {/* AI Assistant Sidebar */}
      <AILearningAssistant
        isOpen={!!assistantTopic}
        onClose={() => setAssistantTopic(null)}
        topicContext={assistantTopic || ''}
      />

      {/* AI Quiz Modal */}
      <AIQuizModal
        isOpen={!!quizTopic}
        onClose={() => setQuizTopic(null)}
        topic={quizTopic?.topic || ''}
        onComplete={(score, total) => {
          if (quizTopic?.isExam) {
            const percentage = score / total;
            if (percentage >= 0.6) {
              if (quizTopic.taskId) {
                if (!completedTasks.includes(quizTopic.taskId)) {
                  const nextCompleted = [...completedTasks, quizTopic.taskId];
                  setCompletedTasks(nextCompleted);
                  persistProgress(nextCompleted, completedPhases);
                  setTimeout(() => {
                    alert("🎉 Passed! Task marked as completed.");
                  }, 300);
                }
              }
            } else {
              setTimeout(() => {
                alert(`You scored ${Math.round(percentage * 100)}%. You need 60% to pass. Keep studying!`);
              }, 300);
            }
          }
        }}
      />
    </div>
  );
}

