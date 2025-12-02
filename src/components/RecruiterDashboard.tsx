import { useState } from 'react';
import { Search, Filter, Star, Award, CheckCircle, ExternalLink, MessageCircle, TrendingUp, Users, Briefcase } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface RecruiterDashboardProps {
  onOpenAIMentor: () => void;
}

const candidates = [
  {
    id: 1,
    name: 'Aarav Sharma',
    university: 'IIT Delhi',
    graduation: '2025',
    uScore: 847,
    avatar: 'from-indigo-400 to-purple-400',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'React'],
    projects: 12,
    matchScore: 95,
    verifiedProjects: 8,
    endorsements: 45,
    status: 'Available',
    location: 'New Delhi',
    topProject: 'AI-Powered Image Classifier - 92% accuracy',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    university: 'BITS Pilani',
    graduation: '2025',
    uScore: 792,
    avatar: 'from-pink-400 to-rose-400',
    skills: ['React', 'Node.js', 'UI/UX', 'TypeScript'],
    projects: 10,
    matchScore: 92,
    verifiedProjects: 7,
    endorsements: 38,
    status: 'Available',
    location: 'Bangalore',
    topProject: 'Campus Event Management - 500+ users',
  },
  {
    id: 3,
    name: 'Rahul Verma',
    university: 'NIT Trichy',
    graduation: '2026',
    uScore: 821,
    avatar: 'from-blue-400 to-cyan-400',
    skills: ['Python', 'Data Science', 'SQL', 'AWS'],
    projects: 9,
    matchScore: 89,
    verifiedProjects: 6,
    endorsements: 42,
    status: 'Open to offers',
    location: 'Chennai',
    topProject: 'Real-time Analytics Dashboard',
  },
  {
    id: 4,
    name: 'Ananya Reddy',
    university: 'IIT Bombay',
    graduation: '2025',
    uScore: 865,
    avatar: 'from-purple-400 to-pink-400',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
    projects: 14,
    matchScore: 91,
    verifiedProjects: 10,
    endorsements: 51,
    status: 'Available',
    location: 'Mumbai',
    topProject: 'E-commerce Microservices Platform',
  },
];

export default function RecruiterDashboard({ onOpenAIMentor }: RecruiterDashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string[]>([]);

  const allSkills = Array.from(new Set(candidates.flatMap(c => c.skills)));

  const filteredCandidates = candidates
    .filter(candidate =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(candidate =>
      selectedSkillFilter.length === 0 ||
      selectedSkillFilter.some(skill => candidate.skills.includes(skill))
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} />
        
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-slate-900 mb-2">Talent Discovery</h1>
            <p className="text-slate-600">Find verified student talent based on real project experience</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <Users className="w-8 h-8 mb-2 text-indigo-200" />
              <p className="text-indigo-100">Total Candidates</p>
              <p>12,450</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <Star className="w-8 h-8 mb-2 text-amber-600" />
              <p className="text-slate-600">High Match (90%+)</p>
              <p className="text-slate-900">{filteredCandidates.filter(c => c.matchScore >= 90).length}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <MessageCircle className="w-8 h-8 mb-2 text-emerald-600" />
              <p className="text-slate-600">Active Conversations</p>
              <p className="text-slate-900">23</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <Briefcase className="w-8 h-8 mb-2 text-purple-600" />
              <p className="text-slate-600">Positions Open</p>
              <p className="text-slate-900">5</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-slate-200">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, university, skills..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filters
              </button>
            </div>

            <div>
              <p className="text-slate-600 mb-2">Filter by Skills:</p>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => {
                  const isSelected = selectedSkillFilter.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSkillFilter(selectedSkillFilter.filter(s => s !== skill));
                        } else {
                          setSelectedSkillFilter([...selectedSkillFilter, skill]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full border transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div className="grid gap-6">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${candidate.avatar} flex-shrink-0`} />

                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-slate-900">{candidate.name}</h3>
                          <div className={`px-3 py-1 rounded-full ${
                            candidate.matchScore >= 90 ? 'bg-emerald-50 text-emerald-700' :
                            candidate.matchScore >= 85 ? 'bg-blue-50 text-blue-700' :
                            'bg-purple-50 text-purple-700'
                          }`}>
                            {candidate.matchScore}% match
                          </div>
                        </div>
                        <p className="text-slate-600 mb-2">
                          {candidate.university} • Class of {candidate.graduation} • {candidate.location}
                        </p>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                          candidate.status === 'Available' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            candidate.status === 'Available' ? 'bg-emerald-600' : 'bg-blue-600'
                          }`} />
                          {candidate.status}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-2">
                          <Award className="w-5 h-5 text-indigo-600" />
                          <span className="text-slate-900">U-Score: {candidate.uScore}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>Top 5%</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{candidate.projects} projects</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>{candidate.verifiedProjects} verified</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span>{candidate.endorsements} endorsements</span>
                      </div>
                    </div>

                    {/* Top Project */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                      <p className="text-slate-600 mb-1">🏆 Top Project:</p>
                      <p className="text-slate-900">{candidate.topProject}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                      <button className="px-6 py-3 border border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Full Profile
                      </button>
                      <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No candidates match your search criteria</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSkillFilter([]);
                }}
                className="mt-4 px-6 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
