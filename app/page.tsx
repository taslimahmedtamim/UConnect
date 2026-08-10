import Link from "next/link";
import { ArrowRight, Brain, Briefcase, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          The AI-Driven <span className="text-blue-600 dark:text-blue-500">Ecosystem</span> <br className="hidden md:block" /> for Your Career
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10">
          UConnect bridges the gap between students, educators, and recruiters. Build teams, generate AI resumes, and find the perfect internships using intelligent matchmaking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-750 transition-colors">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">AI Matchmaking</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Gemini AI intelligently pairs you with the perfect teams and internships based on your unique skills and bio.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Team Collaboration</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Teachers and students can build highly effective teams. Check synergy scores and chat in real-time.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Smart Resume Builder</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Automatically generate a clean, professional resume highlighting your UConnect team projects and skills.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
