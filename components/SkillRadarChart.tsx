"use client";

import React, { useMemo } from 'react';

type SkillItem = {
  id?: string;
  level: number;
  skill?: {
    name: string;
    category?: string | null;
  };
};

type Props = {
  userSkills: SkillItem[];
};

export default function SkillRadarChart({ userSkills }: Props) {
  // Aggregate user skill levels into core domains
  const domainData = useMemo(() => {
    const categories: Record<string, { label: string; maxLevel: number; count: number }> = {
      Frontend: { label: 'Frontend', maxLevel: 0, count: 0 },
      Backend: { label: 'Backend', maxLevel: 0, count: 0 },
      DevOps: { label: 'DevOps / Cloud', maxLevel: 0, count: 0 },
      Data: { label: 'AI / Data Science', maxLevel: 0, count: 0 },
      Security: { label: 'Security', maxLevel: 0, count: 0 },
      SoftSkills: { label: 'Soft Skills', maxLevel: 0, count: 0 }
    };

    userSkills.forEach((us) => {
      const name = (us.skill?.name || '').toLowerCase();
      const cat = (us.skill?.category || '').toLowerCase();
      const lvl = us.level || 0;

      let key = 'Backend';
      if (cat.includes('front') || ['html', 'css', 'javascript', 'typescript', 'react', 'vue', 'tailwind', 'next.js'].some(k => name.includes(k))) {
        key = 'Frontend';
      } else if (cat.includes('devops') || cat.includes('cloud') || ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'linux'].some(k => name.includes(k))) {
        key = 'DevOps';
      } else if (cat.includes('data') || cat.includes('ai') || cat.includes('machine') || ['python', 'tensorflow', 'pytorch', 'machine learning', 'data analysis', 'pandas'].some(k => name.includes(k))) {
        key = 'Data';
      } else if (cat.includes('sec') || ['wazuh', 'network security', 'cyber', 'pentest'].some(k => name.includes(k))) {
        key = 'Security';
      } else if (cat.includes('soft') || ['communication', 'teamwork', 'leadership', 'system design'].some(k => name.includes(k))) {
        key = 'SoftSkills';
      }

      categories[key].maxLevel = Math.max(categories[key].maxLevel, lvl);
      categories[key].count += 1;
    });

    // Provide baseline minimums for visual appeal if empty
    return [
      { label: 'Frontend', value: categories.Frontend.maxLevel || 1 },
      { label: 'Backend', value: categories.Backend.maxLevel || 1 },
      { label: 'DevOps & Cloud', value: categories.DevOps.maxLevel || 1 },
      { label: 'AI & Data', value: categories.Data.maxLevel || 1 },
      { label: 'Security', value: categories.Security.maxLevel || 1 },
      { label: 'System & Soft Skills', value: categories.SoftSkills.maxLevel || 1 }
    ];
  }, [userSkills]);

  const size = 320;
  const center = size / 2;
  const radius = 105;
  const numAxes = domainData.length;
  const maxVal = 5;

  // Compute radar coordinates
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (val / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points string for levels 1 to 5 grid
  const gridPolygons = [1, 2, 3, 4, 5].map((lvl) => {
    return domainData
      .map((_, i) => {
        const { x, y } = getCoordinates(i, lvl);
        return `${x},${y}`;
      })
      .join(' ');
  });

  // User polygon points
  const userPolygonPoints = domainData
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.value);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skill Radar Matrix</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Visual proficiency across 6 key technical domains (L1 - L5)</p>
      </div>

      <div className="relative w-full flex justify-center items-center overflow-visible py-2">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] h-auto overflow-visible">
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
            </radialGradient>
            <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>

          {/* Grid Background Polygons */}
          {gridPolygons.map((pts, idx) => (
            <polygon
              key={idx}
              points={pts}
              fill="none"
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
              strokeDasharray={idx === 4 ? "none" : "2,2"}
            />
          ))}

          {/* Axes lines */}
          {domainData.map((_, i) => {
            const { x, y } = getCoordinates(i, maxVal);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="1.5"
              />
            );
          })}

          {/* User Filled Radar Polygon */}
          <polygon
            points={userPolygonPoints}
            fill="url(#radarGradient)"
            stroke="url(#strokeGradient)"
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out drop-shadow-md"
          />

          {/* Points & Axis Labels */}
          {domainData.map((d, i) => {
            const pt = getCoordinates(i, d.value);
            const labelPt = getCoordinates(i, maxVal + 1.25);

            return (
              <g key={i}>
                {/* Node circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  className="fill-blue-600 dark:fill-blue-400 stroke-white dark:stroke-slate-900"
                  strokeWidth="2"
                />

                {/* Domain Text Label */}
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300"
                >
                  {d.label}
                </text>
                <text
                  x={labelPt.x}
                  y={labelPt.y + 13}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[10px] font-bold fill-blue-600 dark:fill-blue-400"
                >
                  Lvl {d.value}/5
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center">
        {domainData.map((d, i) => (
          <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{d.label}</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Lvl {d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
