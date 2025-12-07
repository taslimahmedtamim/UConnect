import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Brain, Target, TrendingUp, Zap, Award, ChevronRight, Plus, Star } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlassCard from './GlassCard';
import AnimatedBackground from './AnimatedBackground';

interface SkillGraphProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface SkillNode {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  category: string;
  connections: string[];
  x: number;
  y: number;
  color: string;
  endorsements: number;
  trending: boolean;
}

const skillNodes: SkillNode[] = [
  { id: 'python', name: 'Python', level: 5, maxLevel: 5, category: 'Programming', connections: ['ml', 'data', 'django'], x: 50, y: 30, color: 'from-blue-400 to-cyan-500', endorsements: 24, trending: true },
  { id: 'js', name: 'JavaScript', level: 4, maxLevel: 5, category: 'Programming', connections: ['react', 'node', 'ts'], x: 30, y: 50, color: 'from-yellow-400 to-amber-500', endorsements: 18, trending: false },
  { id: 'react', name: 'React', level: 4, maxLevel: 5, category: 'Frontend', connections: ['js', 'ts', 'ui'], x: 15, y: 35, color: 'from-cyan-400 to-blue-500', endorsements: 20, trending: true },
  { id: 'node', name: 'Node.js', level: 3, maxLevel: 5, category: 'Backend', connections: ['js', 'mongo', 'express'], x: 25, y: 70, color: 'from-green-400 to-emerald-500', endorsements: 12, trending: false },
  { id: 'ml', name: 'Machine Learning', level: 4, maxLevel: 5, category: 'AI/ML', connections: ['python', 'tf', 'data'], x: 70, y: 25, color: 'from-purple-400 to-indigo-500', endorsements: 15, trending: true },
  { id: 'tf', name: 'TensorFlow', level: 3, maxLevel: 5, category: 'AI/ML', connections: ['ml', 'python', 'cv'], x: 85, y: 40, color: 'from-orange-400 to-red-500', endorsements: 10, trending: false },
  { id: 'data', name: 'Data Science', level: 3, maxLevel: 5, category: 'AI/ML', connections: ['python', 'ml', 'sql'], x: 65, y: 50, color: 'from-teal-400 to-cyan-500', endorsements: 14, trending: true },
  { id: 'sql', name: 'SQL', level: 4, maxLevel: 5, category: 'Database', connections: ['data', 'mongo', 'node'], x: 55, y: 70, color: 'from-blue-500 to-indigo-600', endorsements: 16, trending: false },
  { id: 'mongo', name: 'MongoDB', level: 3, maxLevel: 5, category: 'Database', connections: ['node', 'sql'], x: 40, y: 85, color: 'from-green-500 to-teal-600', endorsements: 8, trending: false },
  { id: 'ui', name: 'UI/UX Design', level: 2, maxLevel: 5, category: 'Design', connections: ['react', 'figma'], x: 10, y: 55, color: 'from-pink-400 to-rose-500', endorsements: 6, trending: false },
  { id: 'ts', name: 'TypeScript', level: 3, maxLevel: 5, category: 'Programming', connections: ['js', 'react'], x: 20, y: 20, color: 'from-blue-500 to-blue-700', endorsements: 11, trending: true },
  { id: 'cv', name: 'Computer Vision', level: 2, maxLevel: 5, category: 'AI/ML', connections: ['tf', 'python'], x: 90, y: 60, color: 'from-violet-400 to-purple-600', endorsements: 5, trending: false },
  { id: 'django', name: 'Django', level: 2, maxLevel: 5, category: 'Backend', connections: ['python'], x: 75, y: 70, color: 'from-green-600 to-emerald-700', endorsements: 4, trending: false },
  { id: 'figma', name: 'Figma', level: 2, maxLevel: 5, category: 'Design', connections: ['ui'], x: 5, y: 75, color: 'from-purple-500 to-pink-500', endorsements: 7, trending: false },
  { id: 'express', name: 'Express.js', level: 3, maxLevel: 5, category: 'Backend', connections: ['node'], x: 35, y: 90, color: 'from-slate-500 to-slate-700', endorsements: 9, trending: false },
];

const categories = ['All', 'Programming', 'Frontend', 'Backend', 'AI/ML', 'Database', 'Design'];

const suggestedSkills = [
  { name: 'Docker', reason: 'Complements your Node.js skills', match: 92 },
  { name: 'Kubernetes', reason: 'High demand in job market', match: 88 },
  { name: 'GraphQL', reason: 'Works great with React', match: 85 },
  { name: 'PyTorch', reason: 'Trending in ML community', match: 90 },
];

