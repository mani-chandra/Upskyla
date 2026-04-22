"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-24 pb-20 bg-white">
      <div className="container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-flex items-center px-4 py-1.5 mb-8 text-sm font-medium text-primary-700 bg-primary-50 rounded-full border border-primary-100">
            Now open for 2026 academic session
          </span>
          <h1 className="mb-8 text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] sm:leading-[1.05]">
            Everything you need for <br className="hidden sm:block" />
            <span className="text-primary-600">successful student life.</span>
          </h1>
          <p className="mb-10 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Upskyla is the unified ecosystem for student living, learning, and career growth. Manage your hostel, courses, and jobs—all from one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 sm:mb-20 px-4 sm:px-0">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
            >
              Get Started for Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Login to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Professional Mockup Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-gray-50 p-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                alt="Upskyla Platform Dashboard" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Subtle Accent Decorations */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-50 -z-10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
