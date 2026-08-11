"use client";

import { useEffect, useState } from "react";
import { Briefcase, CheckCircle, XCircle, ArrowLeft, Star, User } from "lucide-react";
import Link from "next/link";

export default function ManageOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchManagedOpportunities = async () => {
    try {
      const res = await fetch("/api/opportunities/manage");
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagedOpportunities();
  }, []);

  const handleUpdateStatus = async (applicationId: string, status: string) => {
    try {
      const res = await fetch(`/api/opportunities/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchManagedOpportunities();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20";
    if (score >= 60) return "text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20";
    return "text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20";
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8">
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Briefcase className="text-blue-500 w-8 h-8" />
          Manage Applicants
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review AI-evaluated applications for your job postings.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading your opportunities...</div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-400 opacity-50" />
          <p className="font-medium text-lg text-slate-600 dark:text-slate-300">No opportunities posted</p>
          <p className="text-sm mt-1">You haven't posted any jobs or internships yet.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {opportunities.map(opp => (
            <div key={opp.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{opp.title}</h2>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{opp.company} • {opp.location}</span>
                </div>
                <div className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold rounded-full">
                  {opp.applications.length} Applicants
                </div>
              </div>

              {opp.applications.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-4">No applications received yet.</p>
              ) : (
                <div className="space-y-4">
                  {opp.applications.map((app: any) => (
                    <div key={app.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row gap-6 items-start">
                      
                      {/* Student Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{app.student.fullName}</h3>
                            <p className="text-xs text-slate-500">{app.student.university} • {app.student.department}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-500" /> AI Feedback
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            "{app.aiFeedback}"
                          </p>
                        </div>
                      </div>

                      {/* Score & Actions */}
                      <div className="flex flex-col items-center justify-center min-w-[140px] shrink-0 gap-4 w-full md:w-auto">
                        <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreColor(app.aiScore)}`}>
                          <span className="text-2xl font-black">{app.aiScore}</span>
                          <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Match</span>
                        </div>

                        {app.status === 'pending' ? (
                          <div className="flex gap-2 w-full">
                            <button 
                              onClick={() => handleUpdateStatus(app.id, 'accepted')}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" /> Accept
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        ) : (
                          <div className={`w-full py-1.5 text-center rounded-lg text-xs font-bold uppercase tracking-wider ${
                            app.status === 'accepted' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {app.status}
                          </div>
                        )}
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
