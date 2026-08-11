"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { 
  MonitorPlay, 
  Search, 
  Plus, 
  Filter, 
  Sparkles, 
  Trophy 
} from 'lucide-react';
import FeaturedProjectHero from '@/components/FeaturedProjectHero';
import ProjectShowcaseCard from '@/components/ProjectShowcaseCard';
import SubmitProjectModal from '@/components/SubmitProjectModal';
import ProjectDemoModal from '@/components/ProjectDemoModal';

const CATEGORIES = ['All', 'Web Apps', 'Mobile', 'AI/ML', 'Games', 'IoT', 'Design'];

export default function ShowcasePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [featuredProject, setFeaturedProject] = useState<any | null>(null);
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedDemoProject, setSelectedDemoProject] = useState<any | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const q = encodeURIComponent(searchTerm);
      const cat = selectedCat === 'All' ? '' : encodeURIComponent(selectedCat);

      const res = await fetch(`/api/projects?q=${q}&category=${cat}`);
      const json = await res.json();
      if (json.success) {
        setProjects(json.projects || []);
        setFeaturedProject(json.featuredProject || json.projects?.[0] || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCat]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleLike = async (id: string) => {
    try {
      await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: id, action: 'like' })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Category Filter Bar at Top (Matching Reference Design!) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-200 dark:border-slate-800">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCat === cat
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Header & Submit Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Project Showcase Hub <span className="text-purple-600">.</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Discover student build projects, open-source web apps, mobile solutions, and AI models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Submit Project
          </button>
        </div>
      </div>

      {/* Featured Project Hero (Matching Reference Design Top Hero Card!) */}
      {featuredProject && (
        <FeaturedProjectHero
          project={featuredProject}
          onWatchDemo={(p) => setSelectedDemoProject(p)}
        />
      )}

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects by title, tech stack (e.g. React Native, Flutter, TensorFlow)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 dark:text-white shadow-sm"
        />
      </div>

      {/* Project Showcase Grid Cards (Matching Reference Design!) */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading showcase projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <MonitorPlay className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No projects found in this category</h3>
          <p className="text-xs text-slate-500 mt-1">Be the first to submit a project in {selectedCat}!</p>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="mt-4 px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl"
          >
            Submit Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectShowcaseCard
              key={project.id}
              project={project}
              onLike={handleLike}
              onSelect={(p) => setSelectedDemoProject(p)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SubmitProjectModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSuccess={fetchProjects}
      />

      <ProjectDemoModal
        project={selectedDemoProject}
        onClose={() => setSelectedDemoProject(null)}
      />
    </div>
  );
}
