import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Calendar, Users2, Trophy, ArrowRight } from "lucide-react";
import { Course } from "@/lib/courses-data";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  idx: number;
}

export function CourseCard({ course, idx }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
    >
      <div className="p-8 space-y-6">
        {/* Icon & Badge */}
        <div className="flex items-center justify-between">
          <div className={cn("p-4 rounded-2xl shadow-lg transition-all group-hover:scale-110 group-hover:rotate-6", course.bg, course.color)}>
            <course.icon className="w-8 h-8" />
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            Open for Batch 2026
          </span>
        </div>

        {/* Title & Info */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 group-hover:text-accent-primary transition-colors tracking-tight">
            {course.title}
          </h3>
          <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-600">{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-600">Weekend Only</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
              <Users2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-600">Live Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-600">Capstone + Hackathon</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 pt-2">
          {course.highlights.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-wider border border-slate-100">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col gap-3">
          <Link 
            href={`/courses/${course.slug}`}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-accent-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center group/btn"
          >
            Explore Course
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
