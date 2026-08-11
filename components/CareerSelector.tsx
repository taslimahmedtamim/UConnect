"use client";

import React, { useEffect, useState } from 'react';

export default function CareerSelector() {
  const [paths, setPaths] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [userChoice, setUserChoice] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/career-paths');
      const json = await res.json();
      if (json.success) setPaths(json.careerPaths || []);

      const ucRes = await fetch('/api/user-career');
      const ucJson = await ucRes.json();
      if (ucJson.success) setUserChoice(ucJson.userCareer || null);
    };
    fetchData();
  }, []);

  const choose = async (id: string) => {
    const res = await fetch('/api/user-career', { method: 'POST', body: JSON.stringify({ careerPathId: id }), headers: { 'Content-Type': 'application/json' } });
    const json = await res.json();
    if (json.success) setUserChoice(json.userCareer);
    else alert(json.message || 'Failed');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paths.map(p => (
          <div key={p.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{p.title}</div>
                <div className="text-sm text-slate-500 mt-1">{p.description}</div>
              </div>
              <div>
                <button onClick={() => choose(p.id)} className="px-3 py-1 rounded bg-blue-600 text-white">Choose</button>
              </div>
            </div>
            {p.skills?.length ? (
              <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">Required: {p.skills.map((s:any) => s.skill.name).join(', ')}</div>
            ) : null}
          </div>
        ))}
      </div>

      {userChoice ? (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <div className="font-semibold">Your chosen career: {userChoice.careerPath.title}</div>
          <div className="text-sm mt-2">Required skills:</div>
          <ul className="text-sm mt-1 list-disc list-inside">
            {userChoice.careerPath.skills.map((s:any) => (
              <li key={s.id}>{s.skill.name} (importance {s.importance})</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
