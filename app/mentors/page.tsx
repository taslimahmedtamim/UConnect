"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@/components/UserProvider';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Video, 
  UserCheck, 
  Filter 
} from 'lucide-react';
import MentorCard from '@/components/MentorCard';
import BookSessionModal from '@/components/BookSessionModal';
import BecomeMentorModal from '@/components/BecomeMentorModal';
import AIMentorMatchWidget from '@/components/AIMentorMatchWidget';

const SKILL_FILTERS = [
  'All',
  'React',
  'Node.js',
  'Python',
  'DevOps',
  'Docker',
  'Wazuh',
  'System Design',
  'Machine Learning'
];

export default function MentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedMentorToBook, setSelectedMentorToBook] = useState<any | null>(null);
  const [showBecomeMentorModal, setShowBecomeMentorModal] = useState(false);
  const { user } = useUser();
  const isEducator = user?.role === 'teacher' || user?.role === 'mentor';
  const [activeTab, setActiveTab] = useState<'directory' | 'sessions'>('directory');

  useEffect(() => {
    if (isEducator) {
      setActiveTab('sessions');
    }
  }, [isEducator]);

  const fetchMentors = useCallback(async () => {
    try {
      const q = encodeURIComponent(searchTerm);
      const sk = selectedSkill === 'All' ? '' : encodeURIComponent(selectedSkill);
      const [mRes, rRes] = await Promise.all([
        fetch(`/api/mentors?q=${q}&skill=${sk}`),
        fetch('/api/mentors/requests')
      ]);

      const mJson = await mRes.json();
      const rJson = await rRes.json();

      if (mJson.success) setMentors(mJson.mentors || []);
      if (rJson.success) {
        setSentRequests(rJson.sentRequests || []);
        setReceivedRequests(rJson.receivedRequests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedSkill]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const handleRequestStatusChange = async (requestId: string, status: string, meetingUrl?: string) => {
    try {
      const res = await fetch('/api/mentors/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status, meetingUrl })
      });
      const json = await res.json();
      if (json.success) {
        fetchMentors();
      } else {
        alert(json.message || 'Failed to update request status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              UConnect Mentors <span className="text-purple-600">.</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Connect 1-on-1 with industry veterans and student leaders for code reviews, career prep, and skill guidance.
          </p>
        </div>

        {!isEducator && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBecomeMentorModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              Become a Mentor
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs (Directory vs Active Sessions) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('directory')}
            className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 font-bold text-xs transition-all ${
              activeTab === 'directory'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Mentor Directory ({mentors.length})
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 font-bold text-xs transition-all ${
              activeTab === 'sessions'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> My 1-on-1 Sessions ({sentRequests.length + receivedRequests.length})
          </button>
        </nav>
      </div>

      {activeTab === 'directory' && (
        <div className="space-y-8">
          {/* AI Matchmaker Banner Widget */}
          {!isEducator && <AIMentorMatchWidget onBookSession={(m) => setSelectedMentorToBook(m)} />}

          {/* Search & Filter Bar */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, company, or role (e.g. Google, Frontend, Security)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Skill Filter Badges */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5" /> Topic Filter:
              </span>
              {SKILL_FILTERS.map((sf) => (
                <button
                  key={sf}
                  onClick={() => setSelectedSkill(sf)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSkill === sf
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {sf}
                </button>
              ))}
            </div>
          </div>

          {/* Mentor Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading verified mentors...</div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No mentors found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search filter.</p>
              {!isEducator && (
                <button
                  onClick={() => setShowBecomeMentorModal(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl"
                >
                  Become a Mentor
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onBookSession={(m) => setSelectedMentorToBook(m)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sessions Management Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Sent Requests */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">My Booked Sessions (As Student)</h3>
            <p className="text-xs text-slate-500 mb-4">Sessions you requested with mentors.</p>

            <div className="space-y-3">
              {sentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 gap-3"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      Topic: {req.topic}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          req.status === 'accepted'
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                            : req.status === 'rejected'
                            ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      Mentor: <span className="font-semibold text-slate-700 dark:text-slate-300">{req.mentor?.fullName}</span> ({req.mentor?.mentorProfile?.title})
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic font-medium">"{req.message}"</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {req.status === 'accepted' && (
                      <Link
                        href={req.meetingUrl || '/messages'}
                        target={req.meetingUrl ? '_blank' : '_self'}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
                      >
                        <Video className="w-3.5 h-3.5" /> Join Session
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {sentRequests.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-500">No session requests sent yet.</div>
              )}
            </div>
          </div>

          {/* Received Requests for Mentors */}
          {receivedRequests.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Incoming Student Booking Requests</h3>
              <p className="text-xs text-slate-500 mb-4">Requests submitted to you as a mentor.</p>

              <div className="space-y-3">
                {receivedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 gap-3"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        Student: {req.student?.fullName}
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {req.student?.university || 'Student'}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                        Topic: {req.topic}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">"{req.message}"</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleRequestStatusChange(req.id, 'accepted', 'https://meet.google.com/new')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                          >
                            Accept Session
                          </button>
                          <button
                            onClick={() => handleRequestStatusChange(req.id, 'rejected')}
                            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 uppercase">{req.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <BookSessionModal
        mentor={selectedMentorToBook}
        onClose={() => setSelectedMentorToBook(null)}
        onSuccess={fetchMentors}
      />

      <BecomeMentorModal
        isOpen={showBecomeMentorModal}
        onClose={() => setShowBecomeMentorModal(false)}
        onSuccess={fetchMentors}
      />
    </div>
  );
}
