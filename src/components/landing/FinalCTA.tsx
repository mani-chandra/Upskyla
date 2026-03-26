"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="py-20 bg-primary-600 relative overflow-hidden">
      {/* Decorative background circles */}
      <motion.div 
        className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500 rounded-full opacity-50"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.div 
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-700 rounded-full opacity-50"
        animate={{ scale: [1, 1.1, 1], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" as const }}
      />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="mb-8 text-3xl md:text-5xl font-bold font-heading text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join the Founding Student Community
          </motion.h2>
          <motion.p 
            className="mb-12 text-xl text-primary-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to experience a unified platform designed exclusively for your success? Get started today.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center px-10 py-5 font-bold text-primary-600 transition-all bg-white rounded-xl hover:bg-primary-50 focus:ring-4 focus:ring-primary-400 transform hover:-translate-y-1 shadow-xl"
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all bg-primary-700 border border-primary-500 rounded-xl hover:bg-primary-800 focus:ring-4 focus:ring-primary-400 transform hover:-translate-y-1"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
