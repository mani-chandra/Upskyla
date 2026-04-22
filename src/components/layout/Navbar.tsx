"use client";

import { Bell, Search, User, X, Menu } from "lucide-react";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, moduleTheme, setIsSidebarOpen } = useDashboard();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetch("/api/announcements")
      .then(res => res.json())
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching announcements:", err));
  }, []);

  return (
    <header className="h-16 bg-base-navy border-b border-slate-800 px-4 md:px-8 flex items-center justify-between text-slate-300 transition-colors duration-300 sticky top-0 z-30">
      <div className="flex items-center flex-1">
        <button 
          onClick={() => setIsSidebarOpen?.(true)}
          className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg lg:hidden mr-2"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative w-64 lg:w-96 hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary sm:text-sm text-white transition-all duration-300"
            placeholder="Search for courses, bookings, or info..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white relative transition-colors"
          >
            <Bell className="h-6 w-6" />
            {announcements.length > 0 && (
              <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-accent-primary ring-2 ring-base-navy transition-colors duration-300 animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {announcements.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No new notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                          <p className="text-xs font-black text-accent-primary mb-1 uppercase tracking-widest">{ann.module}</p>
                          <h4 className="text-sm font-bold text-white mb-1">{ann.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{ann.content}</p>
                          <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-tighter">
                            {new Date(ann.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3 bg-slate-800/30 text-center">
                  <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                    View All Activity
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-3 border-l pl-4 border-slate-800">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-white">{user?.name || "Student"}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role?.toLowerCase() || "Free Plan"}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-accent-primary font-bold border border-slate-700 transition-colors duration-300">
            {user?.name?.[0]?.toUpperCase() || <User className="h-6 w-6" />}
          </div>
        </div>
      </div>
    </header>
  );
}
