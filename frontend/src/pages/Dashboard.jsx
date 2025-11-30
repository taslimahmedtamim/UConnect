import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { StatCard } from '../components/StatCard'
import { UScoreBadge, Badge } from '../components/Badge'
import { Avatar, AvatarGroup } from '../components/Avatar'
import { SkillTag } from '../components/SkillTag'
import { AIMentor } from '../components/AIMentor'
import { 
  TrendingUp, 
  Users, 
  FolderKanban, 
  Briefcase, 
  Award,
  ArrowRight,
  Activity,
  Flame,
  Target,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const skillData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 72 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 80 },
  { name: 'May', value: 85 },
  { name: 'Jun', value: 88 },
]

const suggestedTeams = [
  {
    id: 1,
    projectName: 'AI-Powered Campus Assistant',
    match: 94,
    members: [
      { name: 'Priya Sharma', src: null, role: 'student' },
      { name: 'Rahul Das', src: null, role: 'student' },
      { name: 'Amit Kumar', src: null, role: 'student' },
    ],
    requiredSkills: ['Python', 'NLP', 'React'],
    university: 'IIT Delhi',
  },
  {
    id: 2,
    projectName: 'Waste Classification System',
    match: 87,
    members: [
      { name: 'Sneha Roy', src: null, role: 'student' },
      { name: 'Arjun Patel', src: null, role: 'student' },
    ],
    requiredSkills: ['TensorFlow', 'Computer Vision', 'IoT'],
    university: 'BUET',
  },
]

const upcomingDeadlines = [
  { task: 'Submit ML Model Training', project: 'Campus Assistant', dueIn: '2 days', priority: 'high' },
  { task: 'Code Review Session', project: 'Waste Classification', dueIn: '5 days', priority: 'medium' },
  { task: 'Mid-term Presentation', project: 'Event Management', dueIn: '1 week', priority: 'low' },
]

export function Dashboard() {
  const userName = "Tamim Ahmed"
  const uScore = 785
  const xpStreak = 12

  return (
    <div className="space-y-8 relative z-10">
      {/* Personalized Greeting */}
      <div className="bg-gradient-primary rounded-large p-8 text-white shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
            <p className="text-primary-100 text-lg">Ready to make today count?</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-large px-4 py-3">
              <Flame className="w-6 h-6 text-amber-300" />
              <div>
                <p className="text-2xl font-bold">{xpStreak}</p>
                <p className="text-xs text-primary-100">Day Streak</p>
              </div>
            </div>
            <UScoreBadge score={uScore} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Projects"
          value="3"
          icon={FolderKanban}
          trend="up"
          trendValue="+1 this month"
          color="primary"
        />
        <StatCard
          title="Pending Tasks"
          value="8"
          icon={CheckCircle2}
          trend="down"
          trendValue="4 completed today"
          color="emerald"
        />
        <StatCard
          title="New Opportunities"
          value="15"
          icon={Briefcase}
          trend="up"
          trendValue="+5 new matches"
          color="purple"
        />
        <StatCard
          title="Skill Growth"
          value="+12%"
          icon={TrendingUp}
          subtitle="this month"
          color="amber"
        />
      </div>

      {/* Suggested Teams */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Suggested Teams for You</h2>
          <Link to="/app/teams">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestedTeams.map((team) => (
            <Card key={team.id} hover className="group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {team.projectName}
                    </h3>
                    <p className="text-sm text-gray-500">{team.university}</p>
                  </div>
                  <Badge variant="success" className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {team.match}% match
                  </Badge>
                </div>
                <div className="mb-4">
                  <AvatarGroup avatars={team.members} max={3} size="md" />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {team.requiredSkills.map((skill, idx) => (
                    <SkillTag key={idx} skill={skill} variant="outlined" />
                  ))}
                </div>
                <Button className="w-full">
                  View Details <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Growth */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <CardTitle>Skill Growth</CardTitle>
            </div>
            <CardDescription>Your progress over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={skillData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366F1', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <CardTitle>Upcoming Deadlines</CardTitle>
            </div>
            <CardDescription>Stay on track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, i) => {
                const priorityColors = {
                  high: 'bg-red-50 border-red-200 text-red-700',
                  medium: 'bg-amber-50 border-amber-200 text-amber-700',
                  low: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                }
                return (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{deadline.task}</p>
                      <Badge variant="default" size="sm" className={priorityColors[deadline.priority]}>
                        {deadline.dueIn}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{deadline.project}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <CardDescription>Your latest updates and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: Award, text: 'Earned "Team Player" badge', time: '2 hours ago', color: 'text-amber-500' },
              { icon: FolderKanban, text: 'Completed task in "Campus Assistant"', time: '5 hours ago', color: 'text-primary-500' },
              { icon: Briefcase, text: 'Applied to SWE role at TechCorp', time: '1 day ago', color: 'text-emerald-500' },
              { icon: Users, text: 'Joined team for "Waste Classification"', time: '2 days ago', color: 'text-purple-500' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Mentor Floating Widget */}
      <AIMentor />
    </div>
  )
}


