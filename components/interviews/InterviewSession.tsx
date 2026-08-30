"use client";

import React, { useState, useEffect } from "react";
import { Mic, Send, ChevronRight, CheckCircle2, AlertCircle, RefreshCw, Trophy, Target, ArrowRight } from "lucide-react";

interface InterviewSessionProps {
  targetRole: string;
  onClose: () => void;
  onComplete: () => void;
}

export default function InterviewSession({ targetRole, onClose, onComplete }: InterviewSessionProps) {
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const generateQuestions = async () => {
      try {
        const res = await fetch("/api/interviews/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetRole }),
        });
        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions);
          setInterviewId(data.interviewId);
          setAnswers(new Array(data.questions.length).fill(""));
        } else {
          alert(data.message || "Failed to generate questions.");
          onClose();
        }
      } catch (err) {
        console.error(err);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    generateQuestions();
  }, [targetRole, onClose]);

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = currentAnswer;
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer(newAnswers[currentIndex + 1] || "");
    }
  };

  const handlePrevious = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = currentAnswer;
    setAnswers(newAnswers);

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentAnswer(newAnswers[currentIndex - 1] || "");
    }
  };

  const handleSubmit = async () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = currentAnswer;
    setAnswers(newAnswers);

    setEvaluating(true);
    try {
      const res = await fetch("/api/interviews/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId, answers: newAnswers }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.interview);
        onComplete();
      } else {
        alert(data.message || "Failed to evaluate.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Generating Your Interview...</h2>
        <p className="text-slate-500">Preparing customized questions for a {targetRole} role.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 mb-4">
            <Trophy className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Interview Complete</h2>
          <p className="text-slate-500">You scored <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">{result.score}/100</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Strengths</h3>
            <ul className="list-disc pl-5 space-y-1 text-emerald-700 dark:text-emerald-300 text-sm">
              {result.feedback?.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>) || <li>None noted.</li>}
            </ul>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/10 p-5 rounded-xl border border-rose-100 dark:border-rose-900/30">
            <h3 className="font-bold text-rose-800 dark:text-rose-400 mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Areas to Improve</h3>
            <ul className="list-disc pl-5 space-y-1 text-rose-700 dark:text-rose-300 text-sm">
              {result.feedback?.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>) || <li>None noted.</li>}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Detailed Feedback</h3>
          {result.qaHistory?.map((qa: any, i: number) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-slate-900 dark:text-white">Q{i+1}: {qa.question}</h4>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 ml-4 shrink-0">{qa.score}/100</span>
              </div>
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase">Your Answer</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-3 rounded-lg mt-1 border border-slate-200 dark:border-slate-800">
                  "{qa.answer || "No answer provided"}"
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase">AI Feedback</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{qa.feedback}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={onClose} className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px] shadow-xl">
      <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          <span className="font-bold">Mock Interview: {targetRole}</span>
        </div>
        <div className="text-indigo-200 font-medium text-sm">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 shrink-0">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {questions[currentIndex]}
          </h3>
        </div>

        <div className="flex-1 flex flex-col">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here... Be as detailed as you would in a real interview."
            className="flex-1 w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center shrink-0">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || evaluating}
          className="px-4 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors font-medium"
        >
          Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={evaluating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {evaluating ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Evaluating...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Submit Interview</>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
