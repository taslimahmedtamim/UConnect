"use client";

import React, { useState } from 'react';
import { X, GraduationCap, Sparkles, Check } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function BecomeMentorModal({ isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [expertiseStr, setExpertiseStr] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [availability, setAvailability] = useState('Weekends & Evenings');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !expertiseStr.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          company: company.trim(),
          expertise: expertiseStr.split(',').map(s => s.trim()).filter(Boolean),
          experienceYears: Number(experienceYears),
          availability: availability.trim(),
          bio: bio.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        alert('Congratulations! Your mentor profile is active.');
        onSuccess();
        onClose();
      } else {
        alert(json.message || 'Failed to update mentor profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error registering mentor profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
              <GraduationCap className="w-3.5 h-3.5" /> Peer & Industry Mentor
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Become a UConnect Mentor
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Share your technical expertise, guide aspiring developers, and build your mentorship portfolio.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Professional Role / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Frontend Engineer, DevOps Architect, AI Researcher..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Google, Tech Lead at University Lab..."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Core Expertise Topics (Comma separated) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. React, Node.js, System Design, Wazuh, Python..."
              value={expertiseStr}
              onChange={(e) => setExpertiseStr(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              General Availability
            </label>
            <input
              type="text"
              placeholder="e.g. Weekends, Tue/Thu Evenings..."
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mentor Bio / Intro
            </label>
            <textarea
              rows={3}
              placeholder="Tell students about your domain experience, projects you've shipped, and how you love to help..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-75"
            >
              {submitting ? 'Saving...' : (
                <>
                  <Check className="w-3.5 h-3.5" /> Save Mentor Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
