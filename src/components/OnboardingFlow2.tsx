import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, ChevronLeft, GraduationCap, Briefcase, Users, 
  Code, Palette, Brain, Database, Globe, Smartphone, Shield, Zap, 
  CheckCircle, Trophy, Sparkles, Moon, Sun, Search, Plus, X
} from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import GlassCard from './GlassCard';
import Confetti from './Confetti';

interface OnboardingFlowProps {
  onComplete: (role: 'student' | 'teacher' | 'recruiter') => void;
  onBackToHome?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const skillOptions = [
  { id: 'python', label: 'Python', icon: Code, gradient: 'from-blue-400 to-cyan-500' },
  { id: 'javascript', label: 'JavaScript', icon: Code, gradient: 'from-yellow-400 to-amber-500' },
  { id: 'react', label: 'React', icon: Globe, gradient: 'from-cyan-400 to-blue-500' },
  { id: 'nodejs', label: 'Node.js', icon: Database, gradient: 'from-emerald-400 to-green-500' },
  { id: 'ml', label: 'Machine Learning', icon: Brain, gradient: 'from-purple-400 to-pink-500' },
  { id: 'ui', label: 'UI/UX Design', icon: Palette, gradient: 'from-pink-400 to-rose-500' },
  { id: 'mobile', label: 'Mobile Dev', icon: Smartphone, gradient: 'from-indigo-400 to-purple-500' },
  { id: 'cloud', label: 'Cloud/DevOps', icon: Shield, gradient: 'from-slate-400 to-slate-600' },
  { id: 'java', label: 'Java', icon: Code, gradient: 'from-red-400 to-orange-500' },
  { id: 'csharp', label: 'C#', icon: Code, gradient: 'from-violet-400 to-purple-500' },
  { id: 'cpp', label: 'C++', icon: Code, gradient: 'from-blue-500 to-indigo-600' },
  { id: 'typescript', label: 'TypeScript', icon: Code, gradient: 'from-blue-400 to-blue-600' },
  { id: 'sql', label: 'SQL/Database', icon: Database, gradient: 'from-orange-400 to-red-500' },
  { id: 'php', label: 'PHP', icon: Code, gradient: 'from-indigo-400 to-blue-500' },
  { id: 'swift', label: 'Swift', icon: Smartphone, gradient: 'from-orange-400 to-red-400' },
  { id: 'kotlin', label: 'Kotlin', icon: Smartphone, gradient: 'from-purple-400 to-indigo-500' },
  { id: 'flutter', label: 'Flutter', icon: Smartphone, gradient: 'from-cyan-400 to-blue-400' },
  { id: 'angular', label: 'Angular', icon: Globe, gradient: 'from-red-400 to-pink-500' },
  { id: 'vue', label: 'Vue.js', icon: Globe, gradient: 'from-emerald-400 to-teal-500' },
  { id: 'django', label: 'Django', icon: Globe, gradient: 'from-green-500 to-emerald-600' },
  { id: 'spring', label: 'Spring Boot', icon: Database, gradient: 'from-green-400 to-lime-500' },
  { id: 'aws', label: 'AWS', icon: Shield, gradient: 'from-orange-400 to-amber-500' },
  { id: 'docker', label: 'Docker', icon: Shield, gradient: 'from-blue-400 to-cyan-400' },
  { id: 'kubernetes', label: 'Kubernetes', icon: Shield, gradient: 'from-blue-500 to-indigo-500' },
  { id: 'git', label: 'Git/GitHub', icon: Code, gradient: 'from-gray-500 to-slate-600' },
  { id: 'figma', label: 'Figma', icon: Palette, gradient: 'from-purple-400 to-pink-400' },
  { id: 'photoshop', label: 'Photoshop', icon: Palette, gradient: 'from-blue-500 to-indigo-600' },
  { id: 'ai', label: 'AI/Deep Learning', icon: Brain, gradient: 'from-violet-400 to-purple-600' },
  { id: 'datascience', label: 'Data Science', icon: Brain, gradient: 'from-teal-400 to-cyan-500' },
  { id: 'blockchain', label: 'Blockchain', icon: Database, gradient: 'from-yellow-400 to-orange-500' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: Shield, gradient: 'from-red-500 to-rose-600' },
  { id: 'linux', label: 'Linux', icon: Code, gradient: 'from-yellow-500 to-amber-600' },
  { id: 'testing', label: 'Testing/QA', icon: CheckCircle, gradient: 'from-green-400 to-emerald-500' },
  { id: 'agile', label: 'Agile/Scrum', icon: Users, gradient: 'from-blue-400 to-indigo-400' },
  { id: 'communication', label: 'Communication', icon: Users, gradient: 'from-pink-400 to-rose-400' },
  { id: 'leadership', label: 'Leadership', icon: Trophy, gradient: 'from-amber-400 to-yellow-500' },
];

const interestOptions = [
  { id: 'web', label: 'Web Development', icon: Globe },
  { id: 'ai', label: 'AI & ML', icon: Brain },
  { id: 'mobile', label: 'Mobile Apps', icon: Smartphone },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'data', label: 'Data Science', icon: Database },
  { id: 'security', label: 'Cybersecurity', icon: Shield },
];

