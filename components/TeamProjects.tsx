"use client";

import { useState } from "react";
import { Plus, Target, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

export default function TeamProjects({ team, currentUser }: { team: any, currentUser: any }) {
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const isMember = currentUser && (currentUser.id === team.owner.id || team.members.some((m: any) => m.id === currentUser.id));

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${team.id}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          category: "Team Project"
        })
      });
      const data = await res.json();
      if (data.success) {
        team.projects = [data.project, ...(team.projects || [])];
        setCreating(false);
        setNewTitle("");
        setNewDescription("");
      } else {
        alert(data.message);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Team Projects</h2>
        {isMember && !creating && (
          <button 
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      {creating && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Create Team Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
              <input required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal / Description</label>
              <textarea required value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg h-24" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setCreating(false)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {(!team.projects || team.projects.length === 0) && !creating ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 border-dashed dark:border-slate-800">
          <Target className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">No active projects</h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">Start a new project with your team to collaborate and earn points on the leaderboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.projects?.map((proj: any) => (
            <div key={proj.id} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
              <div className="mb-4">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-semibold rounded-md inline-block mb-3">
                  {proj.status}
                </span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white line-clamp-1">{proj.title}</h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{proj.description}</p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-slate-500">Progress</span>
                  <span className="text-xs font-bold text-indigo-600">{proj.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                </div>
                <Link href={`/projects/${proj.id}`} className="block text-center w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg transition-colors">
                  View Project Tasks &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
