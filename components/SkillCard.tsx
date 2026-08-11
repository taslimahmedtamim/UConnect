"use client";

import React from 'react';

type Props = {
  skill: any;
  userSkill?: any;
  onSetLevel?: (skillId: string, level: number, skillName?: string) => void;
};

export default function SkillCard({ skill, userSkill, onSetLevel }: Props) {
  const level = userSkill?.level || 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{skill.name}</div>
          {skill.category ? <div className="text-xs text-slate-500 mt-1">{skill.category}</div> : null}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">{level ? `Lvl ${level}` : '—'}</div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            onClick={() => onSetLevel?.(skill.id, n, skill.name)}
            className={`px-2 py-1 rounded-md text-xs ${n <= level ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
