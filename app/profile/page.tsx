"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UserCircle, GraduationCap, Code, Save, Plus, X, 
  MapPin, Edit3, Briefcase, Award, ShieldCheck, Link as LinkIcon, Target, Globe, Trash2, FileText
} from "lucide-react";
import CareerProgressCard from "@/components/profile/CareerProgressCard";
import AICareerInsights from "@/components/profile/AICareerInsights";
import ProfileGitHubStats from "@/components/profile/ProfileGitHubStats";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

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
  });

  // Modal states for adding experience and certificates
  const [showExpModal, setShowExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ title: "", company: "", duration: "", description: "" });
  
  const [showCertModal, setShowCertModal] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", issuer: "", date: "", txId: "", imageUrl: "", isVerified: false });

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) { router.push("/login"); return; }

      try {
        const res = await fetch("/api/users/profile", {
          // Cookies are automatically sent
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
        setFormData({
          username: data.user.username || "",
          fullName: data.user.fullName || "",
          title: data.user.title || "",
          location: data.user.location || "",
          profileImage: data.user.profileImage || "",
          githubUsername: data.user.githubUsername || "",
          bio: data.user.bio || "",
          university: data.user.university || "",
          department: data.user.department || "",
          skills: data.user.skills || [],
          newSkill: "",
          experience: data.user.experience || [],
          certificates: data.user.certificates || [],
          projects: data.user.projects || [],
          userRoadmap: data.user.userRoadmap || null,
        });
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

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
      // Generate a mock blockchain transaction ID if not provided
      const txId = newCert.txId || '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      setFormData({
        ...formData,
        certificates: [...formData.certificates, { ...newCert, txId, isVerified: true }]
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
        alert('Upload failed: ' + data.message);
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
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
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

      <div className="space-y-6">
        
        {/* HERO SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex items-start gap-6 relative">
          
          {/* Avatar */}
          <div className="relative shrink-0">
            {formData.profileImage ? (
              <img 
                src={formData.profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-slate-200 dark:border-slate-700" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-bold text-white shadow-md relative overflow-hidden">
                {getInitials(formData.fullName)}
              </div>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
            )}

            {/* Verified Checkmark */}
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 pt-2 relative">

            <div className="flex items-center gap-3 mb-2">
              {isEditing && (
                <div className="w-full mb-4">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Upload Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'profileImage')}
                    className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:border-blue-500 outline-none"
                  />
                  {formData.profileImage && <p className="text-xs text-emerald-500 mt-1">✓ Image uploaded</p>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mb-1">
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="text-3xl font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none w-auto max-w-sm pb-1"
                  placeholder="Full Name"
                />
              ) : (
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formData.fullName || "Your Name"}
                </h1>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center text-slate-500 font-mono">
                    @<input 
                      type="text" 
                      value={formData.username} 
                      onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                      className="bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none w-auto max-w-xs"
                      placeholder="username"
                    />
                  </div>
                ) : (
                  <p className="text-blue-500 font-mono font-medium">
                    @{formData.username || "username"}
                  </p>
                )}
              </div>
              <div className="hidden sm:block text-slate-300 dark:text-slate-700">&bull;</div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-sm">
                    <Globe className="w-4 h-4" /> github.com/
                    <input 
                      type="text" 
                      value={formData.githubUsername} 
                      onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                      className="bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-emerald-500 outline-none w-auto max-w-[120px]"
                      placeholder="github_user"
                    />
                  </div>
                ) : formData.githubUsername ? (
                  <a href={`https://github.com/${formData.githubUsername}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium text-sm transition-colors">
                    <Globe className="w-4 h-4" /> {formData.githubUsername}
                  </a>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 text-sm italic">
                    <Globe className="w-4 h-4" /> GitHub not linked
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
              {isEditing ? (
                <>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none w-auto max-w-xs"
                    placeholder="Job Title / Role"
                  />
                  <span>&bull;</span>
                  <input 
                    type="text" 
                    value={formData.university} 
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    className="bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none w-auto max-w-xs"
                    placeholder="University Name"
                  />
                </>
              ) : (
                <p>
                  {formData.title || "Job Title / Role"} &bull; {formData.university || "University Name"}
                </p>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium mt-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none w-48"
                    placeholder="Location"
                  />
                ) : (
                  <span>{formData.location || "Location"}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Target: {formData.userRoadmap?.careerGoal || "Not set"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS CARD */}
        {!isEditing && (
          <div className="w-full">
            <CareerProgressCard user={user} />
          </div>
        )}

        {/* GITHUB STATS */}
        {!isEditing && formData.githubUsername && (
          <ProfileGitHubStats 
            username={formData.githubUsername} 
            onSyncSkills={handleSyncGitHubSkills}
          />
        )}

        {/* ABOUT SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">About</h2>
          </div>
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

        {/* EXPERIENCE SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-500" /> Experience
            </h2>
            {isEditing && (
              <div className="flex gap-3">
                <button onClick={() => setShowExpModal(true)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-blue-600">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {formData.experience.map((exp: any, index: number) => (
              <div key={index} className="flex gap-4 relative group">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="font-bold text-slate-900 dark:text-white">{exp.title}</h3>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{exp.company}</p>
                  <p className="text-xs text-slate-500 mb-2">{exp.duration}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{exp.description}</p>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveExperience(index)}
                    className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity bg-red-50 dark:bg-red-900/30 rounded-full"
                    title="Remove Experience"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {formData.experience.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 italic mb-4">Build your professional profile by adding internships, leadership roles, volunteer experience, or relevant organizational activities.</p>
                {isEditing && (
                  <button onClick={() => setShowExpModal(true)} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold">
                    Add Experience
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* EDUCATION SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-500" /> Education
            </h2>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none w-full pb-1"
                    placeholder="University Name"
                  />
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="text-sm text-slate-600 dark:text-slate-300 mt-2 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-blue-500 outline-none w-full pb-1"
                    placeholder="Degree & Department"
                  />
                </>
              ) : (
                <>
                  <h3 className="font-bold text-slate-900 dark:text-white">{formData.university || "University Name"}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{formData.department || "Degree & Department"}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* SKILLS SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-500" /> Skills
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {formData.skills.map((skill: any, i: number) => {
              const isString = typeof skill === 'string';
              const skillName = isString ? skill : skill.name;
              const skillLevel = isString ? null : skill.level;
              const skillSource = isString ? null : skill.source;

              return (
                <div 
                  key={i} 
                  className="group relative flex flex-col bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 min-w-[140px] transition-all hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <span className="text-slate-900 dark:text-white font-bold">{skillName}</span>
                  {skillLevel && <span className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">{skillLevel}</span>}
                  {skillSource && (
                    <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> {skillSource}
                    </div>
                  )}

                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all absolute top-2 right-2 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
            
            {isEditing && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.newSkill}
                  onChange={(e) => setFormData({ ...formData, newSkill: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
                  placeholder="Add a new skill..."
                />
                <button
                  onClick={handleAddSkill}
                  disabled={!formData.newSkill.trim()}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PROJECTS SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-500" /> Featured Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.projects?.map((proj: any, idx: number) => (
              <div key={idx} className="relative bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-cyan-500/50 transition-colors group/proj">
                {isEditing && (
                  <button
                    onClick={() => handleDeleteProject(proj.id, idx)}
                    className="absolute top-2 right-2 p-2 opacity-0 group-hover/proj:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-all"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 truncate pr-6">{proj.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{proj.description}</p>
                {proj.tags && Array.isArray(proj.tags) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.tags.slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wider">{tag}</span>
                    ))}
                    {proj.tags.length > 3 && <span className="px-2 py-1 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-500 rounded border border-slate-200 dark:border-slate-700">+{proj.tags.length - 3}</span>}
                  </div>
                )}
                <div className="flex items-center gap-4 mt-auto">
                  {proj.repoUrl && (
                    <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" /> View Repository
                    </a>
                  )}
                  {!isEditing && (
                    <button onClick={() => router.push('/resume')} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1 ml-auto">
                      <FileText className="w-3 h-3" /> Add to Resume
                    </button>
                  )}
                </div>
              </div>
            ))}
            {(!formData.projects || formData.projects.length === 0) && (
              <div className="col-span-2 text-center py-6">
                <p className="text-sm text-slate-500 italic mb-4">No projects yet. Build your first project and showcase it here.</p>
              </div>
            )}
          </div>
        </div>

        {/* BLOCKCHAIN CERTIFICATES SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Licenses & Certifications
            </h2>
            {isEditing && (
              <div className="flex gap-3">
                <button onClick={() => setShowCertModal(true)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-blue-600">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {formData.certificates.map((cert: any, index: number) => (
              <div key={index} className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0 relative group">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="font-bold text-slate-900 dark:text-white">{cert.name}</h3>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{cert.issuer}</p>
                  <p className="text-xs text-slate-500 mb-3">Issued {cert.date}</p>
                  
                  {/* Blockchain Verified Badge */}
                  {cert.isVerified && (
                    <div className="inline-flex flex-col items-start bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-3 w-full mt-2">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
                        <ShieldCheck className="w-4 h-4" /> Blockchain Verified
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono break-all bg-white dark:bg-slate-900 p-2 rounded w-full border border-slate-100 dark:border-slate-800">
                        <LinkIcon className="w-3 h-3 shrink-0" />
                        TxID: {cert.txId}
                      </div>
                    </div>
                  )}
                </div>
                {cert.imageUrl && (
                  <div className="ml-4 shrink-0 pr-8">
                    <img src={cert.imageUrl} alt={cert.name} className="w-32 h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 transition-transform" />
                  </div>
                )}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveCertificate(index)}
                    className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity bg-red-50 dark:bg-red-900/30 rounded-full"
                    title="Remove Certificate"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {formData.certificates.length === 0 && (
              <p className="text-sm text-slate-500 italic">No certifications added yet.</p>
            )}
          </div>
        </div>

        {/* AI CAREER INSIGHTS SECTION */}
        {!isEditing && (
          <div className="mt-8">
            <AICareerInsights user={user} />
          </div>
        )}

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

    </div>
  );
}
