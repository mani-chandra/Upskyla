"use client";

import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { 
  Briefcase, 
  MapPin, 
  Search, 
  ArrowRight, 
  Building2, 
  Clock, 
  Plus, 
  CheckCircle,
  FileText
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const jobs = [
  { 
    id: 1, 
    title: "Software Engineer Intern", 
    company: "Google", 
    location: "Bangalore, India", 
    type: "Internship", 
    salary: "₹50,000/mo", 
    posted: "2d ago",
    applied: true 
  },
  { 
    id: 2, 
    title: "Product Designer", 
    company: "Razorpay", 
    location: "Remote", 
    type: "Full-time", 
    salary: "₹12L - ₹18L", 
    posted: "5h ago",
    applied: false 
  },
  { 
    id: 3, 
    title: "Marketing Coordinator", 
    company: "Zomato", 
    location: "Gurgaon, India", 
    type: "Full-time", 
    salary: "₹8L - ₹12L", 
    posted: "1d ago",
    applied: false 
  },
];

export default function JobsPage() {
  return (
    <ModuleLayout moduleName="jobs">
      <div className="space-y-8 bg-module min-h-full transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ambition & <span className="text-accent-primary">Success</span></h1>
            <p className="text-slate-500 font-medium mt-1">Find your dream career with top companies and structured growth.</p>
          </div>
          <button className="flex items-center px-8 py-3 bg-accent-primary text-white rounded-2xl font-black text-sm hover:bg-accent-secondary transition-all shadow-xl shadow-accent-primary/20 hover:scale-105 active:scale-95 group">
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
            Upload Resume
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row gap-6 items-center group">
          <div className="relative flex-1 w-full group/input">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within/input:text-accent-primary transition-colors" />
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all font-medium placeholder:text-slate-400"
              placeholder="Job titles, skills, or companies..."
            />
          </div>
          <div className="relative flex-1 w-full group/input">
            <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within/input:text-accent-primary transition-colors" />
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all font-medium placeholder:text-slate-400"
              placeholder="Location (e.g., Remote, Bangalore)..."
            />
          </div>
          <button className="w-full lg:w-auto px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-accent-primary transition-all shadow-lg hover:scale-105 active:scale-95">
            Find Jobs
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Jobs List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
                <Briefcase className="h-6 w-6 mr-3 text-accent-primary" />
                Recommended Jobs
              </h2>
              <span className="text-xs font-black text-accent-primary uppercase tracking-widest bg-accent-primary/10 px-3 py-1.5 rounded-lg border border-accent-primary/20">
                8 New Matches
              </span>
            </div>
            
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:border-accent-primary/20 transition-all duration-300 group cursor-pointer hover:-translate-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div className="flex items-start gap-6">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-accent-primary/10 group-hover:border-accent-primary/20 transition-all duration-300">
                        <Building2 className="h-10 w-10 text-slate-400 group-hover:text-accent-primary transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-accent-primary transition-colors leading-tight">{job.title}</h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{job.company}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 mt-4">
                          <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 group-hover:border-accent-primary/10 transition-colors">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 text-accent-secondary" /> {job.location}
                          </span>
                          <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 group-hover:border-accent-primary/10 transition-colors">
                            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-accent-secondary" /> {job.type}
                          </span>
                          <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 group-hover:border-accent-primary/10 transition-colors">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-accent-secondary" /> {job.posted}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                      <p className="text-lg font-black text-slate-900 tracking-tight">{job.salary}</p>
                      {job.applied ? (
                        <span className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100 shadow-sm">
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Applied
                        </span>
                      ) : (
                        <button className="px-6 py-2.5 bg-slate-50 text-slate-900 rounded-xl text-sm font-black hover:bg-accent-primary hover:text-white transition-all shadow-sm flex items-center group/btn">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-5 bg-slate-50 text-slate-500 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100">
              View All Job Openings
            </button>
          </div>

          {/* Sidebar Stats/Profile */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center uppercase tracking-tight">
                <CheckCircle className="h-5 w-5 mr-3 text-accent-secondary" />
                Applications
              </h3>
              <div className="space-y-8">
                {[
                  { label: "Applied", count: 12, color: "bg-accent-highlight" },
                  { label: "Interviews", count: 3, color: "bg-amber-500" },
                  { label: "Offers", count: 1, color: "bg-accent-primary" },
                  { label: "Rejected", count: 5, color: "bg-red-500" },
                ].map((stat, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-slate-500">{stat.label}</span>
                      <span className="text-slate-900">{stat.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", stat.color)} 
                        style={{ width: `${(stat.count / 21) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent-primary rounded-[2rem] shadow-xl shadow-accent-primary/20 p-10 text-white text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
              <div className="relative z-10">
                <div className="bg-white/20 p-5 rounded-[1.5rem] w-20 h-20 mx-auto mb-6 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Resume Score: 85</h3>
                <p className="text-accent-highlight/90 text-sm font-medium mb-8 leading-relaxed">Your resume is strong! Optimize keywords to reach a perfect score.</p>
                <button className="w-full py-4 bg-white text-accent-primary rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-lg hover:scale-105 active:scale-95">
                  Improve Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
