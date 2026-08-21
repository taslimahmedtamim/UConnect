"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Bypass AppLayout entirely for admin routes
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Don't show sidebar on auth pages or landing page
  const hideSidebarRoutes = ["/", "/login", "/register"];
  const isPublicProfile = pathname.startsWith("/u/");
  const showSidebar = !hideSidebarRoutes.includes(pathname) && !isPublicProfile;

  return (
    <div className="flex h-full w-full">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 min-w-0 overflow-x-hidden ${showSidebar ? 'md:ml-64 pt-16 md:pt-0' : 'pt-16'}`}>
        {children}
      </div>
    </div>
  );
}
