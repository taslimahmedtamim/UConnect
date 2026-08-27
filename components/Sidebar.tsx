"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useUser } from "./UserProvider";
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
  Zap,
  Bell,
  AlarmClock,
  Rss
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();

  const userRole = (user?.role || "student").toLowerCase();

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (e) {}
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  let navGroups = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Profile", href: "/profile", icon: UserCircle },
        { label: "U-SkillMap", href: "/skillmap", icon: Layers },
        { label: "U-Resume", href: "/resume", icon: FileText },
      ]
    },
    {
      title: "Work & Collaboration",
      items: [
        { label: "Projects", href: "/projects", icon: FolderOpen },
        { label: "Teams", href: "/teams", icon: Users },
        { label: "Opportunities", href: "/opportunities", icon: Briefcase },
      ]
    },
    {
      title: "Community",
      items: [
        { label: "Community Feed", href: "/feed", icon: Rss },
        { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { label: "Mentors", href: "/mentors", icon: GraduationCap },
      ]
    },
    {
      title: "Support",
      items: [
        { label: "Help Board", href: "/help", icon: HelpCircle },
      ]
    }
  ];

  if (userRole === 'mentor') {
    navGroups = [
      {
        title: "Mentorship",
        items: [
          { label: "My Sessions", href: "/mentors", icon: GraduationCap },
        ]
      },
      ...navGroups.map(group => {
        if (group.title === 'Community') {
          return {
            ...group,
            items: group.items.filter(item => item.label !== 'Mentors')
          };
        }
        return group;
      })
    ];
  } else if (userRole === 'recruiter') {
    navGroups = [
      {
        title: "Talent Scouting",
        items: [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Opportunities", href: "/opportunities", icon: Briefcase },
          { label: "Projects", href: "/projects", icon: FolderOpen },
          { label: "Teams", href: "/teams", icon: Users },
          { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
        ]
      },
      {
        title: "Community",
        items: [
          { label: "Community Feed", href: "/feed", icon: Rss },
          { label: "Mentors", href: "/mentors", icon: GraduationCap },
        ]
      },
      {
        title: "Account",
        items: [
          { label: "Profile", href: "/profile", icon: UserCircle },
        ]
      }
    ];
  }

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
                    {(item as any).badge && (
                      <span className={`${isActive ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'} py-0.5 px-2 rounded-full text-[10px] font-bold`}>
                        {(item as any).badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-4">
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
        
        <div className="flex items-center justify-between gap-1 w-full shrink-0 mt-2">
        <div className="relative flex-1" ref={notifRef}>
          <button 
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className="w-full flex justify-center p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[8px] text-white font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifPanel && (
            <div className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline font-medium">Mark all read</button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">No notifications yet.</div>
                ) : (
                  notifications.slice(0, 10).map((n) => {
                    const getNotifProps = (type: string) => {
                      switch (type) {
                        case 'daily_reminder': return { icon: AlarmClock, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/20' };
                        case 'team_joined': return { icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20' };
                        case 'new_message': return { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20' };
                        default: return { icon: Bell, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' };
                      }
                    };
                    const NProps = getNotifProps(n.type);
                    const NIcon = NProps.icon;

                    return (
                      <Link
                        key={n.id}
                        href={n.link || '#'}
                        onClick={() => setShowNotifPanel(false)}
                        className={`block p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          !n.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full shrink-0 ${NProps.bg}`}>
                            <NIcon className={`w-4 h-4 ${NProps.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                              <span className="truncate pr-2">{n.title}</span>
                              {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1.5 font-medium">{new Date(n.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
          <button 
            onClick={toggleTheme}
            className="flex-1 flex justify-center p-2 text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
              } catch (e) {}
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="flex-1 flex justify-center p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </aside>
  );
}
