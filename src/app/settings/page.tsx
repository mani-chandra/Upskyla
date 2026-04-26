"use client";

import { useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboard } from "@/lib/context/DashboardContext";
import { User, Mail, Camera, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, refreshUser } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Account Settings</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage your profile information and account preferences.</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-accent-primary/5 to-transparent">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl text-accent-primary font-black overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-105">
                  {formData.image ? (
                    <Image 
                      src={formData.image} 
                      alt="Profile" 
                      fill
                      className="object-cover" 
                    />
                  ) : (
                    formData.name?.[0]?.toUpperCase() || <User className="h-16 w-16" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 p-2 bg-accent-primary rounded-full shadow-lg border-4 border-slate-900 cursor-pointer hover:scale-110 transition-transform">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-white">{user?.name || "Student"}</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{user?.role || "STUDENT"}</p>
                <p className="text-slate-500 text-sm mt-2 font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all font-medium"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all font-medium"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Profile Image URL</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Camera className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary transition-colors" />
                  </div>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all font-medium"
                    placeholder="Enter image URL (e.g., https://example.com/photo.jpg)"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex-1">
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-emerald-400 font-bold text-sm"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Profile updated successfully!
                  </motion.div>
                )}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-rose-400 font-bold text-sm"
                  >
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </motion.div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-accent-primary/20 transition-all active:scale-95"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
