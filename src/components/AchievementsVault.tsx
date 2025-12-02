import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Lock, Star, Flame, Trophy, Zap, Target, Crown, Shield, Sparkles } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlassCard from './GlassCard';
import AnimatedBackground from './AnimatedBackground';

interface AchievementsVaultProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const achievements = [
  {
    id: 1,
    name: 'First Blood',
    description: 'Complete your first project',
    icon: Trophy,
    unlocked: true,
    rarity: 'common',
    gradient: 'from-slate-400 to-slate-600',
    unlockedDate: 'Sep 15, 2024',
    progress: 100,
  },
  {
    id: 2,
    name: '100-Day Streak',
    description: 'Maintain a 100-day login streak',
    icon: Flame,
    unlocked: true,
    rarity: 'legendary',
    gradient: 'from-orange-400 via-red-500 to-pink-500',
    unlockedDate: 'Nov 20, 2024',
    progress: 100,
    glow: true,
  },
  {
    id: 3,
    name: 'Placed at FAANG',
    description: 'Get placed at a FAANG company',
    icon: Crown,
    unlocked: true,
    rarity: 'mythic',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    unlockedDate: 'Oct 5, 2024',
    progress: 100,
    glow: true,
  },
  {
    id: 4,
    name: 'Team Player',
    description: 'Complete 10 team projects',
    icon: Star,
    unlocked: true,
    rarity: 'rare',
    gradient: 'from-blue-400 to-indigo-500',
    unlockedDate: 'Oct 28, 2024',
    progress: 100,
  },
  {
    id: 5,
    name: 'Skill Master',
    description: 'Reach level 5 in 5 different skills',
    icon: Target,
    unlocked: true,
    rarity: 'epic',
    gradient: 'from-purple-400 via-pink-500 to-rose-500',
    unlockedDate: 'Nov 12, 2024',
    progress: 100,
  },
  {
    id: 6,
    name: 'Genesis \'25',
    description: 'Founding member of UConnect',
    icon: Shield,
    unlocked: true,
    rarity: 'mythic',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    unlockedDate: 'Sep 1, 2024',
    progress: 100,
    glow: true,
  },
  {
    id: 7,
    name: 'Mentor Supreme',
    description: 'Help 50 students with endorsements',
    icon: Sparkles,
    unlocked: false,
    rarity: 'legendary',
    gradient: 'from-emerald-400 to-teal-500',
    progress: 68,
  },
  {
    id: 8,
    name: 'Hackathon Champion',
    description: 'Win 3 hackathons',
    icon: Trophy,
    unlocked: false,
    rarity: 'epic',
    gradient: 'from-amber-400 to-yellow-500',
    progress: 33,
  },
  {
    id: 9,
    name: 'Open Source Hero',
    description: 'Contribute to 25 open source projects',
    icon: Zap,
    unlocked: false,
    rarity: 'rare',
    gradient: 'from-green-400 to-emerald-500',
    progress: 52,
  },
];

const rarityLabels = {
  common: { label: 'Common', color: 'text-slate-500' },
  rare: { label: 'Rare', color: 'text-blue-500' },
  epic: { label: 'Epic', color: 'text-purple-500' },
  legendary: { label: 'Legendary', color: 'text-orange-500' },
  mythic: { label: 'Mythic', color: 'text-red-500' },
};

