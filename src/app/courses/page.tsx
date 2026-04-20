"use client";

import { motion } from "framer-motion";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { CourseCard } from "@/components/courses/CourseCard";
import { courses } from "@/lib/courses-data";
import { Sparkles, ArrowRight, CheckCircle2, Trophy, Rocket, Users2 } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <ModuleLayout moduleName="courses">
      <div className="space-y-20 pb-20 bg-module transition-colors duration-300">
        
        {/* Hero Section */}
        <section className="relative pt-10 text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-5 py-2 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-black border border-accent-primary/20 shadow-sm uppercase tracking-widest"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Learn from the top mentors
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]"
          >
            Industry-Focused <br />
            <span className="text-accent-primary">Career Programs</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Master job-oriented skills through live online weekend training, real-world capstone projects, and internal hackathons.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button 
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-accent-primary text-white rounded-[1.5rem] font-black text-lg hover:bg-accent-secondary transition-all shadow-2xl shadow-accent-primary/20 hover:scale-105 active:scale-95"
            >
              Enroll Now
            </button>
            <button 
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-lg hover:bg-slate-50 border border-slate-200 transition-all shadow-xl shadow-slate-200/50 hover:scale-105 active:scale-95"
            >
              View Curriculum
            </button>
          </motion.div>

          {/* Quick trust badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-12 border-t border-slate-200/50"
          >
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Beginner Friendly
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              <Users2 className="w-4 h-4 text-accent-primary" />
              1:25 TA Support
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              <Trophy className="w-4 h-4 text-amber-500" />
              Hackathon Rewards
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              <Rocket className="w-4 h-4 text-purple-500" />
              Job Assistance
            </div>
          </motion.div>
        </section>

        {/* Course Cards Grid */}
        <section id="programs" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Our Programs</h2>
              <p className="text-slate-500 font-medium">Choose a track and transform your career in 4 months.</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Next Batch Starts Soon</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, idx) => (
              <CourseCard key={course.id} course={course} idx={idx} />
            ))}
          </div>
        </section>

        {/* Support System Redesign */}
        <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl -mr-48 -mt-48 transition-transform group-hover:scale-110" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                Support Ecosystem
              </div>
              <h2 className="text-5xl font-black tracking-tight leading-tight">We don&apos;t just teach, <br /> we <span className="text-accent-primary">mentor</span>.</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
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

            <div className="bg-white/5 rounded-[2rem] border border-white/10 p-10 flex flex-col justify-center items-center text-center space-y-8 backdrop-blur-sm">
              <div className="w-20 h-20 bg-accent-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-accent-primary/20">
                <Users2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Join Our Community</h3>
                <p className="text-slate-400 font-medium">Access our private Discord, network with peers, and collaborate on projects.</p>
              </div>
              <button className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-sm hover:bg-slate-50 transition-all active:scale-95">
                Learn More About Support
              </button>
            </div>
          </div>
        </section>

      </div>
    </ModuleLayout>
  );
}
