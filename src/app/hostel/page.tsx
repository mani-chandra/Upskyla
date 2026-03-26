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
  AlertCircle
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useDashboard } from "@/lib/context/DashboardContext";

const services = [
  { id: 1, name: "Gaming Café", icon: Gamepad, color: "text-purple-600", bg: "bg-purple-50", description: "Book high-end gaming slots." },
  { id: 2, name: "Private Theatre", icon: Film, color: "text-red-600", bg: "bg-red-50", description: "Movie night with friends." },
  { id: 3, name: "Maintenance", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", description: "Raise a support ticket." },
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

      // 1. Create Razorpay Order
      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "Student Ecosystem",
        description: "Hostel Advance Payment",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment and Create Booking
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
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const hasBooking = status?.hostelBooking;
  const hasCoupon = !!(status?.coupons && status.coupons.length > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hostel Management</h1>
        <p className="text-gray-500">Your home away from home. Manage your stay and services.</p>
      </div>

      {!hasBooking ? (
        /* Advance Payment Section */
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Hostel Advance Payment
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Secure your spot today</h2>
              <p className="text-gray-600 text-lg mb-6">
                Pay your hostel advance to complete your registration and get room allotment.
              </p>
              
              {hasCoupon && (
                <div className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-green-800 font-semibold flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    ₹1000 New User Coupon Applied!
                  </p>
                  <p className="text-green-600 text-sm ml-7">
                    “₹7000 Advance – ₹1000 New User Coupon Applied – Pay ₹6000”
                  </p>
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  {formatCurrency(hasCoupon ? 6000 : 7000)}
                </span>
                {hasCoupon && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatCurrency(7000)}
                  </span>
                )}
              </div>

              <button
                onClick={handleAdvancePayment}
                disabled={paying}
                className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 flex items-center justify-center"
              >
                {paying ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay Advance Now"
                )}
              </button>
            </div>
            <div className="hidden lg:block relative">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 relative z-10 w-72">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Hotel className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Standard Room</p>
                <p className="text-xl font-bold text-gray-900 mb-4">All-inclusive stay</p>
                <ul className="space-y-2">
                  {["High-speed WiFi", "24/7 Security", "Daily Cleaning", "Electricity Incl."].map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-indigo-200 rounded-full blur-2xl opacity-50" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 bg-blue-200 rounded-full blur-2xl opacity-50" />
            </div>
          </div>
        </div>
      ) : (
        /* Room Info & Payment (Existing UI for paid users) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-4 rounded-xl mr-6">
                <Hotel className="h-10 w-10 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Room</p>
                <h2 className="text-3xl font-bold text-gray-900">
                  {status.hostelBooking.roomNumber || "Allotment Pending"}
                </h2>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Info className="h-4 w-4 mr-1" /> 
                    {status.hostelBooking.status === "PENDING" ? "Processing Booking" : "Room Allotted"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                status.hostelBooking.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
              )}>
                {status.hostelBooking.status}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-indigo-500" />
              Hostel Rules
            </h3>
            <ul className="space-y-3">
              {["Curfew at 10:00 PM", "No outside guests after 8:00 PM", "Keep rooms clean", "Respect quiet hours"].map((rule, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Services Grid (Always visible but maybe limited if no booking?) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className={cn("inline-flex p-3 rounded-lg mb-4", service.bg, service.color)}>
              <service.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{service.description}</p>
            <button 
              disabled={!hasBooking}
              className={cn(
                "text-sm font-medium flex items-center group",
                hasBooking ? "text-indigo-600 hover:text-indigo-700" : "text-gray-400 cursor-not-allowed"
              )}
            >
              Book Slot
              <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
            {!hasBooking && (
              <p className="text-[10px] text-amber-600 mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> Pay advance to unlock
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Complaints Section */}
      {hasBooking && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Complaints</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">New Complaint</button>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { id: 1, subject: "AC not cooling", status: "In Progress", date: "Mar 18, 2026" },
              { id: 2, subject: "WiFi connectivity issue", status: "Resolved", date: "Mar 15, 2026" },
            ].map((ticket) => (
              <div key={ticket.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                  <p className="text-xs text-gray-500">{ticket.date}</p>
                </div>
                <span className={cn(
                  "px-2 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider",
                  ticket.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                )}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
