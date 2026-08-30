"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: defaultEmail,
    otp: "",
    newPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="max-w-md w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-slate-800/50 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Password Reset Successful!</h2>
          <p className="text-slate-500 dark:text-slate-400">Your password has been securely updated.</p>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 animate-pulse">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-slate-800/50 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white mb-6 shadow-lg shadow-indigo-500/30">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create New Password</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
            Enter the 6-digit OTP sent to your email and choose a new password.
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
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">OTP Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.otp}
                onChange={e => setFormData({...formData, otp: e.target.value.replace(/[^0-9]/g, '')})}
                className="block w-full px-4 py-3 text-center tracking-[0.5em] text-lg font-bold border border-slate-200/80 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all"
                placeholder="000000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={e => setFormData({...formData, newPassword: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200/80 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 ml-1">Must include uppercase, number, and special character.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || formData.otp.length !== 6 || !formData.newPassword}
            className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/25 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5"
          >
            {loading ? "Resetting..." : "Reset Password"}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
