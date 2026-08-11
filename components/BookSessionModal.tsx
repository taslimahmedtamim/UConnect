"use client";

import React, { useState } from 'react';
import { X, Calendar, MessageSquare, Clock, Send, Sparkles } from 'lucide-react';

type Mentor = {
  id: string;
  userId: string;
  title: string;
  company?: string | null;
  user: {
    fullName: string;
  };
};

type Props = {
  mentor: Mentor | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function BookSessionModal({ mentor, onClose, onSuccess }: Props) {
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!mentor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/mentors/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: mentor.userId,
          topic: topic.trim(),
          message: message.trim(),
          scheduledAt: scheduledAt || null
        })
      });

      const json = await res.json();
      if (json.success) {
        alert('Mentorship request sent successfully! The mentor will be notified.');
        onSuccess();
        onClose();
      } else {
        alert(json.message || 'Failed to send request');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending booking request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" /> 1-on-1 Mentorship Session
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Request Session with {mentor.user.fullName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {mentor.title} {mentor.company ? `at ${mentor.company}` : ''}
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
              Mentorship Topic / Skill Focus *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. System Design Review, React Architecture, Career Advice..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message to Mentor *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Briefly introduce yourself, your current project or skill goal, and what specific guidance you'd like to get out of this session..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-75"
            >
              {submitting ? 'Sending Request...' : (
                <>
                  <Send className="w-3.5 h-3.5" /> Send Booking Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
