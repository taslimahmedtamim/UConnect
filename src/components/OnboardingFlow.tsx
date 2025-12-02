import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, Briefcase, Mail, Check, Sparkles, Code, Palette, Database, Globe, Zap, Brain } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (role: 'student' | 'teacher' | 'recruiter') => void;
}

const skills = [
  { name: 'JavaScript', icon: Code, color: 'from-yellow-400 to-amber-500' },
  { name: 'Python', icon: Code, color: 'from-blue-400 to-cyan-500' },
  { name: 'React', icon: Zap, color: 'from-cyan-400 to-blue-500' },
  { name: 'Node.js', icon: Globe, color: 'from-green-400 to-emerald-500' },
  { name: 'UI/UX Design', icon: Palette, color: 'from-pink-400 to-rose-500' },
  { name: 'Machine Learning', icon: Brain, color: 'from-purple-400 to-indigo-500' },
  { name: 'Database', icon: Database, color: 'from-indigo-400 to-purple-500' },
  { name: 'Mobile Dev', icon: Zap, color: 'from-emerald-400 to-teal-500' },
  { name: 'Cloud Computing', icon: Globe, color: 'from-slate-400 to-gray-500' },
  { name: 'Data Science', icon: Brain, color: 'from-orange-400 to-red-500' },
  { name: 'DevOps', icon: Code, color: 'from-teal-400 to-cyan-500' },
  { name: 'Cybersecurity', icon: Zap, color: 'from-red-400 to-pink-500' },
];

const interests = [
  'Web Development', 'Mobile Apps', 'AI/ML', 'Data Science', 
  'Game Development', 'IoT', 'Blockchain', 'Cloud Computing',
  'Cybersecurity', 'AR/VR', 'Open Source', 'Competitive Programming'
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'student' | 'teacher' | 'recruiter' | null>(null);
  const [email, setEmail] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState('10-15');

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (role) {
        onComplete(role);
        navigate(role === 'recruiter' ? '/recruiter' : '/dashboard');
      }
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return role !== null;
      case 2:
        return email.length > 0 && email.includes('@');
      case 3:
        return selectedSkills.length >= 3;
      case 4:
        return selectedInterests.length >= 2;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s}
                className={`flex-1 h-2 rounded-full mx-1 transition-all ${
                  s <= step ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-white'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-slate-600">
            Step {step} of {totalSteps}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-10 shadow-xl"
            >
              <h2 className="text-slate-900 mb-2">Welcome to UConnect!</h2>
              <p className="text-slate-600 mb-8">Let's get started. What best describes you?</p>

              <div className="grid gap-4">
                {[
                  { value: 'student', icon: GraduationCap, label: 'Student', desc: 'I want to collaborate and build projects' },
                  { value: 'teacher', icon: User, label: 'Teacher', desc: 'I want to mentor and approve projects' },
                  { value: 'recruiter', icon: Briefcase, label: 'Recruiter', desc: 'I want to discover talented students' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRole(option.value as 'student' | 'teacher' | 'recruiter')}
                    className={`p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                      role === option.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      role === option.value
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <option.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 mb-1">{option.label}</p>
                      <p className="text-slate-500">{option.desc}</p>
                    </div>
                    {role === option.value && (
                      <Check className="w-6 h-6 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-10 shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-slate-900 mb-2">Verify your university email</h2>
              <p className="text-slate-600 mb-8">
                We'll send a verification link to confirm you're a student
              </p>

              <div className="mb-6">
                <label className="block text-slate-700 mb-2">University Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@university.edu"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-indigo-700">
                  💡 Use your official university email to unlock full access
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Skill Selection */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-10 shadow-xl"
            >
              <h2 className="text-slate-900 mb-2">Select your skills</h2>
              <p className="text-slate-600 mb-8">
                Choose at least 3 skills you're proficient in
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill.name);
                  return (
                    <button
                      key={skill.name}
                      onClick={() => toggleSkill(skill.name)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br ${skill.color}`}>
                        <skill.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-slate-900">{skill.name}</p>
                    </button>
                  );
                })}
              </div>

              <p className="text-slate-500">
                Selected: {selectedSkills.length} {selectedSkills.length === 1 ? 'skill' : 'skills'}
              </p>
            </motion.div>
          )}

          {/* Step 4: Interests & Availability */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-10 shadow-xl"
            >
              <h2 className="text-slate-900 mb-2">Interests & Availability</h2>
              <p className="text-slate-600 mb-8">
                Help us match you with the right projects
              </p>

              <div className="mb-8">
                <label className="block text-slate-700 mb-3">What are you interested in?</label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-full border transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-3">Weekly availability (hours)</label>
                <div className="grid grid-cols-4 gap-3">
                  {['5-10', '10-15', '15-20', '20+'].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setAvailability(hours)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        availability === hours
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {hours}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Welcome */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 shadow-xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white mb-4"
              >
                Welcome to UConnect! 🎉
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-indigo-100 mb-8 max-w-md mx-auto"
              >
                You're all set! Let's start building amazing projects and connecting with opportunities.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 mb-8"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-white/80">Skills</p>
                  <p className="text-white">{selectedSkills.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-white/80">Interests</p>
                  <p className="text-white">{selectedInterests.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-white/80">Hours/week</p>
                  <p className="text-white">{availability}</p>
                </div>
              </motion.div>

              {/* Confetti effect placeholder */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, x: Math.random() * 500, opacity: 1 }}
                    animate={{ 
                      y: 600, 
                      x: Math.random() * 500,
                      opacity: 0,
                      rotate: Math.random() * 360 
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                      repeat: Infinity
                    }}
                    className={`absolute w-2 h-2 rounded-full ${
                      ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400'][i % 4]
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === totalSteps ? 'Get Started' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
