import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { User, Award, TrendingUp, Code, BookOpen } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

const skills = [
  { skill: 'React', level: 85 },
  { skill: 'Node.js', level: 78 },
  { skill: 'Python', level: 72 },
  { skill: 'ML/AI', level: 65 },
  { skill: 'Design', level: 60 },
]

const skillData = skills.map(s => ({ subject: s.skill, A: s.level, fullMark: 100 }))

export function Profile() {
  return (
    <div className="space-y-6 relative z-10">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your profile and showcase your skills</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2" hover>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your public profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-strong to-accent rounded-full flex items-center justify-center text-2xl font-semibold text-white">
                JD
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">John Doe</h3>
                <p className="text-gray-400">Computer Science Student</p>
                <p className="text-sm text-gray-500">University of Technology</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-white">john.doe@university.edu</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">GPA</p>
                <p className="text-white">3.8 / 4.0</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">U-Score</p>
                <p className="text-white font-semibold">8.5</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Projects</p>
                <p className="text-white">12 completed</p>
              </div>
            </div>
            <Button>Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Skill Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Graph</CardTitle>
            <CardDescription>Your skill levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="subject" stroke="#a1b1c6" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#a1b1c6" />
                <Radar name="Skills" dataKey="A" stroke="#6ea8fe" fill="#6ea8fe" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skills List */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
          <CardDescription>Your technical and soft skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{skill.skill}</span>
                  <span className="text-sm text-gray-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-brand-strong to-accent h-2 rounded-full transition-all"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements & Badges</CardTitle>
          <CardDescription>Your earned badges and certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Team Player', icon: Award, color: 'from-yellow-500 to-orange-500' },
              { name: 'Code Master', icon: Code, color: 'from-blue-500 to-cyan-500' },
              { name: 'Fast Learner', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
              { name: 'Rising Star', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
            ].map((badge, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <badge.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-white font-medium">{badge.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


