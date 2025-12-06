import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, User, Briefcase, FolderOpen, MessageCircle, Bell, 
  ChevronRight, TrendingUp, Clock, CheckCircle, Award, Users, 
  Target, Calendar, Zap, Sparkles, Hand
} from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface StudentDashboardProps {
  onOpenAIMentor: () => void;
}

const suggestedTeams = [
  {
    id: 1,
    project: 'AI-Powered Waste Classification',
    skills: ['Python', 'TensorFlow', 'Computer Vision'],
    members: 3,
    matchScore: 94,
    deadline: '2 weeks',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 2,
    project: 'Campus Event Management System',
    skills: ['React', 'Node.js', 'MongoDB'],
    members: 4,
    matchScore: 89,
    deadline: '3 weeks',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 3,
    project: 'Smart Energy Monitoring IoT',
    skills: ['Arduino', 'Python', 'Data Analytics'],
    members: 2,
    matchScore: 87,
    deadline: '1 month',
    color: 'from-purple-400 to-pink-500'
  }
];

const recentActivity = [
  { type: 'project', text: 'Task completed in "ML Image Classifier"', time: '2h ago', icon: CheckCircle, color: 'text-emerald-600' },
  { type: 'team', text: 'Rahul endorsed you for Python', time: '5h ago', icon: Award, color: 'text-amber-600' },
  { type: 'opportunity', text: 'New match: Frontend Intern at Flipkart', time: '1d ago', icon: Briefcase, color: 'text-indigo-600' },
  { type: 'project', text: 'New comment on your project', time: '2d ago', icon: MessageCircle, color: 'text-purple-600' }
];

const upcomingDeadlines = [
  { project: 'ML Image Classifier', task: 'Model training completion', date: 'Tomorrow', urgent: true },
  { project: 'Web Dev Project', task: 'Frontend deployment', date: 'Nov 30', urgent: false },
  { project: 'Database Assignment', task: 'Final submission', date: 'Dec 2', urgent: false }
];

export default function StudentDashboard({ onOpenAIMentor }: StudentDashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} />
        
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-slate-900 mb-2 flex items-center gap-2">Welcome back, Aarav! <Hand className="w-6 h-6 text-amber-500" /></h1>
            <p className="text-slate-600">Here's what's happening with your projects today</p>
          </div>

          {/* U-Score & Streak */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <Sparkles className="w-5 h-5 text-indigo-200" />
              </div>
              <p className="text-indigo-100 mb-1">U-Score</p>
              <p className="mb-1">847</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300">+23 this week</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-slate-600 mb-1">Active Projects</p>
              <p className="text-slate-900 mb-1">5</p>
              <p className="text-emerald-600">2 near completion</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-slate-600 mb-1">Pending Tasks</p>
              <p className="text-slate-900 mb-1">12</p>
              <p className="text-amber-600">3 due today</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-slate-600 mb-1">New Opportunities</p>
              <p className="text-slate-900 mb-1">8</p>
              <p className="text-purple-600">5 high match</p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Suggested Teams */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-slate-900">Suggested Teams for You</h2>
                  <Link to="/projects/new" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid gap-4">
                  {suggestedTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-slate-900 mb-2">{team.project}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {team.skills.map((skill) => (
                              <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${team.color}`}>
                            <Zap className="w-4 h-4 text-white" />
                            <span className="text-white">{team.matchScore}% match</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-slate-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{team.members} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{team.deadline}</span>
                          </div>
                        </div>
                        <Link 
                          to={`/projects/${team.id}`}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Skill Growth Chart Placeholder */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-slate-900 mb-4">Your Skill Growth</h3>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                    <p className="text-slate-600">Your skills are growing! 📈</p>
                    <Link to="/profile" className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 mt-2">
                      View detailed skill graph
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <h3 className="text-slate-900">Upcoming Deadlines</h3>
                </div>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className={`p-3 rounded-xl ${deadline.urgent ? 'bg-red-50 border border-red-200' : 'bg-slate-50'}`}>
                      <p className="text-slate-900 mb-1">{deadline.task}</p>
                      <p className="text-slate-500 mb-2">{deadline.project}</p>
                      <div className="flex items-center gap-1">
                        <Clock className={`w-4 h-4 ${deadline.urgent ? 'text-red-600' : 'text-slate-400'}`} />
                        <span className={deadline.urgent ? 'text-red-600' : 'text-slate-600'}>{deadline.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-slate-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700">{activity.text}</p>
                        <p className="text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link 
                    to="/projects/new"
                    className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-center"
                  >
                    Create New Project
                  </Link>
                  <Link 
                    to="/resume"
                    className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-center"
                  >
                    Generate Resume
                  </Link>
                  <Link 
                    to="/opportunities"
                    className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-center"
                  >
                    Find Opportunities
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
