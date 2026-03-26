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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Education Consultancy</h1>
            <p className="text-gray-500">Plan your career and prepare for international exams.</p>
          </div>
          <button className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            <Calendar className="h-4 w-4 mr-2" />
            Book Consultation
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Prep Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h2 className="font-semibold text-gray-900">Mock Exams</h2>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md text-xs text-gray-900"
                    placeholder="Search exams..."
                  />
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {exams.map((exam) => (
                  <div key={exam.id} className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{exam.title}</h3>
                        <div className="flex items-center mt-1 space-x-3">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {exam.duration}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <FileText className="h-3 w-3 mr-1" /> {exam.questions} Questions
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            exam.difficulty === "Hard" ? "bg-red-50 text-red-600" : 
                            exam.difficulty === "Medium" ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                          )}>
                            {exam.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center group">
                      Take Exam
                      <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Application Status</h3>
                <div className="space-y-4">
                  {[
                    { university: "Stanford University", status: "In Review", date: "Mar 15, 2026" },
                    { university: "MIT", status: "Document Pending", date: "Mar 18, 2026" },
                  ].map((app, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{app.university}</p>
                        <p className="text-xs text-gray-500">{app.date}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider",
                        app.status === "In Review" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Document Vault</h3>
                <div className="space-y-3">
                  {["Transcript_Semester1.pdf", "Resume_Final.pdf", "Passport_Copy.pdf"].map((doc, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600 hover:text-primary-600 cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="flex-1">{doc}</span>
                    </div>
                  ))}
                  <button className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors">
                    Upload New Document
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <div className="bg-primary-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-primary-100 text-sm mb-4">Our expert consultants are ready to guide you through your career decisions.</p>
              <button className="w-full py-2 bg-white text-primary-600 rounded-md font-medium hover:bg-primary-50 transition-colors">
                Contact Expert
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2 text-indigo-500" />
                Live Workshops
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-900">IELTS Writing Masterclass</p>
                  <p className="text-xs text-gray-500">Tomorrow at 4:00 PM</p>
                </div>
                <div className="border-l-4 border-gray-200 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-900">Career in Data Science</p>
                  <p className="text-xs text-gray-500">Mar 22 at 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
