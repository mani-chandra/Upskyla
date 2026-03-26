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
  MapPin
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useDashboard } from "@/lib/context/DashboardContext";
import { motion } from "framer-motion";
import Image from "next/image";

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
      const hasCoupon = status?.coupons && status.coupons.length > 0;
      const amount = hasCoupon ? 6000 : 7000;

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
        description: "Hostel Advance Payment",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/hostel/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              couponId: hasCoupon ? status.coupons[0].id : null,
            }),
          });

          if (verifyRes.ok) {
            alert("Payment successful! Your hostel advance has been paid.");
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
          color: "#4f46e5",
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
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const hasBooking = status?.hostelBooking;
  const hasCoupon = !!(status?.coupons && status.coupons.length > 0);

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      {!hasBooking ? (
        <>
          {/* Header & Introduction */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-bold border border-primary-100 shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome to Upskyla Living
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight"
            >
              Premium Student Accommodation
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-500 leading-relaxed"
            >
              Experience a new standard of student living. From luxury amenities to a vibrant community, Upskyla provides everything you need to thrive during your academic journey.
            </motion.p>
          </div>

          {/* Quick Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {amenities.slice(0, 3).map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.label}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Features & Booking Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Detailed Overview */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Hotel className="w-6 h-6 mr-3 text-primary-600" />
                  Room Features & Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {roomFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center text-gray-700">
                      <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center mr-3 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <hr className="my-8 border-gray-100" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                    <p className="text-sm text-gray-700 font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                      Mangalpally, Ibrahimpatnam
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Capacity</p>
                    <p className="text-sm text-gray-700 font-medium flex items-center">
                      <Users className="w-4 h-4 mr-2 text-primary-500" />
                      250+ Students
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type</p>
                    <p className="text-sm text-gray-700 font-medium flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-primary-500" />
                      Fully Managed
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((item, idx) => (
                  <div key={idx} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                    <item.icon className="w-5 h-5 text-gray-400 mb-2" />
                    <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Payment Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary-200 relative overflow-hidden sticky top-8">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/20 rounded-full blur-2xl -ml-12 -mb-12" />

                <div className="relative z-10 space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Book Your Room</h3>
                    <p className="text-primary-100 text-sm">Secure your spot with a simple advance payment. Remaining balance can be paid monthly.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-primary-100 text-sm font-medium">
                      <span>Hostel Advance</span>
                      <span>{formatCurrency(7000)}</span>
                    </div>
                    
                    {hasCoupon && (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex justify-between items-center text-green-300 text-sm font-bold bg-white/10 p-3 rounded-2xl border border-white/10"
                      >
                        <span className="flex items-center">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Welcome Coupon
                        </span>
                        <span>-{formatCurrency(1000)}</span>
                      </motion.div>
                    )}

                    <div className="pt-4 border-t border-white/20 flex justify-between items-baseline">
                      <span className="text-lg font-bold">Total Payable</span>
                      <span className="text-4xl font-black">{formatCurrency(hasCoupon ? 6000 : 7000)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAdvancePayment}
                    disabled={paying}
                    className="w-full py-5 bg-white text-primary-600 rounded-2xl font-black text-lg hover:bg-primary-50 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center group"
                  >
                    {paying ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        Pay & Secure Spot
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  <p className="text-[10px] text-primary-200 text-center font-medium uppercase tracking-widest opacity-80">
                    Secure 256-bit SSL encrypted payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Room Info & Payment (Paid users) */
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hostel Dashboard</h1>
            <div className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
              Active Resident
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 p-8 flex items-center justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="flex items-center relative z-10">
                <div className="bg-primary-600 p-5 rounded-3xl mr-8 shadow-lg shadow-primary-100">
                  <Hotel className="h-10 w-10 text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Your Room</p>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                    {status.hostelBooking.roomNumber === "TBD" ? "Allotment Pending" : status.hostelBooking.roomNumber}
                  </h2>
                  <div className="flex items-center mt-3 text-sm text-gray-500 font-medium">
                    <Info className="h-4 w-4 mr-2 text-primary-500" /> 
                    {status.hostelBooking.status === "PENDING" ? "Admin is assigning your room..." : "Ready for check-in"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 p-8">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
                <Shield className="h-5 w-5 mr-3 text-primary-600" />
                Resident Rules
              </h3>
              <ul className="space-y-4">
                {["Curfew at 10:00 PM", "No outside guests after 8:00 PM", "Keep rooms clean", "Respect quiet hours"].map((rule, i) => (
                  <li key={i} className="text-sm text-gray-600 font-medium flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Premium Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8 hover:shadow-2xl transition-all hover:-translate-y-1 group">
                  <div className={cn("inline-flex p-4 rounded-2xl mb-6 transition-transform group-hover:scale-110 duration-300", service.bg, service.color)}>
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">{service.description}</p>
                  <button 
                    className="w-full py-3 px-6 bg-gray-50 text-gray-900 rounded-xl font-bold text-sm hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center group/btn"
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
