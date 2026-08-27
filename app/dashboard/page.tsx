"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FolderOpen, 
  Users, 
  Briefcase, 
  FileText, 
  Search,
  Plus,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Terminal,
  Rocket,
  AlarmClock
} from "lucide-react";
import { useUser } from "@/components/UserProvider";
import CareerProgressCard from "@/components/profile/CareerProgressCard";
import LearningHeatmap from "@/components/profile/LearningHeatmap";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState(false);
  const [activityLog, setActivityLog] = useState<Record<string, number>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [hiredCount, setHiredCount] = useState(0);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [recommendedTeams, setRecommendedTeams] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // AI Recommendation
  const [aiRecommendation, setAiRecommendation] = useState<{ focus: string; recommendation: string; steps: string[] } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoadingStats(true);
        // Initialize activity log if available
        if ((user as any).activityLog) {
          setActivityLog((user as any).activityLog);
          const today = new Date().toISOString().split('T')[0];
          if ((user as any).activityLog[today]) {
            setDailyGoalCompleted(true);
          }
        }

        // Fetch projects
        const projRes = await fetch("/api/projects");
        const projData = await projRes.json();
        if (projData.success) {
          const userProjects = projData.projects.filter((p: any) => p.authorId === user.id);
          setProjects(userProjects);
        }

        // Fetch teams
        const teamRes = await fetch("/api/teams");
        const teamData = await teamRes.json();
        if (teamData.success) {
          const userTeams = teamData.teams.filter((t: any) => 
            t.members.some((m: any) => m.id === user.id)
          );
          setTeamCount(userTeams.length);
          
          // Recommended Teams (mock logic: teams looking for user skills)
          const otherTeams = teamData.teams.filter((t: any) => !t.members.some((m: any) => m.id === user.id));
          const matches = otherTeams.map((t: any) => {
            const reqSkills = t.requiredSkills || [];
            const overlap = reqSkills.filter((s: string) => user.skills.includes(s));
            return {
              ...t,
              matchPercent: reqSkills.length > 0 ? Math.round((overlap.length / reqSkills.length) * 100) : 50,
              missing: reqSkills.filter((s: string) => !user.skills.includes(s))
            };
          }).filter((t: any) => t.matchPercent > 0).sort((a: any, b: any) => b.matchPercent - a.matchPercent);
          
          setRecommendedTeams(matches.slice(0, 3));
        }

        // Fetch opportunities
        if (user.role === 'recruiter' || user.role === 'mentor') {
          const manageRes = await fetch("/api/opportunities/manage");
          const manageData = await manageRes.json();
          if (manageData.success) {
             const myOpps = manageData.opportunities;
             setActiveJobsCount(myOpps.length);
             
             let aCount = 0;
             let hCount = 0;
             let recApps: any[] = [];
             
             myOpps.forEach((o: any) => {
               aCount += o.applications.length;
               o.applications.forEach((a: any) => {
                 if (a.status === 'accepted') hCount++;
                 recApps.push({ ...a, oppTitle: o.title });
               });
             });
             
             setTotalApplicants(aCount);
             setHiredCount(hCount);
             recApps.reverse();
             setRecentApplications(recApps.slice(0, 5));
          }
        }

        const oppRes = await fetch("/api/opportunities");
        const oppData = await oppRes.json();
        if (oppData.success) {
          if (user.role === 'student') {
            setActiveJobsCount((user as any).applications?.length || 0);
          }
          
          // Recommended Jobs
          const matches = oppData.opportunities.map((opp: any) => {
            const reqSkills = opp.requirements || [];
            const overlap = reqSkills.filter((s: string) => user.skills.includes(s));
            return {
              ...opp,
              matchPercent: reqSkills.length > 0 ? Math.round((overlap.length / reqSkills.length) * 100) : 50,
              missing: reqSkills.filter((s: string) => !user.skills.includes(s))
            };
          }).filter((o: any) => o.matchPercent > 0).sort((a: any, b: any) => b.matchPercent - a.matchPercent);
          
          setRecommendedJobs(matches.slice(0, 3));
        }
        
        // Cache / load AI Recommendation (with daily expiry)
        const cachedAi = localStorage.getItem(`ai_rec_${user.id}`);
        if (cachedAi) {
          try {
            const parsed = JSON.parse(cachedAi);
            const today = new Date().toISOString().split('T')[0];
            if (parsed.expiry === today && parsed.data) {
              // Cache is from today — use it
              setAiRecommendation(parsed.data);
            } else {
              // Cache is stale — refresh from AI
              generateAIRecommendation();
            }
          } catch {
            generateAIRecommendation();
          }
        } else {
          generateAIRecommendation();
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchData();
  }, [user]);

  const generateAIRecommendation = async () => {
    if (!user) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/users/profile/insights');
      const data = await res.json();

      if (data.success && data.insights) {
        const insights = data.insights;
        const rec = {
          focus: insights.recommendations?.[0] || "Keep building your skills and projects.",
          recommendation: insights.strengths?.length > 0
            ? `Your strengths include ${insights.strengths.slice(0, 2).join(' and ')}. ${insights.weaknesses?.[0] ? `Consider improving: ${insights.weaknesses[0]}.` : ''}`
            : `Focus on building your practical experience to increase your career readiness.`,
          steps: insights.recommendations?.slice(0, 3) || [
            "Complete your U-SkillMap assessment",
            "Add a project to your portfolio",
            "Update your resume"
          ]
        };
        setAiRecommendation(rec);
        // Cache with daily expiry
        const cacheData = {
          data: rec,
          expiry: new Date().toISOString().split('T')[0] // today's date as expiry key
        };
        localStorage.setItem(`ai_rec_${user.id}`, JSON.stringify(cacheData));
      } else {
        // Fallback if API fails
        const rec = {
          focus: user.userRoadmap ? `Complete your ${user.userRoadmap.careerGoal} milestone.` : "Set up your Career Goal in U-SkillMap.",
          recommendation: `Your profile is strong in ${user.skills.slice(0,2).join(', ') || 'fundamentals'}. Focus on building your practical experience.`,
          steps: user.userRoadmap ? [
            "Complete one more module in your U-SkillMap",
            "Create a project using your new skills",
            "Update your U-Resume with the new project"
          ] : [
            "Take the U-SkillMap assessment",
            "Add past projects to your portfolio",
            "Update your resume"
          ]
        };
        setAiRecommendation(rec);
      }
    } catch (error) {
      console.error("AI Recommendation error:", error);
      // Graceful fallback
      const rec = {
        focus: "Keep building your skills and projects.",
        recommendation: "Focus on completing your profile to get personalized AI insights.",
        steps: [
          "Take the U-SkillMap assessment",
          "Add projects to your portfolio",
          "Update your resume"
        ]
      };
      setAiRecommendation(rec);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await fetch('/api/users/activity', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActivityLog(data.activityLog);
        setDailyGoalCompleted(true);
      }
    } catch (error) {
      console.error("Failed to check in:", error);
    }
  };

  if (userLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const careerGoal = user.userRoadmap?.careerGoal || user.title || "Career Explorer";
  
  // Calculate mock "Readiness"
  const skillReadiness = user.skills?.length > 5 ? 80 : 40;
  const projReadiness = projects.length > 1 ? 90 : (projects.length > 0 ? 50 : 10);
  const resumeReadiness = user.experience?.length > 0 ? 85 : 30;
  const totalReadiness = Math.round((skillReadiness + projReadiness + resumeReadiness) / 3);

  if (user.role === 'recruiter') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Recruitment Hub</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, {user.fullName.split(' ')[0]}. Here is your talent pipeline overview.</p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl text-white shadow-lg flex gap-4 items-center cursor-pointer hover:shadow-xl transition-shadow" onClick={() => router.push('/opportunities')}>
            <div className="p-3 bg-white/20 rounded-full">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Post New Opportunity</h2>
              <p className="text-blue-100 text-sm">Find top talent instantly</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{activeJobsCount}</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Jobs</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center gap-2">
            <Users className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{totalApplicants}</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Applicants</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{hiredCount}</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hired</span>
          </div>
        </div>

        {recentApplications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px]">
            <Target className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Active Applications</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">You haven't received any new applications recently. Post a new job or browse the skill map to invite candidates.</p>
            <button onClick={() => router.push('/opportunities')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">Go to Opportunities</button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Applications</h2>
              <button onClick={() => router.push('/opportunities')} className="text-blue-600 text-sm font-medium hover:underline">View All Pipeline &rarr;</button>
            </div>
            <div className="space-y-4">
              {recentApplications.map((app, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-lg gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{app.student.fullName}</h3>
                    <p className="text-sm text-slate-500">Applied for <span className="font-semibold text-slate-700 dark:text-slate-300">{app.oppTitle}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.aiScore >= 80 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : app.aiScore >= 60 ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {app.aiScore}% Match
                    </span>
                    <button onClick={() => router.push('/opportunities')} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header & Career Goal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white shrink-0 transform transition-transform hover:scale-105">
              <Rocket className="w-7 h-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">
              Career Command Center
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Welcome back, <span className="font-semibold text-slate-900 dark:text-white">{user.fullName.split(' ')[0]}</span>. Here is your career progress.
          </p>
        </div>
        
        <div className="w-full lg:w-auto lg:min-w-[380px] shrink-0 group">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-500/20 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform duration-500 group-hover:scale-125"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none transition-transform duration-500 group-hover:scale-125"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-blue-100/90 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  Target Role
                </span>
                <div className="p-1.5 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Target className="w-5 h-5 text-blue-50" />
                </div>
              </div>
              
              <h2 className="text-2xl font-black mb-5 tracking-tight truncate" title={careerGoal}>
                {careerGoal}
              </h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium items-end">
                  <span className="text-blue-100">Career Readiness</span>
                  <span className="font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-lg text-sm">{totalReadiness}%</span>
                </div>
                <div className="h-3 bg-black/20 rounded-full overflow-hidden p-0.5 backdrop-blur-sm shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-all duration-1000 ease-out relative" 
                    style={{ width: `${totalReadiness}%` }}
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Career Journey Stepper */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-500" />
          Your Career Journey
        </h2>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 hidden md:block z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.skills.length > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <Target className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">SkillMap</span>
            <span className="text-xs text-slate-500">{user.skills.length} Skills</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${projects.length > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Projects</span>
            <span className="text-xs text-slate-500">{projects.length} Built</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.experience?.length > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">U-Resume</span>
            <span className="text-xs text-slate-500">{user.experience?.length > 0 ? 'Ready' : 'Incomplete'}</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeJobsCount > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <Search className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Jobs</span>
            <span className="text-xs text-slate-500">{activeJobsCount} Active</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <LearningHeatmap activityLog={activityLog} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Focus & AI */}
        <div className="lg:col-span-2 space-y-6">

          {/* Recommended Jobs */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recommended Opportunities</h2>
              <Link href="/opportunities" className="text-sm font-medium text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loadingStats ? (
                <div className="p-8 text-center text-slate-500">Loading recommendations...</div>
              ) : recommendedJobs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No strong matches found. Add more skills to your profile!</div>
              ) : (
                recommendedJobs.map((job) => (
                  <div key={job.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.company} • {job.type}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {job.missing?.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded text-xs font-medium border border-amber-200 dark:border-amber-800">
                            <AlertCircle className="w-3 h-3" /> Missing: {job.missing[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800">
                        {job.matchPercent}% Match
                      </div>
                      <Link href={`/opportunities`} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                        View <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Teams & Stats */}
        <div className="space-y-6">


          {/* Recommended Teams */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recommended Teams</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loadingStats ? (
                <div className="p-8 text-center text-slate-500">Loading...</div>
              ) : recommendedTeams.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No team matches right now.
                </div>
              ) : (
                recommendedTeams.map((team) => (
                  <div key={team.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{team.name}</h3>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                        {team.matchPercent}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mb-3">{team.description}</p>
                    <Link href="/teams" className="text-blue-600 text-xs font-medium hover:underline">
                      View Team &rarr;
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
