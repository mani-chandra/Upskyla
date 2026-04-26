"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Play, 
  CheckCircle2, 
  ChevronRight,
  ArrowLeft,
  Loader2,
  Lock,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  order: number;
}

interface Enrollment {
  id: string;
  progress: number;
  completed: boolean;
  completedLessons: string[];
  course: {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
  };
}

export default function CourseDetail() {
  const params = useParams();
  const enrollmentId = params.id as string;
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const res = await fetch(`/api/student/courses/${enrollmentId}`);
        if (res.ok) {
          const data = await res.json();
          setEnrollment(data);
          // Set first lesson as active by default
          if (data.course.lessons.length > 0) {
            setActiveLesson(data.course.lessons[0]);
          }
        } else {
          toast.error("Failed to fetch course details");
        }
      } catch (error) {
        console.error("Error fetching enrollment:", error);
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (enrollmentId) {
      fetchEnrollment();
    }
  }, [enrollmentId]);

  const handleCompleteLesson = async (lessonId: string) => {
    if (!enrollment) return;
    
    setCompleting(lessonId);
    try {
      const res = await fetch("/api/student/courses/lessons/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId, lessonId })
      });

      if (res.ok) {
        const data = await res.json();
        setEnrollment(prev => {
          if (!prev) return null;
          return {
            ...prev,
            progress: data.progress,
            completed: data.completed,
            completedLessons: data.completedLessons
          };
        });
        toast.success("Lesson marked as completed!");
      } else {
        toast.error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast.error("An error occurred");
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!enrollment) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-slate-500">Course not found.</p>
          <Link href="/student/courses" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to My Courses
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link 
              href="/student/courses"
              className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {enrollment.course.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 rounded-full"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <span className="text-xs font-black text-primary-600">{enrollment.progress}% Complete</span>
              </div>
              {enrollment.completed && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Video Player) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              {activeLesson ? (
                <div className="space-y-6">
                  <div className="aspect-video bg-slate-900 relative">
                    {/* Video Embed Placeholder - Assuming YouTube/Vimeo/Direct Link */}
                    {activeLesson.videoUrl.includes("youtube.com") || activeLesson.videoUrl.includes("youtu.be") ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${activeLesson.videoUrl.split("/").pop()?.split("=").pop()}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4 p-12 text-center">
                        <Play className="w-16 h-16 text-primary-500 opacity-50" />
                        <p className="font-medium text-slate-400">Video player placeholder for: {activeLesson.videoUrl}</p>
                        <a 
                          href={activeLesson.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                          Open Video <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">{activeLesson.title}</h2>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-500 font-medium">Lesson {activeLesson.order} of {enrollment.course.lessons.length}</p>
                      <button
                        onClick={() => handleCompleteLesson(activeLesson.id)}
                        disabled={enrollment.completedLessons?.includes(activeLesson.id) || completing === activeLesson.id}
                        className={cn(
                          "px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2",
                          enrollment.completedLessons?.includes(activeLesson.id)
                            ? "bg-emerald-50 text-emerald-600 cursor-default"
                            : "bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-600/20 active:scale-95 disabled:opacity-50"
                        )}
                      >
                        {completing === activeLesson.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : enrollment.completedLessons?.includes(activeLesson.id) ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          "Mark as Completed"
                        )}
                        {enrollment.completedLessons?.includes(activeLesson.id) ? "Completed" : "Complete Lesson"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-20 text-center text-slate-500 font-medium">
                  Select a lesson to start learning.
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40">
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">About this course</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {enrollment.course.description}
              </p>
            </div>
          </div>

          {/* Sidebar (Lesson List) */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Course Curriculum</h3>
              </div>
              <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                {enrollment.course.lessons.map((lesson) => {
                  const isCompleted = enrollment.completedLessons?.includes(lesson.id);
                  const isActive = activeLesson?.id === lesson.id;
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={cn(
                        "w-full p-6 flex items-start gap-4 text-left transition-all hover:bg-slate-50",
                        isActive && "bg-primary-50 hover:bg-primary-50"
                      )}
                    >
                      <div className={cn(
                        "mt-1 rounded-full p-1",
                        isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400",
                        isActive && !isCompleted && "bg-primary-100 text-primary-600"
                      )}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <div className="w-4 h-4 flex items-center justify-center text-[10px] font-black">
                            {lesson.order}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={cn(
                          "text-sm font-black transition-colors",
                          isActive ? "text-primary-600" : "text-slate-900"
                        )}>
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Play className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-medium text-slate-400 uppercase">Video Lesson</span>
                        </div>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-primary-600 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Steps / Rewards */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-xs text-primary-400">Final Step</h4>
                <h3 className="text-xl font-black mt-1">Get Certified</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                  Complete all lessons to unlock your certificate of completion and showcase your skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
