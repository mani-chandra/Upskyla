"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  GraduationCap, 
  Hotel, 
  BookOpen, 
  Car, 
  Briefcase,
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { useDashboard } from "@/lib/context/DashboardContext";

const modules = [
  { 
    name: "Consultancy", 
    href: "/consultancy", 
    icon: GraduationCap, 
    flag: "consultancy",
    description: "Book career consultation and take mock exams.",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  { 
    name: "Hostel", 
    href: "/hostel", 
    icon: Hotel, 
    flag: "hostel",
    description: "Manage your room, fees, and maintenance complaints.",
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  { 
    name: "Courses", 
    href: "/courses", 
    icon: BookOpen, 
    flag: "courses",
    description: "Access your purchased courses and track progress.",
    color: "text-green-600",
    bg: "bg-green-50"
  },
  { 
    name: "Taxi & Rental", 
    href: "/taxi", 
    icon: Car, 
    flag: "taxi",
    description: "Book airport pickups or rental vehicles.",
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  { 
    name: "Job Portal", 
    href: "/jobs", 
    icon: Briefcase, 
    flag: "jobs",
    description: "View job openings and track your applications.",
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export default function DashboardPage() {
  const { user, flags, setModuleTheme } = useDashboard();
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    setModuleTheme("dashboard");
    setAnnouncements([
      { id: 1, title: "Welcome to the new Platform!", content: "Explore all the new features we've added.", date: "2026-03-19" },
      { id: 2, title: "Hostel Maintenance", content: "Water supply will be interrupted tomorrow for 2 hours.", date: "2026-03-20" },
    ]);
  }, [setModuleTheme]);

  return (
    <div className="space-y-8 bg-module min-h-full transition-colors duration-300">
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back!</h1>
          <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your student account today.</p>
        </motion.div>

        {/* Announcements Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Latest Announcements</h2>
            <Link href="/announcements" className="text-sm text-accent-primary hover:text-accent-secondary font-medium transition-colors">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {announcements.map((ann, i) => (
              <motion.div 
                key={ann.id} 
                className="px-6 py-4 hover:bg-slate-50 transition-colors"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">{ann.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">{ann.content}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{ann.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const flag = flags.find(f => f.name === module.flag);
            const isDisabled = module.flag && flag && !flag.isEnabled;

            return (
              <motion.div
                key={module.name}
                variants={itemVariants}
                whileHover={isDisabled ? {} : { y: -5, scale: 1.02 }}
                whileTap={isDisabled ? {} : { scale: 0.98 }}
              >
                <Link
                  href={isDisabled ? "#" : module.href}
                  className={cn(
                    "group relative block h-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md hover:border-accent-primary/20",
                    isDisabled && "opacity-75 cursor-not-allowed"
                  )}
                >
                  <div className={cn("inline-flex p-3 rounded-xl mb-4 transition-all group-hover:rotate-12 group-hover:scale-110", module.bg, module.color)}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center group-hover:text-accent-primary transition-colors">
                    {module.name}
                    {!isDisabled && <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{module.description}</p>
                  
                  {isDisabled && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                        Launching Soon
                      </span>
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats/Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="font-semibold text-slate-900 mb-6 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-accent-primary" />
              Recent Activity
            </h2>
            <div className="space-y-6">
              {[
                { text: 'Enrolled in "Advanced Next.js"', time: "2h ago", color: "bg-accent-primary" },
                { text: "Paid Hostel Fee for March", time: "1d ago", color: "bg-emerald-500" }
              ].map((activity, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className={cn("h-2.5 w-2.5 rounded-full mr-4 shadow-sm", activity.color)} />
                  <p className="text-slate-700 font-medium">{activity.text}</p>
                  <span className="ml-auto text-slate-400 font-medium text-xs">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center items-center text-center"
          >
            <div className="h-16 w-16 bg-accent-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-accent-primary" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1 text-lg">Your Profile is 85% Complete</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-[280px]">Complete your profile to unlock more opportunities and recommendations.</p>
            <button 
              onClick={() => alert("Opening profile completion wizard... Feature coming soon!")}
              className="px-6 py-2.5 bg-accent-primary text-white rounded-xl font-bold text-sm hover:bg-accent-secondary transition-all shadow-md shadow-accent-primary/20 hover:scale-105"
            >
              Complete Profile
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
