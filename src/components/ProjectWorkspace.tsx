import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, MoreVertical, MessageCircle, Paperclip, Send, 
  Calendar, CheckCircle, Circle, AlertCircle, Users, Github
} from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface ProjectWorkspaceProps {
  onOpenAIMentor: () => void;
}

const tasks = {
  todo: [
    { id: 1, title: 'Setup project repository', assignee: 'Priya', priority: 'high' },
    { id: 2, title: 'Design database schema', assignee: 'Rahul', priority: 'medium' },
  ],
  inProgress: [
    { id: 3, title: 'Implement data preprocessing', assignee: 'You', priority: 'high' },
    { id: 4, title: 'Create UI mockups', assignee: 'Ananya', priority: 'low' },
  ],
  done: [
    { id: 5, title: 'Project kickoff meeting', assignee: 'Team', priority: 'medium' },
    { id: 6, title: 'Research existing solutions', assignee: 'Priya', priority: 'low' },
  ]
};

const chatMessages = [
  { id: 1, sender: 'Priya Sharma', message: 'Hey team! I\'ve pushed the initial setup to GitHub', time: '10:30 AM', avatar: 'from-pink-400 to-rose-400' },
  { id: 2, sender: 'You', message: 'Great! I\'ll start working on the data preprocessing module', time: '10:35 AM', avatar: 'from-indigo-400 to-purple-400' },
  { id: 3, sender: 'Rahul Verma', message: 'Database schema is almost ready. Will share the ERD soon', time: '11:15 AM', avatar: 'from-blue-400 to-cyan-400' },
];

export default function ProjectWorkspace({ onOpenAIMentor }: ProjectWorkspaceProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<'kanban' | 'timeline'>('kanban');
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} />
        
        <div className="p-8">
          {/* Project Header */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-slate-900 mb-2">AI-Powered Image Classifier</h1>
                <p className="text-slate-600">Deep learning model for multi-class image classification</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="#" className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Link>
                <button className="w-10 h-10 hover:bg-slate-100 rounded-xl flex items-center justify-center">
                  <MoreVertical className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[
                  { name: 'Priya', color: 'from-pink-400 to-rose-400' },
                  { name: 'Rahul', color: 'from-blue-400 to-cyan-400' },
                  { name: 'Ananya', color: 'from-purple-400 to-pink-400' },
                  { name: 'You', color: 'from-indigo-400 to-purple-400' },
                ].map((member) => (
                  <div
                    key={member.name}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.color} border-2 border-white`}
                    title={member.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Due: Dec 15, 2024</span>
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                On Track
              </div>
              <div className="ml-auto">
                <div className="text-slate-600">Progress: 45%</div>
                <div className="w-32 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Workspace */}
            <div className="lg:col-span-2">
              {/* View Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('kanban')}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      view === 'kanban'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Kanban Board
                  </button>
                  <button
                    onClick={() => setView('timeline')}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      view === 'timeline'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Timeline
                  </button>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>

              {view === 'kanban' && (
                <div className="grid md:grid-cols-3 gap-4">
                  {/* To Do */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-slate-900 flex items-center gap-2">
                        <Circle className="w-4 h-4 text-slate-400" />
                        To Do
                      </h3>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {tasks.todo.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {tasks.todo.map((task) => (
                        <div key={task.id} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                          <p className="text-slate-900 mb-2">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">{task.assignee}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* In Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-slate-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        In Progress
                      </h3>
                      <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-full">
                        {tasks.inProgress.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {tasks.inProgress.map((task) => (
                        <div key={task.id} className="bg-white rounded-xl p-4 border-2 border-amber-200 hover:shadow-md transition-all cursor-pointer">
                          <p className="text-slate-900 mb-2">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">{task.assignee}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Done */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-slate-900 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Done
                      </h3>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full">
                        {tasks.done.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {tasks.done.map((task) => (
                        <div key={task.id} className="bg-white rounded-xl p-4 border-2 border-emerald-200 hover:shadow-md transition-all cursor-pointer opacity-75">
                          <p className="text-slate-900 mb-2 line-through">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">{task.assignee}</span>
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {view === 'timeline' && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200">
                  <div className="h-96 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                      <p className="text-slate-600">Timeline view showing project milestones</p>
                      <p className="text-slate-500 mt-2">Gantt chart visualization would appear here</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Sidebar */}
            <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[calc(100vh-16rem)]">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-slate-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Team Chat
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${msg.avatar} flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-900">{msg.sender}</span>
                        <span className="text-slate-400">{msg.time}</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl rounded-tl-none p-3">
                        <p className="text-slate-700">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <button className="w-10 h-10 hover:bg-slate-100 rounded-xl flex items-center justify-center">
                    <Paperclip className="w-5 h-5 text-slate-600" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
