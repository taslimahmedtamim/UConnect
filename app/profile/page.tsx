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
import JourneyTimeline from "@/components/profile/JourneyTimeline";

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
      {/* HERO BANNER - A massive, premium gradient header */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-32 sm:-mt-40 z-10">
        
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

        <div className="space-y-8">
          
          {/* HERO SECTION */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/50 dark:border-slate-700/50 p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 relative mb-4">
          
          {/* Avatar & Info Wrapper */}
          <div className="flex flex-col sm:flex-row items-center gap-6 flex-1 w-full">
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
            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-emerald-500 rounded-xl shadow-lg border-4 border-white dark:border-slate-900 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 pt-2 md:pt-0 pb-2 relative">

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

          {/* Skill Radar Chart */}
          {!isEditing && formData.skills.length > 0 && user?.role !== 'recruiter' && (
            <div className="w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-6 md:pt-0 md:pl-8 flex flex-col items-center justify-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Skill Map</h3>
              <SkillRadarChart 
                skills={formData.skills.map((s: any) => typeof s === 'string' ? s : s.name)} 
                title={formData.title}
                target={formData.userRoadmap?.careerGoal}
              />
            </div>
          )}
        </div>

        {/* RECRUITER CTA */}
        {!isEditing && user?.role === 'recruiter' && (
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Target className="w-6 h-6" /> Talent Acquisition Hub</h2>
              <p className="text-blue-100 max-w-xl">You are currently in Recruiter Mode. Ready to discover top talent for your company? Post an opportunity or browse our talent pool to find the perfect match.</p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-4 shrink-0">
              <button onClick={() => router.push('/opportunities')} className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-md transition-all">Post a Job</button>
            </div>
          </div>
        )}

        {/* PROGRESS CARD */}
        {!isEditing && user?.role !== 'recruiter' && (
          <div className="w-full">
            <CareerProgressCard user={user} />
          </div>
        )}

        {/* LEARNING HEATMAP */}
        {!isEditing && user?.role !== 'recruiter' && (
          <div className="w-full">
            <LearningHeatmap activityLog={user?.activityLog || {}} />
          </div>
        )}

        {/* GITHUB STATS */}
        {!isEditing && formData.githubUsername && user?.role !== 'recruiter' && (
          <ProfileGitHubStats 
            username={formData.githubUsername} 
            onSyncSkills={handleSyncGitHubSkills}
            compact={true}
          />
        )}

        {/* MY TEAMS SECTION */}
        {(!isEditing && (formData.ownedTeams.length > 0 || formData.memberTeams.length > 0)) && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> My Teams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.ownedTeams.map((team: any) => (
                <div key={`owned-${team.id}`} className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-5 flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer" onClick={() => router.push(`/teams/${team.id}`)}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{team.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded">Owner</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">{team.description}</p>
                </div>
              ))}
              {formData.memberTeams.filter((mTeam: any) => !formData.ownedTeams.some((oTeam: any) => oTeam.id === mTeam.id)).map((team: any) => (
                <div key={`member-${team.id}`} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer" onClick={() => router.push(`/teams/${team.id}`)}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{team.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">Member</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">{team.description}</p>
                </div>
              ))}
            </div>
          </div>
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

        {/* JOURNEY SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" /> Career Journey
              </h2>
              <p className="text-sm text-slate-500 mt-1">Experiences, Projects, and Certifications</p>
            </div>
            
            {isEditing && (
              <div className="flex gap-2">
                <button onClick={() => setShowExpModal(true)} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Experience
                </button>
                <button onClick={() => setShowCertModal(true)} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Certificate
                </button>
              </div>
            )}
          </div>

          <JourneyTimeline 
            experiences={formData.experience}
            certificates={formData.certificates}
            projects={formData.projects}
            isEditing={isEditing}
            onRemoveItem={(type, index) => {
              if (type === 'experience') handleRemoveExperience(index);
              if (type === 'certificate') handleRemoveCertificate(index);
              if (type === 'project') handleDeleteProject(formData.projects[index].id, index);
            }}
          />
        </div>

        {/* AI CAREER INSIGHTS SECTION */}
        {!isEditing && user?.role !== 'recruiter' && (
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
              <Award className="w-5 h-5 text-blue-500" /> Add Certificate
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
                <label className="block text-xs font-medium text-slate-500 mb-1">Upload Certificate (Image or PDF)</label>
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'certificate')} 
                  className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white text-sm" 
                />
                {newCert.imageUrl && <p className="text-xs text-emerald-500 mt-1">✓ File ready for upload</p>}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowCertModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">Cancel</button>
              <button onClick={handleAddCertificate} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                Add Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
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
