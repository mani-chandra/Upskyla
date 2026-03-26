"use client";

import { GraduationCap, Hotel, Car, BookOpen, Briefcase, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const sections = [
  {
    id: "admissions",
    title: "Admissions & Career Guidance",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    items: [
      "Book career consultations",
      "Take mock exams",
      "Track application progress",
      "Attend live sessions",
      "Secure admission support",
    ],
  },
  {
    id: "living",
    title: "Smart Student Living",
    icon: Hotel,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    items: [
      "Hostel management",
      "Online fee payments",
      "Complaint tracking",
      "Gaming café booking",
      "Private theatre booking",
      "Gym & lifestyle amenities",
    ],
  },
  {
    id: "mobility",
    title: "Mobility & Rentals",
    icon: Car,
    color: "text-orange-600",
    bg: "bg-orange-50",
    items: [
      "Airport pickup",
      "Taxi services",
      "Vehicle rentals",
      "Safe transport for parents",
    ],
  },
  {
    id: "courses",
    title: "Courses & Upskilling",
    icon: BookOpen,
    color: "text-green-600",
    bg: "bg-green-50",
    items: [
      "Online tech courses",
      "Track learning progress",
      "Earn certificates",
      "Purchase new courses",
    ],
  },
  {
    id: "career",
    title: "Earn While You Learn",
    icon: Briefcase,
    color: "text-purple-600",
    bg: "bg-purple-50",
    items: [
      "Student job opportunities",
      "Internal hiring",
      "Apply directly via platform",
    ],
  },
];

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export function Features() {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="max-w-2xl mx-auto mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl md:text-4xl font-bold font-heading text-gray-900">
            A Complete Ecosystem for Every Student Need
          </h2>
          <p className="text-gray-500 text-lg">
            We've modularized the student experience to provide everything you need to thrive.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all cursor-default"
            >
              <motion.div 
                className={cn("inline-flex items-center justify-center w-12 h-12 mb-6 rounded-xl", section.bg, section.color)}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <section.icon className="h-6 w-6" />
              </motion.div>
              <h3 className="mb-6 text-xl font-bold text-gray-900">{section.title}</h3>
              <ul className="space-y-4">
                {section.items.map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center text-gray-600"
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + (i * 0.05) }}
                  >
                    <CheckCircle2 className={cn("h-5 w-5 mr-3 flex-shrink-0", section.color)} />
                    <span className="text-sm font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
