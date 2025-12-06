import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, Calendar, Award, TrendingUp, ExternalLink, 
  Github, Linkedin, Mail, Edit, CheckCircle, Star, Users, Code, Save,
  Trophy, Target, Rocket
} from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toast from './Toast';

interface ProfilePageProps {
  onOpenAIMentor: () => void;
}

const skillsData = [
  { name: 'Python', level: 5, endorsements: 12, color: 'from-blue-400 to-cyan-500' },
  { name: 'JavaScript', level: 4, endorsements: 8, color: 'from-yellow-400 to-amber-500' },
  { name: 'React', level: 4, endorsements: 10, color: 'from-cyan-400 to-blue-500' },
  { name: 'Machine Learning', level: 3, endorsements: 6, color: 'from-purple-400 to-indigo-500' },
  { name: 'Node.js', level: 3, endorsements: 5, color: 'from-green-400 to-emerald-500' },
  { name: 'UI/UX Design', level: 2, endorsements: 4, color: 'from-pink-400 to-rose-500' },
];

const projects = [
  {
    id: 1,
    title: 'AI-Powered Image Classifier',
    description: 'Deep learning model for multi-class image classification using CNN',
    tech: ['Python', 'TensorFlow', 'OpenCV'],
    status: 'completed',
    verified: true,
    teamSize: 4,
    impact: '92% accuracy, deployed in production'
  },
  {
    id: 2,
    title: 'Campus Event Management System',
    description: 'Full-stack web app for managing university events and registrations',
    tech: ['React', 'Node.js', 'MongoDB'],
    status: 'ongoing',
    verified: false,
    teamSize: 3,
    impact: '500+ active users'
  },
  {
    id: 3,
    title: 'Smart Energy Monitor IoT',
    description: 'IoT device for real-time energy consumption tracking',
    tech: ['Arduino', 'Python', 'MQTT'],
    status: 'completed',
    verified: true,
    teamSize: 2,
    impact: '30% energy savings achieved'
  }
];

const certificates = [
  { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: 'Oct 2024', verified: true },
  { name: 'Machine Learning Specialization', issuer: 'Coursera', date: 'Aug 2024', verified: true },
  { name: 'React Advanced Patterns', issuer: 'Frontend Masters', date: 'Jun 2024', verified: true },
];

