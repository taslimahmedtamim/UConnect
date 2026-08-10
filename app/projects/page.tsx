"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Plus, Search, Filter, ThumbsUp, Eye, ExternalLink, GitBranch } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    tags: "",
    repoUrl: "",
    demoUrl: ""
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", description: "", category: "Web Development", tags: "", repoUrl: "", demoUrl: "" });
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

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FolderOpen className="text-blue-500 w-8 h-8" />
            Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and discover amazing student projects.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap w-fit"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Filters (Mock UI for now) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
            <option value="">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App</option>
            <option value="AI/ML">AI/ML</option>
          </select>
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-400 opacity-50" />
          <p className="font-medium text-lg text-slate-600 dark:text-slate-300">No projects found</p>
          <p className="text-sm mt-1">Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold rounded-full">
                  {project.category}
                </span>
                <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                  <span className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer"><ThumbsUp className="w-3 h-3" /> {project.likes}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {project.views}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{project.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-grow">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tag: string, i: number) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                    {tag}
                  </span>
                ))}
                {Array.isArray(project.tags) && project.tags.length > 3 && (
                  <span className="text-[10px] font-medium px-2 py-1 text-slate-500">+{project.tags.length - 3}</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs">
                    {project.author?.fullName?.charAt(0) || '?'}
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[100px]">{project.author?.fullName}</span>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors">
                      <GitBranch className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-bold">Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm" placeholder="E.g. Smart Campus App" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm resize-none" placeholder="What is this project about?"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm">
                    <option>Web Development</option>
                    <option>Mobile App</option>
                    <option>AI/ML</option>
                    <option>UI/UX Design</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Tags (comma separated)</label>
                  <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm" placeholder="React, Node, Figma" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">GitHub URL (Optional)</label>
                  <input type="url" value={formData.repoUrl} onChange={e => setFormData({...formData, repoUrl: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Live Demo (Optional)</label>
                  <input type="url" value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm" placeholder="https://..." />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
