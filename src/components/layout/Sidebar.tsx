"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Hotel, 
  BookOpen, 
  Car, 
  Briefcase, 
  ShieldCheck,
  LogOut,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { useDashboard } from "@/lib/context/DashboardContext";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Consultancy", href: "/consultancy", icon: GraduationCap, flag: "consultancy" },
  { name: "Hostel", href: "/hostel", icon: Hotel, flag: "hostel" },
  { name: "Courses", href: "/courses", icon: BookOpen, flag: "courses" },
  { name: "Taxi & Rental", href: "/taxi", icon: Car, flag: "taxi" },
  { name: "Job Portal", href: "/jobs", icon: Briefcase, flag: "jobs" },
  { name: "Wallet", href: "/wallet", icon: Wallet },
];

const itemVariants: Variants = {
  hidden: { x: -10, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

export function Sidebar() {
  const { user, flags, moduleTheme } = useDashboard();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full bg-base-navy border-r border-slate-800 w-64 z-20 text-slate-300 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center text-white font-bold italic shrink-0 transition-colors duration-300">U</div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Upskyla
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems.map((item, idx) => {
          const flag = flags.find(f => f.name === item.flag);
          const isDisabled = item.flag && flag && !flag.isEnabled;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <motion.div
              key={item.name}
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <Link
                href={isDisabled ? "#" : item.href}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all group relative",
                  isActive
                    ? "bg-slate-800/50 text-accent-primary shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/30 hover:text-white",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-accent-primary" : "text-slate-500 group-hover:text-slate-300"
                )} />
                {item.name}
                {isDisabled && (
                  <span className="ml-auto bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-pill"
                    className="absolute left-0 w-1 h-6 bg-accent-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}

        {user?.role === "ADMIN" && (
          <motion.div
            custom={sidebarItems.length}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <Link
              href="/admin"
              className={cn(
                "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all group relative",
                pathname.startsWith("/admin")
                  ? "bg-slate-800/50 text-accent-primary shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/30 hover:text-white"
              )}
            >
              <ShieldCheck className={cn(
                "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                pathname.startsWith("/admin") ? "text-accent-primary" : "text-slate-500 group-hover:text-slate-300"
              )} />
              Admin Panel
              {pathname.startsWith("/admin") && (
                <motion.div 
                  layoutId="sidebar-pill"
                  className="absolute left-0 w-1 h-6 bg-accent-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          Logout
        </button>
      </div>
    </div>
  );
}
