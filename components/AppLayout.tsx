"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show sidebar on auth pages or landing page
  const hideSidebarRoutes = ["/", "/login", "/register"];
  const isPublicProfile = pathname.startsWith("/u/");
  const showSidebar = !hideSidebarRoutes.includes(pathname) && !isPublicProfile;

  return (
    <div className="flex h-full w-full">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 w-full ${showSidebar ? 'md:ml-64' : ''}`}>
        {children}
      </div>
    </div>
  );
}
