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
  ExternalLink,
  Shield,
  UserCheck,
  Home,
  DollarSign
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [hostelBookings, setHostelBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [flagsData, referralsData, withdrawalsData, usersData, hostelData] = await Promise.all([
        fetch("/api/feature-flags").then(res => res.json()),
        fetch("/api/admin/referrals").then(res => res.json()),
        fetch("/api/admin/withdrawals").then(res => res.json()),
        fetch("/api/admin/users").then(res => res.json()),
        fetch("/api/admin/hostel/bookings").then(res => res.json())
      ]);

      setFlags(flagsData);
      setReferrals(referralsData.referrals || []);
      setWithdrawals(withdrawalsData || []);
      setUsers(usersData || []);
      setHostelBookings(hostelData || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const toggleFlag = async (name: string, isEnabled: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, isEnabled: !isEnabled }),
      });
      if (res.ok) {
        setFlags(prev => prev.map(f => f.name === name ? { ...f, isEnabled: !isEnabled } : f));
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
        setWithdrawals(prev => prev.filter(w => w.id !== id));
      }
    } catch (error) {
      console.error("Error updating withdrawal:", error);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const updateHostelStatus = async (bookingId: string, field: string, value: boolean) => {
    try {
      const res = await fetch("/api/admin/hostel/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, field, value }),
      });
      if (res.ok) {
        setHostelBookings(prev => prev.map(b => b.id === bookingId ? { ...b, [field]: value } : b));
        // Refresh referrals if status triggers reward
        if (field === "isCheckedIn" || field === "firstRentPaid") {
          fetch("/api/admin/referrals").then(res => res.json()).then(data => setReferrals(data.referrals || []));
        }
      }
    } catch (error) {
      console.error("Error updating hostel status:", error);
    }
  };

  if (dataLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-accent-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-16" data-theme="dashboard">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
              <Shield className="h-10 w-10 mr-4 text-accent-primary" />
              Admin Control Center
            </h1>
            <p className="text-slate-500 font-medium mt-2">Manage users, bookings, and platform features with full authority.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={fetchData}
              className="flex items-center px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              Refresh Data
            </button>
            <button 
              onClick={() => alert("Opening announcement editor... Feature coming soon!")}
              className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-accent-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Announcement
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Total Users" count={users.length} icon={Users} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Hostel Bookings" count={hostelBookings.length} icon={Home} color="text-indigo-600" bg="bg-indigo-50" />
          <StatCard title="Pending Withdrawals" count={withdrawals.length} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard title="Total Referrals" count={referrals.length} icon={Gift} color="text-amber-600" bg="bg-amber-50" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* User Management */}
          <AdminCard title="User Management" icon={Users} badge={`${users.length} Users`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.slice(0, 10).map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-900 group-hover:text-accent-primary transition-colors">{user.name || "Unnamed User"}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest border",
                          user.role === "ADMIN" ? "bg-purple-50 text-purple-700 border-purple-100" :
                          user.role === "STAFF" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="text-xs font-black bg-white border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all cursor-pointer"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="STAFF">Staff</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>

          {/* Hostel Management */}
          <AdminCard title="Hostel Management" icon={Home} badge={`${hostelBookings.length} Bookings`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {hostelBookings.slice(0, 10).map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-900 group-hover:text-accent-primary transition-colors">{booking.user.name || booking.user.email}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Room: {booking.roomNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <StatusBadge active={booking.isCheckedIn} label="Checked In" />
                          <StatusBadge active={booking.firstRentPaid} label="Rent Paid" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <ToggleButton 
                            active={booking.isCheckedIn} 
                            onClick={() => updateHostelStatus(booking.id, "isCheckedIn", !booking.isCheckedIn)}
                            label="Check-in"
                          />
                          <ToggleButton 
                            active={booking.firstRentPaid} 
                            onClick={() => updateHostelStatus(booking.id, "firstRentPaid", !booking.firstRentPaid)}
                            label="Rent"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Feature Flags */}
          <AdminCard title="Module Controls" icon={Flag} className="xl:col-span-1">
            <div className="divide-y divide-slate-100">
              {["consultancy", "hostel", "courses", "taxi", "jobs", "gaming", "theatre"].map((moduleName) => {
                const flag = flags.find(f => f.name === moduleName);
                const isEnabled = flag?.isEnabled ?? true;
                return (
                  <div key={moduleName} className="py-5 flex items-center justify-between group">
                    <span className="text-sm font-black capitalize text-slate-700 group-hover:text-slate-900 transition-colors tracking-tight">{moduleName}</span>
                    <button
                      onClick={() => toggleFlag(moduleName, isEnabled)}
                      disabled={loading}
                      className={cn(
                        "relative inline-flex h-6 w-12 items-center rounded-full transition-all focus:outline-none shadow-inner",
                        isEnabled ? "bg-accent-primary" : "bg-slate-200"
                      )}
                    >
                      <span className={cn(
                        "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md",
                        isEnabled ? "translate-x-6" : "translate-x-1"
                      )} />
                    </button>
                  </div>
                );
              })}
            </div>
          </AdminCard>

          {/* Withdrawal Requests */}
          <AdminCard title="Withdrawals" icon={DollarSign} className="xl:col-span-1" badge={`${withdrawals.length} Pending`}>
            <div className="divide-y divide-slate-100">
              {withdrawals.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="bg-slate-50 p-4 rounded-2xl inline-block mb-4">
                    <TrendingUp className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No pending requests</p>
                </div>
              ) : (
                withdrawals.map((w) => (
                  <div key={w.id} className="py-5 flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-accent-primary transition-colors">{w.user.name || w.user.email}</p>
                      <p className="text-lg font-black text-emerald-600 tracking-tight">{formatCurrency(w.amount)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleWithdrawal(w.id, "WITHDRAWN")} className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100 shadow-sm active:scale-90">
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleWithdrawal(w.id, "CANCELLED")} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm active:scale-90">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          {/* Recent Referrals */}
          <AdminCard title="Recent Referrals" icon={Gift} className="xl:col-span-1">
            <div className="divide-y divide-slate-100">
              {referrals.slice(0, 6).map((ref) => (
                <div key={ref.id} className="py-5 group">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-black text-slate-900 group-hover:text-accent-primary transition-colors tracking-tight">{ref.referrer.name || ref.referrer.email}</p>
                    <span className={cn(
                      "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-sm border",
                      ref.status === "REWARD_CREDITED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {ref.status.split("_")[0]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Referred: {ref.referredUser.name || ref.referredUser.email}</p>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, count, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
      <div className={cn("inline-flex p-4 rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", bg, color)}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <p className="text-4xl font-black text-slate-900 tracking-tight">{count}</p>
    </div>
  );
}

function AdminCard({ title, icon: Icon, children, badge, className }: any) {
  return (
    <div className={cn("bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group hover:border-accent-primary/20 transition-all duration-300", className)}>
      <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Icon className="h-5 w-5 text-slate-500 group-hover:text-accent-primary transition-colors" />
          </div>
          <h2 className="font-black text-slate-900 text-sm uppercase tracking-tight">{title}</h2>
        </div>
        {badge && <span className="text-[10px] font-black bg-accent-primary/10 text-accent-primary px-3 py-1.5 rounded-lg border border-accent-primary/20 shadow-sm uppercase tracking-widest">{badge}</span>}
      </div>
      <div className="p-10">{children}</div>
    </div>
  );
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]", active ? "bg-emerald-500 shadow-emerald-500/50" : "bg-slate-300")} />
      <span className={cn("text-[10px] font-black uppercase tracking-widest", active ? "text-emerald-700" : "text-slate-400")}>{label}</span>
    </div>
  );
}

function ToggleButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-[10px] font-black rounded-xl border transition-all shadow-sm active:scale-90 uppercase tracking-widest",
        active 
          ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100" 
          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}

