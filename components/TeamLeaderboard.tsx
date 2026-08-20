"use client";

import { useState, useEffect } from "react";
import { Trophy, Plus, Medal } from "lucide-react";

export default function TeamLeaderboard({ team, teamId, currentUser }: { team: any, teamId: string, currentUser: any }) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [awarding, setAwarding] = useState<string | null>(null);

  const allMembers = [team.owner, ...team.members].filter(
    (v, i, a) => a.findIndex(t => t.id === v.id) === i
  );

  const getRankBadge = (points: number) => {
    if (points >= 50) return { title: "Expert", color: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-500", icon: "🏆" };
    if (points >= 20) return { title: "Contributor", color: "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300", icon: "🥈" };
    if (points >= 5) return { title: "Novice", color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800/50 dark:text-orange-400", icon: "🥉" };
    return { title: "Member", color: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400", icon: "🌱" };
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}/points`);
      const data = await res.json();
      if (data.success) {
        // Merge fetched leaderboard with allMembers to ensure everyone is listed even if 0 points
        const pointsMap = new Map(data.leaderboard.map((item: any) => [item.receiverId, item.points]));
        
        const merged = allMembers.map((member: any) => ({
          user: member,
          points: Number(pointsMap.get(member.id)) || 0
        }));

        // Sort descending
        merged.sort((a, b) => Number(b.points) - Number(a.points));
        setLeaderboard(merged);
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [teamId]);

  const isMember = currentUser && (currentUser.id === team.owner.id || team.members.some((m: any) => m.id === currentUser.id));

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Team Leaderboard</h2>
          <p className="text-sm text-slate-500">Points are earned when your tasks are reviewed by a team lead!</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading leaderboard...</div>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((item, index) => {
            const isMe = currentUser?.id === item.user.id;
            const rank = index + 1;
            
            let badgeColors = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
            if (rank === 1 && item.points > 0) badgeColors = "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800/50";
            else if (rank === 2 && item.points > 0) badgeColors = "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600";
            else if (rank === 3 && item.points > 0) badgeColors = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50";

            return (
              <div 
                key={item.user.id} 
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isMe 
                    ? "bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30" 
                    : "bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${badgeColors}`}>
                  {rank <= 3 && item.points > 0 ? <Medal className="w-5 h-5" /> : `#${rank}`}
                </div>
                
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg shrink-0 overflow-hidden">
                  {item.user.profileImage ? (
                    <img src={item.user.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    item.user.fullName.charAt(0)
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {item.user.fullName}
                      {isMe && <span className="text-[10px] uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 px-2 py-0.5 rounded-full">You</span>}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{item.user.title || (item.user.id === team.ownerId ? 'Team Owner' : 'Member')}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getRankBadge(item.points).color}`}>
                      {getRankBadge(item.points).icon} {getRankBadge(item.points).title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center px-4">
                    <div className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{item.points}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Points</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
