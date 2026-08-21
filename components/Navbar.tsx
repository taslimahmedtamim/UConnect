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

  const isAdminRoute = pathname.startsWith("/admin");
  const hideSidebarRoutes = ["/", "/login", "/register"];
  const isPublicProfile = pathname.startsWith("/u/");
  const showSidebar = !hideSidebarRoutes.includes(pathname) && !isPublicProfile;

  if (isAdminRoute) {
    return null;
  }

  return (
    <nav className={`fixed top-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 transition-all ${showSidebar ? 'left-0 md:hidden' : 'left-0'}`}>
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

          {!showSidebar && (
            <div className="flex items-center gap-4 ml-2">
              <Link 
                href="/login" 
                className={`text-sm font-semibold transition-all duration-300 ${pathname === '/login' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:-translate-y-0.5'}`}
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative">Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
