import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, ThumbsUp, MessageSquare, Search, Filter, Plus,
  Tag, Clock, CheckCircle, Eye, Award, TrendingUp, Flame, ArrowUp,
  ChevronRight, User, BookOpen, Code, AlertCircle, Lightbulb
} from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlassCard from './GlassCard';
import AnimatedBackground from './AnimatedBackground';

interface HelpBoardProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type PostCategory = 'all' | 'question' | 'discussion' | 'project-help' | 'bug' | 'idea';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: PostCategory;
  tags: string[];
  upvotes: number;
  answers: number;
  views: number;
  createdAt: string;
  solved: boolean;
  convertedToProject?: boolean;
}

const posts: Post[] = [
  {
    id: 1,
    title: 'How to implement efficient caching in Node.js?',
    content: 'I\'m building a REST API and want to implement Redis caching. What\'s the best approach for cache invalidation?',
    author: 'Rafid Ahmed',
    authorAvatar: 'from-blue-400 to-cyan-500',
    category: 'question',
    tags: ['Node.js', 'Redis', 'Caching'],
    upvotes: 45,
    answers: 12,
    views: 234,
    createdAt: '2 hours ago',
    solved: true,
  },
  {
    id: 2,
    title: 'Looking for teammates for ML-based Crop Disease Detection project',
    content: 'Building an AI system to detect crop diseases using image classification. Need 2 more team members with ML/Python experience.',
    author: 'Nusrat Jahan',
    authorAvatar: 'from-pink-400 to-rose-500',
    category: 'project-help',
    tags: ['Machine Learning', 'Python', 'Agriculture'],
    upvotes: 78,
    answers: 8,
    views: 456,
    createdAt: '5 hours ago',
    solved: false,
    convertedToProject: true,
  },
  {
    id: 3,
    title: 'Best practices for React state management in 2024?',
    content: 'Redux vs Zustand vs Jotai - which one should I use for a medium-sized project? Looking for pros and cons.',
    author: 'Tanvir Hossain',
    authorAvatar: 'from-purple-400 to-indigo-500',
    category: 'discussion',
    tags: ['React', 'State Management', 'Frontend'],
    upvotes: 92,
    answers: 23,
    views: 567,
    createdAt: '1 day ago',
    solved: false,
  },
  {
    id: 4,
    title: 'Bug: TensorFlow model not loading in production',
    content: 'My trained model works locally but throws "Failed to load model" error when deployed to AWS Lambda. Help!',
    author: 'Sadia Rahman',
    authorAvatar: 'from-emerald-400 to-teal-500',
    category: 'bug',
    tags: ['TensorFlow', 'AWS', 'Deployment'],
    upvotes: 34,
    answers: 5,
    views: 189,
    createdAt: '3 hours ago',
    solved: false,
  },
  {
    id: 5,
    title: 'Idea: Cross-university hackathon platform',
    content: 'What if we had a platform specifically for organizing and participating in inter-university hackathons?',
    author: 'Fahim Khan',
    authorAvatar: 'from-amber-400 to-orange-500',
    category: 'idea',
    tags: ['Idea', 'Platform', 'Hackathon'],
    upvotes: 156,
    answers: 34,
    views: 892,
    createdAt: '2 days ago',
    solved: false,
    convertedToProject: true,
  },
];

