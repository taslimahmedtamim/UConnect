"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, Briefcase, Award, ShieldCheck, Link as LinkIcon, GraduationCap, Users
} from "lucide-react";

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Profile Not Found</h1>
        <p className="text-slate-500">The user @{username} does not exist or has not set their username.</p>
        <button onClick={() => router.push('/')} className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      
      <div className="space-y-6">
        
        {/* HERO SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative text-center sm:text-left">
          
          {/* Avatar */}
          <div className="relative shrink-0">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-slate-200 dark:border-slate-700" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-bold text-white shadow-md relative overflow-hidden">
                {getInitials(user.fullName)}
              </div>
            )}
            
            {/* Verified Checkmark */}
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 pt-2 w-full">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {user.fullName}
            </h1>
            
            <p className="text-blue-500 font-mono font-medium mb-4">
              @{user.username}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 text-slate-600 dark:text-slate-400 mb-4 justify-center sm:justify-start">
              <p>
                {user.title || "Student"} &bull; {user.university || "University"}
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium justify-center sm:justify-start">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{user.location || "Earth"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Joined {new Date(user.createdAt).getFullYear()}
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        {user.bio && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About</h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {user.bio}
            </p>
          </div>
        )}

        {/* EXPERIENCE SECTION */}
        {user.experience && user.experience.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Experience</h2>
            <div className="space-y-6">
              {user.experience.map((exp: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 pr-8">
                    <h3 className="font-bold text-slate-900 dark:text-white">{exp.title}</h3>
                    <p className="text-sm text-slate-800 dark:text-slate-200">{exp.company}</p>
                    <p className="text-xs text-slate-500 mb-2">{exp.duration}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION SECTION */}
        {(user.university || user.department) && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Education</h2>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">{user.university}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{user.department}</p>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS SECTION */}
        {user.skills && user.skills.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-amber-500">⚡</span> Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill: string) => (
                <div 
                  key={skill} 
                  className="px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center gap-2"
                >
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOCKCHAIN CERTIFICATES SECTION */}
        {user.certificates && user.certificates.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              Licenses & Certifications
            </h2>
            <div className="space-y-6">
              {user.certificates.map((cert: any, index: number) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex-1 pr-8">
                      <h3 className="font-bold text-slate-900 dark:text-white">{cert.name}</h3>
                      <p className="text-sm text-slate-800 dark:text-slate-200">{cert.issuer}</p>
                      <p className="text-xs text-slate-500 mb-3">Issued {cert.date}</p>
                      
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
                  </div>
                  {cert.imageUrl && (
                    <div className="shrink-0 pt-4 md:pt-0">
                      <img src={cert.imageUrl} alt={cert.name} className="w-full md:w-48 h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAMS LED SECTION */}
        {user.ownedTeams && user.ownedTeams.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Teams Led by {user.fullName.split(' ')[0]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.ownedTeams.map((team: any) => (
                <div key={team.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col h-full">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{team.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                    {team.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {team.requiredSkills?.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {skill}
                      </span>
                    ))}
                    {team.requiredSkills?.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                        +{team.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50">
                    <div className="text-xs text-slate-500 font-medium">
                      {team.members?.length || 0} Member{(team.members?.length || 0) !== 1 ? 's' : ''}
                    </div>
                    <button 
                      onClick={() => router.push(`/teams/${team.id}`)}
                      className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                    >
                      <LinkIcon className="w-3 h-3" /> View & Join Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
