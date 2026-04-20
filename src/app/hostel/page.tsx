"use client";

import { useEffect, useState } from "react";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { 
  Hotel, 
  CreditCard, 
  MessageSquare, 
  Gamepad, 
  Film,
  Info,
  ChevronRight,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Shield,
  Zap,
  Coffee,
  Users,
  Utensils,
  Wind,
  Tv,
  Sparkles,
  MapPin,
  GraduationCap
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useDashboard } from "@/lib/context/DashboardContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { ReceiptModal } from "@/components/layout/ReceiptModal";

const services = [
  { id: 1, name: "Gaming Café", icon: Gamepad, color: "text-purple-600", bg: "bg-purple-50", description: "Book high-end gaming slots." },
  { id: 2, name: "Private Theatre", icon: Film, color: "text-red-600", bg: "bg-red-50", description: "Movie night with friends." },
  { id: 3, name: "Maintenance", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", description: "Raise a support ticket." },
];

const amenities = [
  { icon: Wifi, label: "High-speed WiFi", desc: "Seamless connectivity throughout the premises." },
  { icon: Shield, label: "24/7 Security", desc: "Biometric access and constant CCTV monitoring." },
  { icon: Zap, label: "Power Backup", desc: "Uninterrupted power supply for all your needs." },
  { icon: Coffee, label: "Common Lounge", desc: "Spacious areas to relax and socialize." },
  { icon: Utensils, label: "Modern Kitchen", desc: "Fully equipped kitchen and dining area." },
  { icon: Wind, label: "Air Conditioning", desc: "Climate-controlled rooms for maximum comfort." },
];

const roomFeatures = [
  "Premium Furnished Bed",
  "Dedicated Study Table",
  "Personal Wardrobe",
  "Attached Washroom",
  "Regular Housekeeping",
  "Laundry Services",
];

export default function HostelPage() {
  return (
    <ModuleLayout moduleName="hostel">
      <HostelContent />
    </ModuleLayout>
  );
}

function HostelContent() {
  const { user } = useDashboard();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/hostel/status");
      const data = await res.json();
      if (res.ok) {
        setStatus(data);
      } else {
        console.error("API error:", data.message);
        setStatus({ error: data.message || "Failed to fetch status" });
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancePayment = async () => {
    setPaying(true);
    try {
      // Auto-applied coupon logic: Amount is now 6000 instead of 7000
      const amount = 6000;

      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "Upskyla",
        description: "Hostel Advance Payment (Coupon Applied)",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/hostel/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              couponId: status?.coupons?.[0]?.id || null, // Still use existing coupon if any
            }),
          });

          if (verifyRes.ok) {
            setReceiptData({
              transactionId: response.razorpay_payment_id,
              amount: amount,
              date: new Date().toISOString(),
              customerName: user?.name,
              customerEmail: user?.email,
              itemName: "Hostel Advance Booking",
              status: "SUCCESS"
            });
            setShowReceipt(true);
            fetchStatus();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#C2410C",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-accent-primary animate-spin transition-colors duration-300" />
      </div>
    );
  }

  const hasBooking = status?.hostelBooking;
  // Auto-apply coupon UI logic
  const isCouponApplied = true; 

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12 transition-colors duration-300">
      {showReceipt && receiptData && (
        <ReceiptModal 
          {...receiptData} 
          onClose={() => setShowReceipt(false)} 
        />
      )}
      {!hasBooking ? (
        <>
          {/* Header & Introduction */}
          <div className="text-center space-y-6 max-w-4xl mx-auto pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-5 py-2 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-black border border-accent-primary/20 shadow-sm uppercase tracking-wider transition-colors duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome to Upskyla Living
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight"
            >
              Safety, Comfort & <span className="text-accent-primary transition-colors duration-300">Community</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              Experience a warm, welcoming home away from home. Upskyla provides premium student living with a focus on comfort and connection.
            </motion.p>
          </div>

          {/* Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[2rem] shadow-xl border border-accent-primary/10 overflow-hidden relative group transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-accent-primary/10 transition-colors" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative">
              <div className="p-10 md:p-14 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900">Reserve Your Space</h2>
                  <p className="text-slate-500 leading-relaxed">Pay your advance amount now to lock your room for the upcoming academic session. Your comfort is our priority.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {roomFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-accent-secondary/10 flex items-center justify-center transition-colors duration-300">
                        <CheckCircle2 className="h-4 w-4 text-accent-secondary transition-colors duration-300" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-accent-primary/10 flex items-center justify-center transition-colors duration-300">
                      <CreditCard className="h-6 w-6 text-accent-primary transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Advance Payment</p>
                      <div className="flex items-center gap-3">
                        <p className="text-3xl font-black text-slate-900">{formatCurrency(6000)}</p>
                        <span className="text-sm line-through text-slate-400 font-bold">{formatCurrency(7000)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAdvancePayment}
                    disabled={paying}
                    className="w-full md:w-auto px-10 py-4 bg-accent-primary text-white rounded-2xl font-black text-lg hover:bg-accent-primary/90 transition-all shadow-xl shadow-accent-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center group"
                  >
                    {paying ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        Book My Room Now
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-sm font-bold text-accent-secondary flex items-center transition-colors duration-300">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Coupon Applied: ₹1,000 Discount Included!
                  </p>
                </div>
              </div>

              <div className="bg-accent-primary/5 p-10 flex flex-col justify-center transition-colors duration-300">
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-accent-primary transition-colors duration-300" />
                    Nearby Amenities
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "University", dist: "500m", icon: GraduationCap },
                      { label: "Hospital", dist: "1.2km", icon: Shield },
                      { label: "Market", dist: "300m", icon: Utensils },
                      { label: "Metro", dist: "800m", icon: Zap },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-2xl border border-accent-primary/5 transition-colors duration-300">
                        <item.icon className="h-5 w-5 text-accent-secondary mb-2 transition-colors duration-300" />
                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs font-bold text-accent-primary transition-colors duration-300">{item.dist}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-accent-primary rounded-2xl text-white shadow-xl shadow-accent-primary/20 transition-colors duration-300">
                    <p className="text-sm font-black uppercase tracking-widest mb-1 opacity-80">Quick Support</p>
                    <p className="text-lg font-bold">Need help with booking?</p>
                    <p className="text-sm mt-2 font-medium opacity-90">Our wardens are available 24/7 to assist you with the onboarding process.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {amenities.slice(0, 3).map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 bg-accent-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-accent-primary" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{item.label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        /* Room Info & Payment (Paid users) */
        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hostel Dashboard</h1>
              <p className="text-slate-500 font-medium mt-1">Manage your room and services from one place.</p>
            </div>
            <div className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
              Active Resident
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 flex items-center justify-between overflow-hidden relative group transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-primary/5 rounded-full blur-3xl -mr-24 -mt-24 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="flex items-center relative z-10">
                <div className="bg-accent-primary p-6 rounded-3xl mr-10 shadow-xl shadow-accent-primary/20 transition-colors duration-300">
                  <Hotel className="h-12 w-12 text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Your Room</p>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tight">
                    {status.hostelBooking.roomNumber === "TBD" ? "Allotment Pending" : status.hostelBooking.roomNumber}
                  </h2>
                  <div className="flex items-center mt-4 text-sm text-slate-500 font-bold">
                    <Info className="h-4 w-4 mr-2 text-accent-primary transition-colors duration-300" /> 
                    {status.hostelBooking.status === "PENDING" ? "Admin is assigning your room..." : "Ready for check-in"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
              <h3 className="font-black text-slate-900 mb-8 flex items-center text-xl uppercase tracking-tight">
                <Shield className="h-6 w-6 mr-3 text-accent-primary transition-colors duration-300" />
                Resident Rules
              </h3>
              <ul className="space-y-5">
                {["Curfew at 10:00 PM", "No outside guests after 8:00 PM", "Keep rooms clean", "Respect quiet hours"].map((rule, i) => (
                  <li key={i} className="text-sm text-slate-600 font-bold flex items-center">
                    <div className="w-2 h-2 bg-accent-secondary rounded-full mr-4 shrink-0 transition-colors duration-300" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-8 pt-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Premium Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                  <div className={cn("inline-flex p-5 rounded-2xl mb-8 transition-all group-hover:scale-110 duration-300 shadow-lg", service.bg, service.color)}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{service.name}</h3>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">{service.description}</p>
                  <button 
                    className="w-full py-4 px-6 bg-slate-50 text-slate-900 rounded-2xl font-black text-sm hover:bg-accent-primary hover:text-white transition-all flex items-center justify-center group/btn shadow-sm"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
