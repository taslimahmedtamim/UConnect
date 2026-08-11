"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UserCircle, GraduationCap, Code, Save, Plus, X, 
  MapPin, Edit3, Briefcase, Award, ShieldCheck, Link as LinkIcon
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    location: "",
    bio: "",
    profileImage: "",
    university: "",
    department: "",
    skills: [] as string[],
    newSkill: "",
    experience: [] as any[],
    certificates: [] as any[],
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
          
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data.user);
        setFormData({
          fullName: data.user.fullName || "",
          title: data.user.title || "",
          location: data.user.location || "",
          profileImage: data.user.profileImage || "",
          bio: data.user.bio || "",
          university: data.user.university || "",
          department: data.user.department || "",
          skills: data.user.skills || [],
          newSkill: "",
          experience: data.user.experience || [],
          certificates: data.user.certificates || [],
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
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.newSkill.trim()],
        newSkill: "",
      });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
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
          "Content-Type": "application/json",
          },
        body: JSON.stringify({
          fullName: formData.fullName,
          profileImage: formData.profileImage,
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

      if (!res.ok) throw new Error("Failed to save profile");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving profile");
    } finally {
      setSaving(false);
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex items-start gap-6 relative">
          
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

            <div className="flex items-center gap-3 mb-2">
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

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
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
                <Award className="w-4 h-4" />
                Joined Dec 2023
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Experience</h2>
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
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{exp.title}</h3>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{exp.company}</p>
                  <p className="text-xs text-slate-500 mb-2">{exp.duration}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
            {formData.experience.length === 0 && (
              <p className="text-sm text-slate-500 italic">No experience added yet.</p>
            )}
          </div>
        </div>

        {/* EDUCATION SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Education</h2>
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-amber-500">⚡</span> Skills
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {formData.skills.map((skill) => (
              <div 
                key={skill} 
                className="group relative px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center gap-2 transition-all"
              >
                <span className="text-blue-600 dark:text-blue-400 font-medium">{skill}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-red-500 transition-all absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            
            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.newSkill}
                  onChange={(e) => setFormData({ ...formData, newSkill: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-40"
                  placeholder="Add a new skill..."
                />
                <button
                  onClick={handleAddSkill}
                  disabled={!formData.newSkill.trim()}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BLOCKCHAIN CERTIFICATES SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
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
              <div key={index} className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1">
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
                  <div className="ml-4 shrink-0">
                    <img src={cert.imageUrl} alt={cert.name} className="w-32 h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 transition-transform" />
                  </div>
                )}
              </div>
            ))}
            {formData.certificates.length === 0 && (
              <p className="text-sm text-slate-500 italic">No certifications added yet.</p>
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

    </div>
  );
}
