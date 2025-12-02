import { useState } from 'react';
import { 
  Briefcase, MapPin, Clock, TrendingUp, Filter, Search, 
  Building2, DollarSign, Calendar, ExternalLink, Bookmark, Star
} from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface OpportunityHubProps {
  onOpenAIMentor: () => void;
}

const opportunities = [
  {
    id: 1,
    company: 'Google',
    logo: 'from-blue-500 to-cyan-500',
    role: 'Software Engineering Intern',
    type: 'Internship',
    location: 'Bangalore, India',
    salary: '₹80,000/month',
    posted: '2 days ago',
    matchScore: 94,
    skillsMatch: ['Python', 'Machine Learning', 'TensorFlow'],
    skillsGap: ['System Design'],
    description: 'Work on cutting-edge ML projects in our Search team',
    requirements: ['Strong Python skills', 'ML/DL experience', 'Good academics'],
  },
  {
    id: 2,
    company: 'Microsoft',
    logo: 'from-indigo-500 to-purple-500',
    role: 'Frontend Developer Intern',
    type: 'Internship',
    location: 'Hyderabad, India',
    salary: '₹75,000/month',
    posted: '1 week ago',
    matchScore: 89,
    skillsMatch: ['React', 'JavaScript', 'UI/UX'],
    skillsGap: ['TypeScript', 'Azure'],
    description: 'Build beautiful experiences for Microsoft Teams',
    requirements: ['React expertise', 'Strong portfolio', 'Problem-solving skills'],
  },
  {
    id: 3,
    company: 'Flipkart',
    logo: 'from-amber-500 to-orange-500',
    role: 'Full Stack Developer',
    type: 'Full-time',
    location: 'Bangalore, India',
    salary: '₹18-22 LPA',
    posted: '3 days ago',
    matchScore: 92,
    skillsMatch: ['React', 'Node.js', 'MongoDB'],
    skillsGap: ['Microservices'],
    description: 'Join our e-commerce platform team',
    requirements: ['Full-stack experience', '2+ years preferred', 'Startup mindset'],
  },
  {
    id: 4,
    company: 'Amazon',
    logo: 'from-emerald-500 to-teal-500',
    role: 'SDE Intern - ML',
    type: 'Internship',
    location: 'Chennai, India',
    salary: '₹85,000/month',
    posted: '1 day ago',
    matchScore: 91,
    skillsMatch: ['Python', 'Machine Learning', 'Data Science'],
    skillsGap: ['AWS', 'Spark'],
    description: 'Work on recommendation systems for Amazon Prime',
    requirements: ['ML fundamentals', 'Strong coding', 'Data structures'],
  },
  {
    id: 5,
    company: 'Swiggy',
    logo: 'from-rose-500 to-pink-500',
    role: 'Backend Engineer',
    type: 'Full-time',
    location: 'Bangalore, India',
    salary: '₹15-20 LPA',
    posted: '5 days ago',
    matchScore: 87,
    skillsMatch: ['Node.js', 'Python', 'Database'],
    skillsGap: ['Kafka', 'Redis'],
    description: 'Scale our food delivery platform to millions of users',
    requirements: ['Backend expertise', 'System design', 'High-scale systems'],
  },
  {
    id: 6,
    company: 'Razorpay',
    logo: 'from-purple-500 to-indigo-500',
    role: 'Full Stack Intern',
    type: 'Internship',
    location: 'Remote',
    salary: '₹50,000/month',
    posted: '1 week ago',
    matchScore: 88,
    skillsMatch: ['React', 'Node.js', 'JavaScript'],
    skillsGap: ['Payment Systems'],
    description: 'Build features for India\'s leading payment gateway',
    requirements: ['Full-stack skills', 'Fast learner', 'FinTech interest'],
  },
];

export default function OpportunityHub({ onOpenAIMentor }: OpportunityHubProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'internship' | 'fulltime'>('all');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter(jobId => jobId !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };

  const filteredOpportunities = opportunities
    .filter(opp => filterType === 'all' || opp.type.toLowerCase() === filterType)
    .filter(opp => 
      opp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-slate-900 mb-2">Opportunity Discovery</h1>
            <p className="text-slate-600">AI-matched internships and jobs based on your skills and projects</p>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-slate-200">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by role, company, skills..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex gap-2">
                {['all', 'internship', 'fulltime'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as 'all' | 'internship' | 'fulltime')}
                    className={`flex-1 px-4 py-3 rounded-xl transition-colors capitalize ${
                      filterType === type
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'fulltime' ? 'Full-time' : type}
                  </button>
                ))}
              </div>

              <button className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Filter className="w-5 h-5" />
                More Filters
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <Briefcase className="w-8 h-8 text-indigo-600" />
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-slate-600">Total Matches</p>
              <p className="text-slate-900">{filteredOpportunities.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <Star className="w-8 h-8 text-amber-600 mb-2" />
              <p className="text-slate-600">High Match (90%+)</p>
              <p className="text-slate-900">{filteredOpportunities.filter(o => o.matchScore >= 90).length}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <Bookmark className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-slate-600">Saved Jobs</p>
              <p className="text-slate-900">{savedJobs.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <Calendar className="w-8 h-8 text-emerald-600 mb-2" />
              <p className="text-slate-600">Applications</p>
              <p className="text-slate-900">3</p>
            </div>
          </div>

          {/* Opportunities Grid */}
          <div className="grid gap-6">
            {filteredOpportunities.map((opp) => (
              <div key={opp.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all">
                <div className="flex items-start gap-6">
                  {/* Company Logo */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${opp.logo} flex items-center justify-center text-white flex-shrink-0`}>
                    <Building2 className="w-8 h-8" />
                  </div>

                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-slate-900 mb-1">{opp.role}</h3>
                        <p className="text-slate-600">{opp.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${
                          opp.matchScore >= 90 ? 'from-emerald-400 to-teal-500' :
                          opp.matchScore >= 85 ? 'from-blue-400 to-cyan-500' :
                          'from-purple-400 to-pink-500'
                        }`}>
                          <span className="text-white">{opp.matchScore}% match</span>
                        </div>
                        <button
                          onClick={() => toggleSave(opp.id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            savedJobs.includes(opp.id)
                              ? 'bg-amber-100 text-amber-600'
                              : 'hover:bg-slate-100 text-slate-400'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${savedJobs.includes(opp.id) ? 'fill-amber-600' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-700 mb-4">{opp.description}</p>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 mb-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{opp.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{opp.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Posted {opp.posted}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full ${
                        opp.type === 'Internship' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {opp.type}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-slate-600">Matching Skills:</span>
                        {opp.skillsMatch.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                      {opp.skillsGap.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-slate-600">Skills to Learn:</span>
                          {opp.skillsGap.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
                        Apply Now
                      </button>
                      <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No opportunities match your filters</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
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
