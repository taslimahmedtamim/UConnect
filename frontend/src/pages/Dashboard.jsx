import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { 
  TrendingUp, 
  Users, 
  FolderKanban, 
  Briefcase, 
  Award,
  ArrowRight,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const stats = [
  { label: 'U-Score', value: '8.5', change: '+0.3', icon: TrendingUp },
  { label: 'Active Projects', value: '3', change: '+1', icon: FolderKanban },
  { label: 'Team Members', value: '12', change: '+2', icon: Users },
  { label: 'Job Matches', value: '15', change: '+5', icon: Briefcase },
]

const skillData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 72 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 80 },
  { name: 'May', value: 85 },
  { name: 'Jun', value: 88 },
]

export function Dashboard() {
  return (
    <div className="space-y-6 relative z-10">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your career journey.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-green-500 mt-1">
                    {stat.change} this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-brand" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Growth</CardTitle>
            <CardDescription>Your progress over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={skillData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#a1b1c6" />
                <YAxis stroke="#a1b1c6" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f1520', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6ea8fe" 
                  strokeWidth={2}
                  dot={{ fill: '#6ea8fe' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: Award, text: 'Earned "Team Player" badge', time: '2 hours ago' },
                { icon: FolderKanban, text: 'Completed task in "E-Commerce Platform"', time: '5 hours ago' },
                { icon: Briefcase, text: 'Applied to Software Engineer at TechCorp', time: '1 day ago' },
                { icon: Users, text: 'Joined new team for "AI Chatbot" project', time: '2 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/app/resume">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-brand/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Generate Resume</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">Create your U-Resume in one click</p>
              </div>
            </Link>
            <Link to="/app/teams">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-brand/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Find Team</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">Let AI suggest balanced teams</p>
              </div>
            </Link>
            <Link to="/app/jobs">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-brand/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Browse Jobs</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">Discover matched opportunities</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


