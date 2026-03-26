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
    // Simulate withdrawal request
    setTimeout(() => {
      alert("Withdrawal request submitted! Admin will approve it shortly.");
      setWithdrawing(false);
    }, 1500);
  };

  if (loading) {
    return (
      <ModuleLayout moduleName="wallet">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
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
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wallet & Referrals</h1>
            <p className="text-gray-500">Earn ₹750 for every successful hostel referral.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-mono font-bold border border-indigo-100">
              {status?.referralCode}
            </div>
            <button 
              onClick={copyReferralCode}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-indigo-600"
              title="Copy Referral Code"
            >
              {copied ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Wallet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <WalletIcon className="h-8 w-8 opacity-80" />
                <CreditCard className="h-6 w-6 opacity-40" />
              </div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Total Balance</p>
              <h2 className="text-4xl font-bold mb-8">{formatCurrency(balance)}</h2>
              <button
                onClick={handleWithdraw}
                disabled={balance < 750 || withdrawing}
                className="w-full py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {withdrawing ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Withdraw Funds"}
              </button>
              {balance < 750 && (
                <p className="text-[10px] text-indigo-200 mt-2 text-center flex items-center justify-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> Min. ₹750 to withdraw
                </p>
              )}
            </div>
            {/* Decorative circles */}
            <div className="absolute -bottom-12 -right-12 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-12 -left-12 h-40 w-40 bg-indigo-400/20 rounded-full blur-3xl" />
          </motion.div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-50 rounded-xl text-green-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+₹{successfulReferrals * 750}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Successful Referrals</p>
              <h3 className="text-3xl font-bold text-gray-900">{successfulReferrals}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Potential: ₹{pendingReferrals * 750}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Referrals</p>
              <h3 className="text-3xl font-bold text-gray-900">{pendingReferrals}</h3>
            </div>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-500" />
              Referral History
            </h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs text-gray-500">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1" /> Credited
              </span>
              <span className="flex items-center text-xs text-gray-500">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-1" /> Pending
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Reward</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No referrals yet. Share your code to start earning!</p>
                    </td>
                  </tr>
                ) : (
                  referrals.map((ref: any) => (
                    <tr key={ref.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{ref.referredUser.name || "Student"}</div>
                        <div className="text-xs text-gray-500">{ref.referredUser.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider",
                          ref.status === "REWARD_CREDITED" ? "bg-green-100 text-green-700" : 
                          ref.status === "REGISTERED" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {ref.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₹{ref.rewardAmount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
          <h3 className="font-bold text-indigo-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" /> How to earn ₹750?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Share Code", desc: "Share your unique referral code with friends." },
              { step: "02", title: "Friend Registers", desc: "They register and pay the hostel advance." },
              { step: "03", title: "Get Rewarded", desc: "Once they check-in and pay first rent, you get ₹750!" }
            ].map((s, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl font-black text-indigo-200">{s.step}</span>
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">{s.title}</h4>
                  <p className="text-indigo-700 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
