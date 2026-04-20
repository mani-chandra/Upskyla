"use client";

import { Bell, Search, User } from "lucide-react";
import { useDashboard } from "@/lib/context/DashboardContext";

export function Navbar() {
  const { user, moduleTheme } = useDashboard();
  return (
    <header className="h-16 bg-base-navy border-b border-slate-800 px-8 flex items-center justify-between text-slate-300 transition-colors duration-300">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
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

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => alert("No new notifications at the moment.")}
          className="p-2 text-slate-400 hover:text-white relative transition-colors"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-accent-primary ring-2 ring-base-navy transition-colors duration-300" />
        </button>

        <div className="flex items-center space-x-3 border-l pl-4 border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name || "Student"}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-accent-primary font-bold border border-slate-700 transition-colors duration-300">
            {user?.name?.[0]?.toUpperCase() || <User className="h-6 w-6" />}
          </div>
        </div>
      </div>
    </header>
  );
}
