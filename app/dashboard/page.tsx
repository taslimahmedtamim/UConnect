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

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
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
        const oppRes = await fetch("/api/opportunities");
        const oppData = await oppRes.json();
        if (oppData.success) {
          // Count active jobs (just generic opportunities for now, need actual application tracking later)
          setActiveJobsCount((user as any).applications?.length || 0);
          
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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header & Career Goal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Rocket className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Career Command Center</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {user.fullName.split(' ')[0]}. Here is your career progress.</p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl text-white shadow-lg min-w-[300px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-100 text-sm font-medium uppercase tracking-wider">Target Role</span>
            <Target className="w-5 h-5 text-blue-200" />
          </div>
          <h2 className="text-2xl font-bold">{careerGoal}</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span>Career Readiness</span>
                <span className="font-bold">{totalReadiness}%</span>
              </div>
              <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${totalReadiness}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Commitment Tracker */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-purple-100 dark:border-purple-900/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex items-center gap-4 z-10">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
            <AlarmClock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Daily Learning Commitment</h3>
            <p className="text-sm text-slate-500">Target: {user.userRoadmap?.learningTime || "1 hour daily"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto z-10">
          {dailyGoalCompleted ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg w-full md:w-auto justify-center">
              <CheckCircle2 className="w-5 h-5" />
              <span>Goal Met Today!</span>
            </div>
          ) : (
            <button 
              onClick={() => setDailyGoalCompleted(true)}
              className="w-full md:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Check In
            </button>
          )}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Focus & AI */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Focus & AI Recommendation */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              AI Career Recommendation
            </h2>

            {aiLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            ) : aiRecommendation ? (
              <div className="space-y-4 relative z-10">
                <div className="bg-white/60 dark:bg-slate-900/60 rounded-lg p-4 backdrop-blur-sm border border-white/40 dark:border-slate-800/60">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-500" /> Today's Focus
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">{aiRecommendation.focus}</p>
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {aiRecommendation.recommendation}
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recommended Actions</h4>
                  <ul className="space-y-2">
                    {aiRecommendation.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                        <div className="mt-0.5 bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Link href="/skillmap" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm">
                    Start Learning
                  </Link>
                  <button 
                    onClick={generateAIRecommendation}
                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-5 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            ) : null}
          </div>

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
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-1 shadow-sm">
              <FolderOpen className="w-6 h-6 text-blue-500 mb-1" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{projects.length}</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Projects</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-1 shadow-sm">
              <Users className="w-6 h-6 text-purple-500 mb-1" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{teamCount}</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Teams</span>
            </div>
          </div>

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
