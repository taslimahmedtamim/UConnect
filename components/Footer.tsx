"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Layers, 
  GraduationCap, 
  Trophy, 
  HelpCircle, 
  FileText, 
  Users, 
  Briefcase, 
  Code2, 
  Mail, 
  Heart,
  Globe
} from 'lucide-react';

import GitHubContributors from './GitHubContributors';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info (2 columns wide) */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold text-white">
              <Zap className="w-8 h-8 text-blue-600" fill="currentColor" />
              <span className="font-extrabold tracking-tight">UConnect<span className="text-blue-500">.</span></span>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The AI-driven career development and team matchmaking ecosystem. Empowering university students, developers, and mentors with interactive skill maps, AI roadmaps, and 1-on-1 guidance.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/taslimahmedtamim/UConnect"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="GitHub Repository"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@uconnect.app"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Contact Support"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/taslimahmedtamim/UConnect"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Global Network"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Career Tools Column */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Career Tools</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/skillmap" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" /> U-SkillMap Suite
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-500" /> U-Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500" /> Career Profile
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" /> Internships & Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Mentorship Column */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Community & Mentors</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/mentors" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Peer Mentors
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> Hall of Fame
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Help Board & Q&A
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" /> Team Matchmaker
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Status Column */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Ecosystem Status</h4>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> All Systems Operational
              </div>
              <p className="text-[11px] text-slate-400">
                Powered by Next.js 16 App Router, Prisma ORM, MySQL & Google Gemini AI SDK.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & GitHub Contributors Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} <span className="font-bold text-white">UConnect 2.0</span>. Built for Students, Developers & Mentors.
          </div>

          {/* Dynamic GitHub Contributors */}
          <GitHubContributors />
        </div>
      </div>
    </footer>
  );
}