export default function SkillGraph({ onOpenAIMentor, darkMode, onToggleDarkMode }: SkillGraphProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredNodes = useMemo(() => {
    if (selectedCategory === 'All') return skillNodes;
    return skillNodes.filter(node => node.category === selectedCategory);
  }, [selectedCategory]);

  const totalSkillPoints = skillNodes.reduce((sum, s) => sum + s.level, 0);
  const averageLevel = (totalSkillPoints / skillNodes.length).toFixed(1);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} flex relative`}>
      <AnimatedBackground darkMode={darkMode} />
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} relative z-10`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
        
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Brain className="w-12 h-12 text-indigo-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <Brain className="w-12 h-12 text-indigo-400 blur-md" />
                </motion.div>
              </div>
              <div>
                <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl`}>
                  Skill Graph
                </h1>
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                  Your evolving skill network • AI-powered insights
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Total Skills</p>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>{skillNodes.length}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Avg Level</p>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>{averageLevel}/5</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Endorsements</p>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>{skillNodes.reduce((s, n) => s + n.endorsements, 0)}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Trending</p>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>{skillNodes.filter(s => s.trending).length}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Skill Graph Visualization */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                {/* Category Filter */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Graph Container */}
                <div className="relative h-[500px] rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 overflow-hidden">
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    {filteredNodes.map(node => 
                      node.connections.map(connId => {
                        const connNode = skillNodes.find(n => n.id === connId);
                        if (!connNode || !filteredNodes.includes(connNode)) return null;
                        const isHighlighted = hoveredSkill === node.id || hoveredSkill === connId;
                        return (
                          <motion.line
                            key={`${node.id}-${connId}`}
                            x1={`${node.x}%`}
                            y1={`${node.y}%`}
                            x2={`${connNode.x}%`}
                            y2={`${connNode.y}%`}
                            stroke={isHighlighted ? '#6366F1' : '#475569'}
                            strokeWidth={isHighlighted ? 3 : 1}
                            strokeOpacity={isHighlighted ? 1 : 0.3}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        );
                      })
                    )}
                  </svg>

                  {/* Skill Nodes */}
                  {filteredNodes.map((node, index) => (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      onMouseEnter={() => setHoveredSkill(node.id)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onClick={() => setSelectedSkill(node)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg border-2 ${
                          hoveredSkill === node.id ? 'border-white' : 'border-transparent'
                        }`}
                      >
                        <span className="text-white font-black text-xs text-center px-1">{node.name}</span>
                        {/* Level indicator */}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-slate-900 rounded-full text-xs text-white font-medium">
                          Lv.{node.level}
                        </div>
                        {/* Trending badge */}
                        {node.trending && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"
                          >
                            <Zap className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Selected Skill Details */}
              {selectedSkill ? (
                <GlassCard className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedSkill.color} flex items-center justify-center`}>
                      <span className="text-white font-black">{selectedSkill.name.slice(0, 2)}</span>
                    </div>
                    <div>
                      <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl`}>{selectedSkill.name}</h3>
                      <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{selectedSkill.category}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Proficiency</span>
                        <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>Level {selectedSkill.level}/{selectedSkill.maxLevel}</span>
                      </div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(selectedSkill.level / selectedSkill.maxLevel) * 100}%` }}
                          className={`h-full bg-gradient-to-r ${selectedSkill.color} rounded-full`}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Endorsements</span>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>{selectedSkill.endorsements}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Connected Skills</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSkill.connections.map(conn => {
                          const connSkill = skillNodes.find(s => s.id === conn);
                          return connSkill ? (
                            <span key={conn} className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                              {connSkill.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard className="p-6">
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-center`}>
                    Click on a skill node to see details
                  </p>
                </GlassCard>
              )}

              {/* AI Suggested Skills */}
              <GlassCard className="p-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-lg mb-4 flex items-center gap-2`}>
                  <Zap className="w-5 h-5 text-amber-500" />
                  AI Suggested Skills
                </h3>
                <div className="space-y-3">
                  {suggestedSkills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'} hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>{skill.name}</span>
                        <span className="text-indigo-500 font-medium">{skill.match}% match</span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{skill.reason}</p>
                    </motion.div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                  <Plus className="w-5 h-5" />
                  Add New Skill
                </button>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
