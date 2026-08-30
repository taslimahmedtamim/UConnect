"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UserCircle, GraduationCap, Code, Save, Plus, X, 
  MapPin, Edit3, Briefcase, Award, ShieldCheck, Link as LinkIcon, Target, Globe, Trash2, FileText, Users
} from "lucide-react";
import CareerProgressCard from "@/components/profile/CareerProgressCard";
import AICareerInsights from "@/components/profile/AICareerInsights";
import ProfileGitHubStats from "@/components/profile/ProfileGitHubStats";
import LearningHeatmap from "@/components/profile/LearningHeatmap";
import SkillRadarChart from "@/components/profile/SkillRadarChart";
import AIQuizModal from "@/components/skillmap/AIQuizModal";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [quizTopic, setQuizTopic] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    title: "",
    location: "",
    bio: "",
    profileImage: "",
    githubUsername: "",
    university: "",
    department: "",
    skills: [] as any[],
    newSkill: "",
    experience: [] as any[],
    certificates: [] as any[],
    projects: [] as any[],
    userRoadmap: null as any,
    ownedTeams: [] as any[],
    memberTeams: [] as any[],
  });

  // Modal states for adding experience and certificates
  const [showExpModal, setShowExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ title: "", company: "", duration: "", description: "" });
  
  const [showCertModal, setShowCertModal] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", issuer: "", date: "", txId: "", imageUrl: "", isVerified: false });

  const fetchProfile = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { router.push("/login"); return; }

    try {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFormData((prev) => ({
          ...prev,
          username: data.user.username || "",
          fullName: data.user.fullName || "",
          title: data.user.title || "",
          location: data.user.location || "",
          bio: data.user.bio || "",
          university: data.user.university || "",
          department: data.user.department || "",
          skills: data.user.skills || [],
          githubUsername: data.user.githubUsername || "",
          codeforcesUsername: data.user.codeforcesUsername || "",
          profileImage: data.user.profileImage || "",
          experience: data.user.experience || [],
          certificates: data.user.certificates || [],
          projects: data.user.projects || [],
          userRoadmap: data.user.userRoadmap || null,
          ownedTeams: data.user.ownedTeams || [],
          memberTeams: data.user.memberTeams || [],
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const handleAddSkill = () => {
    if (formData.newSkill.trim()) {
      const exists = formData.skills.some((s: any) => typeof s === 'string' ? s === formData.newSkill.trim() : s.name === formData.newSkill.trim());
      if (!exists) {
        setFormData({
          ...formData,
          // Store as simple string if added manually via profile for backward compat,
          // or we can store it as an object { name: formData.newSkill.trim(), source: 'Manual' }
          skills: [...formData.skills, { name: formData.newSkill.trim(), source: 'Manual' }],
          newSkill: "",
        });
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: any) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => typeof s === 'string' ? s !== skillToRemove : s.name !== skillToRemove.name),
    });
  };

  const handleAddExperience = () => {
    if (newExp.title && newExp.company) {
      setFormData({
        ...formData,
        experience: [...formData.experience, newExp]
      });
      setNewExp({ title: "", company: "", duration: "", description: "" });
      setShowExpModal(false);
    }
  };

  const handleAddCertificate = () => {
    if (newCert.name && newCert.issuer) {
      setFormData({
        ...formData,
        certificates: [...formData.certificates, { ...newCert, isVerified: false }]
      });
      setNewCert({ name: "", issuer: "", date: "", txId: "", imageUrl: "", isVerified: false });
      setShowCertModal(false);
    }
  };

  const handleRemoveExperience = (index: number) => {
    const updated = [...formData.experience];
    updated.splice(index, 1);
    setFormData({ ...formData, experience: updated });
  };

  const handleDeleteProject = async (projectId: string, index: number) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete project");
      const updated = [...formData.projects];
      updated.splice(index, 1);
      setFormData({ ...formData, projects: updated });
    } catch (error) {
      console.error(error);
      alert("Error deleting project");
    }
  };

  const handleRemoveCertificate = (index: number) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter((_, i) => i !== index),
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profileImage' | 'certificate') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      
      if (data.success) {
        if (fieldName === 'profileImage') {
          setFormData(prev => ({ ...prev, profileImage: data.url }));
        } else if (fieldName === 'certificate') {
          setNewCert(prev => ({ ...prev, imageUrl: data.url }));
        }
      } else {
        alert('Upload failed: ' + (data.message || data.error));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          fullName: formData.fullName,
          profileImage: formData.profileImage,
          githubUsername: formData.githubUsername,
          title: formData.title,
          location: formData.location,
          bio: formData.bio,
          university: formData.university,
          department: formData.department,
          skills: formData.skills,
          experience: formData.experience,
          certificates: formData.certificates,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to save profile");
      }
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error saving profile");
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleSyncGitHubSkills = async (languages: string[]) => {
    if (!languages || languages.length === 0) return;
    
    // Filter out languages that are already in skills (case-insensitive)
    const existingSkillsLower = formData.skills.map((s: any) => (typeof s === 'string' ? s : s.name).toLowerCase());
    const newLanguages = languages.filter(lang => !existingSkillsLower.includes(lang.toLowerCase()));
    
    if (newLanguages.length === 0) {
      alert("All these languages are already in your skills!");
      return;
    }
    
    const newSkillObjects = newLanguages.map(name => ({ name, source: 'GitHub' }));
    const updatedSkills = [...formData.skills, ...newSkillObjects];
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
    
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills: updatedSkills,
        }),
      });

      if (!res.ok) throw new Error("Failed to sync skills");
      alert(`Successfully added ${newLanguages.length} languages to your skills!`);
    } catch (error) {
      console.error(error);
      alert("Error syncing skills");
    }
  };

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "UC";

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* HERO BANNER */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-24 sm:-mt-32 z-10">
        
        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 z-50 flex gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105"
            >
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={async () => {
                await handleSave();
                setIsEditing(false);
              }}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          )}
        </div>

        {/* 1. TOP PROFILE CARD (Full Width Hero) */}
        <div className="bg-[#0B1121] rounded-3xl shadow-2xl border border-slate-800 p-6 sm:p-10 relative mb-8 flex flex-col md:flex-row items-center gap-8 text-white">
          {/* Left Side: Identity */}
          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start w-full md:flex-1">
            {/* Avatar */}
            <div className="relative shrink-0">
              {formData.profileImage ? (
                <img 
                  src={formData.profileImage} 
                  alt="Profile" 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg border-4 border-[#1e293b]" 
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-bold text-white border-4 border-[#1e293b] shadow-lg">
                  {getInitials(formData.fullName)}
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Edit3 className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profileImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}
              {/* Verified Checkmark */}
              <div className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-500 rounded-xl shadow-lg border-2 border-[#0B1121] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left pt-2">
              <div className="mb-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="text-3xl sm:text-4xl font-bold text-white bg-transparent border-b border-slate-700 focus:border-blue-500 outline-none w-full text-center sm:text-left"
                    placeholder="Full Name"
                  />
                ) : (
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {formData.fullName || "Your Name"}
                  </h1>
                )}
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                {isEditing ? (
                  <div className="flex items-center text-blue-400 font-mono text-sm">
                    @<input 
                      type="text" 
                      value={formData.username} 
                      onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                      className="bg-transparent border-b border-slate-700 focus:border-blue-500 outline-none"
                      placeholder="username"
                    />
                  </div>
                ) : (
                  <p className="text-blue-400 font-mono text-sm">
                    @{formData.username || "username"}
                  </p>
                )}
                
                {/* Optional Social Icons */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">•</span>
                  {isEditing ? (
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <Globe className="w-3.5 h-3.5" />
                      <input 
                        type="text" 
                        value={formData.githubUsername} 
                        onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                        className="bg-transparent border-b border-slate-700 outline-none w-24"
                        placeholder="GitHub"
                      />
                    </div>
                  ) : formData.githubUsername ? (
                    <a href={`https://github.com/${formData.githubUsername}`} target="_blank" className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
                      <Globe className="w-3.5 h-3.5" /> {formData.githubUsername}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="mb-4">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-transparent border-b border-slate-700 text-slate-300 outline-none text-center sm:text-left"
                    placeholder="Headline / Job Title"
                  />
                ) : (
                  <p className="text-lg text-slate-300">
                    {formData.title || "Add a headline"} {formData.university ? ` • ${formData.university.split(' ')[0]}` : ''}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm mt-4">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.location} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="bg-transparent border-b border-slate-700 outline-none w-24"
                      placeholder="Location"
                    />
                  ) : (
                    <span>{formData.location || "Location not set"}</span>
                  )}
                </div>
                
                {formData.userRoadmap?.careerGoal && (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <Target className="w-4 h-4" /> Target: {formData.userRoadmap.careerGoal}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Skill Map Radar */}
          {formData.skills.length > 0 && !isEditing && (
            <div className="w-full md:w-[380px] shrink-0 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-8 md:pt-0 md:pl-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0 w-full text-center">Skill Map</h3>
              <div className="w-full h-[200px] -mt-4">
                <SkillRadarChart 
                  skills={formData.skills.map((s: any) => typeof s === 'string' ? s : s.name)} 
                  title={formData.title}
                  target={formData.userRoadmap?.careerGoal}
                />
              </div>
            </div>
          )}
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN COLUMN (LEFT) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 2. ABOUT */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-lg outline-none resize-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed p-4"
                  placeholder="Write a summary about yourself..."
                />
              ) : (
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {formData.bio || "No summary provided."}
                </p>
              )}
            </div>

            {/* 3. EDUCATION */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Education</h2>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
                  <GraduationCap className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-md outline-none" value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} placeholder="University or School" />
                      <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-md outline-none" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} placeholder="Degree / Department" />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{formData.university || 'University not set'}</h3>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{formData.department || 'Degree not set'}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 4. EXPERIENCE */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Experience</h2>
                {isEditing && (
                  <button onClick={() => setShowExpModal(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {formData.experience.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No experience added yet.</p>
                ) : (
                  formData.experience.map((exp: any, i: number) => (
                    <div key={i} className="flex gap-4 group relative">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
                        <Briefcase className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1 pb-6 border-b border-slate-100 dark:border-slate-800 group-last:border-0 group-last:pb-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{exp.title}</h3>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{exp.company}</p>
                        <p className="text-sm text-slate-500 mt-1">{exp.duration}</p>
                        {exp.description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 whitespace-pre-wrap">{exp.description}</p>}
                      </div>
                      {isEditing && (
                        <button onClick={() => handleRemoveExperience(i)} className="absolute top-0 right-0 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 5. LICENSES & CERTIFICATIONS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Licenses & certifications</h2>
                {isEditing && (
                  <button onClick={() => setShowCertModal(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {formData.certificates.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No certifications added yet.</p>
                ) : (
                  formData.certificates.map((cert: any, i: number) => (
                    <div key={i} className="flex gap-4 group relative">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
                        <Award className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="flex-1 pb-6 border-b border-slate-100 dark:border-slate-800 group-last:border-0 group-last:pb-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{cert.name}</h3>
                        <p className="text-sm text-slate-800 dark:text-slate-200">{cert.issuer}</p>
                        <p className="text-sm text-slate-500 mt-1">Issued {cert.date}</p>
                        
                        {cert.isVerified && (
                          <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider mt-3 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-900/50">
                            <ShieldCheck className="w-4 h-4" /> Blockchain Verified
                          </div>
                        )}
                      </div>
                      {cert.imageUrl && !isEditing && (
                        <div className="hidden sm:block ml-4 shrink-0">
                          <img src={cert.imageUrl} alt={cert.name} className="w-24 h-16 object-cover rounded-md border border-slate-200 dark:border-slate-700 shadow-sm" />
                        </div>
                      )}
                      {isEditing && (
                        <button onClick={() => handleRemoveCertificate(i)} className="absolute top-0 right-0 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 6. PROJECTS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Projects</h2>
              <div className="space-y-6">
                {formData.projects.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No projects yet.</p>
                ) : (
                  formData.projects.map((proj: any, i: number) => (
                    <div key={i} className="flex gap-4 group relative border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{proj.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{proj.createdAt ? new Date(proj.createdAt).toLocaleDateString() : 'Recent'}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 line-clamp-2">{proj.description}</p>
                        
                        {proj.tags && proj.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {proj.tags.slice(0, 4).map((tag: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-4">
                          <button onClick={() => router.push(`/projects/${proj.id}`)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Show project &rarr;</button>
                        </div>
                      </div>
                      {isEditing && (
                        <button onClick={() => handleDeleteProject(proj.id, i)} className="absolute top-0 right-0 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* SIDEBAR COLUMN (RIGHT) */}
          <div className="space-y-6">
            
            {/* 7. SKILLS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Skills</h2>
              
              <div className="flex flex-wrap gap-3">
                {formData.skills.map((skill: any, i: number) => {
                  const skillName = typeof skill === 'string' ? skill : skill.name;
                  const isGitHub = typeof skill === 'object' && skill.source === 'GitHub';
                  const uconnectVerified = user?.userSkills?.find((us: any) => us.skill.name.toLowerCase() === skillName.toLowerCase() && us.verified);

                  return (
                    <div key={i} className="inline-flex items-center gap-2 bg-[#1e293b] border border-[#334155] px-3 py-1.5 rounded-full group hover:border-slate-500 transition-colors shrink-0">
                      <span className="font-semibold text-sm text-slate-100 whitespace-nowrap">{skillName}</span>
                      
                      {isGitHub && (
                        <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20" title="Verified and synced from GitHub">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          <svg className="w-3.5 h-3.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                          </svg>
                        </div>
                      )}
                      
                      {uconnectVerified && !isGitHub && (
                        <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase border border-emerald-500/30">
                          <ShieldCheck className="w-3 h-3" />
                        </div>
                      )}

                      {!uconnectVerified && !isGitHub && !isEditing && (
                        <button 
                          onClick={() => setQuizTopic(skillName)}
                          className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-slate-200 hover:bg-white px-2.5 py-0.5 rounded-full transition-colors"
                          title="Take quiz to verify"
                        >
                          Verify
                        </button>
                      )}

                      {isEditing && (
                        <button onClick={() => handleRemoveSkill(skill)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 ml-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {formData.skills.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No skills added yet.</p>
                )}

                {isEditing && (
                  <div className="mt-4 flex gap-2 w-full">
                    <input 
                      type="text" 
                      value={formData.newSkill} 
                      onChange={(e) => setFormData({...formData, newSkill: e.target.value})}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-md outline-none text-sm"
                      placeholder="Add a new skill"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <button onClick={handleAddSkill} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 rounded-md font-bold text-sm">
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 8. ACTIVITY & INSIGHTS */}
            {!isEditing && user?.role !== 'recruiter' && (
              <div className="space-y-6">
                
                <LearningHeatmap activityLog={user?.activityLog || {}} />
                
                {formData.githubUsername && (
                  <ProfileGitHubStats 
                    username={formData.githubUsername} 
                    onSyncSkills={handleSyncGitHubSkills}
                    compact={true}
                  />
                )}
              </div>
            )}

            {/* RECRUITER CTA */}
            {!isEditing && user?.role === 'recruiter' && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-lg p-6 text-white text-center">
                <Target className="w-8 h-8 mx-auto mb-3" />
                <h2 className="text-lg font-bold mb-2">Talent Acquisition Hub</h2>
                <p className="text-blue-100 text-sm mb-4">Post an opportunity or browse our talent pool to find the perfect match.</p>
                <button onClick={() => router.push('/opportunities')} className="w-full py-2 bg-white text-blue-700 font-bold rounded-xl shadow-md">Post a Job</button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Add Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Add Experience</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                <input type="text" value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. Security Analyst Intern" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Company</label>
                <input type="text" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. Bengal Infosec Limited" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Duration</label>
                <input type="text" value={newExp.duration} onChange={e => setNewExp({...newExp, duration: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. Jun 2026 - Present" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <textarea value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white resize-none" rows={3} placeholder="What did you do?"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowExpModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">Cancel</button>
              <button onClick={handleAddExperience} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Add Verified Certificate
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Certificate Name</label>
                <input type="text" value={newCert.name} onChange={e => setNewCert({...newCert, name: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. Certified Ethical Hacker (CEH)" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Issuing Organization</label>
                <input type="text" value={newCert.issuer} onChange={e => setNewCert({...newCert, issuer: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. EC-Council" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Issue Date</label>
                <input type="text" value={newCert.date} onChange={e => setNewCert({...newCert, date: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. Aug 2026" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Upload Certificate Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'certificate')} 
                  className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white text-sm" 
                />
                {newCert.imageUrl && <p className="text-xs text-emerald-500 mt-1">✓ Image ready for upload</p>}
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                This certificate will be automatically minted on the testnet and receive a unique transaction hash for verification.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowCertModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">Cancel</button>
              <button onClick={handleAddCertificate} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                Mint to Blockchain
              </button>
            </div>
          </div>
        </div>
      )}

      <AIQuizModal 
        isOpen={!!quizTopic}
        onClose={() => setQuizTopic(null)}
        topic={quizTopic || ''}
        onComplete={(score, total) => {
          fetchProfile(); // reload profile to see new verified badge
        }}
      />
    </div>
  );
}
