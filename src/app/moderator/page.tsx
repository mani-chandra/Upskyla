"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  Hotel, 
  Copy, 
  Check, 
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  IndianRupee,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Stats {
  totalReferred: number;
  totalRevenue: number;
  courseEnrollments: number;
  hostelBookings: number;
  referralCode: string;
  walletBalance: number;
}

interface Referral {
  id: string;
  studentName: string;
  studentEmail: string;
  totalPaid: number;
  rewardEarned: number;
  services: string[];
  joinedAt: string;
  status: string;
}

export default function ModeratorDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const [statsRes, referralsRes] = await Promise.all([
        fetch("/api/moderator/stats"),
        fetch("/api/moderator/referrals")
      ]);
      
      const statsData = await statsRes.json();
      const referralsData = await referralsRes.json();
      
      setStats(statsData);
      setReferrals(referralsData);
    } catch (error) {
      console.error("Error fetching moderator data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdraw = async () => {
    if ((stats?.walletBalance || 0) < 750) {
      alert("Minimum withdrawal amount is ₹750");
      return;
    }
    setWithdrawing(true);
    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: stats?.walletBalance }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Withdrawal request submitted! Admin will approve it shortly.");
        fetchData(); // Refresh stats/balance
      } else {
        alert(data.message || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setWithdrawing(false);
    }
  };

  const copyReferralCode = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyReferralLink = () => {
    if (stats?.referralCode) {
      const link = `${window.location.origin}/register?ref=${stats.referralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredReferrals = referrals.filter(ref => 
    ref.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return null; // Handled by DashboardLayout

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header & Referral Code */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Moderator <span className="text-primary-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Track your referrals and earnings in real-time.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referral Code</p>
                <p className="text-lg font-black text-slate-900">{stats?.referralCode}</p>
              </div>
              <button 
                onClick={copyReferralCode}
                className={cn(
                  "p-3 rounded-2xl transition-all active:scale-95",
                  copied ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <button 
              onClick={copyReferralLink}
              className="bg-primary-600 text-white px-6 py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center gap-3"
            >
              <ExternalLink className="w-5 h-5" />
              Copy Referral Link
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[
            { label: "Total Referred", value: stats?.totalReferred, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Revenue", value: formatCurrency(stats?.totalRevenue || 0), icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Course Sales", value: stats?.courseEnrollments, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "PG Bookings", value: stats?.hostelBookings, icon: Hotel, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={cn("p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </motion.div>
          ))}

          {/* Wallet Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-white flex flex-col justify-between"
          >
            <div>
              <div className="p-4 rounded-2xl w-fit mb-6 bg-white/10 text-white group-hover:scale-110 transition-transform">
                <IndianRupee className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Available Balance</p>
              <h3 className="text-3xl font-black text-white tracking-tight">{formatCurrency(stats?.walletBalance || 0)}</h3>
            </div>
            
            <button
              onClick={handleWithdraw}
              disabled={(stats?.walletBalance || 0) < 750 || withdrawing}
              className="mt-6 w-full py-3 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
            >
              {withdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  Withdraw
                  <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Referred Students</h2>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full md:w-[300px] text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Services Opted</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount Paid</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reward Earned</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredReferrals.length > 0 ? (
                  filteredReferrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-900 group-hover:text-primary-600 transition-colors">{ref.studentName}</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{ref.studentEmail}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                          {new Date(ref.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {ref.services.length > 0 ? (
                            ref.services.map((service, idx) => (
                              <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-primary-100">
                                {service}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">No services yet</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-900">{formatCurrency(ref.totalPaid)}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg w-fit">+{formatCurrency(ref.rewardEarned)}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
                          ref.status === "REWARD_CREDITED" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {ref.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                          <Users className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 uppercase tracking-tight">No referrals found</p>
                          <p className="text-sm text-slate-500 font-medium">Share your code to start growing your network.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
