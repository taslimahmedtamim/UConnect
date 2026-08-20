"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Users, Code, CheckCircle, XCircle, BrainCircuit, Sparkles, MessageSquare, Megaphone } from "lucide-react";
import TeamAnnouncements from "@/components/TeamAnnouncements";
import TeamLeaderboard from "@/components/TeamLeaderboard";
import TeamProjects from "@/components/TeamProjects";

export default function TeamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [joining, setJoining] = useState(false);
  const [actioning, setActioning] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setCurrentUser(JSON.parse(storedUser));

        const res = await fetch(`/api/teams/${id}`);
        const data = await res.json();
        if (data.success) {
          setTeam(data.team);
          
          // If owner, fetch suggestions
          if (storedUser && JSON.parse(storedUser).id === data.team.owner.id) {
            fetch(`/api/teams/${id}/suggest`, {
              })
            .then(r => r.json())
            .then(d => {
              if (d.success) setSuggestions(d.suggestions);
            })
            .catch(e => console.error("Failed to fetch suggestions", e));
          }
        }
      } catch (error) {
        console.error("Failed to fetch team", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTeam();
  }, [id]);

  const handleJoinRequest = async () => {
    setJoining(true);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { router.push("/login"); return; }

    try {
      const res = await fetch(`/api/teams/${id}/request`, {
        method: "POST",
        
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      alert(`Join Request Sent! AI Synergy Score: ${data.aiScore}/100\nFeedback: ${data.aiFeedback}`);
      
      // Refresh team data
      const refresh = await fetch(`/api/teams/${id}`);
      const refreshData = await refresh.json();
      if (refreshData.success) setTeam(refreshData.team);

    } catch (error: any) {
      alert(error.message);
    } finally {
      setJoining(false);
    }
  };

  const handleActionRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    setActioning(requestId);
    try {
      const res = await fetch(`/api/teams/${id}/approve`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          },
        body: JSON.stringify({ requestId, status })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      
      // Refresh team data
      const refresh = await fetch(`/api/teams/${id}`);
      const refreshData = await refresh.json();
      if (refreshData.success) setTeam(refreshData.team);
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setActioning(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading team...</div>;
  if (!team) return <div className="text-center py-20 text-slate-500">Team not found.</div>;

  const isOwner = currentUser?.id === team.owner.id;
  const isMember = team.members.some((m: any) => m.id === currentUser?.id);
  const hasRequested = team.joinRequests.some((r: any) => r.user.id === currentUser?.id);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Users className="w-48 h-48" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{team.name}</h1>
        <p className="text-slate-500 dark:text-slate-400">Created by {team.owner.fullName}</p>
        <p className="mt-6 text-lg text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
          {team.description}
        </p>

        {team.requiredSkills && team.requiredSkills.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Code className="w-4 h-4" /> Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {team.requiredSkills.map((skill: string) => (
                <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button for Non-Owners */}
        {!isOwner && (
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
            {isMember ? (
              <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-6 py-3 rounded-xl font-medium">
                <CheckCircle className="w-5 h-5" /> You are a member of this team
              </div>
            ) : hasRequested ? (
              <div className="inline-flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-6 py-3 rounded-xl font-medium">
                <BrainCircuit className="w-5 h-5" /> Join Request Pending (AI Analyzed)
              </div>
            ) : (
              <button
                onClick={handleJoinRequest}
                disabled={joining}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
              >
                {joining ? "Analyzing Profile with AI..." : "Request to Join Team"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 pb-px">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'}`}
        >
          Team Overview
        </button>
        <button 
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'}`}
        >
          Projects & Tasks
        </button>
        <button 
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'leaderboard' ? 'border-amber-500 text-amber-600 dark:border-amber-500 dark:text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'}`}
        >
          Leaderboard 🏆
        </button>
      </div>

      {activeTab === "overview" && (
        <>
          {/* Owner Management Area */}
          {isOwner && team.joinRequests && team.joinRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Pending Applications</h2>
          <div className="space-y-4">
            {team.joinRequests.filter((r:any) => r.status === 'pending').map((req: any) => (
              <div key={req.id} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg dark:text-white">{req.user.fullName}</h3>
                    {/* AI Score Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 ${req.aiScore >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : req.aiScore >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                      <BrainCircuit className="w-4 h-4" /> AI Synergy: {req.aiScore}%
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">"{req.aiFeedback}"</p>
                  
                  <div className="flex gap-2 text-xs text-slate-500">
                    <span className="font-medium">Skills:</span> {req.user.skills?.join(', ') || 'None'}
                  </div>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleActionRequest(req.id, 'rejected')}
                    disabled={actioning === req.id}
                    className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleActionRequest(req.id, 'approved')}
                    disabled={actioning === req.id}
                    className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
            {team.joinRequests.filter((r:any) => r.status === 'pending').length === 0 && (
              <p className="text-slate-500">No pending requests.</p>
            )}
          </div>
        </div>
      )}

      {/* Suggested Teammates (Owner Only) */}
      {isOwner && suggestions.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" /> Auto-Suggested Profiles
          </h2>
          <p className="text-slate-500 mb-6">These students have skills that match your project requirements.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((sug: any) => (
              <div key={sug.user.id} className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-slate-900 rounded-xl p-5 border border-purple-100 dark:border-purple-900/30 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">{sug.user.fullName}</h4>
                    <p className="text-xs text-slate-500">{sug.user.email}</p>
                  </div>
                  <div className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold">
                    {sug.matchPercentage}% Skill Match
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">"{sug.user.bio || 'No bio provided'}"</p>
                <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                  {sug.user.skills?.map((skill: string) => (
                    <span key={skill} className={`px-2 py-1 rounded-md text-xs font-medium ${team.requiredSkills.some((rs: string) => rs.toLowerCase() === skill.toLowerCase()) ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </>
      )}

      {activeTab === "projects" && (
        <TeamProjects team={team} currentUser={currentUser} />
      )}

      {activeTab === "leaderboard" && (
        <TeamLeaderboard team={team} teamId={id as string} currentUser={currentUser} />
      )}

    </div>
  );
}
