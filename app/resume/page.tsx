"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Download, Plus, X, Edit3, Briefcase, GraduationCap, 
  Code, Award, Globe, Link as LinkIcon, User, CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Shield, Code2, MapPin, Phone, Mail, Wand2, Save
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
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
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

  const [improvingText, setImprovingText] = useState<{ field: string, index?: number } | null>(null);

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
    customLinks: [] as { name: string, url: string }[],
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
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [scanSource, setScanSource] = useState<'current' | 'upload'>('current');

  // Fetch initial user data to populate the resume
  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) { router.push("/login"); return; }

      try {
        const res = await fetch("/api/users/profile", {
          // Cookies are automatically sent
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
          customLinks: [],
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
          projects: user.projects ? user.projects.map((p: any) => ({
            title: p.title || "",
            tools: p.tags ? (Array.isArray(p.tags) ? p.tags.join(", ") : p.tags) : "",
            link: p.repoUrl || p.demoUrl || "",
            description: p.description || ""
          })) : []
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const payload = {
        title: resumeData.headline,
        bio: resumeData.summary,
        location: resumeData.address,
        githubUsername: resumeData.github,
        skills: resumeData.skills,
        experience: resumeData.experience,
        // Map resume 'certifications' (array of strings) back to the expected format if possible, 
        // or leave them out if they don't match the DB schema. The DB expects objects for certificates.
        // For simplicity, we just save the fields that map cleanly.
      };

      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle Input Changes
  const handleInputChange = (field: string, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  // Generic Handlers for arrays of objects
  const addArrayItem = (field: 'experience' | 'education' | 'projects' | 'achievements' | 'customLinks', emptyObj: any) => {
    setResumeData(prev => ({ ...prev, [field]: [emptyObj, ...prev[field]] }));
  };

  const updateArrayItem = (field: 'experience' | 'education' | 'projects' | 'achievements' | 'customLinks', index: number, key: string, value: string) => {
    setResumeData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = { ...newArray[index], [key]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const removeArrayItem = (field: 'experience' | 'education' | 'projects' | 'achievements' | 'customLinks', index: number) => {
    setResumeData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const addStringArrayItem = (field: 'skills' | 'languages' | 'certifications') => {
    setResumeData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const updateStringArrayItem = (field: 'skills' | 'languages' | 'certifications', index: number, value: string) => {
    setResumeData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const removeStringArrayItem = (field: 'skills' | 'languages' | 'certifications', index: number) => {
    setResumeData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleImproveWithAI = async (field: 'summary' | 'experience' | 'projects', index?: number) => {
    let currentText = "";
    if (field === 'summary') currentText = resumeData.summary;
    else if (field === 'experience' && index !== undefined) currentText = resumeData.experience[index].description;
    else if (field === 'projects' && index !== undefined) currentText = resumeData.projects[index].description;

    if (!currentText.trim()) {
      alert("Please enter some text first.");
      return;
    }

    setImprovingText({ field, index });
    try {
      const res = await fetch("/api/resume/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText, context: field })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to improve text");

      if (field === 'summary') {
        handleInputChange('summary', data.result);
      } else if (field === 'experience' && index !== undefined) {
        updateArrayItem('experience', index, 'description', data.result);
      } else if (field === 'projects' && index !== undefined) {
        updateArrayItem('projects', index, 'description', data.result);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setImprovingText(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a valid PDF file.');
        return;
      }
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPdfBase64(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPdfFile = () => {
    setPdfFile(null);
    setPdfBase64('');
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
          resumeData: scanSource === 'current' ? resumeData : null,
          pdfData: scanSource === 'upload' && pdfBase64 ? pdfBase64 : null,
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
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-70"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : saveSuccess ? "Saved!" : "Save Profile"}
          </button>
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
            <div className="p-5 flex flex-col gap-4">
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
            </div>

            {/* Custom Links */}
            <div className="px-5 pb-5">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Custom Links (LeetCode, etc.)</label>
                <button onClick={() => addArrayItem('customLinks', { name: "", url: "" })} className="text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded font-medium transition-colors">
                  + Add Link
                </button>
              </div>
              <div className="space-y-2">
                {resumeData.customLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input type="text" value={link.name} onChange={e => updateArrayItem('customLinks', idx, 'name', e.target.value)} placeholder="Name (e.g. Medium)" className="w-1/3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
                    <input type="url" value={link.url} onChange={e => updateArrayItem('customLinks', idx, 'url', e.target.value)} placeholder="URL" className="flex-1 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
                    <button onClick={() => removeArrayItem('customLinks', idx)} className="p-1.5 text-slate-400 hover:text-red-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Profile Summary</label>
                  <button 
                    onClick={() => handleImproveWithAI('summary')}
                    disabled={improvingText?.field === 'summary' || !resumeData.summary.trim()}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
                  >
                    <Wand2 className="w-3 h-3" />
                    {improvingText?.field === 'summary' ? 'Improving...' : 'Improve with AI'}
                  </button>
                </div>
                <textarea value={resumeData.summary} onChange={e => handleInputChange('summary', e.target.value)} rows={3} className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none resize-none" />
              </div>
            </div>
          </div>



          {/* Skills Array */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Technical Skills</h3>
              </div>
              <button onClick={() => addStringArrayItem('skills')} className="text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors">
                + Add
              </button>
            </div>
            <div className="p-5 space-y-2">
              {resumeData.skills.map((skill: any, idx) => {
                const skillStr = typeof skill === 'string' ? skill : (skill.name || '');
                return (
                  <div key={idx} className="flex gap-2 items-center">
                    <input type="text" value={skillStr} onChange={e => updateStringArrayItem('skills', idx, e.target.value)} placeholder="e.g. Frontend: React, Next.js, Tailwind" className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
                    <button onClick={() => removeStringArrayItem('skills', idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {resumeData.skills.length === 0 && <p className="text-sm text-slate-500 text-center italic">No skills added.</p>}
            </div>
          </div>

          {/* Certifications Array */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Certifications</h3>
              </div>
              <button onClick={() => addStringArrayItem('certifications')} className="text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors">
                + Add
              </button>
            </div>
            <div className="p-5 space-y-2">
              {resumeData.certifications.map((cert: any, idx) => {
                const certStr = typeof cert === 'string' ? cert : (cert.name || '');
                return (
                  <div key={idx} className="flex gap-2 items-center">
                    <input type="text" value={certStr} onChange={e => updateStringArrayItem('certifications', idx, e.target.value)} placeholder="e.g. AWS Certified Solutions Architect - 2024" className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
                    <button onClick={() => removeStringArrayItem('certifications', idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {resumeData.certifications.length === 0 && <p className="text-sm text-slate-500 text-center italic">No certifications added.</p>}
            </div>
          </div>

          {/* Languages Array */}
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Languages</h3>
              </div>
              <button onClick={() => addStringArrayItem('languages')} className="text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors">
                + Add
              </button>
            </div>
            <div className="p-5 space-y-2">
              {resumeData.languages.map((lang: any, idx) => {
                const langStr = typeof lang === 'string' ? lang : (lang.name || '');
                return (
                  <div key={idx} className="flex gap-2 items-center">
                    <input type="text" value={langStr} onChange={e => updateStringArrayItem('languages', idx, e.target.value)} placeholder="e.g. English (Fluent)" className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
                    <button onClick={() => removeStringArrayItem('languages', idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {resumeData.languages.length === 0 && <p className="text-sm text-slate-500 text-center italic">No languages added.</p>}
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
                    <div className="col-span-2 mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-slate-500">Description</label>
                        <button 
                          onClick={() => handleImproveWithAI('experience', idx)}
                          disabled={improvingText?.field === 'experience' && improvingText.index === idx || !exp.description.trim()}
                          className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 disabled:opacity-50"
                        >
                          <Wand2 className="w-3 h-3" />
                          {improvingText?.field === 'experience' && improvingText.index === idx ? 'Improving...' : 'Improve with AI'}
                        </button>
                      </div>
                      <textarea value={exp.description} onChange={e => updateArrayItem('experience', idx, 'description', e.target.value)} placeholder="Impact, responsibilities, and achievements." rows={3} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded focus:border-blue-500 outline-none text-sm p-2 resize-none" />
                    </div>
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
                    <div className="col-span-2 mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-slate-500">Description</label>
                        <button 
                          onClick={() => handleImproveWithAI('projects', idx)}
                          disabled={improvingText?.field === 'projects' && improvingText.index === idx || !proj.description.trim()}
                          className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 disabled:opacity-50"
                        >
                          <Wand2 className="w-3 h-3" />
                          {improvingText?.field === 'projects' && improvingText.index === idx ? 'Improving...' : 'Improve with AI'}
                        </button>
                      </div>
                      <textarea value={proj.description} onChange={e => updateArrayItem('projects', idx, 'description', e.target.value)} placeholder="Project description and your contribution." rows={2} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded focus:border-blue-500 outline-none text-sm p-2 resize-none" />
                    </div>
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
                  {resumeData.portfolio && <a href={resumeData.portfolio.startsWith('http') ? resumeData.portfolio : `https://${resumeData.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold no-underline text-black"><Globe className="w-3 h-3 opacity-80" /> Portfolio</a>}
                  {resumeData.customLinks && resumeData.customLinks.map((link, idx) => link.name && link.url && (
                    <a key={idx} href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold no-underline text-black">
                      <LinkIcon className="w-3 h-3 opacity-80" /> {link.name}
                    </a>
                  ))}
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
                    {resumeData.skills.map((skill: any, idx) => {
                      const skillStr = typeof skill === 'string' ? skill : (skill.name || '');
                      return (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: skillStr.includes(':') ? `<strong>${skillStr.split(':')[0]}:</strong>${skillStr.substring(skillStr.indexOf(':') + 1)}` : skillStr }}></li>
                      );
                    })}
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
            
            <div className="p-6 overflow-y-auto flex-1 no-scrollbar">
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

                  {/* Scan Source Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Resume Source</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
                      <button
                        type="button"
                        onClick={() => setScanSource('current')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${scanSource === 'current' ? 'bg-white dark:bg-[#111827] text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        Built-in Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => setScanSource('upload')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${scanSource === 'upload' ? 'bg-white dark:bg-[#111827] text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        Upload PDF
                      </button>
                    </div>
                  </div>

                  {/* PDF Upload Section */}
                  {scanSource === 'upload' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      {!pdfFile ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:hover:bg-slate-800 dark:bg-[#0B0F19] hover:bg-slate-100 dark:border-slate-700 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Plus className="w-8 h-8 text-slate-400 mb-2" />
                            <p className="text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">PDF ONLY</p>
                          </div>
                          <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                        </label>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{pdfFile.name}</p>
                              <p className="text-xs text-slate-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB • Ready to scan</p>
                            </div>
                          </div>
                          <button onClick={clearPdfFile} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
