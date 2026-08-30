"use client";

import { useState } from "react";
import { Sparkles, Loader2, ArrowRight, X } from "lucide-react";

export default function AIProjectAssistant({ onSelectIdea, onClose }: { onSelectIdea: (idea: any) => void, onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.success) {
        setIdea(data.projectData);
      } else {
        setError(data.message || "Failed to generate idea");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" /> AI Project Generator
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!idea ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                What kind of project do you want to build?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. I want to build a cybersecurity project related to log analysis..."
                className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button 
                disabled={loading || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? "Generating Ideas..." : "Generate Project"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{idea.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{idea.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Difficulty</span>
                  <p className="font-medium text-slate-900 dark:text-white">{idea.difficulty}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Duration</span>
                  <p className="font-medium text-slate-900 dark:text-white">{idea.estimatedDuration}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Problem Statement</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  {idea.problemStatement}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Recommended Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {idea.recommendedStack.map((tech: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Skills Demonstrated</h4>
                  <div className="flex flex-wrap gap-2">
                    {idea.skillsDemonstrated.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium border border-indigo-200 dark:border-indigo-900/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Task Scaffolding
                </h4>
                <div className="space-y-3">
                  {idea.tasks?.map((task: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5 flex items-center justify-center bg-white dark:bg-slate-900" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{task.title}</span>
                    </div>
                  ))}
                  {!idea.tasks && idea.features?.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5 flex items-center justify-center bg-white dark:bg-slate-900" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => onSelectIdea(idea)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Sparkles className="w-5 h-5" /> Start This Project <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIdea(null)}
                  className="px-5 py-3 rounded-xl font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
