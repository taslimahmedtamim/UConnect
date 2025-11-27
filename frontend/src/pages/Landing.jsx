import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { ArrowRight, Users, Briefcase, Sparkles, FileText, Map } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-[#0c141f] text-white relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f1520]/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-strong to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span>UConnect</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white">How it works</a>
            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 text-white">
            Turn academic work into career assets
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            An AI-driven university platform that automates team formation, builds verified portfolios, 
            generates polished resumes, and matches jobs and internships.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register">
              <Button size="lg">Join the waitlist</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">View demo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Users, title: 'AI Team Formation', desc: 'Form balanced teams based on skills, interests, and availability' },
            { icon: FileText, title: 'U-Resume', desc: 'One-click resume generation with impact-focused bullet rewrites' },
            { icon: Briefcase, title: 'Job Matching', desc: 'Aggregated feeds ranked by match %, skill gaps, and location' },
            { icon: Sparkles, title: 'Verified Portfolios', desc: 'Auto-build a portfolio backed by evidence and mentor reviews' },
            { icon: Map, title: 'Career Roadmaps', desc: 'Personalized paths with milestones and mentor suggestions' },
            { icon: Sparkles, title: 'AI Mentor', desc: 'Campus-aware chatbot for fast answers about courses and processes' },
          ].map((feature, i) => (
            <div key={i} className="bg-[#0f1520] border border-white/10 rounded-lg p-6 hover:border-white/20 hover:shadow-md transition-all duration-200">
              <feature.icon className="w-8 h-8 text-brand mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
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


