"use client";

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, HelpCircle, Clock } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: any;
  status: string;
  views: number;
  upvotes: number;
  createdAt: string;
  answerCount: number;
  hasAcceptedAnswer: boolean;
  author: {
    id: string;
    fullName: string;
    username?: string | null;
    profileImage?: string | null;
  };
};

type Props = {
  post: Post;
  onUpvote?: (id: string) => void;
};

export default function HelpPostCard({ post, onUpvote }: Props) {
  const isSolved = post.status === 'solved' || post.hasAcceptedAnswer;

  const initials = post.author.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
      isSolved 
        ? 'border-emerald-500/40 dark:border-emerald-500/30 ring-1 ring-emerald-500/10' 
        : 'border-slate-200 dark:border-slate-800'
    }`}>
      <div>
        {/* Category & Status Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            {post.category}
          </span>

          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
            isSolved
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
          }`}>
            {isSolved ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Solved
              </>
            ) : (
              <>
                <HelpCircle className="w-3 h-3 text-amber-600" /> Open Question
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/help/${post.id}`}
          className="font-bold text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 mb-2 block"
        >
          {post.title}
        </Link>

        {/* Content Snippet */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
          {post.content}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2 overflow-hidden">
          {post.author.profileImage ? (
            <img src={post.author.profileImage} alt={post.author.fullName} className="w-6 h-6 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {initials}
            </div>
          )}
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate text-[11px]">
            {post.author.fullName}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {post.answerCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" /> {post.views}
          </span>
          <button
            onClick={() => onUpvote?.(post.id)}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-0.5 rounded-lg transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" /> {post.upvotes}
          </button>
        </div>
      </div>
    </div>
  );
}
