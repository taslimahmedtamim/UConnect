import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, Target, CheckCircle, Circle, Lock, Play, Clock, 
  Zap, Award, TrendingUp, BookOpen, Code, Brain, Briefcase,
  ChevronRight, Star, Sparkles
} from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlassCard from './GlassCard';
import AnimatedBackground from './AnimatedBackground';

interface CareerRoadmapProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'current' | 'locked';
  skills: string[];
  resources: { type: string; title: string; link: string }[];
  milestone?: string;
}

const careerPaths = [
  { id: 'ml-engineer', name: 'ML Engineer', icon: Brain, color: 'from-purple-500 to-indigo-500', match: 94 },
  { id: 'fullstack', name: 'Full Stack Dev', icon: Code, color: 'from-blue-500 to-cyan-500', match: 89 },
  { id: 'data-scientist', name: 'Data Scientist', icon: TrendingUp, color: 'from-emerald-500 to-teal-500', match: 86 },
  { id: 'product-manager', name: 'Product Manager', icon: Briefcase, color: 'from-amber-500 to-orange-500', match: 72 },
];

const roadmapNodes: Record<string, RoadmapNode[]> = {
  'ml-engineer': [
    {
      id: '1',
      title: 'Python Fundamentals',
      description: 'Master Python programming basics and data structures',
      duration: '4 weeks',
      status: 'completed',
      skills: ['Python', 'Data Structures', 'OOP'],
      resources: [
        { type: 'course', title: 'Python for ML', link: '#' },
        { type: 'project', title: 'Build a Calculator', link: '#' },
      ],
    },
    {
      id: '2',
      title: 'Mathematics for ML',
      description: 'Linear algebra, calculus, and statistics essentials',
      duration: '6 weeks',
      status: 'completed',
      skills: ['Linear Algebra', 'Calculus', 'Statistics'],
      resources: [
        { type: 'course', title: 'Math for ML Specialization', link: '#' },
        { type: 'book', title: 'Mathematics for Machine Learning', link: '#' },
      ],
      milestone: 'Foundation Complete',
    },
    {
      id: '3',
      title: 'Machine Learning Basics',
      description: 'Supervised & unsupervised learning algorithms',
      duration: '8 weeks',
      status: 'current',
      skills: ['Scikit-learn', 'Regression', 'Classification'],
      resources: [
        { type: 'course', title: 'ML by Andrew Ng', link: '#' },
        { type: 'project', title: 'Predict House Prices', link: '#' },
      ],
    },
    {
      id: '4',
      title: 'Deep Learning',
      description: 'Neural networks, CNNs, RNNs, and transformers',
      duration: '10 weeks',
      status: 'locked',
      skills: ['TensorFlow', 'PyTorch', 'CNNs', 'Transformers'],
      resources: [
        { type: 'course', title: 'Deep Learning Specialization', link: '#' },
        { type: 'project', title: 'Image Classification Model', link: '#' },
      ],
      milestone: 'ML Practitioner',
    },
    {
      id: '5',
      title: 'MLOps & Deployment',
      description: 'Model deployment, monitoring, and scaling',
      duration: '6 weeks',
      status: 'locked',
      skills: ['Docker', 'Kubernetes', 'MLflow', 'AWS'],
      resources: [
        { type: 'course', title: 'MLOps Fundamentals', link: '#' },
        { type: 'project', title: 'Deploy ML API', link: '#' },
      ],
    },
    {
      id: '6',
      title: 'Specialization',
      description: 'Choose: NLP, Computer Vision, or Reinforcement Learning',
      duration: '12 weeks',
      status: 'locked',
      skills: ['NLP', 'Computer Vision', 'RL'],
      resources: [
        { type: 'course', title: 'Advanced Specialization', link: '#' },
        { type: 'project', title: 'Capstone Project', link: '#' },
      ],
      milestone: 'ML Engineer Ready',
    },
  ],
};

const skillGaps = [
  { skill: 'PyTorch', current: 2, required: 4, priority: 'high' },
  { skill: 'Deep Learning', current: 1, required: 4, priority: 'high' },
  { skill: 'MLOps', current: 0, required: 3, priority: 'medium' },
  { skill: 'Computer Vision', current: 2, required: 4, priority: 'medium' },
];

