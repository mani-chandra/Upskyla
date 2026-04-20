"use client";

import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { 
  Calendar, 
  FileText, 
  Video, 
  Search,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const exams = [
  { id: 1, title: "IELTS Mock Exam", duration: "120m", questions: 40, difficulty: "Hard" },
  { id: 2, title: "GRE Practice Test", duration: "180m", questions: 60, difficulty: "Medium" },
  { id: 3, title: "SAT Diagnostic", duration: "90m", questions: 35, difficulty: "Easy" },
];

export default function ConsultancyPage() {
  return (
    <ModuleLayout moduleName="consultancy">
      <div className="space-y-8 bg-module min-h-full transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trust & <span className="text-accent-primary">Guidance</span></h1>
            <p className="text-slate-500 font-medium mt-1">Plan your career and prepare for international exams with expert mentorship.</p>
          </div>
          <button 
            onClick={() => alert("Opening consultation booking calendar... Feature coming soon!")}
            className="flex items-center px-8 py-3 bg-accent-primary text-white rounded-2xl font-black text-sm hover:bg-accent-secondary transition-all shadow-xl shadow-accent-primary/20 hover:scale-105 active:scale-95 group"
          >
            <Calendar className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
            Book Consultation
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Main Prep Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group">
              <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-accent-primary" />
                  Mock Exams
                </h2>
                <div className="relative group/search">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within/search:text-accent-primary transition-colors" />
                  </span>
                  <input
                    type="text"
                    className="block w-full sm:w-64 pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all font-medium placeholder:text-slate-400"
                    placeholder="Search exams..."
                  />
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {exams.map((exam) => (
                  <div key={exam.id} className="px-8 py-6 hover:bg-slate-50 transition-all flex items-center justify-between group/item">
                    <div className="flex items-center">
                      <div className="bg-accent-primary/10 p-4 rounded-2xl mr-5 group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                        <FileText className="h-7 w-7 text-accent-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 group-hover/item:text-accent-primary transition-colors">{exam.title}</h3>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs text-slate-500 font-bold flex items-center uppercase tracking-wider">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-accent-secondary" /> {exam.duration}
                          </span>
                          <span className="text-xs text-slate-500 font-bold flex items-center uppercase tracking-wider">
                            <FileText className="h-3.5 w-3.5 mr-1.5 text-accent-secondary" /> {exam.questions} Qs
                          </span>
                          <span className={cn(
                            "text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest shadow-sm",
                            exam.difficulty === "Hard" ? "bg-red-50 text-red-600 border border-red-100" : 
                            exam.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          )}>
                            {exam.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Starting ${exam.title} mock test environment...`)}
                      className="px-6 py-2.5 bg-slate-50 text-slate-900 rounded-xl text-sm font-black hover:bg-accent-primary hover:text-white transition-all shadow-sm flex items-center group/btn"
                    >
                      Start
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                <h3 className="font-black text-slate-900 mb-6 flex items-center text-lg uppercase tracking-tight">
                  <CheckCircle className="h-5 w-5 mr-3 text-accent-secondary" />
                  Application Tracker
                </h3>
                <div className="space-y-6">
                  {[
                    { university: "Stanford University", status: "In Review", date: "Mar 15, 2026" },
                    { university: "MIT", status: "Document Pending", date: "Mar 18, 2026" },
                  ].map((app, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-accent-primary/20 transition-colors cursor-default">
                      <div>
                        <p className="text-sm font-black text-slate-900">{app.university}</p>
                        <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{app.date}</p>
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 text-[9px] font-black uppercase rounded-lg tracking-widest shadow-sm border",
                        app.status === "In Review" ? "bg-accent-primary/10 text-accent-primary border-accent-primary/20" : "bg-accent-highlight/10 text-accent-highlight border-accent-highlight/20"
                      )}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                <h3 className="font-black text-slate-900 mb-6 flex items-center text-lg uppercase tracking-tight">
                  <FileText className="h-5 w-5 mr-3 text-accent-primary" />
                  Document Vault
                </h3>
                <div className="space-y-4">
                  {["Transcript_Semester1.pdf", "Resume_Final.pdf", "Passport_Copy.pdf"].map((doc, i) => (
                    <div key={i} className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group/doc">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center mr-3 group-hover/doc:bg-accent-primary/10 transition-colors">
                        <FileText className="h-4 w-4 text-slate-400 group-hover/doc:text-accent-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover/doc:text-slate-900 transition-colors flex-1">{doc}</span>
                    </div>
                  ))}
                  <button className="w-full mt-2 py-4 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-400 hover:border-accent-primary hover:text-accent-primary hover:bg-accent-primary/5 transition-all">
                    Upload New Document
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            <div className="bg-accent-primary rounded-[2rem] shadow-xl shadow-accent-primary/20 p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-3 tracking-tight">Expert Mentorship</h3>
                <p className="text-accent-highlight/90 text-sm font-medium mb-8 leading-relaxed">Our expert consultants are ready to guide you through your career decisions with personalized trust-building sessions.</p>
                <button className="w-full py-4 bg-white text-accent-primary rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-lg hover:scale-105 active:scale-95">
                  Contact Expert
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              <h3 className="font-black text-slate-900 mb-8 flex items-center text-lg uppercase tracking-tight">
                <Video className="h-5 w-5 mr-3 text-accent-secondary" />
                Live Workshops
              </h3>
              <div className="space-y-6">
                <div className="relative pl-6 border-l-4 border-accent-secondary py-1 group/workshop cursor-pointer">
                  <p className="text-sm font-black text-slate-900 group-hover:text-accent-secondary transition-colors">IELTS Writing Masterclass</p>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Tomorrow at 4:00 PM</p>
                  <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-accent-secondary shadow-lg shadow-accent-secondary/50 scale-0 group-hover:scale-100 transition-transform" />
                </div>
                <div className="relative pl-6 border-l-4 border-slate-200 py-1 group/workshop cursor-pointer">
                  <p className="text-sm font-black text-slate-900 group-hover:text-accent-secondary transition-colors">Career in Data Science</p>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Mar 22 at 6:00 PM</p>
                  <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-accent-secondary shadow-lg shadow-accent-secondary/50 scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>
              <button className="w-full mt-8 py-3 px-4 bg-slate-50 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center">
                View All Workshops
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
