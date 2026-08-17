"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  id: string;
  fullName: string;
  username: string | null;
  email: string;
  role: string;
  bio: string | null;
  university: string | null;
  department: string | null;
  skills: string[];
  githubUsername: string | null;
  codeforcesUsername: string | null;
  title: string | null;
  location: string | null;
  profileImage: string | null;
  experience: any[];
  certificates: any[];
  projects: any[];
  userRoadmap: any | null;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/users/profile");
      if (!res.ok) {
        if (res.status === 401) {
          // Not logged in
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem("user");
          }
          return;
        }
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Failed to fetch user profile (${res.status})`);
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err: any) {
      console.error("UserProvider error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}
