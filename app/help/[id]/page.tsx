"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  Sparkles, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  User, 
  Clock, 
  Eye 
} from 'lucide-react';

export default function HelpDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Gemini AI state
  const [aiSolution, setAiSolution] = useState<string | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/help/${id}`);
      const json = await res.json();
      if (json.success) {
        setPost(json.post);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleGenerateAi = async () => {
    if (!post) return;
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/help/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          category: post.category
        })
      });
      const json = await res.json();
      if (json.success) {
        setAiSolution(json.aiSolution);
      } else {
        alert(json.message || 'Failed to generate AI resolution');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setSubmittingAnswer(true);
    try {
      const res = await fetch(`/api/help/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newAnswer.trim() })
      });
      const json = await res.json();
      if (json.success) {
        setNewAnswer('');
        fetchDetail();
      } else {
        alert(json.message || 'Failed to submit answer');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleUpvoteAnswer = async (answerId: string) => {
    try {
      const res = await fetch(`/api/help/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upvote_answer', answerId })
      });
      const json = await res.json();
      if (json.success) {
        fetchDetail();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      const res = await fetch(`/api/help/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept_answer', answerId })
      });
      const json = await res.json();
      if (json.success) {
        fetchDetail();
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center text-slate-500">
        Loading question thread...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Question not found</h2>
        <Link href="/help" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Back to Help Board
        </Link>
      </div>
    );
  }

  const isSolved = post.status === 'solved' || post.answers?.some((a: any) => a.isAccepted);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Back Button */}
      <Link
        href="/help"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Help Board
      </Link>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            {post.category}
          </span>

          <span className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 ${
            isSolved
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
          }`}>
            {isSolved ? <CheckCircle2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
            {isSolved ? 'Solved Question' : 'Open Discussion'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {post.title}
        </h1>

        {/* Author Header */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          {post.author.profileImage ? (
            <img src={post.author.profileImage} alt={post.author.fullName} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
              {post.author.fullName[0]}
            </div>
          )}
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{post.author.fullName}</div>
            <div className="text-[11px] text-slate-400">{post.author.university || 'Community Member'}</div>
          </div>
        </div>

        {/* Question Details Content */}
        <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 font-mono text-xs">
          {post.content}
        </div>

        {/* Action Controls: Generate Gemini AI Answer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleGenerateAi}
            disabled={generatingAi}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            {generatingAi ? 'Generating Gemini AI Fix...' : 'Generate Instant Gemini AI Solution'}
          </button>
        </div>
      </div>

      {/* Gemini AI Resolution Banner */}
      {aiSolution && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-blue-300 font-extrabold text-sm">
            <Sparkles className="w-4 h-4 fill-blue-300" /> Gemini AI Resolution & Debugging Steps
          </div>
          <div className="prose prose-invert max-w-none text-xs text-blue-100/90 whitespace-pre-wrap leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
            {aiSolution}
          </div>
        </div>
      )}

      {/* Answers Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Community Answers ({post.answers?.length || 0})
        </h3>

        {/* Answers List */}
        <div className="space-y-4">
          {post.answers?.map((ans: any) => (
            <div
              key={ans.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                ans.isAccepted
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/50 ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {ans.author.profileImage ? (
                    <img src={ans.author.profileImage} alt={ans.author.fullName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {ans.author.fullName[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{ans.author.fullName}</div>
                    <div className="text-[10px] text-slate-400">{ans.author.role || 'Contributor'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ans.isAccepted ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accepted Solution
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcceptAnswer(ans.id)}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-[11px] font-semibold transition-colors"
                    >
                      Mark as Solution
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800">
                {ans.content}
              </div>

              <div className="flex items-center justify-end gap-3 text-xs">
                <button
                  onClick={() => handleUpvoteAnswer(ans.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> {ans.upvotes}
                </button>
              </div>
            </div>
          ))}

          {(!post.answers || post.answers.length === 0) && (
            <div className="text-center py-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500">
              No community answers posted yet. Be the first to help!
            </div>
          )}
        </div>

        {/* Submit Answer Form */}
        <form onSubmit={handlePostAnswer} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Submit Your Answer</h4>
          <textarea
            required
            rows={4}
            placeholder="Type your technical explanation and code solution here..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white font-mono"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingAnswer}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-75"
            >
              {submittingAnswer ? 'Posting...' : (
                <>
                  <Send className="w-3.5 h-3.5" /> Post Answer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
