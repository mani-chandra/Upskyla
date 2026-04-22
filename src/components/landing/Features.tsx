"use client";

import { GraduationCap, Hotel, Car, BookOpen, Briefcase, Wallet, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const modules = [
  {
    title: "Premium Student Living",
    tagline: "Your Home, Reimagined",
    description: "Experience the next generation of student accommodation. We've automated the mundane so you can focus on living your best life.",
    icon: Hotel,
    color: "text-indigo-600",
    accent: "bg-indigo-600",
    bg: "bg-indigo-50",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: [
      { title: "Smart Booking", text: "Select your preferred room via interactive floor plans and secure it instantly." },
      { title: "Financial Ease", text: "Set up auto-pay for rent and track all utilities in one unified ledger." },
      { title: "Lifestyle Perks", text: "Priority access to on-site Gaming Zones, Private Theatres, and Gym facilities." },
      { title: "Instant Support", text: "24/7 digital concierge for maintenance and community requests." },
    ],
  },
  {
    title: "LMS & Skill Mastery",
    tagline: "Beyond the Classroom",
    description: "Don't just learn—master the skills that matter. Our LMS bridges the gap between theoretical knowledge and industry demands.",
    icon: BookOpen,
    color: "text-green-600",
    accent: "bg-green-600",
    bg: "bg-green-50",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop",
    details: [
      { title: "Expert Curations", text: "Courses designed and delivered by industry leaders from top tech firms." },
      { title: "Interactive Learning", text: "Project-based modules with real-world scenarios and peer reviews." },
      { title: "Verified Credentials", text: "Earn blockchain-secured certificates recognized by global employers." },
      { title: "Career Fast-track", text: "Top 10% of learners get direct interview invites from partner companies." },
    ],
  },
  {
    title: "Career & Placement",
    tagline: "Your Future, Secured",
    description: "The bridge between your education and your first paycheck. We don't just list jobs; we build careers.",
    icon: Briefcase,
    color: "text-purple-600",
    accent: "bg-purple-600",
    bg: "bg-purple-50",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop",
    details: [
      { title: "Internal Hiring", text: "Exclusive access to roles within the growing Upskyla ecosystem." },
      { title: "Partner Network", text: "Direct connections to 500+ startups and multinational corporations." },
      { title: "Earn While Learning", text: "Part-time internships and campus ambassador roles available year-round." },
      { title: "Career Coaching", text: "Personalized resume building and mock interview sessions with HR experts." },
    ],
  },
  {
    title: "Mobility & Transport",
    tagline: "Travel with Peace of Mind",
    description: "Reliable, safe, and student-friendly transport solutions. Because getting there should be the least of your worries.",
    icon: Car,
    color: "text-orange-600",
    accent: "bg-orange-600",
    bg: "bg-orange-50",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
    details: [
      { title: "Airport Logistics", text: "Scheduled pickups for you and your family during move-in weeks." },
      { title: "Daily Commute", text: "On-demand taxi services with verified drivers at student-friendly rates." },
      { title: "Adventure Rentals", text: "Easy vehicle rentals for weekend getaways with group-discount options." },
      { title: "Family Travel", text: "Priority transport arrangements for visiting parents and guardians." },
    ],
  },
  {
    title: "Academic Guidance",
    tagline: "Navigate Your Success",
    description: "Expert guidance for every academic milestone. From choosing a major to securing admissions in dream colleges.",
    icon: GraduationCap,
    color: "text-blue-600",
    accent: "bg-blue-600",
    bg: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1607013407627-6ee814329547?q=80&w=1564&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: [
      { title: "Strategic Planning", text: "Long-term academic roadmaps tailored to your career aspirations." },
      { title: "Entrance Mastery", text: "Preparation modules and mock tests for top-tier competitive exams." },
      { title: "Admission Support", text: "End-to-end assistance with documentation, essays, and interviews." },
      { title: "Scholarship Guidance", text: "Unlock financial aid opportunities through our global database." },
    ],
  },
  {
    title: "Wallet & Rewards",
    tagline: "Growth that Pays Off",
    description: "A transparent financial system that rewards your loyalty and helps you manage your student expenses.",
    icon: Wallet,
    color: "text-red-600",
    accent: "bg-red-600",
    bg: "bg-red-50",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop",
    details: [
      { title: "Referral Engine", text: "Industry-leading rewards for every successful peer referral." },
      { title: "Unified Payments", text: "Pay for rent, courses, and transport from a single wallet." },
      { title: "Cashback & Points", text: "Earn points on every transaction and redeem them for platform perks." },
      { title: "Secure Withdrawals", text: "Easy and transparent process to transfer your referral earnings." },
    ],
  },
];

function ModuleSection({ module, index }: { module: typeof modules[0], index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const x = useTransform(scrollYProgress, [0, 0.2], [index % 2 === 0 ? -20 : 20, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className={cn(
        "flex flex-wrap items-center py-12 md:py-24 min-h-screen lg:min-h-[80vh]",
        index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      {/* Content Side */}
      <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
        <motion.div
          style={{ x }}
          className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className={cn("p-2.5 md:p-3 rounded-2xl shadow-lg", module.bg, module.color)}>
              <module.icon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <span className={cn("text-xs md:text-sm font-bold uppercase tracking-widest", module.color)}>
              {module.tagline}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {module.title}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium">
            {module.description}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-10 text-left">
            {module.details.map((detail, dIdx) => (
              <motion.div
                key={detail.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: dIdx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", module.accent)} />
                  {detail.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {detail.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold shadow-xl transition-all",
              module.accent,
              "hover:shadow-2xl"
            )}
          >
            Explore {module.title.split(' ')[0]}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      {/* Visual Side */}
      <div className="w-full lg:w-1/2 px-4">
        <div className="relative group max-w-2xl mx-auto">
          <motion.div
            initial={{ rotate: index % 2 === 0 ? 1 : -1 }}
            whileHover={{ rotate: 0, scale: 1.01 }}
            className="relative z-10 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white"
          >
            <img 
              src={module.image} 
              alt={module.title} 
              className="w-full aspect-video md:aspect-[4/3] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Floating Info Card */}
            <motion.div
              initial={{ x: 20, y: 20, opacity: 0 }}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-4 right-4 md:bottom-8 md:right-8 p-3 md:p-4 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 md:gap-4"
            >
              <div className={cn("p-1.5 md:p-2 rounded-lg md:rounded-xl", module.bg, module.color)}>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="text-xs md:text-sm font-bold text-gray-900">
                100% Digital Experience
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative Background Elements */}
          <div className={cn(
            "absolute -z-10 w-full h-full rounded-[2.5rem] blur-3xl opacity-20 transition-all group-hover:opacity-40",
            module.bg
          )} style={{ transform: 'scale(1.1)' }} />
          <div className={cn(
            "absolute -inset-4 -z-20 rounded-[3rem] border-2 border-dashed border-gray-200",
            index % 2 === 0 ? "rotate-3" : "-rotate-3"
          )} />
        </div>
      </div>
    </motion.div>
  );
}

export function Features() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Map scroll progress to subtle, professional background colors (Level 120)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
    [
      "#FFFFFF", 
      "#b8c5faff", // Indigo 120
      "#c5f6d9ff", // Green 120
      "#e1c3feff", // Purple 120
      "#fee2c0ff", // Orange 120
      "#b2d4fbff", // Blue 120
      "#feaab7ff", // Red 120
      "#fed0d0ff"
    ]
  );

  return (
    <section ref={containerRef} className="relative">
      {/* Dynamic Progress Bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 h-1.5 bg-primary-600 origin-left z-[100]"
        style={{ scaleX: springScroll }}
      />

      {/* FIXED BACKGROUND THAT CHANGES COLOR */}
      <motion.div 
        style={{ backgroundColor }}
        className="fixed inset-0 -z-20 pointer-events-none transition-colors duration-1000"
      />

      <div className="container px-4 mx-auto relative">
        <div className="pt-16 md:pt-24 pb-8 md:pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-xs md:text-sm font-black text-primary-600 bg-primary-50 rounded-full uppercase tracking-tighter">
              Deep Dive
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-tight">
              The <span className="text-primary-600 italic">Upskyla</span> Experience
            </h1>
          </motion.div>
        </div>

        <div className="relative">
          {/* Central Line Decoration REMOVED to avoid white line issue */}
          
          {modules.map((module, idx) => (
            <ModuleSection key={module.title} module={module} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
