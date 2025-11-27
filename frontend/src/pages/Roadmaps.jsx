import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { Map, Target, BookOpen, Users, Sparkles, CheckCircle, Circle } from 'lucide-react'

const roadmaps = [
  {
    id: 1,
    title: 'Backend Developer',
    description: 'Path to becoming a skilled backend engineer',
    progress: 65,
    milestones: [
      { title: 'Learn Node.js fundamentals', completed: true },
      { title: 'Build REST APIs', completed: true },
      { title: 'Master databases (SQL & NoSQL)', completed: true },
      { title: 'Learn microservices architecture', completed: false },
      { title: 'Deploy to cloud platforms', completed: false },
    ],
    estimatedTime: '6 months',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    id: 2,
    title: 'Data Scientist',
    description: 'Comprehensive data science career path',
    progress: 40,
    milestones: [
      { title: 'Python for data analysis', completed: true },
      { title: 'Statistics fundamentals', completed: true },
      { title: 'Machine Learning basics', completed: false },
      { title: 'Deep Learning', completed: false },
      { title: 'Production ML systems', completed: false },
    ],
    estimatedTime: '8 months',
    skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow'],
  },
]

export function Roadmaps() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Career Roadmaps</h1>
        <p className="text-gray-400">Personalized career paths with milestones and resources</p>
      </div>

      {/* AI Recommendations */}
      <Card className="border-brand/30 bg-gradient-to-r from-brand-strong/10 to-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand" />
            AI Recommended Paths
          </CardTitle>
          <CardDescription>Based on your profile and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Full-Stack Developer', 'ML Engineer', 'DevOps Engineer'].map((path, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="text-white font-medium mb-1">{path}</h3>
                <p className="text-sm text-gray-400 mb-3">Recommended based on your skills</p>
                <Button size="sm" variant="outline">View Path</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Roadmaps */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Active Roadmaps</h2>
        <div className="space-y-6">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="w-5 h-5 text-brand" />
                      {roadmap.title}
                    </CardTitle>
                    <CardDescription>{roadmap.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-brand">{roadmap.progress}%</div>
                    <div className="text-xs text-gray-400">Complete</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="w-full bg-white/5 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-brand-strong to-accent h-2 rounded-full"
                        style={{ width: `${roadmap.progress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Milestones
                    </h3>
                    <div className="space-y-2">
                      {roadmap.milestones.map((milestone, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                          {milestone.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <span className={`text-sm ${milestone.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Estimated Time</p>
                      <p className="text-sm text-white">{roadmap.estimatedTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {roadmap.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Continue Learning</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