export default function ProfilePage({ onOpenAIMentor }: ProfilePageProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [profileData, setProfileData] = useState({
    name: 'Aarav Sharma',
    title: 'Computer Science • IIT Delhi • Class of 2025',
    location: 'New Delhi, India',
    bio: 'Passionate about AI/ML and full-stack development. Love building products that solve real problems. Currently working on deep learning projects and exploring computer vision applications.',
    github: '',
    linkedin: '',
    email: '',
    portfolio: ''
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    setToastMessage('Profile updated successfully!');
    setShowToast(true);
    // In a real app, you would save to a backend here
    localStorage.setItem('uconnect_profile', JSON.stringify(profileData));
  };

  // Load saved profile data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('uconnect_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfileData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} />
        
        <div className="p-8">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-200">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex-shrink-0" />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="text-2xl font-semibold text-slate-900 mb-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    ) : (
                      <h1 className="text-slate-900 mb-2">{profileData.name}</h1>
                    )}
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                        className="text-slate-600 mb-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    ) : (
                      <p className="text-slate-600 mb-2">{profileData.title}</p>
                    )}
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                            className="text-slate-600 bg-slate-50 border border-slate-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          />
                        ) : (
                          <span>{profileData.location}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined Sep 2024</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className={`px-4 py-2 border rounded-xl transition-colors flex items-center gap-2 ${
                      isEditing 
                        ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {isEditing ? 'Save Profile' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="text-slate-700 mb-6 max-w-3xl w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-slate-700 mb-6 max-w-3xl">
                    {profileData.bio}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  <div className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
                    <p className="text-indigo-100">U-Score</p>
                    <p className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      847
                    </p>
                  </div>
                  <div className="px-6 py-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="text-emerald-700">Projects Completed</p>
                    <p className="text-emerald-900">12</p>
                  </div>
                  <div className="px-6 py-3 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-amber-700">Skill Endorsements</p>
                    <p className="text-amber-900">45</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <Github className="w-5 h-5 text-slate-700" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <Linkedin className="w-5 h-5 text-slate-700" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <Mail className="w-5 h-5 text-slate-700" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <ExternalLink className="w-5 h-5 text-slate-700" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Skill Graph */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 mb-8">
                <h2 className="text-slate-900 mb-6">Visual Skill Graph</h2>
                
                {/* Interactive Skill Network Visualization */}
                <div className="relative h-96 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl overflow-hidden">
                  {/* Central Node */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white z-10 shadow-2xl"
                  >
                    <div className="text-center">
                      <p className="text-xs">U-Score</p>
                      <p>847</p>
                    </div>
                  </motion.div>

                  {/* Skill Nodes */}
                  {skillsData.map((skill, index) => {
                    const angle = (index / skillsData.length) * 2 * Math.PI;
                    const radius = 140;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="absolute top-1/2 left-1/2"
                        style={{
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                        }}
                      >
                        {/* Connection Line */}
                        <svg className="absolute top-1/2 left-1/2 -z-10" width="300" height="300" style={{ transform: 'translate(-50%, -50%)' }}>
                          <line
                            x1="150"
                            y1="150"
                            x2={150 - x}
                            y2={150 - y}
                            stroke="#E2E8F0"
                            strokeWidth="2"
                          />
                        </svg>

                        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${skill.color} p-0.5 shadow-lg cursor-pointer hover:scale-110 transition-transform`}>
                          <div className="w-full h-full bg-white rounded-xl p-2 flex flex-col items-center justify-center">
                            <Code className="w-5 h-5 mb-1" style={{ 
                              background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                            }} />
                            <p className="text-slate-900 text-xs text-center">{skill.name}</p>
                            <div className="flex gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 h-1 rounded-full ${
                                    i < skill.level ? 'bg-indigo-600' : 'bg-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  {skillsData.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-slate-900">{skill.name}</p>
                        <p className="text-slate-500">Level {skill.level}/5</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{skill.endorsements}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-3xl border border-slate-200">
                <div className="border-b border-slate-200 px-8 pt-6">
                  <div className="flex gap-6">
                    {['projects', 'certificates', 'activity'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 border-b-2 transition-colors capitalize ${
                          activeTab === tab
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  {activeTab === 'projects' && (
                    <div className="space-y-6">
                      {projects.map((project) => (
                        <div key={project.id} className="p-6 bg-slate-50 rounded-2xl hover:shadow-md transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-slate-900">{project.title}</h3>
                                {project.verified && (
                                  <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                )}
                              </div>
                              <p className="text-slate-600 mb-3">{project.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              project.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tech.map((tech) => (
                              <span key={tech} className="px-3 py-1 bg-white text-slate-700 rounded-lg">
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-slate-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{project.teamSize} members</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{project.impact}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'certificates' && (
                    <div className="space-y-4">
                      {certificates.map((cert) => (
                        <div key={cert.name} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-slate-900">{cert.name}</p>
                                {cert.verified && (
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                )}
                              </div>
                              <p className="text-slate-500">{cert.issuer} • {cert.date}</p>
                            </div>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-700">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="text-center py-12">
                      <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">Your activity timeline will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Achievements */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-slate-900 mb-4">Achievements</h3>
                <div className="space-y-3">
                  {[
                    { icon: Trophy, title: 'Top Contributor', desc: 'Completed 10+ projects', color: 'text-amber-500' },
                    { icon: Star, title: 'Skill Master', desc: '5 skills at level 4+', color: 'text-yellow-500' },
                    { icon: Target, title: 'Perfect Match', desc: '90%+ team compatibility', color: 'text-indigo-500' },
                    { icon: Rocket, title: 'Fast Learner', desc: 'Gained 200 U-Score in a month', color: 'text-purple-500' },
                  ].map((achievement) => (
                    <div key={achievement.title} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center ${achievement.color}`}><achievement.icon className="w-5 h-5" /></div>
                      <div>
                        <p className="text-slate-900">{achievement.title}</p>
                        <p className="text-slate-500">{achievement.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Roadmap */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="mb-4">Learning Roadmap</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Python Advanced</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '80%' }} />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span>System Design</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
                  View Full Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
