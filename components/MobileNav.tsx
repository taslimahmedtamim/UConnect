"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Briefcase,
  UserCircle,
  MessageSquare,
  Menu,
  X,
  FileText,
  Layers,
  Trophy,
  GraduationCap,
  HelpCircle,
  LogOut,
  Zap
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (e) {}
    }
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const userRole = (user?.role || "student").toLowerCase();

  // Don't show on landing, login, register, or admin pages
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderOpen },
    { label: "Teams", href: "/teams", icon: Users },
    { label: "Opportunities", href: "/opportunities", icon: Briefcase },
    { label: "Profile", href: "/profile", icon: UserCircle },
    { label: "U-Resume", href: "/resume", icon: FileText },
    { label: "U-SkillMap", href: "/skillmap", icon: Layers },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Mentors", href: "/mentors", icon: GraduationCap },
    { label: "Messages", href: "/messages", icon: MessageSquare },
    { label: "Help Board", href: "/help", icon: HelpCircle },
  ];

  // Bottom tab bar items (most important 5)
  const bottomTabs = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderOpen },
    { label: "Jobs", href: "/opportunities", icon: Briefcase },
    { label: "Messages", href: "/messages", icon: MessageSquare },
    { label: "More", href: "#menu", icon: Menu, isMenuToggle: true },
  ];

  return (
    <>
      {/* Bottom Tab Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-[70] md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = !tab.isMenuToggle && (pathname === tab.href || pathname.startsWith(tab.href + '/'));

            if (tab.isMenuToggle) {
              return (
                <button
                  key="menu-toggle"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                    isOpen
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  <span className="text-[10px] font-semibold">{isOpen ? "Close" : "More"}</span>
                </button>
              );
            }

            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Full Screen Slide-Up Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[65] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute bottom-16 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
            {/* User Info */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                {user?.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{user?.fullName || "User"}</div>
                <div className="text-xs text-slate-500 capitalize">{user?.role || "Student"}</div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-4 grid grid-cols-3 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-semibold text-center leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={async () => {
                  try { await fetch("/api/auth/logout", { method: "POST" }); } catch (e) {}
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content being hidden behind the bottom bar */}
      <div className="h-16 md:hidden" />
    </>
  );
}
