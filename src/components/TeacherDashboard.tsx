import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, FolderOpen, CheckCircle, XCircle, Clock, MessageCircle, 
  Search, Filter, Eye, ThumbsUp, ThumbsDown, AlertCircle, Award,
  GraduationCap, TrendingUp, Calendar, FileText
} from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlassCard from './GlassCard';
import AnimatedBackground from './AnimatedBackground';

interface TeacherDashboardProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const pendingApprovals = [
  {
    id: 1,
    title: 'AI-Powered Waste Classification System',
    team: ['Rafid Ahmed', 'Nusrat Jahan', 'Tanvir Hossain'],
    submittedDate: '2 hours ago',
    category: 'Machine Learning',
    description: 'Using CNN to classify waste materials for recycling optimization',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Smart Campus Navigation App',
    team: ['Sadia Rahman', 'Fahim Khan'],
    submittedDate: '5 hours ago',
    category: 'Mobile Development',
    description: 'AR-based navigation system for university campus',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Peer Tutoring Platform',
    team: ['Anika Islam', 'Arnab Das', 'Tisha Chowdhury'],
    submittedDate: '1 day ago',
    category: 'Web Development',
    description: 'Connecting students for peer-to-peer learning sessions',
    status: 'pending',
    priority: 'low',
  },
];

const activeProjects = [
  {
    id: 1,
    title: 'E-commerce Recommendation Engine',
    team: ['Mehedi Hasan', 'Lamia Sultana'],
    progress: 75,
    status: 'on-track',
    lastUpdate: '2 hours ago',
    deadline: 'Dec 20, 2024',
  },
  {
    id: 2,
    title: 'Blockchain Voting System',
    team: ['Rafid Ahmed', 'Sadia Rahman', 'Tanvir Hossain'],
    progress: 45,
    status: 'at-risk',
    lastUpdate: '3 days ago',
    deadline: 'Dec 15, 2024',
  },
  {
    id: 3,
    title: 'Mental Health Chatbot',
    team: ['Nusrat Jahan', 'Anika Islam'],
    progress: 90,
    status: 'ahead',
    lastUpdate: '1 hour ago',
    deadline: 'Dec 25, 2024',
  },
];

const recentActivity = [
  { type: 'approval', text: 'Approved "IoT Weather Station" project', time: '1h ago', icon: CheckCircle, color: 'text-emerald-500' },
  { type: 'feedback', text: 'Sent feedback on "ML Image Classifier"', time: '3h ago', icon: MessageCircle, color: 'text-blue-500' },
  { type: 'rejection', text: 'Requested revisions for "Chat App"', time: '1d ago', icon: AlertCircle, color: 'text-amber-500' },
  { type: 'endorsement', text: 'Endorsed Rafid\'s Python skills', time: '2d ago', icon: Award, color: 'text-purple-500' },
];

const topStudents = [
  { name: 'Rafid Ahmed', projects: 8, uScore: 2847, avatar: 'from-amber-400 to-orange-500' },
  { name: 'Nusrat Jahan', projects: 6, uScore: 2791, avatar: 'from-pink-400 to-rose-500' },
  { name: 'Tanvir Hossain', projects: 7, uScore: 2675, avatar: 'from-blue-400 to-cyan-500' },
];

export default function TeacherDashboard({ onOpenAIMentor, darkMode, onToggleDarkMode }: TeacherDashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof pendingApprovals[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleApprove = (projectId: number) => {
    console.log('Approved project:', projectId);
    // In real app, call API
  };

  const handleReject = (projectId: number) => {
    console.log('Rejected project:', projectId);
    // In real app, call API
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
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <GraduationCap className="w-12 h-12 text-indigo-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <GraduationCap className="w-12 h-12 text-indigo-400 blur-md" />
                </motion.div>
              </div>
              <div>
                <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl`}>
                  Teacher Dashboard
                </h1>
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                  Supervise and guide student projects
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Pending</p>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>{pendingApprovals.length}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Active Projects</p>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>{activeProjects.length}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Students</p>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>156</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Approved (Month)</p>
                  <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>24</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Pending Approvals */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl`}>
                    Pending Approvals
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search projects..."
                        className={`pl-10 pr-4 py-2 rounded-xl border ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingApprovals.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-5 rounded-xl border ${
                        darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                      } hover:border-indigo-500 transition-colors`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold`}>
                              {project.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              project.priority === 'high' ? 'bg-red-100 text-red-700' :
                              project.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {project.priority}
                            </span>
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {project.description}
                          </p>
                        </div>
                        <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {project.submittedDate}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member, i) => (
                              <div
                                key={member}
                                className={`w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white flex items-center justify-center`}
                                title={member}
                              >
                                <span className="text-white text-xs font-medium">{member[0]}</span>
                              </div>
                            ))}
                          </div>
                          <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {project.team.length} members
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {project.category}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProject(project)}
                            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition-colors`}
                          >
                            <Eye className="w-5 h-5 text-slate-500" />
                          </button>
                          <button
                            onClick={() => handleApprove(project.id)}
                            className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                          >
                            <ThumbsUp className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(project.id)}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                          >
                            <ThumbsDown className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Active Projects */}
              <GlassCard className="p-6">
                <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl mb-6`}>
                  Active Projects Under Supervision
                </h2>
                <div className="space-y-4">
                  {activeProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>
                          {project.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'on-track' ? 'bg-emerald-100 text-emerald-700' :
                          project.status === 'at-risk' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Progress: {project.progress}%
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Due: {project.deadline}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            project.status === 'at-risk' ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <GlassCard className="p-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-lg mb-4`}>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} flex items-center justify-center`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {activity.text}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Top Students */}
              <GlassCard className="p-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-lg mb-4 flex items-center gap-2`}>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Top Students
                </h3>
                <div className="space-y-3">
                  {topStudents.map((student, i) => (
                    <div key={student.name} className={`p-3 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${student.avatar} flex items-center justify-center`}>
                          <span className="text-white font-bold">{student.name[0]}</span>
                        </div>
                        <div className="flex-1">
                          <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>{student.name}</p>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {student.projects} projects • U-Score: {student.uScore}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-amber-500">#{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Actions */}
              <GlassCard className="p-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-lg mb-4`}>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                    <FileText className="w-5 h-5" />
                    Create Assignment
                  </button>
                  <button className={`w-full px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                    darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  } transition-colors`}>
                    <Calendar className="w-5 h-5" />
                    Schedule Meeting
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
