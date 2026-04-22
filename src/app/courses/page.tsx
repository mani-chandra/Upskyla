"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { CourseCard } from "@/components/courses/CourseCard";
import { courses as initialCourses } from "@/lib/courses-data";
import { Sparkles, ArrowRight, CheckCircle2, Trophy, Rocket, Users2, Code2, BrainCircuit, Video, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          // Merge with initialCourses to preserve icon components and other non-serializable data
          const mergedData = initialCourses.map(initialCourse => {
            const fetchedCourse = data.find((c: any) => c.id === initialCourse.id);
            if (fetchedCourse) {
              return {
                ...initialCourse,
                curriculumPdf: fetchedCourse.curriculumPdf || initialCourse.curriculumPdf
              };
            }
            return initialCourse;
          });
          setCourses(mergedData);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <ModuleLayout moduleName="courses">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="relative space-y-12 md:space-y-20 pb-20 bg-module transition-colors duration-300 px-4 sm:px-0 overflow-hidden">
          {/* ... existing content ... */}
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-accent-primary/5 rounded-full blur-[150px]" />
          
          {/* Abstract Icons */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[15%] text-primary-200/40"
          >
            <Code2 className="w-24 h-24" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 left-[10%] text-accent-primary/10"
          >
            <BrainCircuit className="w-32 h-32" />
          </motion.div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-6 md:pt-10 text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-primary-100 text-primary-600 text-[10px] md:text-sm font-black border border-primary-200 shadow-sm uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Learn from the top mentors
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight md:leading-[1.1]"
          >
            Industry-Focused <br className="hidden sm:block" />
            <span className="text-primary-600">Career Programs</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto px-2 sm:px-0"
          >
            Master job-oriented skills through live online weekend training, real-world capstone projects, and internal hackathons.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4 sm:px-0"
          >
            <button 
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-primary-600 text-white rounded-xl md:rounded-[1.5rem] font-black text-base md:text-lg hover:bg-primary-700 transition-all shadow-2xl shadow-primary-200 hover:scale-105 active:scale-95"
            >
              Enroll Now
            </button>
            <button 
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-gray-900 rounded-xl md:rounded-[1.5rem] font-black text-base md:text-lg hover:bg-gray-50 border border-gray-200 transition-all shadow-xl shadow-gray-200/50 hover:scale-105 active:scale-95"
            >
              View Curriculum
            </button>
          </motion.div>

          {/* Quick trust badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-12 gap-y-4 md:gap-y-6 pt-10 md:pt-12 border-t border-slate-200/50"
          >
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" />
              Beginner Friendly
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
              <Users2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent-primary" />
              1:25 TA Support
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
              <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
              Hackathon Rewards
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
              <Rocket className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-500" />
              Job Assistance
            </div>
          </motion.div>
        </section>

        {/* Course Cards Grid */}
        <section id="programs" className="space-y-8 md:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Our Programs</h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">Choose a track and transform your career in 4 months.</p>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm mx-auto md:mx-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Next Batch Starts Soon</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {courses.map((course, idx) => (
              <CourseCard key={course.id} course={course} idx={idx} />
            ))}
          </div>
        </section>

        {/* Student Experience Section */}
        <section className="py-12 md:py-20 border-t border-slate-200/50">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">The Upskyla Journey</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">From learning fundamentals to landing your dream job, we guide you every step of the way.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "Live Interactive Learning",
                desc: "Learn from industry experts in real-time. Weekend-only classes designed for students and professionals.",
                icon: Video,
                color: "bg-blue-500"
              },
              {
                step: "02",
                title: "Build Real-world Projects",
                desc: "Apply your skills on capstone projects and internal hackathons. Build a portfolio that stands out.",
                icon: Rocket,
                color: "bg-purple-500"
              },
              {
                step: "03",
                title: "Career & Job Support",
                desc: "Get 1-on-1 mentorship, resume reviews, and direct interview opportunities with partner companies.",
                icon: Trophy,
                color: "bg-amber-500"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="absolute top-6 right-8 text-4xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">
                  {item.step}
                </div>
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", item.color)}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Support System Redesign */}
        <section className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent-primary/10 rounded-full blur-3xl -mr-32 md:-mr-48 -mt-32 md:-mt-48 transition-transform group-hover:scale-110" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 relative z-10">
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                Support Ecosystem
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">We don&apos;t just teach, <br className="hidden sm:block" /> we <span className="text-accent-primary">mentor</span>.</h2>
              <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
                Our support system is built to ensure no student is left behind. From code reviews to emotional support, we are with you.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { title: "TA Support", desc: "1 Mentor assigned per 25 students" },
                  { title: "Doubt Sessions", desc: "Weekly dedicated live sessions" },
                  { title: "Code Reviews", desc: "Line-by-line feedback on tasks" },
                  { title: "Mentorship", desc: "1-on-1 career & project guidance" }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="text-accent-primary font-black uppercase tracking-widest text-sm">{item.title}</h4>
                    <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 p-8 md:p-10 flex flex-col justify-center items-center text-center space-y-8 backdrop-blur-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-accent-primary rounded-xl md:rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-accent-primary/20">
                <Users2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-2">Join Our Community</h3>
                <p className="text-slate-400 text-sm md:text-base font-medium">Access our private Discord, network with peers, and collaborate on projects.</p>
              </div>
              <button className="w-full py-4 md:py-5 bg-white text-slate-900 rounded-xl md:rounded-[1.5rem] font-black text-sm hover:bg-slate-50 transition-all active:scale-95">
                Learn More About Support
              </button>
            </div>
          </div>
        </section>

      </div>
      )}
    </ModuleLayout>
  );
}
