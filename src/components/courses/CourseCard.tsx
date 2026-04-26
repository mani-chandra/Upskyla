import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Calendar, Users2, Trophy, ArrowRight, Video, FileDown } from "lucide-react";
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
    >
      {/* Course Image Header */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Preview Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Video className="w-3 h-3" />
            Watch Preview
          </div>
        </div>

        {/* Floating Icon */}
        <div className={cn(
          "absolute bottom-4 left-6 p-3 rounded-xl shadow-xl backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform z-10",
          course.bg.replace('bg-', 'bg-white/90 '),
          course.color
        )}>
          <course.icon className="w-6 h-6" />
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-white/20 shadow-lg">
            Batch 2026 Open
          </div>
          {(course.id === 'aiml') && (
            <div className="px-3 py-1 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg animate-pulse">
              Bestseller
            </div>
          )}
          {course.description.toLowerCase().includes('early bird') && (
            <div className="px-3 py-1 rounded-full bg-primary-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/20">
              Early Bird Offer
            </div>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 flex-grow flex flex-col">
        {/* Title & Info */}
        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight leading-tight">
            {course.title}
          </h3>
          <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-primary-500 transition-colors">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-600">{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-primary-500 transition-colors">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Weekend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-primary-500 transition-colors">
              <Users2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Live Class</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-primary-500 transition-colors">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Certified</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 pt-2 flex-grow">
          {course.highlights.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-wider border border-slate-100 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-all">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-6 flex gap-3">
          <Link 
            href={`/courses/${course.slug}`}
            className="flex-grow py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-sm hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center group/btn"
          >
            Explore Curriculum
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          {course.curriculumPdf ? (
            <a 
              href={course.curriculumPdf}
              download
              className="p-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all active:scale-95 flex items-center justify-center"
              title="Download Syllabus"
            >
              <FileDown className="w-5 h-5" />
            </a>
          ) : (
            <div className="p-4 bg-slate-50 text-slate-300 rounded-xl md:rounded-2xl flex items-center justify-center cursor-not-allowed" title="No Syllabus Uploaded">
              <FileDown className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