export default function CareerRoadmap({ onOpenAIMentor, darkMode, onToggleDarkMode }: CareerRoadmapProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPath, setSelectedPath] = useState('ml-engineer');
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const currentRoadmap = roadmapNodes[selectedPath] || [];
  const completedCount = currentRoadmap.filter(n => n.status === 'completed').length;
  const progress = Math.round((completedCount / currentRoadmap.length) * 100);

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
                <Map className="w-12 h-12 text-indigo-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <Map className="w-12 h-12 text-indigo-400 blur-md" />
                </motion.div>
              </div>
              <div>
                <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl`}>
                  Career Roadmap
                </h1>
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                  AI-personalized learning paths to your dream career
                </p>
              </div>
            </div>
          </motion.div>

          {/* Career Path Selection */}
          <div className="mb-8">
            <GlassCard className="p-6">
              <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl mb-4 flex items-center gap-2`}>
                <Sparkles className="w-5 h-5 text-amber-500" />
                AI-Recommended Career Paths
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                {careerPaths.map((path) => (
                  <motion.button
                    key={path.id}
                    onClick={() => setSelectedPath(path.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedPath === path.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : darkMode ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-3`}>
                      <path.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold mb-1`}>{path.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-500 font-bold">{path.match}%</span>
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>match</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Roadmap Timeline */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl`}>
                    Your Learning Path
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {completedCount}/{currentRoadmap.length} completed
                    </div>
                    <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  {/* Timeline Line */}
                  <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />

                  {/* Nodes */}
                  <div className="space-y-6">
                    {currentRoadmap.map((node, index) => (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Milestone Badge */}
                        {node.milestone && (
                          <div className="ml-14 mb-2">
                            <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                              <Award className="w-3 h-3" />
                              {node.milestone}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-4">
                          {/* Status Icon */}
                          <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                            node.status === 'completed' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                            node.status === 'current' ? 'bg-gradient-to-br from-indigo-500 to-purple-500' :
                            darkMode ? 'bg-slate-700' : 'bg-slate-200'
                          }`}>
                            {node.status === 'completed' ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : node.status === 'current' ? (
                              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                <Play className="w-6 h-6 text-white" />
                              </motion.div>
                            ) : (
                              <Lock className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            )}
                          </div>

                          {/* Content */}
                          <div className={`flex-1 p-4 rounded-xl ${
                            darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                          } ${node.status === 'current' ? 'ring-2 ring-indigo-500' : ''}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold`}>
                                  {node.title}
                                </h3>
                                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  {node.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  {node.duration}
                                </span>
                              </div>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {node.skills.map(skill => (
                                <span key={skill} className={`px-2 py-1 rounded-lg text-xs ${
                                  darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {skill}
                                </span>
                              ))}
                            </div>

                            {/* Expand/Collapse */}
                            <button
                              onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                              className={`text-sm text-indigo-500 flex items-center gap-1 hover:underline`}
                            >
                              {expandedNode === node.id ? 'Hide Resources' : 'Show Resources'}
                              <ChevronRight className={`w-4 h-4 transition-transform ${expandedNode === node.id ? 'rotate-90' : ''}`} />
                            </button>

                            {/* Resources */}
                            <AnimatePresence>
                              {expandedNode === node.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-3 space-y-2 overflow-hidden"
                                >
                                  {node.resources.map((resource, i) => (
                                    <a
                                      key={i}
                                      href={resource.link}
                                      className={`flex items-center gap-3 p-2 rounded-lg ${
                                        darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white hover:bg-slate-100'
                                      } transition-colors`}
                                    >
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        resource.type === 'course' ? 'bg-blue-100 text-blue-600' :
                                        resource.type === 'project' ? 'bg-emerald-100 text-emerald-600' :
                                        'bg-amber-100 text-amber-600'
                                      }`}>
                                        <BookOpen className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{resource.title}</p>
                                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{resource.type}</p>
                                      </div>
                                    </a>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Current Node Action */}
                            {node.status === 'current' && (
                              <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                                Continue Learning
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Summary */}
              <GlassCard className="p-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-lg mb-4`}>
                  Your Progress
                </h3>
                <div className="text-center mb-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        className={darkMode ? 'stroke-slate-700' : 'stroke-slate-200'}
                        strokeWidth="12"
                        fill="none"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#progressGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '0 352' }}
                        animate={{ strokeDasharray: `${progress * 3.52} 352` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366F1" />
                          <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-3xl`}>{progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'} text-center`}>
                    <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold text-xl`}>{completedCount}</p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Completed</p>
                  </div>
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'} text-center`}>
                    <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold text-xl`}>{currentRoadmap.length - completedCount}</p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Remaining</p>
                  </div>
                </div>
              </GlassCard>

              {/* Skill Gaps */}
              <GlassCard className="p-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-lg mb-4 flex items-center gap-2`}>
                  <Target className="w-5 h-5 text-red-500" />
                  Skill Gaps
                </h3>
                <div className="space-y-4">
                  {skillGaps.map((gap) => (
                    <div key={gap.skill}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{gap.skill}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          gap.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {gap.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                            style={{ width: `${(gap.current / gap.required) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {gap.current}/{gap.required}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Estimated Completion */}
              <GlassCard className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6" />
                  <h3 className="font-black text-lg">Career Ready In</h3>
                </div>
                <p className="text-4xl font-black mb-2">6 months</p>
                <p className="text-indigo-200">Based on your current pace</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
