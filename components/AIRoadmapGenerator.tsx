"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Calendar, CheckSquare, Square, Rocket, BookOpen, Clock, Target, CheckCircle2, Award, PlayCircle, BarChart3, TrendingUp, Zap, HelpCircle, Plus } from 'lucide-react';
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
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [assistantTopic, setAssistantTopic] = useState<string | null>(null);
  const [quizTopic, setQuizTopic] = useState<string | null>(null);
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
  const persistProgress = (tasks: string[]) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(async () => {
      try {
        await fetch('/api/skillmap/ai-roadmap/progress', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completedTasks: tasks }),
        });
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    }, 500); // 500ms debounce
  };

  const toggleTask = (taskId: string) => {
    const nextCompleted = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    
    setCompletedTasks(nextCompleted);
    persistProgress(nextCompleted);
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

  const addSkillToProfile = async (taskName: string) => {
    try {
      const profileRes = await fetch('/api/users/profile');
      const profileData = await profileRes.json();
      if (profileData.success) {
        const currentSkills = profileData.user.skills || [];
        const exists = currentSkills.some((s: any) => typeof s === 'string' ? s === taskName : s.name === taskName);
        if (!exists) {
          currentSkills.push({ name: taskName, level: 'Intermediate', source: 'U-SkillMap Task' });
          const updateRes = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...profileData.user, skills: currentSkills })
          });
          if (updateRes.ok) {
            alert(`✅ "${taskName}" added to your Profile & Resume!`);
          }
        } else {
          alert('This skill is already on your profile!');
        }
      }
    } catch (e) {
      console.error(e);
      alert('Error adding skill.');
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

  return (
    <div className="space-y-8">
      {/* Top Dashboard Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold mb-4">
              <Target className="w-3.5 h-3.5" /> Target Career
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{roadmap.careerGoal}</h2>
            
            <div className="flex items-center gap-6 mt-6">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Overall Progress</div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-blue-600 dark:text-blue-400 leading-none">{progress}%</span>
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-800" />
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Tasks Completed</div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{completedTasks.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col shadow-xl text-white">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-bold mb-6 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" /> Gap Analysis
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" className="stroke-slate-800" strokeWidth="12" fill="none" />
                <circle 
                  cx="64" cy="64" r="56" 
                  className="stroke-blue-500" strokeWidth="12" fill="none" 
                  strokeDasharray="351" strokeDashoffset={351 - (351 * (roadmap.readinessScore || 0)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{roadmap.readinessScore || 0}%</span>
              </div>
            </div>
            <div className="mt-4 font-bold text-lg">Job Readiness</div>
            <p className="text-xs text-slate-400 mt-2">Based on your existing skills vs required skills.</p>
          </div>
        </div>
      </div>

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

            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden relative"
              >
                {isPhaseComplete && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full flex items-start justify-end p-3">
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
                    <button 
                      onClick={() => setQuizTopic(phase.title)}
                      className="mt-2 text-[10px] font-bold px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3" /> Test your knowledge
                    </button>
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
                        <button onClick={() => toggleTask(item.taskId)} className="mt-1 sm:mt-0 shrink-0 hover:scale-110 transition-transform focus:outline-none">
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

                        <div className="flex gap-2">
                          <button 
                            onClick={() => setAssistantTopic(typeof item === 'string' ? item : item.task)}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm shrink-0"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> Ask AI
                          </button>
                          
                          {isChecked && (
                            <button 
                              onClick={() => addSkillToProfile(typeof item === 'string' ? item : item.task)}
                              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/50 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors shadow-sm shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add to Profile
                            </button>
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
        topic={quizTopic || ''}
      />
    </div>
  );
}

