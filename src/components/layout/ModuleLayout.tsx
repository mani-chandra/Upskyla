"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { AlertCircle } from "lucide-react";
import { useDashboard } from "@/lib/context/DashboardContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ModuleLayout({ 
  children, 
  moduleName 
}: { 
  children: React.ReactNode, 
  moduleName: string 
}) {
  return (
    <DashboardLayout>
      <ModuleContent moduleName={moduleName}>{children}</ModuleContent>
    </DashboardLayout>
  );
}

function ModuleContent({ children, moduleName }: { children: React.ReactNode, moduleName: string }) {
  const { flags, loading: dashboardLoading, setModuleTheme } = useDashboard();
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // Set the theme for this module
    setModuleTheme(moduleName);
    // Cleanup: Reset theme when leaving module
    return () => setModuleTheme("dashboard");
  }, [moduleName, setModuleTheme]);

  useEffect(() => {
    if (dashboardLoading) return;

    if (flags) {
      const flag = flags.find((f: any) => f.name === moduleName);
      setIsEnabled(flag ? flag.isEnabled : true);
    }
  }, [moduleName, flags, dashboardLoading]);

  if (dashboardLoading || isEnabled === null) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="bg-amber-50 p-4 rounded-full mb-6">
          <AlertCircle className="h-12 w-12 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Launching Soon!</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          The {moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} module is currently under maintenance or being prepared for launch. 
          Check back later!
        </p>
        <a
          href="/dashboard"
          className="mt-8 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      {/* Module Glow Effect */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--accent-primary)] opacity-[0.03] blur-[120px] pointer-events-none rounded-full" />
      
      {/* Content Wrapper */}
      <div className="relative z-10 space-y-12">
        {children}
      </div>
    </motion.div>
  );
}
