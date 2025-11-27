import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { Plus, Search, Filter, FolderKanban, Users, Calendar } from 'lucide-react'

const projects = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React and Node.js',
    status: 'active',
    progress: 75,
    team: 4,
    deadline: '2024-12-15',
    skills: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 2,
    name: 'AI Chatbot',
    description: 'Intelligent chatbot using NLP and machine learning',
    status: 'active',
    progress: 45,
    team: 3,
    deadline: '2024-12-20',
    skills: ['Python', 'ML', 'NLP'],
  },
  {
    id: 3,
    name: 'Mobile App',
    description: 'Cross-platform mobile application for task management',
    status: 'completed',
    progress: 100,
    team: 5,
    deadline: '2024-11-30',
    skills: ['React Native', 'Firebase'],
  },
]

export function Projects() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage and track your projects</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-strong"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} to={`/app/projects/${project.id}`}>
            <Card hover className="cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-brand" />
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-brand-strong to-accent h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{project.team} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.deadline}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}


