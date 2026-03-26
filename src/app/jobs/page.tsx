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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Career / Job Portal</h1>
            <p className="text-gray-500">Find your dream career with top companies.</p>
          </div>
          <button className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Upload Resume
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              placeholder="Search job titles, skills, or companies..."
            />
          </div>
          <div className="relative flex-1 w-full">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              placeholder="Location (e.g., Remote, Bangalore)..."
            />
          </div>
          <button className="w-full md:w-auto px-8 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors">
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-primary-50 transition-colors">
                        <Building2 className="h-8 w-8 text-gray-500 group-hover:text-primary-600 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                        <p className="text-sm font-medium text-gray-600">{job.company}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {job.location}</span>
                          <span className="flex items-center"><Briefcase className="h-3 w-3 mr-1" /> {job.type}</span>
                          <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {job.posted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 mb-2">{job.salary}</p>
                      {job.applied ? (
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle className="h-3 w-3 mr-1" /> Applied
                        </span>
                      ) : (
                        <button className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center group">
                          Apply Now
                          <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              View All Job Openings
            </button>
          </div>

          {/* Sidebar Stats/Profile */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Application Tracker</h3>
              <div className="space-y-6">
                {[
                  { label: "Applied", count: 12, color: "bg-blue-500" },
                  { label: "Interviews", count: 3, color: "bg-amber-500" },
                  { label: "Offers", count: 1, color: "bg-green-500" },
                  { label: "Rejected", count: 5, color: "bg-red-500" },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{stat.label}</span>
                      <span className="font-bold text-gray-900">{stat.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className={cn("h-full rounded-full", stat.color)} 
                        style={{ width: `${(stat.count / 21) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-600 rounded-xl shadow-sm p-6 text-white text-center">
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold mb-2">Resume Score: 85/100</h3>
              <p className="text-primary-100 text-xs mb-4">Your resume is strong! Try adding more keywords to reach 90+.</p>
              <button className="w-full py-2 bg-white text-primary-600 rounded-md text-sm font-bold hover:bg-primary-50 transition-colors">
                Improve Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
