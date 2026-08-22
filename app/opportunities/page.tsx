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

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        {user?.role && ['teacher', 'recruiter', 'admin'].includes(user.role) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" /> Post Job
          </button>
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
                {user && (
                  <div className="w-full lg:w-[350px] shrink-0 bg-slate-50 dark:bg-[#1e2738]/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800/60">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Your Match Score</span>
                      <span className={`text-xl font-black ${
                        opp.matchPercent >= 80 ? 'text-emerald-500' :
                        opp.matchPercent >= 50 ? 'text-blue-400' : 'text-slate-400'
                      }`}>
                        {opp.matchPercent}%
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                      <div 
                        className={`h-full rounded-full ${opp.matchPercent >= 80 ? 'bg-emerald-500' : opp.matchPercent >= 50 ? 'bg-amber-500' : 'bg-slate-400'}`}
                        style={{ width: `${opp.matchPercent}%` }}
                      ></div>
                    </div>

                    <div className="space-y-3">
                      {opp.matching.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> You Match:
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
                      
                      <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                        <Link 
                          href="/resume" 
                          className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                          Tailor Resume with AI
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                {user?.role === "student" && !opp.application && (
                  <button 
                    onClick={() => setApplyModalOpp(opp)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                  >
                    Apply Now
                  </button>
                )}
                {opp.application && (
                  <button disabled className="bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 opacity-70" /> Applied
                  </button>
                )}
              </div>
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
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" /> AI Resume Review
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Your resume will be automatically analyzed by AI against the job requirements to calculate your final application score.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Upload Resume (PDF)</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer">
                  <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pdfBase64 ? "PDF Selected" : "Click to upload or drag and drop"}</span>
                </div>
              </div>

              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                <span className="relative bg-white dark:bg-slate-900 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Paste Custom Resume Text</label>
                <textarea 
                  value={customResume} 
                  onChange={e => setCustomResume(e.target.value)} 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  placeholder="Paste your plain text resume here..." 
                />
              </div>

            </div>
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
              <button type="button" onClick={() => setApplyModalOpp(null)} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={handleApplySubmit} 
                disabled={applyingId === applyModalOpp.id || (!customResume && !pdfBase64)} 
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                {applyingId === applyModalOpp.id ? "Analyzing & Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Basic Post Modal kept simple for employer flow */}
      {isModalOpen && user?.role && ['teacher', 'recruiter', 'admin'].includes(user.role) && (
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
