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
  const { user, flags } = useDashboard();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 z-20">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary-600">
          StudentEcosystem
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems.map((item, idx) => {
          const flag = flags.find(f => f.name === item.flag);
          const isDisabled = item.flag && flag && !flag.isEnabled;

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
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all group relative",
                  pathname === item.href
                    ? "bg-primary-50 text-primary-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                  pathname === item.href ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                {item.name}
                {isDisabled && (
                  <span className="ml-auto bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                )}
                {pathname === item.href && (
                  <motion.div 
                    layoutId="sidebar-pill"
                    className="absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full"
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
                "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all group relative",
                pathname.startsWith("/admin")
                  ? "bg-primary-50 text-primary-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <ShieldCheck className={cn(
                "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                pathname.startsWith("/admin") ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
              )} />
              Admin Panel
              {pathname.startsWith("/admin") && (
                <motion.div 
                  layoutId="sidebar-pill"
                  className="absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          Logout
        </button>
      </div>
    </div>
  );
}
