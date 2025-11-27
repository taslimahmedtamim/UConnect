import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { Sparkles, Star, Eye, Code, Users, Search } from 'lucide-react'
import { useState } from 'react'

const projects = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React and Node.js',
    author: 'John Doe',
    stars: 45,
    views: 320,
    skills: ['React', 'Node.js', 'MongoDB'],
    category: 'Web Development',
  },
  {
    id: 2,
    name: 'AI Chatbot',
    description: 'Intelligent chatbot using NLP and machine learning',
    author: 'Jane Smith',
    stars: 38,
    views: 280,
    skills: ['Python', 'ML', 'NLP'],
    category: 'AI/ML',
  },
  {
    id: 3,
    name: 'Mobile Task Manager',
    description: 'Cross-platform mobile app for productivity',
    author: 'Bob Johnson',
    stars: 52,
    views: 410,
    skills: ['React Native', 'Firebase'],
    category: 'Mobile',
  },
]

export function Showcase() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Project Showcase</h1>
        <p className="text-gray-400">Discover amazing projects from the university community</p>
      </div>

      {/* Search */}
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
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:border-brand/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand" />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
                <span className="px-2 py-1 bg-brand/20 text-brand rounded text-xs font-medium">
                  {project.category}
                </span>
              </div>
              <p className="text-sm text-gray-400">{project.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{project.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{project.views}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Code className="w-4 h-4 mr-2" />
                    View Code
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


