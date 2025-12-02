import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Sparkles, Users, Clock, Target, Zap, CheckCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface ProjectCreationProps {
  onOpenAIMentor: () => void;
}

const suggestedTeams = [
  {
    id: 1,
    members: [
      { name: 'Priya Sharma', skills: ['Python', 'ML'], avatar: 'from-pink-400 to-rose-400', match: 95 },
      { name: 'Rahul Verma', skills: ['TensorFlow', 'Data'], avatar: 'from-blue-400 to-cyan-400', match: 92 },
      { name: 'You', skills: ['Python', 'Computer Vision'], avatar: 'from-indigo-400 to-purple-400', match: 100 },
    ],
    matchScore: 94,
    diversity: 85,
    availability: 'High',
    reason: 'Complementary skills in ML and data processing'
  },
  {
    id: 2,
    members: [
      { name: 'Ananya Reddy', skills: ['PyTorch', 'CV'], avatar: 'from-purple-400 to-pink-400', match: 90 },
      { name: 'Karan Singh', skills: ['Python', 'Backend'], avatar: 'from-emerald-400 to-teal-400', match: 88 },
      { name: 'You', skills: ['Python', 'Computer Vision'], avatar: 'from-indigo-400 to-purple-400', match: 100 },
    ],
    matchScore: 89,
    diversity: 78,
    availability: 'Medium',
    reason: 'Strong technical background with varied expertise'
  },
  {
    id: 3,
    members: [
      { name: 'Sneha Patel', skills: ['ML', 'Statistics'], avatar: 'from-amber-400 to-orange-400', match: 87 },
      { name: 'Arjun Kumar', skills: ['Python', 'OpenCV'], avatar: 'from-cyan-400 to-blue-400', match: 91 },
      { name: 'You', skills: ['Python', 'Computer Vision'], avatar: 'from-indigo-400 to-purple-400', match: 100 },
    ],
    matchScore: 87,
    diversity: 90,
    availability: 'High',
    reason: 'Balanced team with high diversity score'
  },
];

export default function ProjectCreation({ onOpenAIMentor }: ProjectCreationProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [step, setStep] = useState(1);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState(3);
  const [requireTeacherApproval, setRequireTeacherApproval] = useState(true);
  const [generatingTeams, setGeneratingTeams] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const availableSkills = [
    'Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'OpenCV',
    'Machine Learning', 'Data Science', 'Deep Learning', 'NumPy', 'Pandas'
  ];

  const totalSteps = 3;

  const handleGenerateTeams = () => {
    setGeneratingTeams(true);
    setTimeout(() => {
      setGeneratingTeams(false);
      setStep(3);
    }, 2000);
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} />
        
        <div className="p-8 max-w-6xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    s <= step ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Project Details</span>
              <span>Required Skills</span>
              <span>Team Formation</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Project Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 border border-slate-200"
              >
                <h2 className="text-slate-900 mb-2">Tell us about your project</h2>
                <p className="text-slate-600 mb-8">Provide details to help AI find the perfect team</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-700 mb-2">Project Title</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g., AI-Powered Waste Classification System"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      rows={5}
                      placeholder="Describe your project idea, goals, and expected outcomes..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Team Size</label>
                    <div className="flex gap-3">
                      {[2, 3, 4, 5].map((size) => (
                        <button
                          key={size}
                          onClick={() => setTeamSize(size)}
                          className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                            teamSize === size
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Users className="w-5 h-5 mx-auto mb-1" />
                          {size} members
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireTeacherApproval}
                        onChange={(e) => setRequireTeacherApproval(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <div className="flex-1">
                        <p className="text-slate-900">Require Teacher Approval</p>
                        <p className="text-slate-600">Get your project verified by faculty for credibility</p>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Skills Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 border border-slate-200"
              >
                <h2 className="text-slate-900 mb-2">What skills are needed?</h2>
                <p className="text-slate-600 mb-8">Select the skills required for your project</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {availableSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-slate-900 mb-2">AI Team Matching</h3>
                      <p className="text-slate-600 mb-4">
                        Our AI will analyze {selectedSkills.length} selected skills to find teammates with complementary expertise, 
                        similar availability, and proven collaboration history.
                      </p>
                      <button
                        onClick={handleGenerateTeams}
                        disabled={selectedSkills.length < 2 || generatingTeams}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        <Zap className={`w-5 h-5 ${generatingTeams ? 'animate-spin' : ''}`} />
                        {generatingTeams ? 'Finding teams...' : 'Generate Team Suggestions'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Team Suggestions */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-slate-900 mb-2">AI-Suggested Teams</h2>
                  <p className="text-slate-600">Select the team that best fits your project</p>
                </div>

                <div className="grid gap-6">
                  {suggestedTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                        selectedTeam === team.id
                          ? 'border-indigo-600 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedTeam(team.id)}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-slate-900">Team Option {team.id}</h3>
                            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${
                              team.matchScore >= 90 ? 'from-emerald-400 to-teal-500' :
                              team.matchScore >= 85 ? 'from-blue-400 to-cyan-500' :
                              'from-purple-400 to-pink-500'
                            }`}>
                              <span className="text-white">{team.matchScore}% match</span>
                            </div>
                          </div>
                          <p className="text-slate-600">{team.reason}</p>
                        </div>
                        {selectedTeam === team.id && (
                          <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                        )}
                      </div>

                      {/* Team Members */}
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        {team.members.map((member) => (
                          <div key={member.name} className="p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.avatar}`} />
                              <div>
                                <p className="text-slate-900">{member.name}</p>
                                {member.name !== 'You' && (
                                  <p className="text-emerald-600">{member.match}% compatible</p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.map((skill) => (
                                <span key={skill} className="px-2 py-1 bg-white text-slate-600 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Team Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Zap className="w-4 h-4 text-indigo-600" />
                          <span>Match: {team.matchScore}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span>Diversity: {team.diversity}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span>{team.availability} availability</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {selectedTeam && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
                  >
                    <h3 className="mb-2">Ready to create your team?</h3>
                    <p className="text-indigo-100 mb-4">
                      Invitations will be sent to all team members. {requireTeacherApproval && 'Your teacher will be notified for approval.'}
                    </p>
                    <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:shadow-lg transition-all">
                      Send Invitations
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 3 && (
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 1 && projectTitle && projectDescription) {
                    setStep(2);
                  } else if (step === 2 && selectedSkills.length >= 2) {
                    handleGenerateTeams();
                  }
                }}
                disabled={
                  (step === 1 && (!projectTitle || !projectDescription)) ||
                  (step === 2 && selectedSkills.length < 2)
                }
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
