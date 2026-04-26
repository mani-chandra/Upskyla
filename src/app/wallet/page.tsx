"use client";

import { useEffect, useState } from "react";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Users, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  TrendingUp,
  CreditCard,
  Gift
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

export default function WalletPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/hostel/status");
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(status?.referralCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async () => {
    if ((status?.wallet?.balance || 0) < 750) {
      alert("Minimum withdrawal amount is ₹750");
      return;
    }
    setWithdrawing(true);
    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: status.wallet.balance }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Withdrawal request submitted! Admin will approve it shortly.");
        fetchStatus(); // Refresh balance
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

  if (loading) {
    return (
      <ModuleLayout moduleName="wallet">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-accent-primary animate-spin transition-colors duration-300" />
        </div>
      </ModuleLayout>
    );
  }

  const balance = status?.wallet?.balance || 0;
  const referrals = status?.referrals || [];
  const successfulReferrals = referrals.filter((r: any) => r.status === "REWARD_CREDITED").length;
  const pendingReferrals = referrals.filter((r: any) => r.status !== "REWARD_CREDITED").length;

  return (
    <ModuleLayout moduleName="wallet">
      <div className="space-y-8 bg-module min-h-full transition-colors duration-300 px-4 sm:px-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Money & <span className="text-accent-primary">Reward</span></h1>
            <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Earn ₹750 for every successful hostel referral with full transparency.</p>
          </div>
          <div className="flex items-center justify-between gap-4 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 group max-w-sm mx-auto lg:mx-0 w-full lg:w-auto">
            <div className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 bg-accent-primary/10 text-accent-primary rounded-xl font-mono font-black border border-accent-primary/20 text-base sm:text-lg shadow-sm text-center">
              {status?.referralCode}
            </div>
            <button 
              onClick={copyReferralCode}
              className="p-2.5 sm:p-3 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-accent-primary hover:scale-110 active:scale-90 shrink-0"
              title="Copy Referral Code"
            >
              {copied ? <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" /> : <Copy className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Wallet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-primary-600 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl shadow-primary-200 relative overflow-hidden group transition-all duration-300 md:col-span-2 lg:col-span-1"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <div className="bg-white/20 p-3 sm:p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                  <WalletIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400 rounded-full border border-white/20 shadow-lg">
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-900" />
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-widest">Active Wallet</span>
                </div>
              </div>
              <p className="text-white/60 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2">Total Balance</p>
              <h2 className="text-4xl sm:text-5xl font-black mb-8 sm:mb-10 tracking-tight">{formatCurrency(balance)}</h2>
              <button
                onClick={handleWithdraw}
                disabled={balance < 750 || withdrawing}
                className="w-full py-4 sm:py-5 bg-white text-primary-600 rounded-xl sm:rounded-[1.5rem] font-black text-xs sm:text-sm hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10 hover:shadow-2xl active:scale-95 flex items-center justify-center group/btn"
              >
                {withdrawing ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    Withdraw Funds
                    <ArrowUpRight className="ml-2 h-5 w-5 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
              {balance < 750 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <p className="text-[10px] text-white/70 font-black uppercase tracking-widest">
                    Min. ₹750 required
                  </p>
                </div>
              )}
            </div>
            {/* Decorative circles */}
            <div className="absolute -bottom-16 -right-16 h-48 w-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
            <div className="absolute -top-16 -left-16 h-48 w-48 bg-white/5 rounded-full blur-3xl" />
          </motion.div>

          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group hover:border-accent-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 sm:px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100 shadow-sm">
                +₹{successfulReferrals * 750}
              </span>
            </div>
            <div className="mt-6 sm:mt-8">
              <p className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2">Successful Referrals</p>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{successfulReferrals}</h3>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group hover:border-accent-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="p-4 sm:p-5 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 sm:px-3 py-1.5 rounded-lg uppercase tracking-widest border border-amber-100 shadow-sm">
                Potential: ₹{pendingReferrals * 750}
              </span>
            </div>
            <div className="mt-6 sm:mt-8">
              <p className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2">Pending Referrals</p>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{pendingReferrals}</h3>
            </div>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden pb-8">
          <div className="px-6 sm:px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight flex items-center">
              <Users className="h-5 w-5 mr-3 text-accent-primary" />
              Referral History
            </h2>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="flex items-center text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Credited
              </span>
              <span className="flex items-center text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-2 shadow-[0_0_8px_rgba(245,158,11,0.5)]" /> Pending
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-left">
              <thead>
                <tr className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/30 border-b border-slate-50">
                  <th className="px-6 sm:px-10 py-5">Student</th>
                  <th className="px-6 sm:px-10 py-5">Status</th>
                  <th className="px-6 sm:px-10 py-5">Reward</th>
                  <th className="px-6 sm:px-10 py-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center">
                      <div className="bg-slate-50 p-6 rounded-3xl inline-block mb-6 shadow-inner">
                        <Gift className="h-12 w-12 mx-auto text-slate-200" />
                      </div>
                      <p className="text-slate-900 font-black text-lg mb-2">No referrals yet</p>
                      <p className="text-slate-500 text-sm font-medium">Share your code to start earning rewards!</p>
                    </td>
                  </tr>
                ) : (
                  referrals.map((ref: any) => (
                    <tr key={ref.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-10 py-6">
                        <div className="font-black text-slate-900 group-hover:text-accent-primary transition-colors">{ref.referredUser.name || "Student"}</div>
                        <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{ref.referredUser.email}</div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={cn(
                          "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border",
                          ref.status === "REWARD_CREDITED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {ref.status === "REWARD_CREDITED" ? "Credited" : "Pending"}
                        </span>
                      </td>
                      <td className="px-10 py-6 font-black text-slate-900">
                        {formatCurrency(750)}
                      </td>
                      <td className="px-10 py-6 text-sm text-slate-500 font-bold uppercase tracking-wider">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
