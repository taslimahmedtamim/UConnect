"use client";

import React from 'react';
import SkillMap from '@/components/SkillMap';
import CareerSelector from '@/components/CareerSelector';

export default function SkillmapSkillsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div>
        <h2 className="text-lg font-bold">Skill Map</h2>
        <p className="text-sm text-slate-500">Track your skill levels here.</p>
      </div>
      <SkillMap />

      <div>
        <h2 className="text-lg font-bold">Career Paths</h2>
        <p className="text-sm text-slate-500">Choose a career path to see required skills.</p>
      </div>
      <CareerSelector />
    </div>
  );
}
