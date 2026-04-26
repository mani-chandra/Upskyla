"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Trophy, 
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  lessons: { id: string; title: string; order: number }[];
}

interface Enrollment {
  id: string;
  progress: number;
  completed: boolean;
  enrolledAt: string;
  course: Course;
}

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/student/courses");
        if (res.ok) {
          const data = await res.json();
          setEnrollments(data);
        }
      } catch (error) {
        console.error("Error fetching student courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            My <span className="text-primary-600">Courses</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track your learning progress and continue where you left off.</p>
        </div>

        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enrollment, i) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Course Thumbnail */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  {enrollment.course.thumbnail ? (
                    <Image 
                      src={enrollment.course.thumbnail} 
                      alt={enrollment.course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-50">
                      <BookOpen className="w-12 h-12 text-primary-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <Link 
                      href={`/student/courses/${enrollment.course.id}`}
                      className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary-600 hover:text-white transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Continue Learning
                    </Link>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 line-clamp-1 mb-2">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {enrollment.course.description}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Course Progress</span>
                      <span className="text-primary-600">{enrollment.progress}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${enrollment.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary-600 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lessons</p>
                        <p className="text-sm font-black text-slate-900">{enrollment.course.lessons.length}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                      <Trophy className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                        <p className={cn(
                          "text-sm font-black uppercase tracking-tight",
                          enrollment.completed ? "text-emerald-600" : "text-amber-600"
                        )}>
                          {enrollment.completed ? "Completed" : "In Progress"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href={`/student/courses/${enrollment.course.id}`}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-slate-900/10"
                  >
                    Go to Course
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 shadow-xl shadow-slate-200/40 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <BookOpen className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No courses found</h2>
                <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                  You haven't enrolled in any courses yet. Explore our curriculum to start your learning journey.
                </p>
              </div>
              <Link 
                href="/courses"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95"
              >
                Browse Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