const categories = [
  { id: 'all', name: 'All Posts', icon: MessageCircle, color: 'from-slate-500 to-slate-600' },
  { id: 'question', name: 'Questions', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
  { id: 'discussion', name: 'Discussions', icon: MessageCircle, color: 'from-purple-500 to-indigo-500' },
  { id: 'project-help', name: 'Project Help', icon: User, color: 'from-emerald-500 to-teal-500' },
  { id: 'bug', name: 'Bug Help', icon: AlertCircle, color: 'from-red-500 to-rose-500' },
  { id: 'idea', name: 'Ideas', icon: Lightbulb, color: 'from-amber-500 to-orange-500' },
];

const topContributors = [
  { name: 'Rafid Ahmed', answers: 156, reputation: 2847, avatar: 'from-blue-400 to-cyan-500' },
  { name: 'Nusrat Jahan', answers: 134, reputation: 2456, avatar: 'from-pink-400 to-rose-500' },
  { name: 'Tanvir Hossain', answers: 98, reputation: 1987, avatar: 'from-purple-400 to-indigo-500' },
];

const trendingTags = ['React', 'Python', 'Machine Learning', 'Node.js', 'AWS', 'TensorFlow'];

export default function HelpBoard({ onOpenAIMentor, darkMode, onToggleDarkMode }: HelpBoardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const filteredPosts = posts
    .filter(post => selectedCategory === 'all' || post.category === selectedCategory)
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'popular') return b.upvotes - a.upvotes;
      if (sortBy === 'unanswered') return a.answers - b.answers;
      return 0;
    });

  const getCategoryIcon = (category: PostCategory) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || MessageCircle;
  };

  const getCategoryColor = (category: PostCategory) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'from-slate-500 to-slate-600';
  };

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MessageCircle className="w-12 h-12 text-indigo-500" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0"
                  >
                    <MessageCircle className="w-12 h-12 text-indigo-400 blur-md" />
                  </motion.div>
                </div>
                <div>
                  <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl`}>
                    Help Board
                  </h1>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Ask questions, share ideas, get help from the community
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                New Post
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl`}>1,234</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Questions</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl`}>89%</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Solved</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl`}>47</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>→ Projects</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl`}>5,678</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Contributors</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="space-y-6">
              <GlassCard className="p-4">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold mb-4`}>Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as PostCategory)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                          : darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                        <cat.icon className="w-4 h-4 text-white" />
                      </div>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Trending Tags */}
              <GlassCard className="p-4">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold mb-4 flex items-center gap-2`}>
                  <Flame className="w-5 h-5 text-orange-500" />
                  Trending Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      } transition-colors`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Top Contributors */}
              <GlassCard className="p-4">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold mb-4 flex items-center gap-2`}>
                  <Award className="w-5 h-5 text-amber-500" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {topContributors.map((user, i) => (
                    <div key={user.name} className="flex items-center gap-3">
                      <span className={`font-bold ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : 'text-amber-700'}`}>
                        #{i + 1}
                      </span>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.avatar}`} />
                      <div className="flex-1">
                        <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-medium text-sm`}>{user.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{user.answers} answers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search & Sort */}
              <GlassCard className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search questions, tags..."
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`px-4 py-2 rounded-xl border ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="unanswered">Unanswered</option>
                  </select>
                </div>
              </GlassCard>

              {/* Posts List */}
              <div className="space-y-4">
                {filteredPosts.map((post, index) => {
                  const CategoryIcon = getCategoryIcon(post.category);
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlassCard className="p-5 hover:border-indigo-500 transition-colors cursor-pointer">
                        <div className="flex gap-4">
                          {/* Upvote Section */}
                          <div className="flex flex-col items-center gap-1">
                            <button className={`p-1 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                              <ArrowUp className="w-5 h-5 text-slate-400" />
                            </button>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{post.upvotes}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getCategoryColor(post.category)} flex items-center justify-center`}>
                                <CategoryIcon className="w-3 h-3 text-white" />
                              </div>
                              {post.solved && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Solved
                                </span>
                              )}
                              {post.convertedToProject && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  → Project
                                </span>
                              )}
                            </div>

                            <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold mb-2 hover:text-indigo-500 transition-colors`}>
                              {post.title}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3 line-clamp-2`}>
                              {post.content}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${post.authorAvatar}`} />
                                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{post.author}</span>
                                </div>
                                <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{post.createdAt}</span>
                              </div>

                              <div className="flex items-center gap-4 text-sm">
                                <span className={`flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  <MessageSquare className="w-4 h-4" />
                                  {post.answers}
                                </span>
                                <span className={`flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  <Eye className="w-4 h-4" />
                                  {post.views}
                                </span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.tags.map(tag => (
                                <span key={tag} className={`px-2 py-0.5 rounded text-xs ${
                                  darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-2xl ${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl p-6`}
              onClick={e => e.stopPropagation()}
            >
              <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl mb-6`}>Create New Post</h2>
              <div className="space-y-4">
                <div>
                  <label className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Title</label>
                  <input
                    type="text"
                    placeholder="What's your question or idea?"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div>
                  <label className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Category</label>
                  <select className={`w-full px-4 py-3 rounded-xl border ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}>
                    {categories.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Description</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your question or idea in detail..."
                    className={`w-full px-4 py-3 rounded-xl border ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                  />
                </div>
                <div>
                  <label className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Machine Learning"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className={`px-6 py-3 rounded-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  Cancel
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold">
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
