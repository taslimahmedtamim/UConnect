import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Users, 
  GraduationCap, 
  Trophy, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  Brain, 
  TrendingUp, 
  Zap 
} from "lucide-react";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 overflow-hidden">
        {/* Glowing Background Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
          {/* Top Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 fill-blue-500 text-blue-500" />
            <span>UConnect 2.0 • AI-Powered University Career & Team Ecosystem</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Bridge the Gap Between <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Skills, Teams & Mentors
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            UConnect equips university students and developers with interactive **U-SkillMap** tracking, **Gemini AI Roadmaps**, **Peer & Industry Mentorship**, **Gamified Leaderboards**, and **Smart AI Resumes**.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/skillmap" 
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-blue-600" /> Explore U-SkillMap
            </Link>
          </div>

          {/* Logo Showcase Mockup */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="p-2 sm:p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs text-slate-400 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="font-mono text-[11px] text-slate-400 bg-slate-800/60 px-3 py-0.5 rounded-md">
                  uconnect.app/dashboard
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-400">AI Powered</span>
                </div>
              </div>

              {/* Feature Grid Preview inside Hero Frame */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2 text-left">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-1">
                    <Layers className="w-4 h-4" /> U-SkillMap
                  </div>
                  <div className="text-xs text-white font-extrabold">Radar & Matrix</div>
                  <div className="text-[10px] text-slate-400 mt-1">6 Technical Domains</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs mb-1">
                    <GraduationCap className="w-4 h-4" /> Mentorship
                  </div>
                  <div className="text-xs text-white font-extrabold">1-on-1 Sessions</div>
                  <div className="text-[10px] text-slate-400 mt-1">AI Matchmaker</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                    <Trophy className="w-4 h-4" /> Leaderboard
                  </div>
                  <div className="text-xs text-white font-extrabold">Hall of Fame</div>
                  <div className="text-[10px] text-slate-400 mt-1">XP Ranks & Badges</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                    <HelpCircle className="w-4 h-4" /> Help Board
                  </div>
                  <div className="text-xs text-white font-extrabold">AI Debugger</div>
                  <div className="text-[10px] text-slate-400 mt-1">Instant Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid Section */}
      <section className="py-20 px-4 sm:px-6 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Everything You Need to Scale Your Career
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Integrated technical skill mapping, peer endorsements, automated resume building, and direct mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">U-SkillMap Suite</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Visualize skill strengths across Frontend, Backend, DevOps, AI, Security, and System Design with SVG spider charts and Gemini AI learning roadmaps.
              </p>
              <Link href="/skillmap" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Explore SkillMap <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Mentorship Hub</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect 1-on-1 with verified industry leaders and senior peers. Get direct code reviews, career guidance, and mock interview prep.
              </p>
              <Link href="/mentors" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400">
                Find Mentors <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Leaderboard & XP</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Earn XP points through skill ratings, peer endorsements, and project showcases. Rise up the Hall of Fame podium and unlock Legendary tier badges.
              </p>
              <Link href="/leaderboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400">
                View Standings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Counter Strip */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-blue-400">5,000+</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Skills Tracked</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-purple-400">94%</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Career Match Synergy</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400">1,200+</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Mentorship Sessions</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">100%</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Free for Students</div>
          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <TeamSection />

      {/* Call to Action Footer Card */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Ready to Kickstart Your Career?</h2>
          <p className="text-sm sm:text-base text-blue-200 max-w-xl mx-auto">
            Join thousands of university students, developers, and mentors building the future together on UConnect.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all"
            >
              Create Your UConnect Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
