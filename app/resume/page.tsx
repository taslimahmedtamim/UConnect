"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Download, Plus, X, Edit3, Briefcase, GraduationCap, 
  Code, Award, Globe, Link as LinkIcon, User, CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Shield, Code2, MapPin, Phone, Mail
} from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Section Visibility Toggles
  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    certifications: true,
    languages: true,
    achievements: false
  });

  // Resume Data State
  const [resumeData, setResumeData] = useState({
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    address: "",
    portfolio: "",
    linkedin: "",
    github: "",
    tryhackme: "",
    codeforces: "",
    summary: "",
    photo: "",
    skills: [] as string[],
    languages: [] as string[],
    certifications: [] as string[],
    achievements: [] as any[],
    education: [] as any[],
    experience: [] as any[],
    projects: [] as any[]
  });

  // AI Scan State
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // Fetch initial user data to populate the resume
  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) { router.push("/login"); return; }

      try {
        const res = await fetch("/api/users/profile", {
          
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        const user = data.user;

        setResumeData({
          fullName: user.fullName || "",
          headline: user.title || "",
          email: user.email || "",
          phone: "", // Not in DB currently, leave blank
          address: user.location || "",
          portfolio: "",
          linkedin: "",
          github: user.githubUsername || "",
          tryhackme: "",
          codeforces: "",
          summary: user.bio || "",
          photo: user.profileImage || "",
          skills: user.skills || [],
          languages: [],
          certifications: user.certificates ? user.certificates.map((c: any) => c.name) : [],
          achievements: [],
          education: user.university ? [{
            institution: user.university,
            degree: user.department || "",
            cgpa: "",
            startYear: "",
            endYear: "Present",
            details: ""
          }] : [],
          experience: user.experience ? user.experience.map((e: any) => ({
            company: e.company,
            role: e.title,
            startDate: e.duration?.split(" - ")[0] || "",
            endDate: e.duration?.split(" - ")[1] || "",
            description: e.description
          })) : [],
          projects: []
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Handle Input Changes
  const handleInputChange = (field: string, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayStringChange = (field: string, value: string) => {
    const arr = value.split(",").map(s => s.trim()).filter(s => s);
    setResumeData(prev => ({ ...prev, [field]: arr }));
  };

  // Generic Handlers for arrays of objects
  const addArrayItem = (field: 'experience' | 'education' | 'projects' | 'achievements', emptyObj: any) => {
    setResumeData(prev => ({ ...prev, [field]: [emptyObj, ...prev[field]] }));
  };

  const updateArrayItem = (field: 'experience' | 'education' | 'projects' | 'achievements', index: number, key: string, value: string) => {
    setResumeData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = { ...newArray[index], [key]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const removeArrayItem = (field: 'experience' | 'education' | 'projects' | 'achievements', index: number) => {
    setResumeData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScan = async () => {
    if (!targetJobTitle.trim()) {
      alert("Please enter a target job title.");
      return;
    }

    setScanning(true);
    setScanResult(null);
    try {
      const res = await fetch("/api/resume/scan", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          },
        body: JSON.stringify({
          resumeData,
          targetJobTitle
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Scan failed");
      
      setScanResult(data.result);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 15mm 15mm !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            margin: 0;
          }
        }
      `}} />
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 print:p-0 print:bg-white">
      
      {/* Header Actions (Hidden when printing) */}
      <div className="max-w-[1400px] mx-auto flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">U-Resume Builder</h1>
          <p className="text-sm text-slate-500">AI-powered resume builder</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setScanModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> AI Scan
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm shadow-blue-600/20"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 print:block">
        
        {/* LEFT PANE: Form Builder (Hidden when printing) */}
        <div className="space-y-6 print:hidden">
          
          {/* Section Toggles */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Visible Sections</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(visibleSections).map((sec) => (
                <label 
                  key={sec} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors border ${
                    visibleSections[sec as keyof typeof visibleSections] 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={visibleSections[sec as keyof typeof visibleSections]}
                    onChange={() => setVisibleSections(prev => ({ ...prev, [sec]: !prev[sec as keyof typeof visibleSections] }))}
                  />
                  {visibleSections[sec as keyof typeof visibleSections] && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Personal Information</h3>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                <input type="text" value={resumeData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Headline</label>
                <input type="text" value={resumeData.headline} onChange={e => handleInputChange('headline', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
                <input type="email" value={resumeData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Phone</label>
                <input type="tel" value={resumeData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Address / Location</label>
                <input type="text" value={resumeData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">LinkedIn URL</label>
                <input type="url" value={resumeData.linkedin} onChange={e => handleInputChange('linkedin', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">GitHub URL</label>
                <input type="url" value={resumeData.github} onChange={e => handleInputChange('github', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Portfolio URL</label>
                <input type="url" value={resumeData.portfolio} onChange={e => handleInputChange('portfolio', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">TryHackMe URL</label>
                <input type="url" value={resumeData.tryhackme} onChange={e => handleInputChange('tryhackme', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Codeforces URL</label>
                <input type="url" value={resumeData.codeforces} onChange={e => handleInputChange('codeforces', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Profile Summary</label>
                <textarea value={resumeData.summary} onChange={e => handleInputChange('summary', e.target.value)} rows={3} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none resize-none" />
              </div>
            </div>
          </div>

          {/* Simple Lists: Skills, Languages, Certs */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Quick Lists (Comma separated)</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Skills</label>
                <input type="text" value={resumeData.skills.join(", ")} onChange={e => handleArrayStringChange('skills', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" placeholder="JavaScript, Python, React..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Languages</label>
                <input type="text" value={resumeData.languages.join(", ")} onChange={e => handleArrayStringChange('languages', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" placeholder="English, Bengali, Spanish..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Certifications</label>
                <input type="text" value={resumeData.certifications.join(", ")} onChange={e => handleArrayStringChange('certifications', e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" placeholder="AWS Cloud Practitioner, CCNA..." />
              </div>
            </div>
          </div>

          {/* Education Array */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Education</h3>
              </div>
              <button onClick={() => addArrayItem('education', { institution: "", degree: "", cgpa: "", startYear: "", endYear: "", details: "" })} className="text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors">
                + Add
              </button>
            </div>
            <div className="p-5 space-y-4">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg p-4 relative">
                  <button onClick={() => removeArrayItem('education', idx)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <input type="text" value={edu.institution} onChange={e => updateArrayItem('education', idx, 'institution', e.target.value)} placeholder="Institution" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <input type="text" value={edu.degree} onChange={e => updateArrayItem('education', idx, 'degree', e.target.value)} placeholder="Degree/Program" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <input type="text" value={edu.startYear} onChange={e => updateArrayItem('education', idx, 'startYear', e.target.value)} placeholder="Start Year" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <input type="text" value={edu.endYear} onChange={e => updateArrayItem('education', idx, 'endYear', e.target.value)} placeholder="End Year" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <input type="text" value={edu.cgpa} onChange={e => updateArrayItem('education', idx, 'cgpa', e.target.value)} placeholder="CGPA (optional)" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1 col-span-2" />
                    <textarea value={edu.details} onChange={e => updateArrayItem('education', idx, 'details', e.target.value)} placeholder="Relevant coursework, honors, etc." rows={2} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded focus:border-blue-500 outline-none text-sm p-2 col-span-2 resize-none mt-2" />
                  </div>
                </div>
              ))}
              {resumeData.education.length === 0 && <p className="text-sm text-slate-500 text-center italic">No education added.</p>}
            </div>
          </div>

          {/* Experience Array */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Experience</h3>
              </div>
              <button onClick={() => addArrayItem('experience', { company: "", role: "", startDate: "", endDate: "", description: "" })} className="text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors">
                + Add
              </button>
            </div>
            <div className="p-5 space-y-4">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg p-4 relative">
                  <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <input type="text" value={exp.company} onChange={e => updateArrayItem('experience', idx, 'company', e.target.value)} placeholder="Company Name" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <input type="text" value={exp.role} onChange={e => updateArrayItem('experience', idx, 'role', e.target.value)} placeholder="Job Title / Role" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <input type="text" value={exp.startDate} onChange={e => updateArrayItem('experience', idx, 'startDate', e.target.value)} placeholder="Start Date" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <input type="text" value={exp.endDate} onChange={e => updateArrayItem('experience', idx, 'endDate', e.target.value)} placeholder="End Date" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <textarea value={exp.description} onChange={e => updateArrayItem('experience', idx, 'description', e.target.value)} placeholder="Impact, responsibilities, and achievements." rows={3} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded focus:border-blue-500 outline-none text-sm p-2 col-span-2 resize-none mt-2" />
                  </div>
                </div>
              ))}
              {resumeData.experience.length === 0 && <p className="text-sm text-slate-500 text-center italic">No experience added.</p>}
            </div>
          </div>

          {/* Projects Array */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Projects</h3>
              </div>
              <button onClick={() => addArrayItem('projects', { title: "", tools: "", link: "", description: "" })} className="text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors">
                + Add
              </button>
            </div>
            <div className="p-5 space-y-4">
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg p-4 relative">
                  <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <input type="text" value={proj.title} onChange={e => updateArrayItem('projects', idx, 'title', e.target.value)} placeholder="Project Name" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <input type="text" value={proj.tools} onChange={e => updateArrayItem('projects', idx, 'tools', e.target.value)} placeholder="Tech Stack (comma separated)" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1" />
                    <input type="url" value={proj.link} onChange={e => updateArrayItem('projects', idx, 'link', e.target.value)} placeholder="Project Link / GitHub" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1 col-span-2" />
                    <textarea value={proj.description} onChange={e => updateArrayItem('projects', idx, 'description', e.target.value)} placeholder="Project description and your contribution." rows={2} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded focus:border-blue-500 outline-none text-sm p-2 col-span-2 resize-none mt-2" />
                  </div>
                </div>
              ))}
              {resumeData.projects.length === 0 && <p className="text-sm text-slate-500 text-center italic">No projects added.</p>}
            </div>
          </div>

          {/* Achievements Array */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-pink-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Achievements</h3>
              </div>
              <button onClick={() => addArrayItem('achievements', { title: "", date: "", description: "" })} className="text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors">
                + Add
              </button>
            </div>
            <div className="p-5 space-y-4">
              {resumeData.achievements.map((ach, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg p-4 relative">
                  <button onClick={() => removeArrayItem('achievements', idx)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <input type="text" value={ach.title} onChange={e => updateArrayItem('achievements', idx, 'title', e.target.value)} placeholder="Achievement Title" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1 col-span-2" />
                    <input type="text" value={ach.date} onChange={e => updateArrayItem('achievements', idx, 'date', e.target.value)} placeholder="Date / Year (optional)" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none text-sm pb-1 col-span-2" />
                    <textarea value={ach.description} onChange={e => updateArrayItem('achievements', idx, 'description', e.target.value)} placeholder="Brief description (optional)" rows={2} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded focus:border-blue-500 outline-none text-sm p-2 col-span-2 resize-none mt-2" />
                  </div>
                </div>
              ))}
              {resumeData.achievements.length === 0 && <p className="text-sm text-slate-500 text-center italic">No achievements added.</p>}
            </div>
          </div>

        </div>

        {/* RIGHT PANE: Live Preview */}
        <div className="relative print:static">
          <div className="sticky top-6 print:static">
            
            {/* The Print Area */}
            <div id="resume-preview" className="bg-white shadow-2xl rounded-sm mx-auto overflow-hidden text-black print:shadow-none print:m-0" style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm', padding: '40px 50px', fontFamily: '"Times New Roman", Times, serif', lineHeight: '1.2' }}>
              
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="text-3xl font-bold mb-1" style={{ fontSize: '24px' }}>{resumeData.fullName || "Your Name"}</h1>
                
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm text-black font-medium" style={{ fontSize: '11px' }}>
                  {resumeData.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {resumeData.address}</span>}
                  {resumeData.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {resumeData.phone}</span>}
                  {resumeData.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {resumeData.email}</span>}
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm text-black font-medium mt-1" style={{ fontSize: '11px' }}>
                  {resumeData.github && <a href={resumeData.github.startsWith('http') ? resumeData.github : `https://${resumeData.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold text-black no-underline hover:underline"><GithubIcon className="w-3 h-3 opacity-80" /> GitHub</a>}
                  {resumeData.linkedin && <a href={resumeData.linkedin.startsWith('http') ? resumeData.linkedin : `https://${resumeData.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold text-black no-underline hover:underline"><LinkedinIcon className="w-3 h-3 opacity-80" /> LinkedIn</a>}
                  {resumeData.portfolio && <a href={resumeData.portfolio.startsWith('http') ? resumeData.portfolio : `https://${resumeData.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold text-black no-underline hover:underline"><Globe className="w-3 h-3 opacity-80" /> Portfolio</a>}
                  {resumeData.tryhackme && <a href={resumeData.tryhackme.startsWith('http') ? resumeData.tryhackme : `https://${resumeData.tryhackme}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold text-black no-underline hover:underline"><Shield className="w-3 h-3 opacity-80" /> TryHackMe</a>}
                  {resumeData.codeforces && <a href={resumeData.codeforces.startsWith('http') ? resumeData.codeforces : `https://${resumeData.codeforces}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold text-black no-underline hover:underline"><Code2 className="w-3 h-3 opacity-80" /> Codeforces</a>}
                </div>
              </div>

              {/* Summary */}
              {visibleSections.summary && resumeData.summary && (
                <div className="mb-3">
                  <h2 className="text-[14px] font-bold text-black border-b border-black pb-[2px] mb-2">Professional Summary</h2>
                  <p className="text-[11.5px] text-justify whitespace-pre-wrap">{resumeData.summary}</p>
                </div>
              )}

              {/* Skills */}
              {visibleSections.skills && resumeData.skills.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[14px] font-bold text-black border-b border-black pb-[2px] mb-2">Technical Skills</h2>
                  <ul className="list-disc pl-5 text-[11.5px] space-y-[2px]">
                    {resumeData.skills.map((skill, idx) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: skill.includes(':') ? `<strong>${skill.split(':')[0]}:</strong>${skill.substring(skill.indexOf(':') + 1)}` : skill }}></li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Experience */}
              {visibleSections.experience && resumeData.experience.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[14px] font-bold text-black border-b border-black pb-[2px] mb-2">Professional Experience</h2>
                  <div className="space-y-3">
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-[12px] font-bold text-black">{exp.role}</h3>
                          <span className="text-[11.5px] font-bold text-black">{(exp.startDate || "Start") + " – " + (exp.endDate || "Present")}</span>
                        </div>
                        <div className="text-[11.5px] italic text-black mb-1">{exp.company}</div>
                        {exp.description && (
                          <ul className="list-disc pl-5 text-[11.5px] space-y-[2px]">
                            {exp.description.split('\\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                              <li key={i}>{line.replace(/^[•\\-\\*]\\s*/, '')}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {visibleSections.education && resumeData.education.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[14px] font-bold text-black border-b border-black pb-[2px] mb-2">Education</h2>
                  <div className="space-y-2">
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-[12px] font-bold text-black">{edu.institution}</h3>
                          <span className="text-[11.5px] font-bold text-black">{(edu.startYear || "Start") + " – " + (edu.endYear || "Present")}</span>
                        </div>
                        <div className="flex justify-between items-baseline text-[11.5px] text-black">
                          <span>{edu.degree}</span>
                          {edu.cgpa && <span className="font-bold">CGPA: {edu.cgpa}</span>}
                        </div>
                        {edu.details && <p className="text-[11.5px] mt-0.5">{edu.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {visibleSections.certifications && resumeData.certifications.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[14px] font-bold text-black border-b border-black pb-[2px] mb-2">Certifications & Training</h2>
                  <ul className="list-disc pl-5 text-[11.5px] space-y-[2px]">
                    {resumeData.certifications.map((cert, idx) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: cert.includes('—') ? `<strong>${cert.split('—')[0]}</strong> — ${cert.substring(cert.indexOf('—') + 1)}` : cert.includes('-') ? `<strong>${cert.split('-')[0]}</strong> - ${cert.substring(cert.indexOf('-') + 1)}` : cert }}></li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {visibleSections.achievements && resumeData.achievements.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[14px] font-bold text-black border-b border-black pb-[2px] mb-2">Leadership & Activities</h2>
                  <ul className="list-disc pl-5 text-[11.5px] space-y-[2px]">
                    {resumeData.achievements.map((ach, idx) => (
                      <li key={idx}>
                        {ach.title ? <strong>{ach.title}</strong> : null}
                        {ach.title && ach.date ? ` (${ach.date})` : ach.date ? `(${ach.date})` : null}
                        {(ach.title || ach.date) && ach.description ? ' — ' : null}
                        {ach.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Projects */}
              {visibleSections.projects && resumeData.projects.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[14px] font-bold text-black border-b border-black pb-[2px] mb-2">Projects</h2>
                  <div className="space-y-3">
                    {resumeData.projects.map((proj, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-[12px] font-bold text-black">
                            {proj.title}
                          </h3>
                        </div>
                        {proj.description && (
                          <ul className="list-disc pl-5 text-[11.5px] space-y-[2px]">
                            {proj.description.split('\\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                              <li key={i}>{line.replace(/^[•\\-\\*]\\s*/, '')}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {visibleSections.languages && resumeData.languages.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[14px] font-bold text-black border-b border-black pb-[2px] mb-2">Languages</h2>
                  <p className="text-[11.5px] text-black">{resumeData.languages.join(", ")}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* AI Scan Modal */}
      {scanModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm print:hidden">
          <div className="bg-white dark:bg-[#111827] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> AI Resume Scanner
              </h2>
              <button onClick={() => setScanModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {!scanResult ? (
                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-400">
                    Test your resume against a specific job role. Our AI will analyze your experience and skills just like an ATS (Applicant Tracking System) and give you actionable feedback.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Job Title</label>
                    <input 
                      type="text" 
                      value={targetJobTitle}
                      onChange={(e) => setTargetJobTitle(e.target.value)}
                      placeholder="e.g. Junior SOC Analyst, Frontend Developer..."
                      className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                  <button 
                    onClick={handleScan}
                    disabled={scanning}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-lg font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 mt-6"
                  >
                    {scanning ? (
                      <span className="flex items-center gap-2">Scanning... <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></span>
                    ) : (
                      <span className="flex items-center gap-2">Scan Resume <Sparkles className="w-4 h-4" /></span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-white dark:bg-[#111827] shadow-sm border-4 border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                      {scanResult.score}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">ATS Match Score</h3>
                      <p className="text-sm text-slate-500">Target Role: <span className="font-medium text-slate-700 dark:text-slate-300">{targetJobTitle}</span></p>
                    </div>
                  </div>

                  {scanResult.gaps && scanResult.gaps.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
                        <AlertCircle className="w-4 h-4 text-amber-500" /> Missing Keywords & Gaps
                      </h4>
                      <ul className="space-y-2">
                        {scanResult.gaps.map((gap: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-2.5 rounded-lg">
                            <span className="text-amber-500 mt-0.5">•</span> {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scanResult.suggestions && scanResult.suggestions.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
                        <Sparkles className="w-4 h-4 text-emerald-500" /> Improvement Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {scanResult.suggestions.map((suggestion: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-2.5 rounded-lg">
                            <span className="text-emerald-500 mt-0.5">✓</span> {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button 
                    onClick={() => setScanResult(null)}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors mt-4"
                  >
                    Scan Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
}
