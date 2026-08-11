"use client";

import React from 'react';
import { Star, Briefcase, Calendar, CheckCircle2, MessageSquare, Award } from 'lucide-react';

type Mentor = {
  id: string;
  userId: string;
  title: string;
  company?: string | null;
  expertise?: any;
  experienceYears?: number;
  availability?: string | null;
  bio?: string | null;
  rating?: number;
  reviewsCount?: number;
  featured?: boolean;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string | null;
    githubUsername?: string | null;
  };
  matchPercentage?: number;
  aiReason?: string;
};

type Props = {
  mentor: Mentor;
  onBookSession: (mentor: Mentor) => void;
};

export default function MentorCard({ mentor, onBookSession }: Props) {
  let expertiseList: string[] = [];
  if (Array.isArray(mentor.expertise)) {
    expertiseList = mentor.expertise as string[];
  }

  const initials = mentor.user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
      mentor.featured 
        ? 'border-blue-500/40 dark:border-blue-500/30 ring-1 ring-blue-500/10' 
        : 'border-slate-200 dark:border-slate-800'
    }`}>
      {mentor.featured && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-sm">
          Verified Mentor
        </div>
      )}

      <div>
        {/* Mentor Header */}
        <div className="flex items-start gap-4 mb-4">
          {mentor.user.profileImage ? (
            <img
              src={mentor.user.profileImage}
              alt={mentor.user.fullName}
              className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shrink-0 shadow-md shadow-blue-600/20">
              {initials}
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-lg truncate flex items-center gap-1.5">
              {mentor.user.fullName}
              <CheckCircle2 className="w-4 h-4 text-blue-600 inline shrink-0" />
            </h4>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate mt-0.5">
              {mentor.title} {mentor.company ? `at ${mentor.company}` : ''}
            </div>

            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500" /> {mentor.rating || 5.0}
              </span>
              <span>•</span>
              <span>{mentor.experienceYears || 3}+ yrs exp</span>
            </div>
          </div>
        </div>

        {/* AI Recommendation Reason Banner */}
        {mentor.aiReason && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-blue-600 dark:text-blue-400 block mb-0.5">
              🤖 {mentor.matchPercentage || 90}% AI Match
            </span>
            {mentor.aiReason}
          </div>
        )}

        {/* Bio */}
        {mentor.bio && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
            {mentor.bio}
          </p>
        )}

        {/* Expertise Tags */}
        <div className="mb-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Core Expertise:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {expertiseList.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer & Action */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{mentor.availability || 'Flexible'}</span>
        </div>

        <button
          onClick={() => onBookSession(mentor)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Book 1-on-1
        </button>
      </div>
    </div>
  );
}
