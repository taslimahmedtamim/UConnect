"use client";

import React, { useState } from 'react';
import { Target, Clock, GraduationCap, X, ChevronRight, CheckCircle2, Award } from 'lucide-react';

export type AssessmentData = {
  careerGoal: string;
  currentLevel: string;
  learningTime: string;
  learningGoal: string;
  existingSkills: string[];
};

export default function SkillAssessmentModal({
  isOpen,
  onClose,
  onSubmit,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssessmentData) => void;
  loading: boolean;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssessmentData>({
    careerGoal: '',
    currentLevel: '',
    learningTime: '',
    learningGoal: '',
    existingSkills: []
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const updateData = (key: keyof AssessmentData, val: any) => {
    setData(prev => ({ ...prev, [key]: val }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">What is your target career role?</label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer, Data Scientist..."
                  value={data.careerGoal}
                  onChange={(e) => updateData('careerGoal', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="pt-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">What is your current experience level?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => updateData('currentLevel', lvl)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all ${data.currentLevel === lvl ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">How much time can you dedicate daily?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['1 hour/day', '2 hours/day', '3 hours/day', '4+ hours/day'].map(time => (
                  <button
                    key={time}
                    onClick={() => updateData('learningTime', time)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${data.learningTime === time ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'}`}
                  >
                    <Clock className="w-4 h-4" /> {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">What is your primary goal?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Internship', 'Entry-level Job', 'Career Transition', 'Academic Learning'].map(goal => (
                  <button
                    key={goal}
                    onClick={() => updateData('learningGoal', goal)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${data.learningGoal === goal ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'}`}
                  >
                    <GraduationCap className="w-4 h-4" /> {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        const commonSkills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'SQL', 'Git', 'Java', 'C++', 'Docker', 'AWS'];
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Select skills you already know</label>
              <p className="text-xs text-slate-500 mb-4">We will skip fundamentals you've already mastered.</p>
              
              <div className="flex flex-wrap gap-2">
                {commonSkills.map(skill => {
                  const isSelected = data.existingSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => {
                        const nextSkills = isSelected 
                          ? data.existingSkills.filter(s => s !== skill)
                          : [...data.existingSkills, skill];
                        updateData('existingSkills', nextSkills);
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${isSelected ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'}`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assessment Complete!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We are ready to generate your highly personalized, adaptive roadmap for <span className="font-bold text-blue-600">{data.careerGoal}</span>.
            </p>
          </div>
        );
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !data.careerGoal || !data.currentLevel;
    if (step === 2) return !data.learningTime || !data.learningGoal;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Skill Assessment</h2>
            <div className="text-xs text-slate-500 font-medium mt-1">Step {step} of 4</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onSubmit(data)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all w-full justify-center sm:w-auto"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              Generate AI Roadmap
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
