"use client";

import React, { useState } from 'react';
import { Search, Plus, Star, ThumbsUp, Trash2, CheckCircle, Tag, BookOpen } from 'lucide-react';
import SkillLearningModal from './SkillLearningModal';

type Skill = {
  id: string;
  name: string;
  category?: string | null;
};

type UserSkill = {
  id: string;
  skillId: string;
  level: number;
  endorsementCnt: number;
  skill: Skill;
  endorsements?: any[];
};

type Props = {
  skills: Skill[];
  userSkills: UserSkill[];
  onRefresh: () => void;
};

const CATEGORIES = ['All', 'Frontend', 'Backend', 'DevOps & Cloud', 'AI & Data', 'Security', 'Soft Skills'];

export default function SkillMapMatrix({ skills, userSkills, onRefresh }: Props) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [learningSkill, setLearningSkill] = useState<Skill | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUserSkill = (skillId: string) => userSkills.find((us) => us.skillId === skillId);

  // Filter skills
  const filteredSkills = skills.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCat === 'All') return true;

    const cat = (s.category || '').toLowerCase();
    const sc = selectedCat.toLowerCase();
    if (sc.includes('front')) return cat.includes('front') || ['html','css','javascript','typescript','react','vue','tailwind','next.js'].some(k => s.name.toLowerCase().includes(k));
    if (sc.includes('back')) return cat.includes('back') || ['node.js','express','python','django','flask','sql','postgresql','mysql','mongodb'].some(k => s.name.toLowerCase().includes(k));
    if (sc.includes('devops')) return cat.includes('devops') || cat.includes('cloud') || ['docker','kubernetes','aws','azure','gcp','ci/cd'].some(k => s.name.toLowerCase().includes(k));
    if (sc.includes('data')) return cat.includes('data') || cat.includes('ai') || ['python','machine learning','tensorflow','pytorch','data analysis'].some(k => s.name.toLowerCase().includes(k));
    if (sc.includes('sec')) return cat.includes('sec') || ['wazuh','linux','network security'].some(k => s.name.toLowerCase().includes(k));
    if (sc.includes('soft')) return cat.includes('soft') || ['communication','system design'].some(k => s.name.toLowerCase().includes(k));

    return true;
  });

  const handleSetLevel = async (skillId: string, level: number, skillName?: string, category?: string) => {
    try {
      const body = skillId ? { skillId, level } : { skillName, category, level };
      const res = await fetch('/api/user-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        onRefresh();
      } else {
        alert(json.message || 'Failed to update skill');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to remove this skill from your profile?')) return;
    try {
      const res = await fetch(`/api/user-skills?skillId=${skillId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        onRefresh();
      } else {
        alert(json.message || 'Failed to delete skill');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCustomSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setIsSubmitting(true);
    try {
      await handleSetLevel('', newSkillLevel, newSkillName.trim(), newSkillCat);
      setNewSkillName('');
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills by name (e.g. React, Docker, Python)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Custom Skill
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const us = getUserSkill(skill.id);
          const level = us?.level || 0;
          const endorsements = us?.endorsementCnt || 0;

          return (
            <div
              key={skill.id}
              className={`relative bg-white dark:bg-slate-900 border transition-all rounded-2xl p-5 shadow-sm hover:shadow-md ${
                level > 0
                  ? 'border-blue-500/40 dark:border-blue-500/30 ring-1 ring-blue-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-1.5">
                    {skill.name}
                    {level >= 4 && <CheckCircle className="w-4 h-4 text-emerald-500 inline shrink-0" />}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {skill.category || 'General'}
                    </span>
                    {endorsements > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {endorsements}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setLearningSkill(skill)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title={`Learn ${skill.name}`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <div className="text-xs font-bold px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {level > 0 ? `Lvl ${level}/5` : 'Unrated'}
                  </div>
                  {level > 0 && (
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Level Star Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Proficiency Level:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {level === 1 && 'Novice'}
                    {level === 2 && 'Advanced Beginner'}
                    {level === 3 && 'Competent'}
                    {level === 4 && 'Proficient'}
                    {level === 5 && 'Expert'}
                    {level === 0 && 'Not set'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleSetLevel(skill.id, lvl, skill.name)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        lvl <= level
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${lvl <= level ? 'fill-white' : ''}`} />
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Tag className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">No skills match your search</h3>
          <p className="text-xs text-slate-500 mt-1">Try searching for something else or add a custom skill.</p>
        </div>
      )}

      {/* Add Custom Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Add Custom Skill</h3>
            <p className="text-xs text-slate-500 mb-4">Add a new skill to track in your U-SkillMap matrix.</p>

            <form onSubmit={handleAddCustomSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GraphQL, Tailwind CSS, Rust..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Domain Category</label>
                <select
                  value={newSkillCat}
                  onChange={(e) => setNewSkillCat(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="AI & Data">AI & Data</option>
                  <option value="Security">Security</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Level (1 - 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewSkillLevel(lvl)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        newSkillLevel === lvl
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Lvl {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/20"
                >
                  {isSubmitting ? 'Saving...' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Skill Learning Modal */}
      {learningSkill && (
        <SkillLearningModal skill={learningSkill} onClose={() => setLearningSkill(null)} />
      )}
    </div>
  );
}
