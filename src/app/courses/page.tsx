"use client";

import Image from "next/image";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { 
  BookOpen, 
  Play, 
  Clock, 
  CheckCircle, 
  Search,
  ChevronRight,
  Award
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const courses = [
  { 
    id: 1, 
    title: "Full Stack Development", 
    instructor: "Sarah Johnson", 
    progress: 65, 
    lessons: 24, 
    completed: 15,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3" 
  },
  { 
    id: 2, 
    title: "Data Science with Python", 
    instructor: "Michael Brown", 
    progress: 30, 
    lessons: 18, 
    completed: 5,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" 
  },
  { 
    id: 3, 
    title: "UI/UX Design Masterclass", 
    instructor: "Elena Rodriguez", 
    progress: 100, 
    lessons: 12, 
    completed: 12,
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" 
  },
];

export default function CoursesPage() {
  return (
    <ModuleLayout moduleName="courses">
      <div className="space-y-8 bg-module min-h-full transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Growth & <span className="text-accent-primary">Intelligence</span></h1>
            <p className="text-slate-500 font-medium mt-1">Access your lessons, track progress, and learn new skills.</p>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm w-64 text-slate-900 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all shadow-sm"
              placeholder="Search courses..."
            />
          </div>
        </div>

        {/* Featured Course/Last Watched */}
        <div className="bg-slate-950 rounded-[2.5rem] overflow-hidden text-white shadow-2xl flex flex-col md:flex-row relative group">
          <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
            <Image 
              src={courses[0].image} 
              alt="Course Thumbnail" 
              fill
              className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>
          <div className="md:w-1/2 p-10 md:p-14 space-y-6 relative z-10">
            <div className="flex items-center space-x-3 text-accent-highlight text-xs font-black uppercase tracking-[0.2em]">
              <div className="h-2 w-2 rounded-full bg-accent-highlight animate-pulse" />
              <span>Continue Learning</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight leading-tight">{courses[0].title}</h2>
            <p className="text-slate-400 text-lg font-medium">Lesson 16: Building API Routes in Next.js</p>
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>65% Complete</span>
                <span>15/24 Lessons</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-accent-primary to-accent-highlight h-full w-[65%] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
              </div>
            </div>
            <div className="pt-4">
              <button className="px-10 py-4 bg-accent-primary text-white rounded-2xl font-black text-lg hover:bg-accent-secondary transition-all shadow-xl shadow-accent-primary/20 hover:scale-105 active:scale-95 flex items-center group">
                Resume Lesson
                <Play className="ml-3 h-5 w-5 fill-current group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-2">
              <div className="relative h-56 overflow-hidden">
                <Image 
                  src={course.image} 
                  alt={course.title} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {course.progress === 100 && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg border border-white/20">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-accent-primary transition-colors leading-tight mb-2">{course.title}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{course.instructor}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-accent-primary" /> {course.lessons} Lessons
                    </span>
                    <span className={course.progress === 100 ? "text-emerald-500" : "text-accent-primary"}>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full transition-all duration-700",
                      course.progress === 100 ? "bg-emerald-500" : "bg-accent-primary shadow-[0_0_10px_rgba(49,46,129,0.3)]"
                    )} style={{ width: `${course.progress}%` }} />
                  </div>
                </div>

                {course.progress === 100 ? (
                  <button className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-black flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm">
                    <Award className="h-5 w-5 mr-2" />
                    View Certificate
                  </button>
                ) : (
                  <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl text-sm font-black flex items-center justify-center hover:bg-accent-primary hover:text-white transition-all shadow-sm group/btn">
                    Continue Course
                    <ChevronRight className="h-5 w-5 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Browse More Card */}
          <div className="bg-accent-primary/5 border-2 border-dashed border-accent-primary/20 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center space-y-6 cursor-pointer hover:bg-accent-primary/10 transition-all group">
            <div className="bg-white p-5 rounded-2xl shadow-lg shadow-accent-primary/10 group-hover:scale-110 transition-transform">
              <BookOpen className="h-10 w-10 text-accent-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Explore More</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">Browse our library of 500+ premium courses designed for your growth.</p>
            </div>
            <button className="text-accent-primary font-black text-sm flex items-center hover:translate-x-2 transition-transform uppercase tracking-widest">
              Go to Marketplace <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
