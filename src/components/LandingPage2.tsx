import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Users, Briefcase, TrendingUp, Github, Mail, ArrowRight, CheckCircle, Star, Flame, Zap, Moon, Sun, Globe } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import GlassCard from './GlassCard';

interface LandingPageProps {
  onLogin: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function LandingPage({ onLogin, darkMode, onToggleDarkMode }: LandingPageProps) {
  const [studentCount, setStudentCount] = useState(12547);
  const [liveActivities, setLiveActivities] = useState([
    { user: 'Rafid', action: 'joined', project: 'Smart Traffic System', college: 'BUET', time: '2s ago' },
    { user: 'Nusrat', action: 'completed', project: 'Green Campus Initiative', college: 'DU', time: '5s ago' },
    { user: 'Tanvir', action: 'placed at', project: 'Google Singapore', college: 'NSU', time: '12s ago' },
  ]);

  // Animate student counter
  useEffect(() => {
    const interval = setInterval(() => {
      setStudentCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rotate live activities
  useEffect(() => {
    const activities = [
      { user: 'Rafid', action: 'joined', project: 'Smart Traffic System', college: 'BUET', time: '2s ago' },
      { user: 'Nusrat', action: 'completed', project: 'Green Campus Initiative', college: 'DU', time: '5s ago' },
      { user: 'Tanvir', action: 'placed at', project: 'Google Singapore', college: 'NSU', time: '12s ago' },
      { user: 'Fahim', action: 'earned', project: '100-Day Streak Badge', college: 'BRAC University', time: '18s ago' },
      { user: 'Sadia', action: 'joined', project: 'AI Mental Health Assistant', college: 'IUB', time: '25s ago' },
      { user: 'Anika', action: 'placed at', project: 'Microsoft Dublin', college: 'UIU', time: '30s ago' },
    ];

    const interval = setInterval(() => {
      const newActivity = activities[Math.floor(Math.random() * activities.length)];
      setLiveActivities(prev => [{ ...newActivity, time: 'just now' }, ...prev.slice(0, 2)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'} transition-colors duration-300 relative overflow-hidden`}>
      <AnimatedBackground darkMode={darkMode} />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full backdrop-blur-2xl ${darkMode ? 'bg-slate-900/80' : 'bg-white/80'} border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'} z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-md"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <span className={`font-black text-xl ${darkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
                UConnect
              </span>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <button className={`px-6 py-2 ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
              Features
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleDarkMode}
              className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'} flex items-center justify-center transition-colors`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button 
              onClick={onLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 ${darkMode ? 'text-slate-300 hover:text-white border-slate-700' : 'text-slate-700 hover:text-slate-900 border-slate-300'} border rounded-xl transition-colors`}
            >
              Login
            </motion.button>
            <motion.button 
              onClick={onLogin}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Sign Up</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Live Counter */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <GlassCard className="inline-block px-8 py-4" glowColor="#6366F1">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                />
                <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'} flex items-center gap-2`}>
                  <Users className="w-5 h-5 text-indigo-500" />
                  <motion.span
                    key={studentCount}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  >
                    {studentCount.toLocaleString()}
                  </motion.span>
                  students from <span className="font-black text-indigo-600">50+</span> Bangladeshi universities • Going Global <Globe className="w-4 h-4 inline text-indigo-500" />
                </span>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-indigo-500/30 mb-8"
              >
                <span className="flex items-center gap-2 font-black text-indigo-600 dark:text-indigo-400">
                  <Zap className="w-5 h-5" />
                  AI-Native Collaboration Platform
                </span>
              </motion.div>
              
              <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} mb-8 leading-tight`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900, letterSpacing: '-0.03em', fontSize: '3.5rem' }}>
                Turn your academic projects into{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    verified career assets
                  </span>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-xl -z-10"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>
              </h1>
              
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-xl mb-10 max-w-xl leading-relaxed`}>
                Connect with teammates, build exceptional projects, and showcase your skills to top recruiters. 
                Let AI help you find the perfect collaborators and create opportunities that matter.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <motion.button 
                  onClick={onLogin}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl transition-all flex items-center gap-3 relative overflow-hidden font-black"
                  style={{ boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' }}
                >
                  <Mail className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Sign in with University Email</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                <motion.button 
                  onClick={onLogin}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-10 py-5 ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'} rounded-2xl hover:shadow-2xl transition-all flex items-center gap-3 font-black`}
                >
                  <Github className="w-6 h-6" />
                  Sign in with GitHub
                </motion.button>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[
                    'from-pink-400 to-rose-400',
                    'from-blue-400 to-cyan-400',
                    'from-purple-400 to-indigo-400',
                    'from-emerald-400 to-teal-400',
                    'from-amber-400 to-orange-400'
                  ].map((gradient, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} border-4 ${darkMode ? 'border-slate-900' : 'border-white'} cursor-pointer`}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className={darkMode ? 'text-slate-400 font-black' : 'text-slate-600 font-black'}>
                    Trusted by <span className="text-indigo-600">50,000+</span> students
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 3D Rotating Skill Graph Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1 }}
              className="relative perspective-1000"
            >
              <GlassCard className="p-12 aspect-square flex items-center justify-center" glowColor="#8B5CF6">
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Center orb */}
                  <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>

                  {/* Orbiting skill nodes */}
                  {[
                    { name: 'Python', angle: 0, radius: 120, gradient: 'from-blue-400 to-cyan-400' },
                    { name: 'React', angle: 60, radius: 140, gradient: 'from-cyan-400 to-teal-400' },
                    { name: 'ML', angle: 120, radius: 130, gradient: 'from-purple-400 to-pink-400' },
                    { name: 'Design', angle: 180, radius: 125, gradient: 'from-pink-400 to-rose-400' },
                    { name: 'Node.js', angle: 240, radius: 135, gradient: 'from-emerald-400 to-green-400' },
                    { name: 'Cloud', angle: 300, radius: 120, gradient: 'from-amber-400 to-orange-400' },
                  ].map((skill, i) => {
                    const x = Math.cos((skill.angle * Math.PI) / 180) * skill.radius;
                    const y = Math.sin((skill.angle * Math.PI) / 180) * skill.radius;
                    return (
                      <motion.div
                        key={skill.name}
                        className={`absolute top-1/2 left-1/2 w-20 h-20 rounded-full bg-gradient-to-br ${skill.gradient} shadow-lg flex items-center justify-center font-black text-white`}
                        style={{
                          transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${Math.sin(i) * 50}px)`,
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotateZ: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      >
                        {skill.name}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="py-12 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-center ${darkMode ? 'text-white' : 'text-slate-900'} mb-8 font-black flex items-center justify-center gap-2`}>
            <Flame className="w-6 h-6 text-orange-500" /> Live Activity
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {liveActivities.map((activity, i) => (
                <motion.div
                  key={`${activity.user}-${activity.time}`}
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <GlassCard className="p-4" glowColor="#10B981">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                        ['from-pink-400 to-rose-400', 'from-blue-400 to-cyan-400', 'from-purple-400 to-indigo-400'][i % 3]
                      } flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black truncate`}>
                          {activity.user}
                        </p>
                        <p className={darkMode ? 'text-slate-400 text-sm' : 'text-slate-600 text-sm'}>
                          {activity.action} <span className="font-black text-indigo-600">"{activity.project}"</span>
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {activity.college} • {activity.time}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Rest of sections would continue with similar glass morphism styling... */}
    </div>
  );
}