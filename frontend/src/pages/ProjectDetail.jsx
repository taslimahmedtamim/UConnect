import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { ArrowLeft, CheckCircle, Circle, MessageSquare, FileText, Users, Calendar } from 'lucide-react'

const tasks = [
  { id: 1, title: 'Setup project structure', status: 'completed', assignee: 'John Doe' },
  { id: 2, title: 'Implement authentication', status: 'in-progress', assignee: 'Jane Smith' },
  { id: 3, title: 'Design database schema', status: 'todo', assignee: 'Bob Johnson' },
  { id: 4, title: 'Create API endpoints', status: 'todo', assignee: 'Alice Brown' },
]

const team = [
  { name: 'John Doe', role: 'Lead Developer', avatar: 'JD' },
  { name: 'Jane Smith', role: 'Frontend Developer', avatar: 'JS' },
  { name: 'Bob Johnson', role: 'Backend Developer', avatar: 'BJ' },
  { name: 'Alice Brown', role: 'UI/UX Designer', avatar: 'AB' },
]

export function ProjectDetail() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/app/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">E-Commerce Platform</h1>
          <p className="text-gray-400">Full-stack e-commerce solution with React and Node.js</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <p className={`text-white ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-400">{task.assignee}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400'
                        : task.status === 'in-progress'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Project Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 min-h-[200px]">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    JD
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">John Doe</p>
                    <p className="text-sm text-gray-300 mt-1">Let's start with the authentication module</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    JS
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">Jane Smith</p>
                    <p className="text-sm text-gray-300 mt-1">I'll work on the frontend components</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-strong"
                />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand to-accent rounded-full flex items-center justify-center text-white font-semibold">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <p className="text-sm text-white">Active</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/5 rounded-full h-2">
                    <div className="bg-gradient-to-r from-brand-strong to-accent h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <span className="text-sm text-white">75%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Deadline</p>
                <p className="text-sm text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Dec 15, 2024
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'MongoDB'].map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


