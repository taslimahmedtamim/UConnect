"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, Plus, Search, Filter, ThumbsUp, ThumbsDown, Eye, Sparkles, ExternalLink, GitBranch, Terminal, Lock } from "lucide-react";
import { useUser } from "@/components/UserProvider";
import AIProjectAssistant from "@/components/projects/AIProjectAssistant";
import GitHubStatsBadge from "@/components/projects/GitHubStatsBadge";

export default function ProjectsPage() {
  const { user } = useUser();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    tags: "",
    repoUrl: "",
    demoUrl: "",
    lookingForContributors: false,
    progress: 10,
    status: "Planning",
    skillsDemonstrated: "",
    features: [] as {title: string, completed: boolean}[],
    difficulty: "",
    estimatedDuration: "",
    isPrivate: false
  });

  const fetchProjects = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(() => {
      fetchProjects(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLikeProject = async (e: React.MouseEvent, projectId: string, currentLikes: number) => {
    e.preventDefault();
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: currentLikes + 1 } : p));
    try {
      const res = await fetch(`/api/projects/${projectId}/like`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: currentLikes } : p));
        if (data.message === 'Already liked') {
          // It's fine, silently ignore or toggle it? The user clicked like again, maybe they meant to unlike?
          // Since we have a dislike button, they should click that. Let's just tell them.
          alert("You have already liked this project! Click thumbs down to unlike.");
        }
      } else {
        // Sync with actual likes from server just in case
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: data.likes } : p));
      }
    } catch (err) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: currentLikes } : p));
    }
  };

  const handleDislikeProject = async (e: React.MouseEvent, projectId: string, currentLikes: number) => {
    e.preventDefault();
    if (currentLikes <= 0) return;
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: currentLikes - 1 } : p));
    try {
      const res = await fetch(`/api/projects/${projectId}/dislike`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: currentLikes } : p));
        if (data.message === 'Not liked yet') {
          alert("You haven't liked this project yet!");
        }
      } else {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: data.likes } : p));
      }
    } catch (err) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: currentLikes } : p));
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
          skillsDemonstrated: formData.skillsDemonstrated ? formData.skillsDemonstrated.split(",").map(s => s.trim()).filter(Boolean) : [],
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", description: "", category: "Web Development", tags: "", repoUrl: "", demoUrl: "", lookingForContributors: false, progress: 10, status: "Planning", skillsDemonstrated: "", features: [], difficulty: "", estimatedDuration: "", isPrivate: false });
        fetchProjects();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create project");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAISelect = async (idea: any) => {
    setSubmitting(true);
    try {
      const payload = {
        title: idea.title,
        description: idea.description,
        category: "AI Generated",
        tags: idea.recommendedStack,
        skillsDemonstrated: idea.skillsDemonstrated,
        status: "Planning",
        progress: 0,
        features: idea.tasks ? idea.tasks : idea.features.map((f: string) => ({ title: f, completed: false })),
        difficulty: idea.difficulty,
        estimatedDuration: idea.estimatedDuration,
        isPrivate: false,
        lookingForContributors: false
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsAIOpen(false);
        const data = await res.json();
        if (data.project && data.project.id) {
          router.push(`/projects/${data.project.id}`);
        } else {
          fetchProjects();
        }
      } else {
        const err = await res.json();
        alert(err.message || "Failed to start AI project");
      }
    } catch (error) {
      console.error(error);
      alert("Error starting AI project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Terminal className="text-indigo-500 w-8 h-8" />
            Career Portfolio
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Build, showcase, and generate projects to prove your skills.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5" />
            AI Generator
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects by skill or title..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <Terminal className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Your portfolio is empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">Projects are the best way to prove your skills to employers. Generate an idea with AI or create your own.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setIsAIOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Generate Idea
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all group flex flex-col h-full relative overflow-hidden">
              {project.featured && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-8 translate-x-6 translate-y-2 rotate-45 shadow-sm">
                  Featured
                </div>
              )}
              
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold rounded-md">
                    {project.category}
                  </span>
                  <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md border ${
                    project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800' :
                    project.status === 'Planning' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800' :
                    'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800'
                  }`}>
                    {project.status || "In Progress"}
                  </span>
                  {project.isPrivate && (
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold rounded-md flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Private
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 min-h-[40px]">
                  {project.description}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-slate-700 dark:text-slate-300">{project.progress || 10}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.progress || 10}%` }}></div>
                </div>
              </div>

              {/* Tags / Tech Stack */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.slice(0, 4).map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-md">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-md">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>
              )}

              {project.repoUrl && (
                <GitHubStatsBadge repoUrl={project.repoUrl} />
              )}

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => handleLikeProject(e, project.id, project.likes)} className="hover:text-blue-500 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className="font-medium min-w-[1ch] text-center">{project.likes}</span>
                    <button onClick={(e) => handleDislikeProject(e, project.id, project.likes)} className="hover:text-red-500 transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Link href={`/projects/${project.id}`} className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAIOpen && <AIProjectAssistant onSelectIdea={handleAISelect} onClose={() => setIsAIOpen(false)} />}

      {/* Basic Create Modal (kept simple for constraints, in real app would match the fields) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <form id="projectForm" onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg h-24" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <option>Web Development</option>
                      <option>Mobile App</option>
                      <option>AI/ML</option>
                      <option>Cybersecurity</option>
                      <option>Data Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <option>Planning</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tech Stack (comma separated)</label>
                  <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" placeholder="React, Node.js, Prisma" />
                </div>
                <div className="flex items-center gap-3 py-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                  <label className="flex items-center cursor-pointer relative">
                    <input type="checkbox" className="sr-only" checked={formData.isPrivate} onChange={(e) => setFormData({...formData, isPrivate: e.target.checked})} />
                    <div className={`w-11 h-6 rounded-full transition-colors ${formData.isPrivate ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isPrivate ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </label>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1"><Lock className="w-4 h-4" /> Private Project</span>
                    <span className="text-xs text-slate-500">Only you and your team members can see this project.</span>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
              <button type="submit" form="projectForm" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">{submitting ? 'Creating...' : 'Create Project'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
