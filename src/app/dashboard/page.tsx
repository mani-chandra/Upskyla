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
  const { user, flags } = useDashboard();
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    setAnnouncements([
      { id: 1, title: "Welcome to the new Platform!", content: "Explore all the new features we've added.", date: "2026-03-19" },
      { id: 2, title: "Hostel Maintenance", content: "Water supply will be interrupted tomorrow for 2 hours.", date: "2026-03-20" },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500">Here&apos;s what&apos;s happening with your student account today.</p>
        </motion.div>

        {/* Announcements Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Latest Announcements</h2>
            <Link href="/announcements" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {announcements.map((ann, i) => (
              <motion.div 
                key={ann.id} 
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{ann.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{ann.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{ann.date}</span>
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
                    "group relative block h-full bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md",
                    isDisabled && "opacity-75 cursor-not-allowed"
                  )}
                >
                  <div className={cn("inline-flex p-3 rounded-lg mb-4 transition-transform group-hover:rotate-12", module.bg, module.color)}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    {module.name}
                    {!isDisabled && <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />}
                  </h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                  
                  {isDisabled && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
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
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary-500" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                { text: 'Enrolled in "Advanced Next.js"', time: "2h ago", color: "bg-blue-500" },
                { text: "Paid Hostel Fee for March", time: "1d ago", color: "bg-green-500" }
              ].map((activity, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                >
                  <div className={cn("h-2 w-2 rounded-full mr-3", activity.color)} />
                  <span className="text-gray-600 flex-1">{activity.text}</span>
                  <span className="text-gray-400">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              Upcoming Deadlines
            </h2>
            <div className="space-y-4">
              {[
                { text: "Mock Exam: Mathematics", time: "Tomorrow", color: "bg-red-500" },
                { text: "Consultancy Booking", time: "Mar 25", color: "bg-amber-500" }
              ].map((deadline, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                >
                  <div className={cn("h-2 w-2 rounded-full mr-3", deadline.color)} />
                  <span className="text-gray-600 flex-1">{deadline.text}</span>
                  <span className="text-gray-400">{deadline.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
