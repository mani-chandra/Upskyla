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
  const [approxCheckIn, setApproxCheckIn] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);

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
    if (!approxCheckIn) {
      alert("Please select an approximate check-in date.");
      return;
    }

    setPaying(true);
    try {
      const amount = 6000;
      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type: "HOSTEL_ADVANCE" }),
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
              approxCheckIn: approxCheckIn,
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

  const handleRentPayment = async () => {
    setPaying(true);
    try {
      const amount = 6000;
      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type: "HOSTEL_RENT" }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "Upskyla",
        description: "Hostel Rent Payment",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/hostel/pay-rent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            setReceiptData({
              transactionId: response.razorpay_payment_id,
              amount: amount,
              date: new Date().toISOString(),
              customerName: user?.name,
              customerEmail: user?.email,
              itemName: "First Month Rent",
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
      alert("An error occurred during rent payment.");
    } finally {
      setPaying(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await fetch("/api/hostel/check-in", {
        method: "POST",
      });
      if (res.ok) {
        alert("Welcome! Check-in successful.");
        fetchStatus();
      } else {
        const data = await res.json();
        alert(data.message || "Check-in failed.");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      alert("An error occurred during check-in.");
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-accent-primary animate-spin transition-colors duration-300" />
      </div>
    );
  }

  const booking = status?.hostelBooking;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12 transition-colors duration-300 px-4 sm:px-0">
      {showReceipt && receiptData && (
        <ReceiptModal 
          {...receiptData} 
          onClose={() => setShowReceipt(false)} 
        />
      )}
      {!booking ? (
        <>
          {/* Header & Introduction */}
          <div className="text-center space-y-6 max-w-4xl mx-auto pt-4 md:pt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center px-6 py-2 rounded-full bg-white shadow-xl shadow-gray-200/50 text-[var(--accent-primary)] text-xs md:text-sm font-bold border border-gray-100 uppercase tracking-widest transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Elevated Student Living
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]"
            >
              Premium <span className="text-[var(--accent-primary)]">Hostel</span> Ecosystem
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto"
            >
              Discover a living experience that combines modern comfort with advanced automation. Manage your entire stay from your phone.
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

                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-700 uppercase tracking-widest">Approximate Check-in Date</label>
                  <input 
                    type="date" 
                    value={approxCheckIn}
                    onChange={(e) => setApproxCheckIn(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent-primary outline-none transition-all font-bold text-slate-900 bg-slate-50/50"
                  />
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
        </>
      ) : (
        /* Status Tracking Flow */
        <div className="space-y-12">
          {/* Notifications / Reminders */}
          {status.notifications && status.notifications.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-accent-primary" />
                Important Updates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {status.notifications.map((notif: any) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={notif.id} 
                    className={cn(
                      "p-6 rounded-3xl border flex items-start gap-4 shadow-sm",
                      notif.isRead ? "bg-slate-50 border-slate-100" : "bg-accent-primary/5 border-accent-primary/20"
                    )}
                  >
                    <div className="mt-1 h-10 w-10 rounded-xl bg-accent-primary/10 flex items-center justify-center shrink-0">
                      <Info className="h-5 w-5 text-accent-primary" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 mb-1">{notif.title}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Status Card */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent-primary/5 rounded-full blur-3xl -mr-24 -mt-24 transition-transform group-hover:scale-150 duration-700" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                  <div className="bg-accent-primary p-8 rounded-[2rem] shadow-xl shadow-accent-primary/20 transition-colors duration-300">
                    <Hotel className="h-16 w-16 text-white" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Booking Status</p>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                        booking.isCheckedIn ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"
                      )}>
                        {booking.status}
                      </div>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                      {booking.roomNumber || "Allotment Pending"}
                    </h2>
                    <p className="text-lg text-slate-500 font-bold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent-primary" />
                      Approx. Check-in: {new Date(booking.approxCheckIn).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Step 1</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm font-black text-slate-900">Advance Paid</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Step 2</p>
                      <div className="flex items-center gap-2">
                        {booking.roomNumber ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
                        )}
                        <span className="text-sm font-black text-slate-900">Room Assigned</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Step 3</p>
                      <div className="flex items-center gap-2">
                        {booking.firstRentPaid ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-slate-200" />
                        )}
                        <span className="text-sm font-black text-slate-900">Rent Payment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Actions */}
              {!booking.firstRentPaid && booking.roomNumber && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-accent-primary/5 border-2 border-accent-primary/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">Pay First Month&apos;s Rent</h3>
                    <p className="text-slate-500 font-bold leading-relaxed">Your room has been assigned! Pay your first month&apos;s rent of ₹6,000 to proceed with check-in.</p>
                  </div>
                  <button
                    onClick={handleRentPayment}
                    disabled={paying}
                    className="shrink-0 px-10 py-5 bg-accent-primary text-white rounded-2xl font-black text-lg hover:bg-accent-primary/90 transition-all shadow-xl shadow-accent-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center group"
                  >
                    {paying ? <Loader2 className="h-6 w-6 animate-spin" /> : "Pay ₹6,000 Now"}
                  </button>
                </motion.div>
              )}

              {booking.firstRentPaid && !booking.isCheckedIn && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-emerald-900">Ready to Check-in</h3>
                    <p className="text-emerald-700 font-bold leading-relaxed">All payments complete! You can now check into the hostel. Our wardens are waiting for you.</p>
                  </div>
                  <button
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    className="shrink-0 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center group"
                  >
                    {checkingIn ? <Loader2 className="h-6 w-6 animate-spin" /> : "Proceed to Check-in"}
                  </button>
                </motion.div>
              )}
            </div>

            <div className="space-y-8">
              {/* Rent Details (For Active Users) */}
              {booking.isCheckedIn && (
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-6">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-accent-primary" />
                    Rent Details
                  </h3>
                  <div className="space-y-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Next Due Date</p>
                      <p className="text-xl font-black text-slate-900">
                        {booking.rentDueDate ? new Date(booking.rentDueDate).toLocaleDateString() : "Not Set"}
                      </p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Last Payment</p>
                      <p className="text-xl font-black text-slate-900">
                        {booking.lastRentPaidAt ? new Date(booking.lastRentPaidAt).toLocaleDateString() : "No Payments"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                <h3 className="font-black text-slate-900 mb-6 flex items-center text-xl uppercase tracking-tight">
                  <Shield className="h-6 w-6 mr-3 text-accent-primary transition-colors duration-300" />
                  Resident Rules
                </h3>
                <ul className="space-y-4">
                  {["Curfew at 10:00 PM", "No outside guests after 8:00 PM", "Keep rooms clean", "Respect quiet hours"].map((rule, i) => (
                    <li key={i} className="text-sm text-slate-600 font-bold flex items-center">
                      <div className="w-2 h-2 bg-accent-secondary rounded-full mr-4 shrink-0 transition-colors duration-300" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Services Section */}
          {booking.isCheckedIn && (
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
          )}
        </div>
      )}
    </div>
 );
}
