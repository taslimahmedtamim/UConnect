"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Plus, Search, MapPin, Building, AlertCircle, CheckCircle2, XCircle, ChevronRight, UploadCloud, Sparkles } from "lucide-react";
import { useUser } from "@/components/UserProvider";

export default function OpportunitiesPage() {
  const { user } = useUser();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [applyModalOpp, setApplyModalOpp] = useState<any | null>(null);
  const [customResume, setCustomResume] = useState("");
  const [pdfBase64, setPdfBase64] = useState("");
  const [filterMode, setFilterMode] = useState<"all"|"matches"|"applied">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    type: "Internship",
    location: "",
    salary: "",
    description: "",
    requirements: ""
  });

  const fetchOpportunities = async () => {
    try {
      const res = await fetch("/api/opportunities");
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error("Failed to load opportunities", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handlePostOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split(",").map(r => r.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", company: "", type: "Internship", location: "", salary: "", description: "", requirements: "" });
        fetchOpportunities();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to post opportunity");
      }
    } catch (error) {
      console.error(error);
      alert("Error posting opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPdfBase64("");
    }
  };

  const handleApplySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !applyModalOpp) return;
    
    setApplyingId(applyModalOpp.id);
    try {
      const res = await fetch(`/api/opportunities/${applyModalOpp.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: customResume, pdfData: pdfBase64 })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Application submitted! AI Match Score: ${data.application.aiScore}%`);
        setApplyModalOpp(null);
        setCustomResume("");
        setPdfBase64("");
        fetchOpportunities(); // Refresh to show applied state
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting application");
    } finally {
      setApplyingId(null);
    }
  };

  const handleUpdateStatus = async (applicationId: string, status: string) => {
    try {
      const res = await fetch(`/api/opportunities/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOpportunities();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  // Compute matches and application statuses
  const processedOpportunities = opportunities.map(opp => {
    let matchPercent = 0;
    let missing: string[] = [];
    let matching: string[] = [];
    
    const reqSkills = opp.requirements || [];
    
    if (user) {
      if (reqSkills.length > 0) {
        matching = reqSkills.filter((s: string) => user.skills.includes(s));
        missing = reqSkills.filter((s: string) => !user.skills.includes(s));
        matchPercent = Math.round((matching.length / reqSkills.length) * 100);
      } else {
        matchPercent = 50; // Neutral baseline
      }
    }

    const application = opp.applications?.find((app: any) => app.studentId === user?.id);

    return { ...opp, matchPercent, missing, matching, application };
  });

  let displayOpps = processedOpportunities;

  // Apply search filter
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    displayOpps = displayOpps.filter(o =>
      o.title.toLowerCase().includes(q) ||
      o.company.toLowerCase().includes(q) ||
      o.description?.toLowerCase().includes(q) ||
      (o.requirements || []).some((r: string) => r.toLowerCase().includes(q))
    );
  }

  if (filterMode === "matches") {
    displayOpps = displayOpps.filter(o => o.matchPercent > 0).sort((a, b) => b.matchPercent - a.matchPercent);
  } else if (filterMode === "applied") {
    displayOpps = displayOpps.filter(o => !!o.application);
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" /> Opportunities
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Find internships, jobs, and roles that match your skill profile.</p>
        </div>
        {user?.role && ['mentor', 'recruiter', 'admin'].includes(user.role) && (
          <div className="flex gap-3">
            <Link
              href="/opportunities/manage"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Briefcase className="w-5 h-5" /> Manage Applicants
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" /> Post Job
            </button>
          </div>
        )}
      </div>



      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title, company, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-sm">
          <button onClick={() => setFilterMode("all")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${filterMode === "all" ? "bg-white dark:bg-slate-700/50 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>All Roles</button>
          <button onClick={() => setFilterMode("matches")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${filterMode === "matches" ? "bg-white dark:bg-slate-700/50 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>Top Matches</button>
          <button onClick={() => setFilterMode("applied")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${filterMode === "applied" ? "bg-white dark:bg-slate-700/50 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>Applied</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : displayOpps.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">No opportunities found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">Check back later or adjust your filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayOpps.map((opp) => (
            <div key={opp.id} className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800/80 transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
                
                {/* Left Side: Job Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{opp.title}</h2>
                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{opp.type}</span>
                    {opp.application && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                        opp.application.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                        opp.application.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {opp.application.status === 'accepted' ? <CheckCircle2 className="w-3 h-3" /> :
                         opp.application.status === 'rejected' ? <XCircle className="w-3 h-3" /> :
                         <AlertCircle className="w-3 h-3" />}
                        {opp.application.status === 'pending' ? 'Applied (Pending)' : opp.application.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {opp.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {opp.location}</span>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {opp.description}
                  </p>
                </div>

                {/* Right Side: Explainable AI Match */}
                {user && opp.postedById !== user.id && (
                  <div className="w-full lg:w-[350px] shrink-0 bg-slate-50 dark:bg-[#1e2738]/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800/60 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">AI Match Score</span>
                      <span className={`text-xl font-black ${
                        (opp.application?.aiScore || opp.matchPercent) >= 80 ? 'text-emerald-500' :
                        (opp.application?.aiScore || opp.matchPercent) >= 50 ? 'text-blue-400' : 'text-slate-400'
                      }`}>
                        {opp.application?.aiScore || opp.matchPercent}%
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                      <div 
                        className={`h-full rounded-full ${(opp.application?.aiScore || opp.matchPercent) >= 80 ? 'bg-emerald-500' : (opp.application?.aiScore || opp.matchPercent) >= 50 ? 'bg-amber-500' : 'bg-slate-400'}`}
                        style={{ width: `${opp.application?.aiScore || opp.matchPercent}%` }}
                      ></div>
                    </div>

                    <div className="space-y-3">
                      {opp.matching.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> You Matched:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {opp.matching.map((s: string, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-100 dark:border-emerald-800/50">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {opp.missing.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-orange-600 dark:text-orange-500 mb-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Missing:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {opp.missing.map((s: string, i: number) => (
                              <Link key={i} href={`/skillmap?addSkill=${encodeURIComponent(s)}`} className="text-[10px] px-2.5 py-1 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-500 rounded-md border border-orange-200 dark:border-orange-900/50 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors flex items-center gap-1 group">
                                {s} <ChevronRight className="w-3 h-3 text-orange-400 dark:text-orange-600 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-4 flex flex-col gap-3">
                      {!opp.application ? (
                        <button 
                          onClick={() => setApplyModalOpp(opp)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <button 
                          onClick={() => setApplyModalOpp(opp)}
                          className="w-full bg-emerald-50 hover:bg-indigo-50 text-emerald-700 hover:text-indigo-700 dark:bg-emerald-900/20 dark:hover:bg-indigo-900/30 dark:text-emerald-400 dark:hover:text-indigo-300 border border-emerald-200 dark:border-emerald-800/50 hover:border-indigo-200 dark:hover:border-indigo-800/50 px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <CheckCircle2 className="w-5 h-5" /> Apply Again
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Recruiter / Poster View: Manage Applicants inline */}
              {opp.postedById === user?.id && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                    Applicants ({opp.applications?.length || 0})
                  </h3>
                  {opp.applications?.length === 0 ? (
                    <p className="text-sm text-slate-500">No applications received yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {opp.applications.map((app: any) => (
                        <div key={app.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row gap-6 items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                                {app.student?.fullName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{app.student?.fullName}</h3>
                                <p className="text-xs text-slate-500">{app.student?.university} • {app.student?.department}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Feedback
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                "{app.aiFeedback}"
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center min-w-[170px] shrink-0 gap-4 w-full md:w-auto mt-4 md:mt-0">
                            <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 ${app.aiScore >= 80 ? 'text-emerald-500 border-emerald-200' : app.aiScore >= 60 ? 'text-amber-500 border-amber-200' : 'text-red-500 border-red-200'}`}>
                              <span className="text-xl font-black">{app.aiScore}</span>
                              <span className="text-[9px] uppercase font-bold tracking-widest opacity-70">Match</span>
                            </div>
                            {app.status === 'pending' ? (
                              <div className="flex gap-2 w-full">
                                <button onClick={() => handleUpdateStatus(app.id, 'accepted')} className="flex-1 flex items-center justify-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                  <CheckCircle2 className="w-4 h-4" /> Accept
                                </button>
                                <button onClick={() => handleUpdateStatus(app.id, 'rejected')} className="flex-1 flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                  <XCircle className="w-4 h-4" /> Reject
                                </button>
                              </div>
                            ) : (
                              <div className={`w-full py-1.5 text-center rounded-lg text-xs font-bold uppercase tracking-wider ${app.status === 'accepted' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                {app.status}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {applyModalOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Apply for {applyModalOpp.title}</h2>
                <p className="text-sm text-slate-500">{applyModalOpp.company}</p>
              </div>
              <button onClick={() => setApplyModalOpp(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-white dark:bg-slate-800 rounded-full shadow-sm">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-slate-50 dark:bg-[#151c2c]">
              
              <div className="bg-indigo-50/80 dark:bg-indigo-500/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 flex gap-4 items-start shadow-sm">
                <div className="p-2.5 bg-white dark:bg-indigo-500/20 rounded-xl shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-lg">AI Resume Review Enabled</h4>
                  <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mt-1 leading-relaxed">
                    Whichever method you choose, your resume will be automatically analyzed against the job requirements to calculate your match score.
                  </p>
                </div>
              </div>

              <div>
                 <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 ml-1">Choose Application Method</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Option 1: U-Resume */}
                    <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all bg-white dark:bg-slate-800 shadow-sm hover:shadow-md flex flex-col justify-between group">
                       <div>
                         <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                         </div>
                         <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Apply with U-Resume</h4>
                         <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">Automatically generate an application using your saved profile data and skills.</p>
                       </div>
                       <button 
                         onClick={() => {
                           setCustomResume("");
                           setPdfBase64("");
                           handleApplySubmit();
                         }}
                         disabled={applyingId === applyModalOpp.id}
                         className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                         {applyingId === applyModalOpp.id ? "Submitting..." : "Apply with U-Resume"}
                       </button>
                    </div>

                    {/* Option 2: Upload Resume */}
                    <div className={`border ${pdfBase64 ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5' : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800'} rounded-2xl p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between relative group`}>
                       <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                       <div>
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${pdfBase64 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                            {pdfBase64 ? <CheckCircle2 className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                         </div>
                         <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Upload Resume (PDF)</h4>
                         <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">{pdfBase64 ? "PDF securely attached and ready for submission." : "Submit a custom formatted PDF resume."}</p>
                       </div>
                       <div className={`w-full py-3 rounded-xl font-bold text-sm text-center transition-all border ${pdfBase64 ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-200'}`}>
                          {pdfBase64 ? "PDF Selected" : "Browse Files"}
                       </div>
                    </div>
                 </div>
              </div>

              {pdfBase64 && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <div className="flex items-center gap-3">
                     <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                     <span className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Resume attached. Click Submit below.</span>
                   </div>
                   <button onClick={() => setPdfBase64("")} className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline font-medium relative z-20">Remove</button>
                </div>
              )}

            </div>
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-slate-900">
              <button type="button" onClick={() => setApplyModalOpp(null)} className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={handleApplySubmit} 
                disabled={applyingId === applyModalOpp.id || !pdfBase64} 
                className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-sm"
              >
                {applyingId === applyModalOpp.id ? "Analyzing..." : "Submit PDF Application"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Basic Post Modal kept simple for employer flow */}
      {isModalOpen && user?.role && ['mentor', 'recruiter', 'admin'].includes(user.role) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Post Opportunity</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">&times;</button>
            </div>
            <div className="p-5 overflow-y-auto">
              <form id="oppForm" onSubmit={handlePostOpportunity} className="space-y-4">
                <input required type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                <input required type="text" placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                
                <div className="flex gap-4">
                  <input required type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all">
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <input required type="text" placeholder="Required Skills (comma separated)" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all h-32 resize-none" />
              </form>
            </div>
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="oppForm" disabled={submitting} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                {submitting ? "Posting..." : "Post Opportunity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
