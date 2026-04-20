"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DashboardContextType {
  user: any;
  flags: any[];
  loading: boolean;
  moduleTheme: string;
  setModuleTheme: (theme: string) => void;
  refreshUser: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleTheme, setModuleTheme] = useState("dashboard");

  const fetchData = async () => {
    try {
      console.log("DashboardContext: Fetching session...");
      const [sessionRes, flagsRes] = await Promise.all([
        fetch("/api/auth/session"),
        fetch("/api/feature-flags"),
      ]);
      
      if (sessionRes.ok) {
        const { session } = await sessionRes.json();
        console.log("DashboardContext: Session found for", session.user.email);
        setUser(session.user);
      } else {
        console.log("DashboardContext: No session found");
        // Only redirect if on a protected route
        const publicRoutes = ["/", "/login", "/register"];
        const isPublicRoute = publicRoutes.includes(window.location.pathname);
        
        if (!isPublicRoute) {
          console.log("DashboardContext: Protected route, redirecting to login");
          window.location.href = "/login";
        }
      }
      
      if (flagsRes.ok) {
        const flagsData = await flagsRes.json();
        setFlags(flagsData);
      }
    } catch (error) {
      console.error("Dashboard context fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardContext.Provider value={{ 
      user, 
      flags, 
      loading, 
      moduleTheme, 
      setModuleTheme, 
      refreshUser: fetchData 
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
