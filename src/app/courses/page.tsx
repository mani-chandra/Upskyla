"use client";

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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course LMS</h1>
            <p className="text-gray-500">Access your lessons, track progress, and learn new skills.</p>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm w-64 text-gray-900"
              placeholder="Search courses..."
            />
          </div>
        </div>

        {/* Featured Course/Last Watched */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden text-white shadow-xl flex flex-col md:flex-row">
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <img 
              src={courses[0].image} 
              alt="Course Thumbnail" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent" />
          </div>
          <div className="md:w-1/2 p-8 space-y-4">
            <div className="flex items-center space-x-2 text-primary-400 text-sm font-bold uppercase tracking-wider">
              <Play className="h-4 w-4 fill-current" />
              <span>Continue Learning</span>
            </div>
            <h2 className="text-3xl font-bold">{courses[0].title}</h2>
            <p className="text-gray-400 text-sm">Lesson 16: Building API Routes in Next.js</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>65% Complete</span>
                <span>15/24 Lessons</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-primary-500 h-full w-[65%] rounded-full transition-all duration-1000" />
              </div>
            </div>
            <button className="px-8 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg">
              Resume Lesson
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {course.progress === 100 && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.instructor}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {course.lessons} Lessons
                    </span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full transition-all duration-500",
                      course.progress === 100 ? "bg-green-500" : "bg-primary-500"
                    )} style={{ width: `${course.progress}%` }} />
                  </div>
                </div>

                {course.progress === 100 ? (
                  <button className="w-full py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-green-100 transition-colors">
                    <Award className="h-4 w-4 mr-2" />
                    View Certificate
                  </button>
                ) : (
                  <button className="w-full py-2 bg-gray-50 text-gray-900 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-gray-100 transition-colors">
                    Continue Course
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Browse More Card */}
          <div className="bg-primary-50 border-2 border-dashed border-primary-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:bg-primary-100 transition-colors">
            <div className="bg-primary-100 p-4 rounded-full">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-900">Explore More</h3>
              <p className="text-sm text-primary-700">Browse our library of 500+ premium courses.</p>
            </div>
            <button className="text-primary-600 font-bold text-sm flex items-center hover:underline">
              Go to Marketplace <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
