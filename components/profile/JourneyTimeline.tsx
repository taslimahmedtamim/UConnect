"use client";

import React, { useMemo } from 'react';
import { Briefcase, Award, Globe, ShieldCheck, Calendar, X } from 'lucide-react';

type TimelineItem = {
  type: 'experience' | 'certificate' | 'project';
  title: string;
  subtitle: string;
  description?: string;
  dateStr: string;
  year: number;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  extra?: any;
  originalIndex?: number;
};

export default function JourneyTimeline({
  experiences = [],
  certificates = [],
  projects = [],
  isEditing = false,
  onRemoveItem
}: {
  experiences: any[];
  certificates: any[];
  projects: any[];
  isEditing?: boolean;
  onRemoveItem?: (type: 'experience' | 'certificate' | 'project', index: number) => void;
}) {
  const items = useMemo(() => {
    const list: TimelineItem[] = [];

    // Parse experiences
    experiences.forEach((exp, index) => {
      let year = 2020;
      const match = exp.duration?.match(/\d{4}/);
      if (match) year = parseInt(match[0], 10);

      list.push({
        type: 'experience',
        title: exp.title,
        subtitle: exp.company,
        description: exp.description,
        dateStr: exp.duration,
        year,
        icon: <Briefcase className="w-5 h-5" />,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-100 dark:bg-purple-900/30',
        extra: exp,
        originalIndex: index,
      });
    });

    // Parse certificates
    certificates.forEach((cert, index) => {
      let year = 2020;
      const match = cert.date?.match(/\d{4}/);
      if (match) year = parseInt(match[0], 10);
      
      list.push({
        type: 'certificate',
        title: cert.name,
        subtitle: cert.issuer,
        dateStr: cert.date,
        year,
        icon: <Award className="w-5 h-5" />,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        extra: cert,
        originalIndex: index,
      });
    });

    // Parse projects
    projects.forEach((proj, index) => {
      let year = new Date().getFullYear();
      if (proj.createdAt) {
        year = new Date(proj.createdAt).getFullYear();
      }
      
      list.push({
        type: 'project',
        title: proj.title,
        subtitle: 'Personal Project',
        description: proj.description,
        dateStr: proj.createdAt ? new Date(proj.createdAt).toLocaleDateString() : 'Recent',
        year,
        icon: <Globe className="w-5 h-5" />,
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
        extra: proj,
        originalIndex: index,
      });
    });

    // Sort descending by year
    return list.sort((a, b) => b.year - a.year);
  }, [experiences, certificates, projects]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 italic">No journey milestones yet.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 md:ml-8 py-4 space-y-12">
      {items.map((item, i) => (
        <div key={i} className="relative pl-8 sm:pl-10 group">
          {/* Timeline Dot */}
          <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${item.iconBg} ${item.iconColor} shadow-sm group-hover:scale-110 transition-transform`}>
            {item.icon}
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">{item.subtitle}</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5" />
                {item.dateStr}
              </div>
            </div>

            {item.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {item.description}
              </p>
            )}

            {/* Extra specifics based on type */}
            {item.type === 'certificate' && item.extra?.isVerified && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                <ShieldCheck className="w-4 h-4" /> Blockchain Verified
              </div>
            )}
            
            {item.type === 'project' && item.extra?.tags && (
              <div className="flex flex-wrap gap-2">
                {item.extra.tags.slice(0, 4).map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-900 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {isEditing && (
              <button
                onClick={() => onRemoveItem && onRemoveItem(item.type, item.originalIndex as number)}
                className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity bg-red-50 dark:bg-red-900/30 rounded-full"
                title={`Remove ${item.type}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
