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
  Wallet,
  Settings,
  X,
  Library
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/lib/context/DashboardContext";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["STUDENT"] },
  { name: "Moderator Panel", href: "/moderator", icon: ShieldCheck, roles: ["MODERATOR"] },
  { name: "Consultancy", href: "/consultancy", icon: GraduationCap, flag: "consultancy", roles: ["STUDENT"] },
  { name: "Hostel", href: "/hostel", icon: Hotel, flag: "hostel", roles: ["STUDENT"] },
  { name: "Courses", href: "/courses", icon: BookOpen, flag: "courses", roles: ["STUDENT"] },
  { name: "My Courses", href: "/student/courses", icon: Library, roles: ["STUDENT"] },
  { name: "Taxi & Rental", href: "/taxi", icon: Car, flag: "taxi", roles: ["STUDENT"] },
  { name: "Job Portal", href: "/jobs", icon: Briefcase, flag: "jobs", roles: ["STUDENT"] },
  { name: "Wallet", href: "/wallet", icon: Wallet, roles: ["STUDENT"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["STUDENT", "MODERATOR", "ADMIN"] },
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
  const { user, flags, moduleTheme, isSidebarOpen, setIsSidebarOpen } = useDashboard();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-white border-r border-gray-100 w-64 text-gray-600 transition-transform duration-300 lg:static lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold italic shrink-0">U</div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Upskyla
            </h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {sidebarItems
            .filter(item => !item.roles || (user && item.roles.includes(user.role)))
            .map((item, idx) => {
            const flag = flags.find(f => f.name === item.flag);
            const isDisabled = item.flag && flag && !flag.isEnabled;
            const isActive = pathname.startsWith(item.href);

            return (
              <motion.div
                key={item.name}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                whileHover={{ x: 4 }}
              >
                <Link
                  href={isDisabled ? "#" : item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all group relative",
                    isActive
                      ? "bg-[var(--accent-highlight)] text-[var(--accent-primary)] shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-[var(--accent-primary)]" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  {item.name}
                  {isDisabled && (
                    <span className="ml-auto bg-gray-100 text-gray-400 text-[10px] px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-pill"
                      className="absolute left-0 w-1.5 h-6 bg-[var(--accent-primary)] rounded-r-full"
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
              whileHover={{ x: 4 }}
            >
              <Link
                href="/admin"
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all group relative",
                  pathname.startsWith("/admin")
                    ? "bg-[var(--accent-highlight)] text-[var(--accent-primary)] shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <ShieldCheck className={cn(
                  "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                  pathname.startsWith("/admin") ? "text-[var(--accent-primary)]" : "text-gray-400 group-hover:text-gray-600"
                )} />
                Admin Panel
                {pathname.startsWith("/admin") && (
                  <motion.div 
                    layoutId="sidebar-pill"
                    className="absolute left-0 w-1.5 h-6 bg-[var(--accent-primary)] rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
