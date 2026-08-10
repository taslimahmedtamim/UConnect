"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, [pathname]); // Re-check on route change

  // If we are in an app route (where Sidebar handles navigation and logo), we might want to hide the navbar entirely or keep it for mobile.
  // For now, we'll just hide the auth buttons if logged in.

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <Zap className="w-6 h-6 text-blue-600" fill="currentColor" />
          <span>UConnect<span className="text-blue-600">.</span></span>
        </Link>
        
        {!isLoggedIn && (
          <div className="flex items-center gap-6">
            <Link 
              href="/login" 
              className={`text-sm font-medium transition-colors ${pathname === '/login' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
            >
              Log in
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-medium px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
