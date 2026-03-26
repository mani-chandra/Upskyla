"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Hotel, Car, BookOpen } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const floatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

export function Hero() {
  return (
    <section className="relative py-20 overflow-hidden bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          <motion.div 
            className="w-full px-4 mb-16 lg:w-1/2 lg:mb-0"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.span 
              variants={itemVariants}
              className="inline-block py-1 px-3 mb-4 text-xs font-semibold text-primary-600 bg-primary-50 rounded-full uppercase tracking-widest"
            >
              The All-in-One Student Hub
            </motion.span>
            <motion.h1 
              variants={itemVariants}
              className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-gray-900 leading-tight"
            >
              Empowering Students <span className="text-primary-600">Beyond Education.</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mb-8 text-lg md:text-xl text-gray-500 leading-relaxed max-w-xl"
            >
              A unified ecosystem for admissions, student living, mobility, career growth, and skill development — all in one platform.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transform hover:-translate-y-1 shadow-lg shadow-primary-200"
              >
                Register Now
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 font-bold text-gray-900 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transform hover:-translate-y-1"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="w-full px-4 lg:w-1/2">
            <div className="relative max-w-lg mx-auto lg:max-w-none">
              <motion.div 
                className="absolute top-0 left-0 w-full h-full bg-primary-100 rounded-3xl transform translate-x-4 translate-y-4 -z-10"
                animate={{ 
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const }}
              />
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="p-6 bg-white rounded-2xl shadow-lg transform translate-y-8 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all"
                  variants={floatVariants}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-blue-600 bg-blue-50 rounded-xl">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Admissions</h3>
                  <p className="text-sm text-gray-500">Expert guidance & prep.</p>
                </motion.div>
                <motion.div 
                  className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all"
                  initial={{ y: 0 }}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-indigo-600 bg-indigo-50 rounded-xl">
                    <Hotel className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Living</h3>
                  <p className="text-sm text-gray-500">Smart hostel management.</p>
                </motion.div>
                <motion.div 
                  className="p-6 bg-white rounded-2xl shadow-lg transform translate-y-8 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all"
                  initial={{ y: 0 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-orange-600 bg-orange-50 rounded-xl">
                    <Car className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Mobility</h3>
                  <p className="text-sm text-gray-500">Safe student transport.</p>
                </motion.div>
                <motion.div 
                  className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all"
                  initial={{ y: 0 }}
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-green-600 bg-green-50 rounded-xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Courses</h3>
                  <p className="text-sm text-gray-500">Industry-ready skills.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
