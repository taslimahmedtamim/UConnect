import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Users, Briefcase, TrendingUp, Github, Mail, ArrowRight, CheckCircle, Star, Flame, Zap, Moon, Sun, Globe, Target, Award, MessageCircle, Shield, Rocket, BookOpen, Heart, Linkedin, Twitter, Instagram } from 'lucide-react';
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
    { user: 'Rafid', action: 'joined', project: 'Smart Traffic System', college: 'BUET', time: '2m ago' },
    { user: 'Nusrat', action: 'completed', project: 'Green Campus Initiative', college: 'DU', time: '4m ago' },
    { user: 'Tanvir', action: 'placed at', project: 'Google Singapore', college: 'NSU', time: '6m ago' },
    { user: 'Fahim', action: 'earned', project: '100-Day Streak Badge', college: 'BRAC University', time: '8m ago' },
    { user: 'Sadia', action: 'joined', project: 'AI Mental Health Assistant', college: 'IUB', time: '10m ago' },
    { user: 'Anika', action: 'placed at', project: 'Microsoft Dublin', college: 'UIU', time: '12m ago' },
    { user: 'Arif', action: 'completed', project: 'E-Commerce Platform', college: 'AIUB', time: '14m ago' },
    { user: 'Mim', action: 'joined', project: 'Healthcare App', college: 'EWU', time: '16m ago' },
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
      { user: 'Rafid', action: 'joined', project: 'Smart Traffic System', college: 'BUET' },
      { user: 'Nusrat', action: 'completed', project: 'Green Campus Initiative', college: 'DU' },
      { user: 'Tanvir', action: 'placed at', project: 'Google Singapore', college: 'NSU' },
      { user: 'Fahim', action: 'earned', project: '100-Day Streak Badge', college: 'BRAC University' },
      { user: 'Sadia', action: 'joined', project: 'AI Mental Health Assistant', college: 'IUB' },
      { user: 'Anika', action: 'placed at', project: 'Microsoft Dublin', college: 'UIU' },
      { user: 'Arif', action: 'completed', project: 'E-Commerce Platform', college: 'AIUB' },
      { user: 'Mim', action: 'joined', project: 'Healthcare App', college: 'EWU' },
      { user: 'Kabir', action: 'earned', project: 'Top Contributor Badge', college: 'CUET' },
      { user: 'Rima', action: 'placed at', project: 'Amazon Seattle', college: 'RUET' },
    ];

    const interval = setInterval(() => {
      const newActivity = activities[Math.floor(Math.random() * activities.length)];
      setLiveActivities(prev => [{ ...newActivity, time: 'just now' }, ...prev.slice(0, 7)]);
    }, 300000); // 5 minutes = 300000ms


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

            {/* CTA Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12" glowColor="#6366F1">
              <h2 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                Ready to transform your academic journey?
              </h2>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-lg mb-8 max-w-2xl mx-auto`}>
                Join thousands of students who are already building their future with UConnect.
              </p>
              <motion.button
                onClick={onLogin}
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(99, 102, 241, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg flex items-center gap-3 mx-auto"
              >
                Get Started for Free
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </GlassCard>
          </motion.div>
        </div>
      </section>


      {/* Live Activity Feed */}
      <section className="pt-32 pb-20 px-6 relative">
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

      {/* Features Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
              Everything you need to <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">succeed</span>
            </h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-lg max-w-2xl mx-auto`}>
              Powerful features designed to help you collaborate, learn, and land your dream opportunities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Smart Team Matching',
                description: 'AI-powered algorithm matches you with the perfect teammates based on skills, interests, and working style.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Target,
                title: 'Verified Projects',
                description: 'Get your projects verified by mentors and showcase them as credible portfolio pieces to recruiters.',
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                icon: Award,
                title: 'U-Score & Leaderboard',
                description: 'Build your reputation through project contributions, skill endorsements, and community engagement.',
                gradient: 'from-amber-500 to-orange-500',
              },
              {
                icon: MessageCircle,
                title: 'AI Mentor',
                description: '24/7 AI assistant to help with project ideas, career guidance, and campus information.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: Briefcase,
                title: 'Opportunity Hub',
                description: 'Curated internships and job opportunities matched to your skills and verified project portfolio.',
                gradient: 'from-indigo-500 to-purple-500',
              },
              {
                icon: Rocket,
                title: 'Skill Growth Tracking',
                description: 'Visual skill graphs, learning roadmaps, and streak tracking to keep you motivated.',
                gradient: 'from-rose-500 to-pink-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full hover:scale-105 transition-transform cursor-pointer" glowColor="#6366F1">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    {feature.title}
                  </h3>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
     <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-12" glowColor="#8B5CF6">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: '50,000+', label: 'Active Students', icon: Users },
                { value: '10,000+', label: 'Projects Completed', icon: CheckCircle },
                { value: '500+', label: 'Partner Companies', icon: Briefcase },
                { value: '95%', label: 'Placement Rate', icon: TrendingUp },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Developer Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
              Meet the <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Developers</span>
            </h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-lg`}>
              Built with passion for the student community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Md. Majharul Islam',
                initial: 'M',
                role: 'Full Stack Developer',
                github: 'https://github.com/MrMajharul',
                gradient: 'from-blue-500 via-cyan-500 to-teal-500',
                description: 'Passionate about creating scalable web applications and innovative solutions.',
                photo: 'https://avatars.githubusercontent.com/MrMajharul',
              },
              {
                name: 'Taslim Ahmed Tamim',
                initial: 'T',
                role: 'Full Stack Developer & UI/UX Designer',
                github: 'https://github.com/taslimahmedtamim',
                gradient: 'from-indigo-500 via-purple-500 to-pink-500',
                description: 'Building products that connect people and create opportunities.',
                photo: 'https://avatars.githubusercontent.com/taslimahmedtamim',
              },
              {
                name: 'Salman Kabir Sany',
                initial: 'S',
                role: 'Backend Developer',
                github: 'https://github.com/salmankabirsany',
                gradient: 'from-emerald-500 via-green-500 to-teal-500',
                description: 'Focused on building robust backend systems and APIs.',
                photo: 'https://avatars.githubusercontent.com/salmankabirsany',
              },
            ].map((developer, index) => (
              <motion.div
                key={developer.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <GlassCard className="p-6 text-center h-full" glowColor="#8B5CF6">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${developer.gradient} mx-auto mb-4 flex items-center justify-center shadow-2xl overflow-hidden`}
                  >
                    <img 
                      src={developer.photo} 
                      alt={developer.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <span className="text-3xl font-black text-white hidden">{developer.initial}</span>
                  </motion.div>
                  <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-1`}>
                    {developer.name}
                  </h3>
                  <p className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'} font-semibold text-sm mb-3`}>
                    {developer.role}
                  </p>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>
                    {developer.description}
                  </p>
                  <motion.a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} transition-colors font-medium`}
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </motion.a>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <section className="pt-32 pb-20 px-6 relative"></section>
      <footer className={`py-16 px-6 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'} border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className={`font-black text-xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  UConnect
                </span>
              </div>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                Connecting students, building futures. The AI-native collaboration platform for the next generation.
              </p>
              <div className="flex gap-3">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} flex items-center justify-center transition-colors`}
                >
                  <Twitter className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} flex items-center justify-center transition-colors`}
                >
                  <Instagram className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} flex items-center justify-center transition-colors`}
                >
                  <Linkedin className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} flex items-center justify-center transition-colors`}
                >
                  <Github className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                </motion.a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Platform</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Universities', 'Enterprise'].map((item) => (
                  <li key={item}>
                    <a href="#" className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Resources</h4>
              <ul className="space-y-3">
                {['Blog', 'Documentation', 'Help Center', 'Community'].map((item) => (
                  <li key={item}>
                    <a href="#" className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <a href="#" className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
            <p className={`${darkMode ? 'text-slate-500' : 'text-slate-500'} text-sm`}>
              © {new Date().getFullYear()} UConnect. All rights reserved.
            </p>
            <p className={`${darkMode ? 'text-slate-500' : 'text-slate-500'} text-sm flex items-center gap-1`}>
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Bangladesh
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}