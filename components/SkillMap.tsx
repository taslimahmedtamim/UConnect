"use client";

import React, { useEffect, useState } from 'react';
import SkillCard from './SkillCard';

export default function SkillMap() {
  const [skills, setSkills] = useState<any[]>([]);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, uRes] = await Promise.all([fetch('/api/skills'), fetch('/api/user-skills')]);
        const sJson = await sRes.json();
        const uJson = await uRes.json();
        if (sJson.success) setSkills(sJson.skills);
        if (uJson.success) setUserSkills(uJson.userSkills || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSetLevel = async (skillId: string, level: number, skillName?: string) => {
    try {
      const body = skillId ? { skillId, level } : { skillName, level };
      const res = await fetch('/api/user-skills', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
      const json = await res.json();
      if (json.success) {
        // refresh user skills
        const uRes = await fetch('/api/user-skills');
        const uJson = await uRes.json();
        if (uJson.success) setUserSkills(uJson.userSkills || []);
      } else {
        alert(json.message || 'Failed to save skill');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving skill');
    }
  };

  const getUserSkillFor = (skillId: string) => userSkills.find((us) => us.skillId === skillId);

  if (loading) return <div className="p-6">Loading skills…</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((s) => (
        <SkillCard key={s.id} skill={s} userSkill={getUserSkillFor(s.id)} onSetLevel={handleSetLevel} />
      ))}
    </div>
  );
}
