import Link from "next/link";
import { 
  ArrowRight, 
  Layers, 
  Users, 
  CheckCircle2, 
  Brain, 
  Zap,
  Target,
  Briefcase,
  Terminal,
  Code2,
  FileText
} from "lucide-react";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020817] text-slate-50 selection:bg-blue-500/30 font-sans">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[80px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-emerald-600/5 rounded-full blur-[80px]" />
      </div>

      {/* Navbar overlay for scroll effect */}
      <div className="fixed top-0 inset-x-0 h-20 bg-gradient-to-b from-[#020817] to-transparent z-40 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 px-4 sm:px-6 z-10 min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-left space-y-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/50 border border-slate-800/80 backdrop-blur-md shadow-2xl">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </div>
              <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
                UConnect is Live
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[1.1] drop-shadow-2xl">
              Architect Your <br />
              <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
                Dream Career.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-light">
              The ultimate AI ecosystem for university students. 
              <span className="text-slate-200 font-medium"> Auto-generate projects, map your skills, and match with the perfect team instantly.</span>
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-blue-600 rounded-full overflow-hidden group hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link 
                href="/login" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-slate-300 bg-slate-900/40 border border-slate-700/50 rounded-full hover:bg-slate-800/80 hover:text-white backdrop-blur-sm transition-all"
              >
                Log In
              </Link>
            </div>
          </div>

          {/* Right Unique Visual - Floating Glassmorphic Composition */}
          <div className="relative hidden lg:block h-[600px] w-full perspective-[2000px]">
            {/* Center glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/30 blur-[100px] rounded-full" />
            
            {/* Card 1: SkillMap (Top Right) */}
            <div className="absolute top-12 right-0 w-64 p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 shadow-2xl backdrop-blur-xl transform rotate-12 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center"><Target className="w-5 h-5" /></div>
                <div><div className="text-sm font-bold text-white">Frontend Skill</div><div className="text-xs text-blue-400">Mastery Level 4</div></div>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="w-[80%] h-full bg-blue-500 rounded-full" /></div>
            </div>

            {/* Card 2: AI Match (Center Left) */}
            <div className="absolute top-1/3 -left-8 w-72 p-5 rounded-2xl bg-slate-900/70 border border-purple-500/30 shadow-[0_0_50px_-15px_rgba(168,85,247,0.4)] backdrop-blur-xl transform -rotate-6 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-purple-400">AI TEAM MATCH</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-[10px] font-bold">98% SYNERGY</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-rose-500 z-20" />
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500 z-10" />
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-blue-500 z-0" />
                </div>
                <span className="text-xs text-slate-400 font-medium ml-2">Hackathon Squad</span>
              </div>
            </div>

            {/* Card 3: AI Resume (Bottom Right) */}
            <div className="absolute bottom-16 right-10 w-60 p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 shadow-2xl backdrop-blur-xl transform rotate-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                <div className="text-sm font-bold text-white">AI ATS Resume</div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-800 rounded animate-pulse" />
                <div className="h-2 w-3/4 bg-slate-800 rounded animate-pulse" />
                <div className="h-2 w-1/2 bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The UConnect Journey Section */}
      <section className="py-32 px-4 sm:px-6 relative z-10 bg-slate-950/50 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              How UConnect Works
            </h2>
            <p className="text-lg text-slate-400">
              We took the chaos of career planning and turned it into a clear, four-step journey powered by Google Gemini AI.
            </p>
          </div>

          <div className="space-y-32">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/50 font-bold text-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">1</span>
                  Map Your Identity
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white">Visualize your skills with U-SkillMap</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Stop listing skills on a boring PDF. Our interactive radar charts evaluate your strengths across Frontend, Backend, DevOps, AI, Security, and System Design.
                </p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Identify knowledge gaps instantly</li>
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Get AI-generated learning roadmaps</li>
                </ul>
              </div>
              <div className="flex-1 w-full relative">
                {/* Visual Mockup for Step 1 */}
                <div className="relative w-full aspect-square max-w-md mx-auto rounded-full border border-slate-700 bg-slate-900/40 flex items-center justify-center p-8 backdrop-blur-sm shadow-[0_0_50px_-15px_rgba(37,99,235,0.3)]">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 rounded-full"></div>
                  {/* Pseudo Radar Chart */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500/20 fill-current drop-shadow-xl">
                    <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                    <polygon points="50,25 75,40 75,65 50,75 25,65 25,40" stroke="currentColor" strokeWidth="0.5" fill="none" />
                    <polygon points="50,40 60,45 60,55 50,60 40,55 40,45" stroke="currentColor" strokeWidth="0.5" fill="none" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="10" y1="30" x2="90" y2="70" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="10" y1="70" x2="90" y2="30" stroke="currentColor" strokeWidth="0.5" />
                    {/* The Data Polygon */}
                    <polygon points="50,15 85,35 60,65 50,85 20,60 30,35" fill="rgba(59, 130, 246, 0.4)" stroke="#3b82f6" strokeWidth="1.5" className="animate-pulse" />
                  </svg>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-300">Frontend</div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-300">Security</div>
                  <div className="absolute top-1/4 right-2 text-xs font-bold text-slate-300">Backend</div>
                  <div className="absolute top-1/4 left-2 text-xs font-bold text-slate-300">AI</div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 text-purple-400 border border-purple-800/50 font-bold text-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-xs">2</span>
                  Build Your Portfolio
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white">AI Project Generator</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Don't know what to build to impress recruiters? Tell our Gemini AI your current skills and target role, and it will generate complete, portfolio-ready project scopes.
                </p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-purple-500" /> Recommended tech stacks & features</li>
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-purple-500" /> Auto-tracked progress to completion</li>
                </ul>
              </div>
              <div className="flex-1 w-full">
                {/* Visual Mockup for Step 2 */}
                <div className="rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
                  <div className="flex items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                    <Terminal className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-xs text-slate-400 font-mono">Gemini AI Prompt</span>
                  </div>
                  <div className="p-4 space-y-4 font-mono text-sm">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-xs flex-shrink-0">You</div>
                      <div className="text-slate-300 bg-slate-800 p-3 rounded-r-xl rounded-bl-xl">Generate a React + Node.js project to practice WebSockets.</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-xs flex-shrink-0"><Brain className="w-4 h-4" /></div>
                      <div className="text-purple-200 bg-purple-900/20 border border-purple-800/50 p-3 rounded-r-xl rounded-bl-xl w-full">
                        <div className="font-bold text-white mb-2">Project: Live Collaborative Whiteboard</div>
                        <div className="text-xs text-slate-400 mb-2">Difficulty: Intermediate • Stack: React, Socket.io, Canvas API</div>
                        <div className="space-y-1 mt-3 pl-2 border-l-2 border-purple-500/30">
                          <div>[ ] Setup real-time drawing sync</div>
                          <div>[ ] Add user cursors & presence</div>
                          <div>[ ] Implement board clearing</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-900/30 text-rose-400 border border-rose-800/50 font-bold text-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs">3</span>
                  Assemble Your Squad
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white">Smart Team Matchmaking</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Building a startup or doing a hackathon? UConnect analyzes your U-SkillMap against other students to find the perfect synergistic match.
                </p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-rose-500" /> Explainable match percentages</li>
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-rose-500" /> Discover what skills your team is missing</li>
                </ul>
              </div>
              <div className="flex-1 w-full relative">
                {/* Visual Mockup for Step 3 */}
                <div className="relative h-64 w-full flex items-center justify-center">
                  
                  {/* Left User Card */}
                  <div className="absolute left-0 md:left-10 z-10 w-48 p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl transform -rotate-6 hover:rotate-0 hover:z-30 transition-transform">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">JD</div>
                      <div>
                        <div className="text-sm font-bold">John Doe</div>
                        <div className="text-xs text-blue-400">Frontend</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 text-[10px] bg-slate-700 rounded">React</span>
                      <span className="px-2 py-1 text-[10px] bg-slate-700 rounded">Tailwind</span>
                    </div>
                  </div>

                  {/* Right User Card */}
                  <div className="absolute right-0 md:right-10 z-10 w-48 p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl transform rotate-6 hover:rotate-0 hover:z-30 transition-transform">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold">AS</div>
                      <div>
                        <div className="text-sm font-bold">Alice S.</div>
                        <div className="text-xs text-emerald-400">Backend</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 text-[10px] bg-slate-700 rounded">Node.js</span>
                      <span className="px-2 py-1 text-[10px] bg-slate-700 rounded">MySQL</span>
                    </div>
                  </div>

                  {/* Center Match Badge */}
                  <div className="absolute z-20 w-24 h-24 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.6)] border-4 border-[#020817] animate-bounce">
                    <Users className="w-6 h-6 text-white mb-1" />
                    <span className="text-lg font-black text-white leading-none">95%</span>
                    <span className="text-[10px] text-rose-100 font-bold">Match</span>
                  </div>
                  
                  {/* Connecting Line */}
                  <div className="absolute w-full h-1 bg-gradient-to-r from-blue-500 via-rose-500 to-emerald-500 opacity-50 z-0"></div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 font-bold text-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs">4</span>
                  Land the Opportunity
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white">AI Resume ATS Review</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Before you apply for a job, test your resume against our built-in ATS simulator. See exactly how your skills map to the job description and what you need to improve.
                </p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Explainable match scoring</li>
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 1-Click missing skill addition</li>
                </ul>
              </div>
              <div className="flex-1 w-full">
                {/* Visual Mockup for Step 4 */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl relative">
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-4 border-emerald-500 border-l-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-400">82%</span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-1">Full Stack Developer Intern</h4>
                  <p className="text-sm text-slate-400 mb-6">TechCorp Inc. • Remote</p>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">Matched Skills (3)</div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-800 rounded-full text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> React</span>
                        <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-800 rounded-full text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> TypeScript</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-bold text-rose-400 mb-2 uppercase tracking-wider">Missing Skills (1)</div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-rose-900/30 text-rose-300 border border-rose-800 rounded-full text-xs flex items-center gap-1 hover:bg-rose-800/50 transition-colors group">
                          + Add to Learning Path: Docker
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 px-4 sm:px-6 relative z-10 border-y border-slate-800/50 bg-[#020817]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: "5,000+", label: "Skills Tracked", color: "text-blue-400" },
            { value: "94%", label: "Career Synergy", color: "text-purple-400" },
            { value: "100+", label: "AI Projects Built", color: "text-emerald-400" },
            { value: "100%", label: "Free for Students", color: "text-amber-400" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className={`text-4xl sm:text-5xl font-black ${stat.color} drop-shadow-md`}>{stat.value}</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Team Section */}
      <div className="relative z-10 bg-[#020817]">
        <TeamSection />
      </div>

      {/* Final CTA */}
      <section className="py-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/20 p-10 sm:p-20 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
            
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                Ready to Architect Your Future?
              </h2>
              <p className="text-lg text-blue-200/80 max-w-2xl mx-auto font-light">
                Join the fastest-growing network of ambitious university students and developers building their careers with AI.
              </p>
              <div className="pt-4 flex justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-base rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
                >
                  Create Your Free Profile <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
