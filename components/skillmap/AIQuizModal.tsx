"use client";

import React, { useState, useEffect } from 'react';
import { Target, X, CheckCircle2, AlertCircle, Loader2, Sparkles, Trophy } from 'lucide-react';

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export default function AIQuizModal({
  isOpen,
  onClose,
  topic,
  onComplete
}: {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  onComplete?: (score: number, total: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ passed: boolean, message: string } | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (isOpen && topic) {
      generateQuiz();
    }
  }, [isOpen, topic]);

  const generateQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
    setIsFinished(false);
    setVerificationResult(null);
    setVerifying(false);

    try {
      const res = await fetch('/api/skillmap/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (data.success && data.quiz) {
        setQuestions(data.quiz);
      } else {
        alert('Could not generate quiz.');
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('Error generating quiz.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null) return;
    
    if (selectedOption === questions[currentQuestion].correctAnswerIndex) {
      setScore(s => s + 1);
    }
    setShowAnswer(true);
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
      
      // Call verification API
      setVerifying(true);
      try {
        const res = await fetch('/api/skills/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skillName: topic, score, totalQuestions: questions.length })
        });
        const data = await res.json();
        if (data.success) {
          setVerificationResult({ passed: data.passed, message: data.message });
        }
      } catch (e) {
        console.error("Verification failed", e);
      } finally {
        setVerifying(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-extrabold text-white">AI Quick Quiz</h2>
              <div className="text-xs text-blue-100 opacity-90">{topic}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-6 min-h-[300px] flex flex-col overflow-y-auto">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="font-medium animate-pulse text-sm">Generating your personalized quiz...</p>
            </div>
          ) : isFinished ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                <Trophy className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Quiz Completed!</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                You scored <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> out of {questions.length}
              </p>
              
              {verifying && (
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying score...
                </div>
              )}
              
              {verificationResult && (
                <div className={`mt-2 p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${verificationResult.passed ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {verificationResult.passed ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {verificationResult.message}
                </div>
              )}
              <button 
                onClick={() => {
                  onComplete?.(score, questions.length);
                  onClose();
                }} 
                className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md w-full sm:w-auto"
              >
                Finish & Close
              </button>
            </div>
          ) : questions.length > 0 ? (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500">Question {currentQuestion + 1} of {questions.length}</span>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">Score: {score}</span>
              </div>
              
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 leading-relaxed">
                {questions[currentQuestion].question}
              </h4>

              <div className="space-y-3 flex-1">
                {questions[currentQuestion].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === questions[currentQuestion].correctAnswerIndex;
                  
                  let optClass = "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all shadow-sm";
                  
                  if (showAnswer) {
                    if (isCorrect) optClass = "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold ring-1 ring-emerald-500 shadow-sm";
                    else if (isSelected && !isCorrect) optClass = "bg-rose-50 dark:bg-rose-900/40 border-rose-500 text-rose-900 dark:text-rose-300 font-bold ring-1 ring-rose-500 shadow-sm";
                    else optClass = "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/50 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed";
                  } else if (isSelected) {
                    optClass = "bg-blue-50 dark:bg-blue-900/40 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-300 font-bold ring-2 ring-blue-600 dark:ring-blue-500 shadow-sm";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !showAnswer && setSelectedOption(idx)}
                      disabled={showAnswer}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${optClass} flex items-start gap-3`}
                    >
                      <div className="w-5 h-5 mt-0.5 shrink-0 flex items-center justify-center">
                        {showAnswer && isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 
                         : showAnswer && isSelected && !isCorrect ? <AlertCircle className="w-5 h-5 text-rose-500" />
                         : <div className={`w-4 h-4 rounded-full border ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-slate-600'}`} />}
                      </div>
                      <span className="flex-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <div className={`mt-6 p-4 rounded-xl text-sm ${selectedOption === questions[currentQuestion].correctAnswerIndex ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300'}`}>
                  <p className="font-bold mb-1">
                    {selectedOption === questions[currentQuestion].correctAnswerIndex ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p>{questions[currentQuestion].explanation}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {!loading && !isFinished && questions.length > 0 && (
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            {!showAnswer ? (
              <button
                onClick={handleAnswerSubmit}
                disabled={selectedOption === null}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