export default function AchievementsVault({ onOpenAIMentor, darkMode, onToggleDarkMode }: AchievementsVaultProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<typeof achievements[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    completion: Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100),
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Award className="w-12 h-12 text-amber-500" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                  >
                    <Sparkles className="w-12 h-12 text-amber-400 blur-md" />
                  </motion.div>
                </div>
                <div>
                  <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl`} style={{ letterSpacing: '-0.02em' }}>
                    Achievements Vault
                  </h1>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Your legendary collection • {stats.unlocked}/{stats.total} unlocked
                  </p>
                </div>
              </div>

              {/* Stats */}
              <GlassCard className="p-6" glowColor="#F59E0B">
                <div className="text-center">
                  <div className="relative inline-block mb-2">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={darkMode ? '#1e293b' : '#e2e8f0'}
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '0 251.2' }}
                        animate={{ strokeDasharray: `${(stats.completion / 100) * 251.2} 251.2` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>
                        {stats.completion}%
                      </span>
                    </div>
                  </div>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} font-black`}>
                    Collection Complete
                  </p>
                </div>
              </GlassCard>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="mb-8">
            <GlassCard className="p-4">
              <div className="flex gap-3">
                {[
                  { key: 'all', label: 'All Achievements', count: stats.total },
                  { key: 'unlocked', label: 'Unlocked', count: stats.unlocked },
                  { key: 'locked', label: 'Locked', count: stats.total - stats.unlocked },
                ].map((f) => (
                  <motion.button
                    key={f.key}
                    onClick={() => setFilter(f.key as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 px-6 py-3 rounded-xl transition-all font-black ${
                      filter === f.key
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg'
                        : `${darkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-100 text-slate-600'} hover:bg-slate-200`
                    }`}
                  >
                    {f.label} ({f.count})
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedAchievement(achievement)}
              >
                <GlassCard
                  className={`p-6 cursor-pointer relative overflow-hidden ${
                    !achievement.unlocked ? 'opacity-60' : ''
                  }`}
                  glowColor={achievement.unlocked ? achievement.gradient.split(' ')[1] : '#94a3b8'}
                >
                  {/* Glow effect for mythic/legendary */}
                  {achievement.unlocked && achievement.glow && (
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} opacity-10`}
                    />
                  )}

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative inline-block"
                      >
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center shadow-2xl ${
                          !achievement.unlocked ? 'grayscale' : ''
                        }`}>
                          {achievement.unlocked ? (
                            <achievement.icon className="w-10 h-10 text-white" />
                          ) : (
                            <Lock className="w-10 h-10 text-white/50" />
                          )}
                        </div>
                        {achievement.unlocked && achievement.glow && (
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${achievement.gradient} blur-xl -z-10`}
                          />
                        )}
                      </motion.div>
                    </div>

                    {/* Name & Rarity */}
                    <div className="mb-2">
                      <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black mb-1`}>
                        {achievement.name}
                      </h3>
                      <p className={`${rarityLabels[achievement.rarity].color} text-xs font-black uppercase tracking-wide`}>
                        {rarityLabels[achievement.rarity].label}
                      </p>
                    </div>

                    {/* Description */}
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>
                      {achievement.description}
                    </p>

                    {/* Progress or Date */}
                    {achievement.unlocked ? (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        darkMode ? 'bg-slate-800/50' : 'bg-slate-100'
                      }`}>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'} text-sm font-black`}>
                          Unlocked {achievement.unlockedDate}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm font-black`}>
                            Progress
                          </span>
                          <span className="text-indigo-600 font-black text-sm">
                            {achievement.progress}%
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${
                          darkMode ? 'bg-slate-800' : 'bg-slate-200'
                        }`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${achievement.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                            className={`h-full bg-gradient-to-r ${achievement.gradient}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Achievement Detail Modal */}
          <AnimatePresence>
            {selectedAchievement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                onClick={() => setSelectedAchievement(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-lg w-full"
                >
                  <GlassCard className="p-8 text-center" glowColor={selectedAchievement.gradient.split(' ')[1]}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="relative inline-block mb-6"
                    >
                      <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${selectedAchievement.gradient} flex items-center justify-center shadow-2xl`}>
                        <selectedAchievement.icon className="w-16 h-16 text-white" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${selectedAchievement.gradient} blur-2xl`}
                      />
                    </motion.div>

                    <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-3xl mb-2`}>
                      {selectedAchievement.name}
                    </h2>
                    <p className={`${rarityLabels[selectedAchievement.rarity].color} text-sm font-black uppercase tracking-wide mb-4`}>
                      {rarityLabels[selectedAchievement.rarity].label} Achievement
                    </p>
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                      {selectedAchievement.description}
                    </p>

                    {selectedAchievement.unlocked ? (
                      <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${selectedAchievement.gradient} text-white font-black`}>
                        <Award className="w-5 h-5" />
                        Unlocked on {selectedAchievement.unlockedDate}
                      </div>
                    ) : (
                      <div>
                        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3 font-black`}>
                          {selectedAchievement.progress}% Complete
                        </p>
                        <div className={`w-full h-3 rounded-full overflow-hidden ${
                          darkMode ? 'bg-slate-800' : 'bg-slate-200'
                        }`}>
                          <div
                            className={`h-full bg-gradient-to-r ${selectedAchievement.gradient}`}
                            style={{ width: `${selectedAchievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}