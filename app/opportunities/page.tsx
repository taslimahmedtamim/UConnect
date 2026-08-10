"use client";

import { useEffect, useState } from "react";
import { Briefcase, Plus, Search, MapPin, DollarSign, Building, Clock } from "lucide-react";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userRole, setUserRole] = useState("student");

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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserRole(JSON.parse(storedUser).role);
    }
  }, []);

  const handlePostOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split("\n").filter(Boolean)
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

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Briefcase className="text-blue-500 w-8 h-8" />
            Opportunities
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Find jobs, internships, and research positions.</p>
        </div>
        
        {(userRole === 'recruiter' || userRole === 'teacher') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap w-fit"
          >
            <Plus className="w-5 h-5" />
            Post Opportunity
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by role, company, or keywords..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Research">Research Assistant</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading opportunities...</div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-400 opacity-50" />
          <p className="font-medium text-lg text-slate-600 dark:text-slate-300">No opportunities available</p>
          <p className="text-sm mt-1">Check back later for new postings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div key={opp.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all group flex flex-col h-full hover:border-blue-500/50">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xl border border-slate-200 dark:border-slate-700">
                  {opp.company.charAt(0)}
                </div>
                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold rounded-full">
                  {opp.type}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{opp.title}</h3>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium mb-4">
                <Building className="w-4 h-4" />
                {opp.company}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{opp.location}</span>
                </div>
                {opp.salary && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span>{opp.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Posted {new Date(opp.postedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-bold">Post an Opportunity</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                &times;
              </button>
            </div>
            <form onSubmit={handlePostOpportunity} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full form-input" placeholder="E.g. Frontend Intern" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company / Organization</label>
                  <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full form-input" placeholder="Company Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employment Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full form-input">
                    <option>Internship</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Research Assistant</option>
                    <option>Freelance</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full form-input" placeholder="E.g. Remote, New York..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Salary (Optional)</label>
                  <input type="text" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full form-input" placeholder="E.g. $20/hr, Unpaid" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full form-input resize-none" placeholder="Details about the role..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Requirements (One per line)</label>
                <textarea rows={3} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full form-input resize-none" placeholder="React.js experience&#10;Currently pursuing CS degree..."></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {submitting ? 'Posting...' : 'Post Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
