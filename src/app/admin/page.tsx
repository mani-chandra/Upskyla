"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, 
  Settings, 
  CreditCard, 
  Flag, 
  Calendar,
  MessageSquare,
  BookOpen,
  Plus,
  Loader2,
  Gift,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const adminModules = [
  { name: "User Management", icon: Users, count: 1254, color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Feature Flags", icon: Flag, count: 12, color: "text-amber-600", bg: "bg-amber-50" },
  { name: "Payments", icon: CreditCard, count: 85, color: "text-emerald-600", bg: "bg-emerald-50" },
  { name: "Bookings", icon: Calendar, count: 42, color: "text-indigo-600", bg: "bg-indigo-50" },
  { name: "Complaints", icon: MessageSquare, count: 8, color: "text-red-600", bg: "bg-red-50" },
  { name: "Courses", icon: BookOpen, count: 15, color: "text-purple-600", bg: "bg-purple-50" },
];

export default function AdminDashboardPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/feature-flags").then(res => res.json()),
      fetch("/api/admin/referrals").then(res => res.json()),
      fetch("/api/admin/withdrawals").then(res => res.json())
    ]).then(([flagsData, referralsData, withdrawalsData]) => {
      setFlags(flagsData);
      setReferrals(referralsData.referrals || []);
      setWithdrawals(withdrawalsData || []);
    }).finally(() => setDataLoading(false));
  }, []);

  const toggleFlag = async (name: string, isEnabled: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, isEnabled: !isEnabled }),
      });
      if (res.ok) {
        const updatedFlags = flags.map(f => f.name === name ? { ...f, isEnabled: !isEnabled } : f);
        setFlags(updatedFlags);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: id, status }),
      });
      if (res.ok) {
        setWithdrawals(withdrawals.filter(w => w.id !== id));
        alert(`Withdrawal ${status.toLowerCase()} successfully`);
      }
    } catch (error) {
      console.error("Error updating withdrawal:", error);
    }
  };

  if (dataLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Overview of the entire student ecosystem platform.</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {adminModules.map((module) => (
            <div key={module.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className={cn("inline-flex p-2 rounded-lg mb-3", module.bg, module.color)}>
                <module.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-gray-500">{module.name}</p>
              <p className="text-xl font-bold text-gray-900">{module.count}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Flags Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="font-semibold text-gray-900">Module Feature Flags</h2>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Admin Only</span>
            </div>
            <div className="divide-y divide-gray-100">
              {["consultancy", "hostel", "courses", "taxi", "jobs", "gaming", "theatre"].map((moduleName) => {
                const flag = flags.find(f => f.name === moduleName);
                const isEnabled = flag?.isEnabled ?? true;

                return (
                  <div key={moduleName} className="px-6 py-4 flex items-center justify-between">
                    <div className="capitalize">
                      <p className="text-sm font-medium text-gray-900">{moduleName} Module</p>
                      <p className="text-xs text-gray-500">Enable or disable this module for students.</p>
                    </div>
                    <button
                      onClick={() => toggleFlag(moduleName, isEnabled)}
                      disabled={loading}
                      className={cn(
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2",
                        isEnabled ? "bg-primary-600" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          isEnabled ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referral Tracking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center">
                <Gift className="h-5 w-5 mr-2 text-indigo-500" />
                Referral Tracking
              </h2>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referrals.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-sm">No referrals yet.</td>
                    </tr>
                  ) : (
                    referrals.slice(0, 5).map((ref, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ref.referrer.name || ref.referrer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ref.referredUser.name || ref.referredUser.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider",
                            ref.status === "REWARD_CREDITED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {ref.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Withdrawal Approvals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
                Withdrawal Requests
              </h2>
              <span className="text-xs text-amber-600 font-medium">Action Required</span>
            </div>
            <div className="divide-y divide-gray-100">
              {withdrawals.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500 text-sm">No pending requests.</div>
              ) : (
                withdrawals.map((w, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{w.user.name || w.user.email}</p>
                      <p className="text-xs text-emerald-600 font-bold">{formatCurrency(w.amount)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleWithdrawal(w.id, "WITHDRAWN")}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Approve"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleWithdrawal(w.id, "CANCELLED")}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Payments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="font-semibold text-gray-900">Recent Payments</h2>
              <Link href="/admin/payments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { user: "John Doe", module: "Hostel", amount: 6000, status: "captured" },
                    { user: "Jane Smith", module: "Courses", amount: 2499, status: "captured" },
                    { user: "Bob Wilson", module: "Taxi", amount: 450, status: "failed" },
                  ].map((pay, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{pay.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pay.module}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(pay.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          pay.status === "captured" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Minimal Link component for admin page
function Link({ href, children, className }: any) {
  return <a href={href} className={className}>{children}</a>;
}
