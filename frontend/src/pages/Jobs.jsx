import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { Briefcase, MapPin, DollarSign, TrendingUp, Search, Filter, Zap } from 'lucide-react'

const jobs = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    matchScore: 95,
    skills: ['React', 'Node.js', 'TypeScript'],
    posted: '2 days ago',
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $130k',
    matchScore: 88,
    skills: ['React', 'Next.js', 'Tailwind'],
    posted: '5 days ago',
  },
  {
    id: 3,
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$140k - $170k',
    matchScore: 82,
    skills: ['Python', 'TensorFlow', 'ML'],
    posted: '1 week ago',
  },
]

export function Jobs() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Job Opportunities</h1>
        <p className="text-gray-400">Discover jobs and internships matched to your profile</p>
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
                placeholder="Search jobs, companies, locations..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-strong"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:border-brand/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-strong to-accent rounded-lg flex items-center justify-center text-white font-bold">
                      {job.company.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
                      <p className="text-gray-300 mb-2">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Posted {job.posted}</p>
                </div>
                <div className="ml-6 text-right">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-brand" />
                      <span className="text-lg font-bold text-brand">{job.matchScore}%</span>
                    </div>
                    <p className="text-xs text-gray-400">Match Score</p>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full">
                      <Zap className="w-4 h-4 mr-2" />
                      Quick Apply
                    </Button>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}



