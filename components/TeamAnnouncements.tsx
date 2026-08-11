"use client";

import { useState, useEffect } from "react";
import { Send, Megaphone, Loader2 } from "lucide-react";

export default function TeamAnnouncements({ teamId, currentUser, isOwner }: { teamId: string, currentUser: any, isOwner: boolean }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}/announcements`);
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 10000);
    return () => clearInterval(interval);
  }, [teamId]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || posting) return;

    setPosting(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/announcements`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: newContent })
      });
      const data = await res.json();
      if (data.success) {
        setNewContent("");
        setAnnouncements([data.announcement, ...announcements]);
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[500px]">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-500" /> Announcements
          </h3>
          <p className="text-xs text-slate-500 mt-1">Important updates from the team owner</p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {announcements.length === 0 ? (
          <div className="text-center h-full flex flex-col items-center justify-center text-slate-400">
            <Megaphone className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700" />
            <p className="text-sm">No announcements yet.</p>
          </div>
        ) : (
          announcements.map((ann, i) => (
            <div key={ann.id || i} className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold bg-amber-500 shadow-sm">
                {ann.author.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{ann.author.fullName}</div>
                  <div className="text-xs text-slate-500 font-medium">
                    {new Date(ann.createdAt).toLocaleDateString()} at {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{ann.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area (Owner Only) */}
      {isOwner && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handlePost} className="flex flex-col gap-3">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write a new announcement to the team..."
              className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl outline-none transition-all text-sm resize-none min-h-[80px]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newContent.trim() || posting}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 shadow-sm flex items-center gap-2"
              >
                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                Post Announcement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
