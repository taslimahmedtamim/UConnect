"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, [pathname]);

  const hideSidebarRoutes = ["/", "/login", "/register"];
  const isPublicProfile = pathname.startsWith("/u/");
  const showSidebar = !hideSidebarRoutes.includes(pathname) && !isPublicProfile;

  return (
    <nav className={`fixed top-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 transition-all ${showSidebar ? 'left-0 md:left-64' : 'left-0'}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2.5 text-xl font-bold text-slate-900 dark:text-white ${showSidebar ? 'md:hidden' : ''}`}>
          <Zap className="w-8 h-8 text-blue-600" fill="currentColor" />
          <span className="font-extrabold tracking-tight">UConnect<span className="text-blue-600">.</span></span>
        </Link>
        
        <div className={`flex items-center gap-4 ${showSidebar ? 'ml-auto' : ''}`}>
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </nav>
  );
}
