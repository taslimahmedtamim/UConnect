"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [loginMode, setLoginMode] = useState<'normal' | 'admin'>('normal');

  const handleLogin = async (mode: 'normal' | 'admin') => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to login");
      }

      if (mode === 'admin' && data.user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      
      if (mode === 'admin') {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(loginMode);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[20%] h-[20%] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="max-w-md w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-slate-800/50 z-10 transition-all duration-500 hover:shadow-blue-500/10 hover:border-blue-500/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white mb-6 shadow-lg shadow-indigo-500/30">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-xl text-center font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200/80 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white sm:text-sm transition-all"
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  name="password"
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200/80 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 px-1">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            onClick={() => setLoginMode('normal')}
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/25 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 mt-2"
          >
            {loading && loginMode === 'normal' ? "Signing in..." : "Sign in to Dashboard"}
            {!(loading && loginMode === 'normal') && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="relative mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/70 dark:bg-slate-900/70 text-slate-500">Or continue as</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoginMode('admin');
              handleLogin('admin');
            }}
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-300 hover:-translate-y-0.5"
          >
            {loading && loginMode === 'admin' ? (
              "Authenticating..."
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300 transition-colors" />
                Sign in as Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
