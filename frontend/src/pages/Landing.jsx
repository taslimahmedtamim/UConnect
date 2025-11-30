import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { ArrowRight, Users, Briefcase, Sparkles, FileText, Map, Award, TrendingUp, Globe, CheckCircle, Github, Linkedin } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold">
            <div className="w-10 h-10 bg-gradient-primary rounded-large flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">UConnect</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">How it works</a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Testimonials</a>
            <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Login</Link>
            <Link to="/register">
              <Button className="shadow-soft hover:shadow-card">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="primary" size="lg" className="mb-6 animate-fade-in">
              🚀 Now supporting 50+ universities across India & Bangladesh
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent leading-tight animate-fade-in">
              Turn your academic projects into verified career assets
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              An AI-powered ecosystem that connects students, teachers, and recruiters. 
              Build balanced teams, generate professional resumes, and discover opportunities — all in one place.
            </p>
            <div className="flex gap-4 justify-center flex-wrap mb-12 animate-slide-in">
              <Link to="/register">
                <Button size="lg" className="shadow-card hover:shadow-hover text-lg px-8 py-6">
                  Join Waitlist <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                  Sign in with Google
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>10,000+ Active Students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>50+ Partner Universities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>500+ Recruiters</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-hover p-8 border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-primary-100 via-purple-50 to-emerald-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-24 h-24 text-primary-500 mx-auto mb-4 animate-float" />
                  <p className="text-gray-600 font-medium">Platform Preview Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20 bg-white relative z-10">
        <div className="text-center mb-16">
          <Badge variant="purple" size="lg" className="mb-4">Features</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Everything you need to succeed</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From team formation to career opportunities, we've got you covered
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { 
              icon: Users, 
              title: 'AI Team Formation', 
              desc: 'Form balanced teams based on skills, interests, and availability. Our AI ensures diversity and complementary skill sets.',
              color: 'primary'
            },
            { 
              icon: FileText, 
              title: 'U-Resume Builder', 
              desc: 'One-click resume generation with AI-powered impact-focused bullet points. Export to PDF, DOCX, or LinkedIn.',
              color: 'purple'
            },
            { 
              icon: Briefcase, 
              title: 'Smart Job Matching', 
              desc: 'Discover internships and jobs ranked by match %, with skill gaps highlighted and location preferences.',
              color: 'emerald'
            },
            { 
              icon: Award, 
              title: 'Verified Portfolios', 
              desc: 'Auto-build a portfolio backed by evidence and mentor reviews. Showcase your verified projects to recruiters.',
              color: 'amber'
            },
            { 
              icon: Map, 
              title: 'Career Roadmaps', 
              desc: 'Personalized learning paths with milestones, mentor suggestions, and skill progression tracking.',
              color: 'primary'
            },
            { 
              icon: Sparkles, 
              title: 'AI Campus Mentor', 
              desc: 'Campus-aware chatbot for instant answers about courses, mess menu, events, and academic processes.',
              color: 'purple'
            },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group bg-white border-2 border-gray-100 rounded-large p-8 hover:border-primary-200 hover:shadow-hover transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-soft`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            'Create your profile → capture skills, projects, interests',
            'Let AI suggest a balanced team and mentor',
            'Build together in a realtime project space',
            'Generate your U-Resume from verified outcomes',
            'Get matched to internships and jobs — apply faster',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-strong to-accent rounded-lg flex items-center justify-center text-white font-bold">
                {i + 1}
              </div>
              <p className="text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center bg-[#0f1520] border border-white/10 rounded-lg p-12">
          <h2 className="text-3xl font-semibold mb-4 text-white">Be the first to try UConnect</h2>
          <p className="text-gray-300 mb-8">Join the waitlist — we'll email you when the beta is ready.</p>
          <Link to="/register">
            <Button size="lg" className="inline-flex items-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} UConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


