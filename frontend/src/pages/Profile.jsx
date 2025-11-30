import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { Badge, UScoreBadge } from '../components/Badge'
import { Avatar } from '../components/Avatar'
import { SkillTag } from '../components/SkillTag'
import { User, Award, TrendingUp, Code, BookOpen, MapPin, Calendar, Mail, GraduationCap, Github, Linkedin, ExternalLink, Star, CheckCircle } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { useState } from 'react'

const skills = [
  { name: 'React', level: 5, category: 'Frontend' },
  { name: 'Node.js', level: 4, category: 'Backend' },
  { name: 'Python', level: 4, category: 'Programming' },
  { name: 'TensorFlow', level: 3, category: 'ML/AI' },
  { name: 'PostgreSQL', level: 4, category: 'Database' },
  { name: 'Docker', level: 3, category: 'DevOps' },
  { name: 'TypeScript', level: 5, category: 'Programming' },
  { name: 'MongoDB', level: 3, category: 'Database' },
]

const projects = [
  { 
    title: 'AI Campus Assistant', 
    description: 'NLP-powered chatbot for campus queries',
    skills: ['Python', 'NLP', 'React'],
    status: 'Active',
    verified: true 
  },
  { 
    title: 'Smart Waste Classification', 
    description: 'Computer vision for waste sorting',
    skills: ['TensorFlow', 'Computer Vision', 'IoT'],
    status: 'Completed',
    verified: true 
  },
  { 
    title: 'Event Management Platform', 
    description: 'Full-stack platform for campus events',
    skills: ['React', 'Node.js', 'MongoDB'],
    status: 'Active',
    verified: false 
  },
]

const skillData = skills.slice(0, 6).map(s => ({ subject: s.name, A: s.level * 20, fullMark: 100 }))

export function Profile() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: TrendingUp },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ]

  return (
    <div className="space-y-6 relative z-10">
      {/* Profile Header */}
      <div className="bg-gradient-primary rounded-large p-8 shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <Avatar
              src={null}
              alt="Tamim Ahmed"
              size="2xl"
              online={true}
              role="student"
            />
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Tamim Ahmed</h1>
                <Badge variant="primary" className="bg-white/20 text-white">Student</Badge>
              </div>
              <p className="text-primary-100 text-lg mb-2">Computer Science & Engineering</p>
              <p className="text-primary-200 flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4" />
                Bangladesh University of Engineering & Technology (BUET)
              </p>
              <div className="flex flex-wrap gap-4 text-primary-100">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Dhaka, Bangladesh
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Graduating 2025
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  tamim@buet.ac.bd
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <UScoreBadge score={785} />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Projects', value: '8', icon: Code },
              { label: 'Skills', value: '24', icon: TrendingUp },
              { label: 'Certificates', value: '6', icon: Award },
              { label: 'Endorsements', value: '12', icon: Star },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <stat.icon className="w-5 h-5 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-primary-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 rounded-t-large">
        <div className="flex gap-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects */}
          {activeTab === 'projects' && (
            <Card>
              <CardHeader>
                <CardTitle>Verified Projects</CardTitle>
                <CardDescription>Your completed and ongoing projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 hover:shadow-soft transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{project.title}</h3>
                          {project.verified && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      <Badge variant={project.status === 'Active' ? 'success' : 'default'}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, idx) => (
                        <SkillTag key={idx} skill={skill} variant="outlined" />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {(activeTab === 'skills' || activeTab === 'overview') && (
            <Card>
              <CardHeader>
                <CardTitle>Progressive Skill Graph</CardTitle>
                <CardDescription>Interactive visualization of your skills and expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={skillData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" stroke="#6b7280" tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
                      <Radar name="Skills" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {skills.map((skill, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          <Badge variant="default" size="sm">{skill.category}</Badge>
                        </div>
                        <SkillTag skill={`Level ${skill.level}`} level={skill.level} showLevel={false} variant="primary" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all"
                          style={{ width: `${skill.level * 20}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificates */}
          {activeTab === 'certificates' && (
            <Card>
              <CardHeader>
                <CardTitle>Certificates & Achievements</CardTitle>
                <CardDescription>Your earned certifications and badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: 'Dec 2024', icon: Award },
                    { name: 'React Advanced Patterns', issuer: 'Frontend Masters', date: 'Nov 2024', icon: Code },
                    { name: 'Machine Learning Specialization', issuer: 'Coursera', date: 'Oct 2024', icon: BookOpen },
                    { name: 'Team Leadership Badge', issuer: 'UConnect', date: 'Sep 2024', icon: Star },
                  ].map((cert, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 hover:shadow-soft transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <cert.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{cert.name}</h3>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                          <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed">
                Passionate CS student with expertise in full-stack development and machine learning. 
                Love building products that solve real-world problems.
              </p>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { text: 'Completed ML project', time: '2h ago', icon: CheckCircle, color: 'text-emerald-500' },
                { text: 'Earned new badge', time: '1d ago', icon: Award, color: 'text-amber-500' },
                { text: 'Updated skills', time: '3d ago', icon: TrendingUp, color: 'text-primary-500' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-2">
                  <activity.icon className={`w-4 h-4 mt-0.5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


