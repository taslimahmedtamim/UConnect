"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, Briefcase, Award, ShieldCheck, Link as LinkIcon, GraduationCap, Users, FolderOpen, Code, Printer, Calendar, ChevronRight, FileText
} from "lucide-react";
import ProfileGitHubStats from "@/components/profile/ProfileGitHubStats";
import SkillRadarChart from "@/components/profile/SkillRadarChart";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/public/${username}`);
        const data = await res.json();
        
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "UC";

  const handlePrintResume = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50 dark:bg-slate-950">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Profile Not Found</h1>
          <p className="text-slate-500 mb-6">The user @{username} does not exist or has not set their username.</p>
          <button onClick={() => router.push('/')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-xl font-bold shadow-md shadow-blue-500/20">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Combine owned and joined teams uniquely
  const allTeams = [...(user.ownedTeams || []), ...(user.memberTeams || [])].reduce((acc: any[], curr: any) => {
    if(!acc.find((t: any) => t.id === curr.id)) acc.push(curr);
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 print:bg-white print:p-0">
      
      {/* 
        HERO BANNER - A massive, premium gradient header 
      */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-32 sm:-mt-40 z-10 print:mt-0">
        
        {/* PROFILE CARD */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/50 dark:border-slate-700/50 p-6 sm:p-10 flex flex-col md:flex-row print:flex-row items-center md:items-center print:items-center gap-8 mb-8 print:shadow-none print:border-none print:bg-transparent print:p-0 print:mb-8">
          
          <div className="relative shrink-0 group">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl p-1.5 bg-gradient-to-br from-white/50 to-white/20 dark:from-slate-700/50 dark:to-slate-800/20 backdrop-blur-sm shadow-xl print:p-0 print:shadow-none print:bg-transparent">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-full h-full rounded-2xl object-cover" 
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-6xl font-black text-white shadow-inner print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300 print:shadow-none">
                  {getInitials(user.fullName)}
                </div>
              )}
            </div>
            {/* Verified Badge */}
            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-emerald-500 rounded-xl shadow-lg border-4 border-white dark:border-slate-900 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform print:hidden">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left print:text-left pt-2 md:pt-0 pb-2">
            <div className="flex flex-col md:flex-row print:flex-row md:items-center print:items-center gap-3 mb-2 justify-center md:justify-start print:justify-start">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {user.fullName}
              </h1>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-sm border border-blue-200 dark:border-blue-800/50 w-fit mx-auto md:mx-0 print:mx-0">
                @{user.username}
              </span>
            </div>

            <p className="text-xl text-slate-600 dark:text-slate-300 font-medium mb-4 max-w-2xl print:text-slate-900">
              {user.title || "Student"} {user.university && `• ${user.university}`}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start print:justify-start gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400 print:text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 print:bg-transparent print:p-0 px-3 py-1.5 rounded-lg">
                <MapPin className="w-4 h-4" /> {user.location || "Earth"}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 print:bg-transparent print:p-0 px-3 py-1.5 rounded-lg">
                <Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).getFullYear()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex gap-3 print:hidden w-full md:w-auto mt-4 md:mt-0">
            <button onClick={handlePrintResume} className="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" /> Export CV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: RESUME & ABOUT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ABOUT */}
            {user.bio && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:p-0">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">About Me</h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                  {user.bio}
                </p>
              </div>
            )}

            {/* EXPERIENCE (DIGITAL RESUME) */}
            {user.experience && user.experience.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:p-0 print:mt-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Experience
                </h2>
                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-10">
                  {user.experience.map((exp: any, index: number) => (
                    <div key={index} className="relative pl-8">
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-blue-500" />
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{exp.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500 mb-3">
                        <span className="text-blue-600 dark:text-blue-400">{exp.company}</span>
                        <span>•</span>
                        <span>{exp.duration}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {(user.university || user.department) && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:p-0 print:mt-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Education
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50">
                    <GraduationCap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{user.university}</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">{user.department}</p>
                  </div>
                </div>
              </div>
            )}

            {/* SKILLS */}
            {user.role !== 'recruiter' && user.skills && user.skills.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:p-0 print:mt-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Code className="w-4 h-4" /> Technical Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill: any, idx: number) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <div 
                        key={skillName || idx} 
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:scale-105 transition-transform cursor-default"
                      >
                        {skillName}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: STATS, TEAMS, GITHUB */}
          <div className="space-y-8">
            
            {/* SKILL RADAR */}
            {user.role !== 'recruiter' && user.skills?.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center print:hidden">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 w-full text-left">Skill Radar</h3>
                <SkillRadarChart 
                  skills={(user.skills || []).map((s: any) => typeof s === 'string' ? s : s.name)} 
                  title={user.title}
                />
              </div>
            )}

            {/* GITHUB STATS */}
            {user.role !== 'recruiter' && user.githubUsername && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 print:break-inside-avoid">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Code className="w-4 h-4" /> Open Source
                </h2>
                <ProfileGitHubStats username={user.githubUsername} />
              </div>
            )}

            {/* TEAMS */}
            {allTeams.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 print:break-inside-avoid">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Teams & Collaborations
                </h2>
                <div className="space-y-4">
                  {allTeams.map((team: any) => (
                    <div key={team.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 group hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{team.name}</h3>
                        <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full shrink-0">
                          {team.members?.length || 0} Members
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{team.description}</p>
                      <button 
                        onClick={() => router.push(`/teams/${team.id}`)}
                        className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline print:hidden"
                      >
                        View Team <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM SECTION: PROJECTS & CERTIFICATES */}
        <div className="mt-8 space-y-8">
          
          {/* PROJECTS */}
          {user.role !== 'recruiter' && user.projects && user.projects.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:p-0 print:mt-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <FolderOpen className="w-4 h-4" /> Project Portfolio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.projects.map((project: any) => (
                  <div key={project.id} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col h-full hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1">
                      {project.description || "No description provided."}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(Array.isArray(project.tags) ? project.tags : []).slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span> {project.likes || 0}
                        </div>
                        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span> {project.views || 0}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 print:hidden"
                      >
                        Details <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATES */}
          {user.role !== 'recruiter' && user.certificates && user.certificates.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:p-0 print:mt-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Award className="w-4 h-4" /> Licenses & Certifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.certificates.map((cert: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-700/50">
                      <Award className="w-8 h-8 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1">{cert.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">{cert.issuer}</p>
                      <p className="text-xs text-slate-400 mb-3">Issued {cert.date}</p>
                      
                      {cert.isVerified && (
                        <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
                          <ShieldCheck className="w-4 h-4" /> Blockchain Verified
                        </div>
                      )}
                    </div>
                    {cert.imageUrl && (
                      <div className="shrink-0 print:hidden mt-4 sm:mt-0">
                        {cert.imageUrl.toLowerCase().endsWith('.pdf') ? (
                          <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-24 h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-blue-600 hover:text-blue-700 hover:scale-105 transition-all">
                            <FileText className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-bold">PDF</span>
                          </a>
                        ) : (
                          <img src={cert.imageUrl} alt={cert.name} className="w-24 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 transition-all" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
