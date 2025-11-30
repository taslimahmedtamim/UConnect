import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { Plus, Users, Sparkles, Search } from 'lucide-react'

const teams = [
  {
    id: 1,
    name: 'E-Commerce Team',
    project: 'E-Commerce Platform',
    members: [
      { name: 'John Doe', role: 'Lead', avatar: 'JD' },
      { name: 'Jane Smith', role: 'Frontend', avatar: 'JS' },
      { name: 'Bob Johnson', role: 'Backend', avatar: 'BJ' },
      { name: 'Alice Brown', role: 'Design', avatar: 'AB' },
    ],
    matchScore: 92,
    status: 'active',
  },
  {
    id: 2,
    name: 'AI Research Team',
    project: 'AI Chatbot',
    members: [
      { name: 'You', role: 'ML Engineer', avatar: 'U' },
      { name: 'Sarah Lee', role: 'NLP Specialist', avatar: 'SL' },
      { name: 'Mike Chen', role: 'Data Scientist', avatar: 'MC' },
    ],
    matchScore: 88,
    status: 'active',
  },
]

const suggestions = [
  {
    name: 'Suggested Team for "Mobile App"',
    reason: 'Balanced skills: React Native, Firebase, UI/UX',
    matchScore: 95,
    members: 4,
  },
  {
    name: 'Suggested Team for "Blockchain Project"',
    reason: 'Complementary expertise in Web3 and smart contracts',
    matchScore: 87,
    members: 3,
  },
]

export function Teams() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
          <p className="text-gray-400">Manage your teams and discover new collaborations</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      {/* AI Suggestions */}
      <Card className="border-brand/30 bg-gradient-to-r from-brand-strong/10 to-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand" />
            AI Team Suggestions
          </CardTitle>
          <CardDescription>Let AI help you form balanced teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-medium">{suggestion.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{suggestion.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-brand">{suggestion.matchScore}%</div>
                    <div className="text-xs text-gray-400">Match</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{suggestion.members} members</span>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Teams */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">My Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>{team.project}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    team.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {team.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Team Match Score</span>
                      <span className="text-sm font-semibold text-brand">{team.matchScore}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-brand-strong to-accent h-2 rounded-full"
                        style={{ width: `${team.matchScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Members</p>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((member, i) => (
                        <div key={i} className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded">
                          <div className="w-6 h-6 bg-gradient-to-br from-brand to-accent rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="text-xs text-white font-medium">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">View Team</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}



