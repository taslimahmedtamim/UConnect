"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  Search, 
  Plus, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Filter, 
  BookOpen,
  ArrowUpRight 
} from 'lucide-react';
import HelpPostCard from '@/components/HelpPostCard';
import AskQuestionModal from '@/components/AskQuestionModal';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'DevOps', 'AI & Data', 'Security', 'Career'];

export default function HelpBoardPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const q = encodeURIComponent(searchTerm);
      const cat = selectedCat === 'All' ? '' : encodeURIComponent(selectedCat);
      const st = selectedStatus === 'All' ? '' : encodeURIComponent(selectedStatus);

      const res = await fetch(`/api/help?q=${q}&category=${cat}&status=${st}`);
      const json = await res.json();
      if (json.success) {
        setPosts(json.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCat, selectedStatus]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/help/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upvote_post' })
      });
      const json = await res.json();
      if (json.success) {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, upvotes: json.upvotes } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const solvedCount = posts.filter(p => p.status === 'solved' || p.hasAcceptedAnswer).length;
  const openCount = posts.length - solvedCount;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              UConnect Help Board <span className="text-blue-600">.</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ask coding questions, get community answers, and generate instant Gemini AI resolutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAskModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Ask a Question
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Questions</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{posts.length}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Solved</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{solvedCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">Awaiting Answer</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{openCount}</div>
        </div>
      </div>

      {/* Toolbar: Search & Category Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search help topics (e.g. Next.js CORS, Docker permission, Prisma migration)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {['All', 'Open', 'Solved'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Question Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading help board discussions...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No questions match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Be the first to ask a technical question in this topic!</p>
          <button
            onClick={() => setShowAskModal(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
          >
            Ask a Question
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <HelpPostCard key={post.id} post={post} onUpvote={handleUpvote} />
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        onSuccess={fetchPosts}
      />
    </div>
  );
}
