"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Briefcase, 
  UserCircle, 
  FileText, 
  Layers,
  MonitorPlay,
  Trophy,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  Zap
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<{fullName: string, role: string} | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const navGroups = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Projects", href: "/projects", icon: FolderOpen },
        { label: "Teams", href: "/teams", icon: Users },
        { label: "Opportunities", href: "/opportunities", icon: Briefcase },
      ]
    },
    {
      title: "Career Tools",
      items: [
        { label: "Profile", href: "/profile", icon: UserCircle },
        { label: "U-Resume", href: "/resume", icon: FileText },
        { label: "U-SkillMap", href: "/skillmap", icon: Layers },
      ]
    },
    {
      title: "Community",
      items: [
        { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { label: "Mentors", href: "/mentors", icon: GraduationCap },
      ]
    },
    {
      title: "Support",
      items: [
        { label: "Messages", href: "/messages", icon: MessageSquare },
        { label: "Help Board", href: "/help", icon: HelpCircle },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex z-[60]">
      {/* Top Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold text-slate-900 dark:text-white">
          <Zap className="w-8 h-8 text-blue-600" fill="currentColor" />
          <span className="font-extrabold tracking-tight">UConnect<span className="text-blue-600">.</span></span>
        </Link>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto no-scrollbar mt-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`${isActive ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'} py-0.5 px-2 rounded-full text-[10px] font-bold`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-blue-600/20">
            {user?.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
              {user?.fullName || "User"}
            </span>
            <span className="text-xs text-slate-500 capitalize">{user?.role || "Student"}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </aside>
  );
}