export default function OnboardingFlow({ onComplete, onBackToHome, darkMode, onToggleDarkMode }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'recruiter' | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [customSkills, setCustomSkills] = useState<Array<{ id: string; label: string }>>([]);
  const [profileData, setProfileData] = useState({
    name: '',
    college: '',
    department: '',
    year: '',
  });
  const [showProjection, setShowProjection] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Filter skills based on search
  const filteredSkills = useMemo(() => {
    if (!skillSearch.trim()) return skillOptions;
    return skillOptions.filter(skill => 
      skill.label.toLowerCase().includes(skillSearch.toLowerCase())
    );
  }, [skillSearch]);

  // Check if search term can be added as custom skill
  const canAddCustomSkill = useMemo(() => {
    if (!skillSearch.trim()) return false;
    const searchLower = skillSearch.toLowerCase().trim();
    const existsInOptions = skillOptions.some(s => s.label.toLowerCase() === searchLower);
    const existsInCustom = customSkills.some(s => s.label.toLowerCase() === searchLower);
    return !existsInOptions && !existsInCustom && skillSearch.trim().length >= 2;
  }, [skillSearch, customSkills]);

  const addCustomSkill = () => {
    if (canAddCustomSkill) {
      const newSkill = {
        id: `custom-${skillSearch.toLowerCase().replace(/\s+/g, '-')}`,
        label: skillSearch.trim()
      };
      setCustomSkills([...customSkills, newSkill]);
      setSelectedSkills([...selectedSkills, newSkill.id]);
      setSkillSearch('');
    }
  };

  const removeCustomSkill = (skillId: string) => {
    setCustomSkills(customSkills.filter(s => s.id !== skillId));
    setSelectedSkills(selectedSkills.filter(id => id !== skillId));
  };

  // Refs for cleanup of animation timeouts
  const projectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeouts on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (projectionTimeoutRef.current) clearTimeout(projectionTimeoutRef.current);
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
    };
  }, []);

  const handleNext = () => {
    if (step === 2 && selectedSkills.length >= 3) {
      setShowProjection(true);
      projectionTimeoutRef.current = setTimeout(() => {
        setShowProjection(false);
        setStep(step + 1);
      }, 3000);
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else if (step === totalSteps && selectedRole) {
      // Save profile data to localStorage before completing onboarding
      const userProfile = {
        name: profileData.name,
        title: `${profileData.department} • ${profileData.college} • Class of ${profileData.year}`,
        college: profileData.college,
        department: profileData.department,
        year: profileData.year,
        location: 'Bangladesh',
        bio: `Passionate student at ${profileData.college}. Skilled in ${selectedSkills.slice(0, 3).map(id => skillOptions.find(s => s.id === id)?.label || id).join(', ')}.`,
        skills: selectedSkills,
        interests: selectedInterests,
      };
      localStorage.setItem('uconnect_profile', JSON.stringify(userProfile));
      
      setShowConfetti(true);
      confettiTimeoutRef.current = setTimeout(() => {
        onComplete(selectedRole);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (step === 1 && onBackToHome) {
      onBackToHome();
    }
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId) ? prev.filter(id => id !== interestId) : [...prev, interestId]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedRole !== null;
      case 2: return selectedSkills.length >= 3;
      case 3: return selectedInterests.length >= 2;
      case 4: return profileData.name && profileData.college && profileData.department;
      case 5: return true;
      default: return false;
    }
  };

  const calculateUScore = () => {
    const baseScore = 500;
    const skillBonus = selectedSkills.length * 50;
    const interestBonus = selectedInterests.length * 30;
    const randomBonus = Math.floor(Math.random() * 200);
    return baseScore + skillBonus + interestBonus + randomBonus;
  };

  const uScore = calculateUScore();
  const percentile = Math.min(95, 70 + (selectedSkills.length * 5));

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} flex items-center justify-center p-6 relative overflow-hidden`}>
      <AnimatedBackground darkMode={darkMode} />
      
      {/* Dark Mode Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleDarkMode}
        className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-xl ${
          darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-600'
        } flex items-center justify-center shadow-xl backdrop-blur-xl border ${
          darkMode ? 'border-slate-700' : 'border-slate-200'
        }`}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Confetti */}
      <Confetti active={showConfetti} />

      {/* U-Score Projection Modal */}
      <AnimatePresence>
        {showProjection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <GlassCard className="p-12 text-center max-w-md" glowColor="#6366F1">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative inline-block mb-6"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                    <Zap className="w-16 h-16 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 blur-2xl"
                  />
                </motion.div>

                <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl mb-2`}>
                  Your U-Score Projection
                </h2>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
                >
                  {uScore}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} text-xl font-black`}
                >
                  Top {100 - percentile}% at {profileData.college || 'Your College'}
                </motion.p>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl w-full relative z-10">
        {/* Progress Ring */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={darkMode ? '#1e293b' : '#e2e8f0'}
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 351.68' }}
                    animate={{ strokeDasharray: `${(progress / 100) * 351.68} 351.68` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl`}>
                    {step}/{totalSteps}
                  </span>
                </div>
              </div>
            </div>
            <p className={`text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'} font-black`}>
              {['Choose Your Role', 'Select Skills', 'Pick Interests', 'Profile Details', 'Welcome Aboard'][step - 1]}
            </p>
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <GlassCard className="p-8">
              {/* Step 1: Role Selection */}
              {step === 1 && (
                <div>
                  <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-3xl mb-2`}>
                    Welcome to UConnect
                  </h2>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-8`}>
                    Select your role to get started
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { id: 'student', label: 'Student', icon: GraduationCap, gradient: 'from-indigo-500 to-purple-500', desc: 'Build projects & find teams' },
                      { id: 'teacher', label: 'Teacher', icon: Users, gradient: 'from-emerald-500 to-teal-500', desc: 'Mentor & verify projects' },
                      { id: 'recruiter', label: 'Recruiter', icon: Briefcase, gradient: 'from-amber-500 to-orange-500', desc: 'Discover top talent' },
                    ].map((role) => (
                      <motion.button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id as any)}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${
                          selectedRole === role.id
                            ? 'border-indigo-500 shadow-2xl'
                            : `border-transparent ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`
                        }`}
                      >
                        {selectedRole === role.id && (
                          <>
                            <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-10`} />
                            <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-indigo-600" />
                          </>
                        )}
                        <div className="relative">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mx-auto mb-4`}>
                            <role.icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl mb-2`}>
                            {role.label}
                          </h3>
                          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                            {role.desc}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Skills Selection */}
              {step === 2 && (
                <div>
                  <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-3xl mb-2`}>
                    What are your skills?
                  </h2>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                    Select at least 3 skills • {selectedSkills.length} selected
                  </p>

                  {/* Search Bar */}
                  <div className="relative mb-6">
                    <input
                      type="text"
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && canAddCustomSkill) {
                          addCustomSkill();
                        }
                      }}
                      placeholder="Search skills or type to add your own..."
                      className={`w-full px-4 pr-24 py-3 rounded-xl ${
                        darkMode ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-slate-100 text-slate-900 placeholder-slate-400'
                      } border-2 border-transparent focus:border-indigo-500 outline-none transition-colors`}
                    />
                    {canAddCustomSkill && (
                      <div className="absolute right-2 top-0 bottom-0 flex items-center">
                        <button
                          onClick={addCustomSkill}
                          className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1 hover:shadow-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Selected Custom Skills */}
                  {customSkills.length > 0 && (
                    <div className="mb-4">
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-2`}>Your custom skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {customSkills.map((skill) => (
                          <motion.div
                            key={skill.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span className="font-semibold text-sm">{skill.label}</span>
                            <button
                              onClick={() => removeCustomSkill(skill.id)}
                              className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Grid */}
                  <div className="grid md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-2">
                    {filteredSkills.map((skill) => (
                      <motion.button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedSkills.includes(skill.id)
                            ? `bg-gradient-to-br ${skill.gradient} border-transparent text-white shadow-lg`
                            : `border-transparent ${darkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-50 text-slate-700'}`
                        }`}
                      >
                        <skill.icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-black text-sm">{skill.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {filteredSkills.length === 0 && !canAddCustomSkill && (
                    <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <p>No skills found matching "{skillSearch}"</p>
                      <p className="text-sm mt-1">Type at least 2 characters to add as a custom skill</p>
                    </div>
                  )}

                  {filteredSkills.length === 0 && canAddCustomSkill && (
                    <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <p>No existing skill matches "{skillSearch}"</p>
                      <button
                        onClick={addCustomSkill}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Add "{skillSearch}" as a skill
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Interests */}
              {step === 3 && (
                <div>
                  <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-3xl mb-2`}>
                    What interests you?
                  </h2>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-8`}>
                    Select at least 2 areas • {selectedInterests.length} selected
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    {interestOptions.map((interest) => (
                      <motion.button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-6 rounded-2xl border-2 transition-all relative ${
                          selectedInterests.includes(interest.id)
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg'
                            : `border-transparent ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`
                        }`}
                      >
                        {selectedInterests.includes(interest.id) && (
                          <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-indigo-600" />
                        )}
                        <interest.icon className={`w-12 h-12 mx-auto mb-3 ${
                          selectedInterests.includes(interest.id) ? 'text-indigo-600' : darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`} />
                        <span className={`font-black ${
                          selectedInterests.includes(interest.id) ? 'text-indigo-600' : darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {interest.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Profile Details */}
              {step === 4 && (
                <div>
                  <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-3xl mb-2`}>
                    Complete your profile
                  </h2>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-8`}>
                    Just a few more details
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} font-black mb-2`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl ${
                          darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                        } border-2 border-transparent focus:border-indigo-500 outline-none transition-colors`}
                        placeholder="Enter Your Name"
                      />
                    </div>
                    <div>
                      <label className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} font-black mb-2`}>
                        College/University
                      </label>
                      <input
                        type="text"
                        value={profileData.college}
                        onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl ${
                          darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                        } border-2 border-transparent focus:border-indigo-500 outline-none transition-colors`}
                        placeholder="Enter Your College/University"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} font-black mb-2`}>
                          Department
                        </label>
                        <input
                          type="text"
                          value={profileData.department}
                          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl ${
                            darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                          } border-2 border-transparent focus:border-indigo-500 outline-none transition-colors`}
                          placeholder="CSE"
                        />
                      </div>
                      <div>
                        <label className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} font-black mb-2`}>
                          Year
                        </label>
                        <select
                          value={profileData.year}
                          onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl ${
                            darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                          } border-2 border-transparent focus:border-indigo-500 outline-none transition-colors`}
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Welcome */}
              {step === 5 && (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative inline-block mb-6"
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl">
                      <Trophy className="w-16 h-16 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 blur-2xl"
                    />
                  </motion.div>

                  <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl mb-4`}>
                    You've earned the Genesis '25 Badge!
                  </h2>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-xl mb-8 max-w-2xl mx-auto`}>
                    You're one of the founding members of UConnect. Your journey to building incredible projects starts now.
                  </p>

                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div>
                      <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {uScore}
                      </div>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} font-black`}>U-Score</p>
                    </div>
                    <div>
                      <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Top {100 - percentile}%
                      </div>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} font-black`}>Ranking</p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
                  </motion.div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <motion.button
            onClick={handleBack}
            disabled={step === 1 && !onBackToHome}
            whileHover={{ scale: (step === 1 && !onBackToHome) ? 1 : 1.05 }}
            whileTap={{ scale: (step === 1 && !onBackToHome) ? 1 : 0.95 }}
            className={`px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all ${
              step === 1 && !onBackToHome
                ? 'opacity-0 pointer-events-none'
                : darkMode
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-white text-slate-900 hover:bg-slate-100'
            } shadow-lg`}
          >
            <ChevronLeft className="w-5 h-5" />
            {step === 1 ? 'Back to Home' : 'Back'}
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!canProceed()}
            whileHover={{ scale: canProceed() ? 1.05 : 1, boxShadow: canProceed() ? '0 0 30px rgba(99, 102, 241, 0.5)' : undefined }}
            whileTap={{ scale: canProceed() ? 0.95 : 1 }}
            className={`px-8 py-3 rounded-xl font-black flex items-center gap-2 transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg'
                : darkMode
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {step === totalSteps ? 'Get Started' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}