"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Accordion } from "@/components/courses/Accordion";
import { courses } from "@/lib/courses-data";
import { 
  Clock, 
  Calendar, 
  Video, 
  Trophy, 
  Users2, 
  Rocket, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Code2,
  FileDown
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import Link from "next/link";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ReceiptModal } from "@/components/layout/ReceiptModal";

export default function CourseDetailPage() {
  const params = useParams();
  const { user } = useDashboard();
  const [enrolling, setEnrolling] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const course = courses.find((c) => c.slug === params.slug);

  const handleEnroll = async () => {
    if (!course) return;
    setEnrolling(true);

    try {
      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: course.price }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "Upskyla",
        description: `Enrollment for ${course.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/courses/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              courseId: course.id,
            }),
          });

          if (verifyRes.ok) {
            setReceiptData({
              transactionId: response.razorpay_payment_id,
              amount: course.price,
              date: new Date().toISOString(),
              customerName: user?.name,
              customerEmail: user?.email,
              itemName: `Enrollment: ${course.title}`,
              status: "SUCCESS"
            });
            setShowReceipt(true);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#312E81",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("An error occurred during enrollment.");
    } finally {
      setEnrolling(false);
    }
  };

  if (!course) {
    return (
      <ModuleLayout moduleName="courses">
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <HelpCircle className="w-16 h-16 text-slate-300" />
          <h1 className="text-2xl font-black text-slate-900">Course Not Found</h1>
          <Link href="/courses" className="text-accent-primary font-bold hover:underline">
            Back to All Courses
          </Link>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleName="courses">
      <div className="space-y-20 pb-20 bg-module">
        {showReceipt && receiptData && (
          <ReceiptModal 
            {...receiptData} 
            onClose={() => {
              setShowReceipt(false);
              window.location.href = "/dashboard";
            }} 
          />
        )}
        
        {/* Hero Section */}
        <section className="relative pt-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8 sticky top-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary text-[10px] font-black uppercase tracking-widest border border-accent-primary/20"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Enrollment Open for 2026
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]"
            >
              {course.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 font-medium leading-relaxed"
            >
              {course.longDescription}
            </motion.p>

            {/* Course Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 group"
            >
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className={cn(
                "absolute bottom-6 left-6 p-4 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20",
                course.bg.replace('bg-', 'bg-white/90 '),
                course.color
              )}>
                <course.icon className="w-8 h-8" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-6 pt-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-center text-accent-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                  <p className="text-sm font-black text-slate-900">{course.duration} ({course.totalHours} hrs)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-center text-accent-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                  <p className="text-sm font-black text-slate-900">Sat & Sun (Live)</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tight">Career Outcomes</h3>
                <p className="text-slate-400 font-medium">What you&apos;ll achieve after 4 months</p>
              </div>
              <div className="space-y-4">
                {course.outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-accent-primary shrink-0" />
                    <span className="font-bold text-slate-200">{outcome}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Program Fee</p>
                <div className="flex items-end gap-3 mb-8">
                  <span className="text-5xl font-black text-white">{formatCurrency(course.price)}</span>
                  <span className="text-slate-400 font-bold mb-2">/ Total</span>
                </div>
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-5 bg-accent-primary text-white rounded-2xl font-black text-lg hover:bg-accent-secondary transition-all shadow-xl shadow-accent-primary/20 active:scale-95 disabled:opacity-50 flex items-center justify-center"
                >
                  {enrolling ? <Loader2 className="w-6 h-6 animate-spin" /> : "Secure Your Seat Now"}
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Curriculum Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Master the Curriculum</h2>
              <p className="text-slate-500 font-medium max-w-2xl">
                A meticulously structured 96-hour roadmap designed for depth and practical mastery.
              </p>
            </div>
            {course.curriculumPdf && (
              <a 
                href={course.curriculumPdf}
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-sm border border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all active:scale-95 shrink-0"
              >
                <FileDown className="w-4 h-4 text-accent-primary" />
                Download Syllabus PDF
              </a>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion 
              items={course.curriculum.map((mod) => ({
                title: mod.title,
                badge: `${mod.hours} Hours`,
                content: (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mod.topics.map((topic, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                        <span className="text-sm font-bold text-slate-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                )
              }))}
            />
          </div>
        </section>

        {/* Capstone & Hackathon */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
            <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center text-accent-primary">
              <Rocket className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Capstone <br /> <span className="text-accent-primary">Real-world Project</span></h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              {course.capstone.description}
            </p>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mandatory Requirements</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.capstone.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Timeline</h4>
              <div className="space-y-6 relative">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100" />
                {course.capstone.timeline.map((item, i) => (
                  <div key={i} className="flex items-center gap-6 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-accent-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-accent-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-accent-primary uppercase tracking-widest">{item.week}</p>
                      <p className="text-sm font-bold text-slate-900">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white space-y-10 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mb-32" />
            
            <div className="space-y-6">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black tracking-tight">Internal <br /> <span className="text-amber-500">Hackathon</span></h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                After course completion, participate in our internal hackathon. Compete with peers, build something innovative, and win rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest">Rewards</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xs">1</div>
                    <span className="font-bold">₹10,000 Cash + Medal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-400/10 flex items-center justify-center text-slate-400 font-black text-xs">2</div>
                    <span className="font-bold">₹5,000 Cash + Medal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-700/10 flex items-center justify-center text-orange-700 font-black text-xs">3</div>
                    <span className="font-bold">₹2,500 Cash + Medal</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest">Judging Criteria</h4>
                <div className="space-y-3">
                  {["Technical Depth", "UI/UX Design", "Deployment", "Innovation"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-sm font-bold text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            
          </div>
        </section>

        {/* Support & FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-10">
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Unmatched Support</h2>
            <div className="space-y-6">
              {[
                { icon: Users2, title: "1:25 Ratio", desc: "Dedicated TAs for every small batch" },
                { icon: Video, title: "Doubt Sessions", desc: "Live weekly sessions for problem solving" },
                { icon: Code2, title: "Code Reviews", desc: "Industry-standard feedback on your code" },
                { icon: ShieldCheck, title: "Certification", desc: "Verified professional certificate on completion" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-accent-primary shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Common Questions</h2>
            <div className="space-y-4">
              {course.faq.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-black text-slate-900 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-accent-primary" />
                    {item.q}
                  </h4>
                  <p className="text-sm text-slate-600 font-medium ml-8 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-accent-primary rounded-[3.5rem] p-12 md:p-24 text-white text-center space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary opacity-50 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
              Ready to transform <br /> your career?
            </h2>
            <p className="text-white/80 text-xl font-medium">
              Join our next batch and start your journey towards becoming a top 1% engineer. Seats are filling fast!
            </p>
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-12 py-6 bg-white text-accent-primary rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[280px]"
              >
                {enrolling ? <Loader2 className="w-6 h-6 animate-spin" /> : "Apply for this Course"}
              </button>
              <Link href="/courses" className="px-12 py-6 bg-transparent text-white border-2 border-white/20 rounded-2xl font-black text-xl hover:bg-white/10 transition-all active:scale-95">
                Browse Other Courses
              </Link>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 pt-4">
              Secure Payment • Lifetime Community Access • Career Support
            </p>
          </div>
        </section>

      </div>
    </ModuleLayout>
  );
}
