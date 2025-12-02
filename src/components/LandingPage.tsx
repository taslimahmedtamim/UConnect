import { motion } from 'motion/react';
import { Sparkles, Users, Briefcase, TrendingUp, Github, Mail, ArrowRight, CheckCircle, Star } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-slate-900">UConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors">
              About
            </button>
            <button className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </button>
            <button 
              onClick={onLogin}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 mb-6">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Academic Collaboration
                </span>
              </div>
              
              <h1 className="text-slate-900 mb-6">
                Turn your academic projects into <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">verified career assets</span>
              </h1>
              
              <p className="text-slate-600 mb-8 max-w-xl">
                Connect with teammates, build exceptional projects, and showcase your skills to top recruiters. 
                Let AI help you find the perfect collaborators and create opportunities that matter.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button 
                  onClick={onLogin}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Sign in with University Email
                </button>
                <button 
                  onClick={onLogin}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  Sign in with GitHub
                </button>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600">Trusted by 50,000+ students</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-emerald-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <Users className="w-8 h-8 text-indigo-600 mb-3" />
                    <p className="text-slate-900 mb-1">AI Team Formation</p>
                    <p className="text-slate-500">Perfect match</p>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
                    <p className="text-slate-900 mb-1">Skill Growth</p>
                    <p className="text-slate-500">Track progress</p>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <Briefcase className="w-8 h-8 text-purple-600 mb-3" />
                    <p className="text-slate-900 mb-1">Job Matches</p>
                    <p className="text-slate-500">92% accuracy</p>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <Sparkles className="w-8 h-8 text-amber-600 mb-3" />
                    <p className="text-slate-900 mb-1">AI Resume</p>
                    <p className="text-slate-500">Auto-generated</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-600 mb-8">Trusted by students from</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'IIT Bombay', 'IIIT Hyderabad', 'VIT Vellore'].map((uni) => (
              <div key={uni} className="text-slate-400 px-6 py-3 bg-white rounded-xl">
                {uni}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From finding teammates to landing your dream job, UConnect has you covered
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'AI-Powered Team Formation',
                description: 'Let our AI find the perfect teammates based on skills, availability, and project needs',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                icon: TrendingUp,
                title: 'Visual Skill Graph',
                description: 'Track your growth with an interactive skill map that shows connections and endorsements',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Sparkles,
                title: 'Smart Resume Builder',
                description: 'Auto-generate professional resumes from your verified projects with AI-powered suggestions',
                color: 'from-emerald-500 to-teal-500'
              },
              {
                icon: Briefcase,
                title: 'Opportunity Matching',
                description: 'Get matched with internships and jobs that align with your skills and projects',
                color: 'from-amber-500 to-orange-500'
              },
              {
                icon: CheckCircle,
                title: 'Verified Projects',
                description: 'Teacher-approved projects that recruiters can trust, building your credibility',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Sparkles,
                title: 'Campus AI Mentor',
                description: 'Get instant answers about campus life, deadlines, and academic guidance',
                color: 'from-rose-500 to-pink-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 mb-4">Loved by students everywhere</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'CS Student, IIT Delhi',
                content: 'Found my dream team for the final year project in minutes. The AI matching is incredible!',
                avatar: 'from-pink-400 to-rose-400'
              },
              {
                name: 'Arjun Patel',
                role: 'ECE Student, BITS Pilani',
                content: 'Landed an internship at Microsoft thanks to my verified project portfolio on UConnect.',
                avatar: 'from-blue-400 to-cyan-400'
              },
              {
                name: 'Sneha Reddy',
                role: 'IT Student, NIT Trichy',
                content: 'The AI resume builder saved me hours. Got interview calls from 3 companies in the first week!',
                avatar: 'from-purple-400 to-pink-400'
              }
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatar}`} />
                  <div>
                    <p className="text-slate-900">{testimonial.name}</p>
                    <p className="text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12">
            <h2 className="text-white mb-4">Ready to transform your academic journey?</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students already building their future on UConnect
            </p>
            <button 
              onClick={onLogin}
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span>UConnect</span>
              </div>
              <p className="text-slate-400">Empowering students to build their future</p>
            </div>
            <div>
              <h4 className="mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Universities</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            © 2025 UConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
