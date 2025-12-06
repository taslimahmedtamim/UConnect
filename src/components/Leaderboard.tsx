import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Crown, TrendingUp, Flame, Zap, Award, ChevronUp, ChevronDown, Globe, Building2, GraduationCap } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlassCard from './GlassCard';
import AnimatedBackground from './AnimatedBackground';

interface LeaderboardProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const leaderboardData = {
  national: [
    { rank: 1, name: 'Rafid Ahmed', college: 'BUET', branch: 'CSE', uScore: 2847, projects: 45, change: 0, avatar: 'from-amber-400 to-orange-500', tier: 'Mythic' },
    { rank: 2, name: 'Nusrat Jahan', college: 'DU', branch: 'CSE', uScore: 2791, projects: 42, change: 2, avatar: 'from-pink-400 to-rose-500', tier: 'Mythic' },
    { rank: 3, name: 'Tanvir Hossain', college: 'NSU', branch: 'ECE', uScore: 2675, projects: 38, change: -1, avatar: 'from-blue-400 to-cyan-500', tier: 'Mythic' },
    { rank: 4, name: 'Sadia Rahman', college: 'BRAC University', branch: 'CS', uScore: 2543, projects: 35, change: 1, avatar: 'from-purple-400 to-pink-500', tier: 'Diamond I' },
    { rank: 5, name: 'Fahim Khan', college: 'CUET', branch: 'CSE', uScore: 2401, projects: 33, change: -2, avatar: 'from-emerald-400 to-teal-500', tier: 'Diamond I' },
    { rank: 6, name: 'Anika Islam', college: 'IUB', branch: 'CS', uScore: 2298, projects: 31, change: 3, avatar: 'from-indigo-400 to-purple-500', tier: 'Diamond II' },
    { rank: 7, name: 'Arnab Das', college: 'UIU', branch: 'CSE', uScore: 2145, projects: 28, change: 0, avatar: 'from-cyan-400 to-blue-500', tier: 'Diamond II' },
    { rank: 8, name: 'Tisha Chowdhury', college: 'BUET', branch: 'EEE', uScore: 2087, projects: 27, change: 1, avatar: 'from-rose-400 to-pink-500', tier: 'Diamond III' },
    { rank: 9, name: 'Mehedi Hasan', college: 'RUET', branch: 'CSE', uScore: 1976, projects: 25, change: -1, avatar: 'from-teal-400 to-emerald-500', tier: 'Diamond III' },
    { rank: 10, name: 'Lamia Sultana', college: 'KUET', branch: 'ME', uScore: 1854, projects: 23, change: 2, avatar: 'from-orange-400 to-amber-500', tier: 'Platinum I' },
  ],
};

export default function Leaderboard({ onOpenAIMentor, darkMode, onToggleDarkMode }: LeaderboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'national' | 'college' | 'branch'>('national');

  const getTierColor = (tier: string) => {
    if (tier === 'Mythic') return 'from-amber-500 via-orange-500 to-red-500';
    if (tier.includes('Diamond')) return 'from-blue-400 via-indigo-500 to-purple-500';
    if (tier.includes('Platinum')) return 'from-cyan-400 via-teal-400 to-emerald-400';
    return 'from-slate-400 to-slate-600';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} flex relative`}>
      <AnimatedBackground darkMode={darkMode} />
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} relative z-10`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} />
        
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Trophy className="w-12 h-12 text-amber-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <Trophy className="w-12 h-12 text-amber-400 blur-md" />
                </motion.div>
              </div>
              <div>
                <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl`} style={{ letterSpacing: '-0.02em' }}>
                  Leaderboard
                </h1>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Top builders across Bangladesh • Going Global
                </p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="mb-8">
            <GlassCard className="p-6">
              <div className="flex gap-3">
                {[
                  { key: 'national', label: 'National', icon: Globe },
                  { key: 'college', label: 'Your College', icon: Building2 },
                  { key: 'branch', label: 'Your Branch', icon: GraduationCap },
                ].map((filter) => (
                  <motion.button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 px-6 py-4 rounded-xl transition-all font-black ${
                      activeFilter === filter.key
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg'
                        : `${darkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-100 text-slate-600'} hover:bg-slate-200`
                    }`}
                  >
                    <filter.icon className="w-5 h-5 inline mr-2" />
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Top 3 Podium */}
          <div className="mb-8 grid grid-cols-3 gap-6 items-end">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6 text-center" glowColor="#C0C0C0">
                <motion.div
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                  className="relative inline-block mb-4"
                >
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${leaderboardData.national[1].avatar} border-4 border-slate-300 mx-auto`} />
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center border-2 border-white shadow-lg">
                    <span className="text-white font-black">2</span>
                  </div>
                </motion.div>
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black mb-1`}>
                  {leaderboardData.national[1].name}
                </h3>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-3`}>
                  {leaderboardData.national[1].college}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-300 to-slate-500 rounded-full">
                  <Flame className="w-5 h-5 text-white" />
                  <span className="text-white font-black">{leaderboardData.national[1].uScore.toLocaleString()}</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GlassCard className="p-8 text-center" glowColor="#FFD700">
                  <motion.div
                    animate={{ rotateZ: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2"
                  >
                    <Crown className="w-16 h-16 text-amber-500 drop-shadow-2xl" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotateZ: -5 }}
                    className="relative inline-block mb-4 mt-8"
                  >
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${leaderboardData.national[0].avatar} border-4 border-amber-500 mx-auto shadow-2xl`} />
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-white shadow-lg">
                      <span className="text-white font-black text-lg">1</span>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-amber-500 blur-xl"
                    />
                  </motion.div>
                  <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl mb-1`}>
                    {leaderboardData.national[0].name}
                  </h3>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                    {leaderboardData.national[0].college}
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full shadow-lg">
                    <Flame className="w-6 h-6 text-white" />
                    <span className="text-white font-black text-lg">{leaderboardData.national[0].uScore.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                    <p className="text-amber-600 dark:text-amber-400 font-black">👑 Mythic Tier</p>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6 text-center" glowColor="#CD7F32">
                <motion.div
                  whileHover={{ scale: 1.1, rotateZ: -5 }}
                  className="relative inline-block mb-4"
                >
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${leaderboardData.national[2].avatar} border-4 border-amber-700 mx-auto`} />
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center border-2 border-white shadow-lg">
                    <span className="text-white font-black">3</span>
                  </div>
                </motion.div>
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black mb-1`}>
                  {leaderboardData.national[2].name}
                </h3>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-3`}>
                  {leaderboardData.national[2].college}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-700 to-orange-800 rounded-full">
                  <Flame className="w-5 h-5 text-white" />
                  <span className="text-white font-black">{leaderboardData.national[2].uScore.toLocaleString()}</span>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Rest of Rankings */}
          <GlassCard className="p-6">
            <div className="space-y-3">
              {leaderboardData.national.slice(3).map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'
                  } transition-all cursor-pointer`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTierColor(user.tier)} flex items-center justify-center font-black text-white shadow-lg`}>
                    {user.rank}
                  </div>
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${user.avatar}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black`}>
                        {user.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getTierColor(user.tier)} text-white font-black`}>
                        {user.tier}
                      </span>
                    </div>
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      {user.college} • {user.branch} • {user.projects} projects
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-5 h-5 text-indigo-500" />
                      <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-lg`}>
                        {user.uScore.toLocaleString()}
                      </span>
                    </div>
                    {user.change !== 0 && (
                      <div className={`flex items-center gap-1 text-sm ${user.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {user.change > 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span className="font-black">{Math.abs(user.change)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}