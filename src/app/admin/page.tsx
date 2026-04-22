"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
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
  DollarSign,
  FileText,
  Upload,
  Link as LinkIcon,
  AlertCircle
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { courses as initialCourses } from "@/lib/courses-data";

export default function AdminDashboardPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [hostelBookings, setHostelBookings] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [allotmentData, setAllotmentData] = useState({ block: "A", room: "1", bed: "1" });
  const [allotting, setAllotting] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementData, setAnnouncementData] = useState({ title: "", content: "", module: "GLOBAL" });
  const [creatingAnnouncement, setCreatingAnnouncement] = useState(false);
  const [uploadingCourseId, setUploadingCourseId] = useState<string | null>(null);
  const [editingCourseUrl, setEditingCourseUrl] = useState<{ id: string, url: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [flagsData, referralsData, withdrawalsData, usersData, hostelData, coursesData] = await Promise.all([
        fetch("/api/feature-flags").then(res => res.json()),
        fetch("/api/admin/referrals").then(res => res.json()),
        fetch("/api/admin/withdrawals").then(res => res.json()),
        fetch("/api/admin/users").then(res => res.json()),
        fetch("/api/admin/hostel/bookings").then(res => res.json()),
        fetch("/api/courses").then(res => res.json())
      ]);

      setFlags(flagsData);
      setReferrals(referralsData.referrals || []);
      setWithdrawals(withdrawalsData || []);
      setUsers(usersData || []);
      setHostelBookings(hostelData || []);

      // Merge with initialCourses to preserve icon components
      const mergedCourses = initialCourses.map(initialCourse => {
        const fetchedCourse = (coursesData || []).find((c: any) => c.id === initialCourse.id);
        if (fetchedCourse) {
          return {
            ...initialCourse,
            curriculumPdf: fetchedCourse.curriculumPdf || initialCourse.curriculumPdf
          };
        }
        return initialCourse;
      });
      setCourses(mergedCourses);
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

  const updateHostelStatus = async (bookingId: string, field: string | null, value: any, roomNumber?: string) => {
    try {
      if (roomNumber) setAllotting(true);
      const body: any = { bookingId };
      if (field) {
        body.field = field;
        body.value = value;
      }
      if (roomNumber) {
        body.roomNumber = roomNumber;
      }

      const res = await fetch("/api/admin/hostel/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setHostelBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...data.booking } : b));
        setSelectedBooking(null);
        if (roomNumber) {
          alert(`Successfully alloted room ${roomNumber} to the student!`);
        }
        // Refresh referrals if status triggers reward
        if (field === "isCheckedIn" || field === "firstRentPaid" || roomNumber) {
          fetch("/api/admin/referrals").then(res => res.json()).then(data => setReferrals(data.referrals || []));
        }
      } else {
        alert(`Error: ${data.message || "Failed to update status"}`);
      }
    } catch (error: any) {
      console.error("Error updating hostel status:", error);
      alert(`Network Error: ${error.message || "An unexpected error occurred. Please check your connection."}`);
    } finally {
      setAllotting(false);
    }
  };

  const handleAllotRoom = () => {
    if (!selectedBooking) return;
    if (!allotmentData.room || parseInt(allotmentData.room) < 1 || parseInt(allotmentData.room) > 33) {
      alert("Please enter a valid room number (1-33)");
      return;
    }
    const roomStr = `${allotmentData.block}-${allotmentData.room} (Bed ${allotmentData.bed})`;
    updateHostelStatus(selectedBooking.id, null, null, roomStr);
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementData.title || !announcementData.content) {
      alert("Title and content are required");
      return;
    }
    setCreatingAnnouncement(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementData),
      });
      if (res.ok) {
        alert("Announcement created successfully!");
        setShowAnnouncementModal(false);
        setAnnouncementData({ title: "", content: "", module: "GLOBAL" });
      } else {
        const data = await res.json();
        alert(`Error: ${data.message || "Failed to create announcement"}`);
      }
    } catch (error) {
      alert("Network Error: Failed to create announcement");
    } finally {
      setCreatingAnnouncement(false);
    }
  };

  const handleFileUpload = async (courseId: string, file: File) => {
    if (!file) return;
    setUploadingCourseId(courseId);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);

    try {
      const res = await fetch("/api/admin/courses/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCourses(prev => prev.map(c => 
          c.id === courseId ? { ...c, curriculumPdf: data.path } : c
        ));
        alert("Syllabus uploaded successfully!");
      } else {
        const errorData = await res.json();
        alert(`Failed to upload syllabus: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload");
    } finally {
      setUploadingCourseId(null);
    }
  };

  const handleUpdateSyllabusUrl = async (courseId: string, url: string) => {
    try {
      const res = await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, curriculumPdf: url }),
      });

      if (res.ok) {
        setCourses(prev => prev.map(c => 
          c.id === courseId ? { ...c, curriculumPdf: url } : c
        ));
        setEditingCourseUrl(null);
        alert("Syllabus URL updated successfully!");
      } else {
        alert("Failed to update syllabus URL");
      }
    } catch (error) {
      console.error("Error updating syllabus URL:", error);
      alert("An error occurred during update");
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
      <div className="space-y-8 pb-12 px-4 sm:px-0">
        {selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Allot Room</h3>
                <p className="text-slate-500 font-medium text-sm">Assign a room and bed to {selectedBooking.user.name || selectedBooking.user.email}</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Block</label>
                    <select 
                      value={allotmentData.block}
                      onChange={(e) => setAllotmentData({ ...allotmentData, block: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    >
                      <option value="A">Block A</option>
                      <option value="B">Block B</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room (1-33)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="33"
                      value={allotmentData.room}
                      onChange={(e) => setAllotmentData({ ...allotmentData, room: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bed Selection (1-4)</label>
                  <div className="grid grid-cols-4 gap-3">
                    {["1", "2", "3", "4"].map((bed) => (
                      <button
                        key={bed}
                        onClick={() => setAllotmentData({ ...allotmentData, bed })}
                        className={cn(
                          "py-3 rounded-xl font-black text-sm transition-all border",
                          allotmentData.bed === bed 
                            ? "bg-accent-primary text-white border-accent-primary shadow-lg shadow-accent-primary/20" 
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        {bed}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleAllotRoom}
                  disabled={allotting}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-accent-primary transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                >
                  {allotting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Allotment"}
                </button>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-4 bg-white text-slate-400 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showAnnouncementModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">New Announcement</h3>
                <p className="text-slate-500 font-medium text-sm">Post a message to the platform for all users.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Announcement Title</label>
                  <input 
                    type="text" 
                    placeholder="Important: Maintenance update..."
                    value={announcementData.title}
                    onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Module</label>
                  <select 
                    value={announcementData.module}
                    onChange={(e) => setAnnouncementData({ ...announcementData, module: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                  >
                    <option value="GLOBAL">Global (All)</option>
                    <option value="HOSTEL">Hostel Module</option>
                    <option value="COURSES">Courses (LMS)</option>
                    <option value="ADMIN">Admin Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
                  <textarea 
                    rows={4}
                    placeholder="Enter announcement details here..."
                    value={announcementData.content}
                    onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleCreateAnnouncement}
                  disabled={creatingAnnouncement}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-accent-primary transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                >
                  {creatingAnnouncement ? <Loader2 className="h-5 w-5 animate-spin" /> : "Post Announcement"}
                </button>
                <button 
                  onClick={() => setShowAnnouncementModal(false)}
                  className="flex-1 py-4 bg-white text-slate-400 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 mr-3 text-accent-primary" />
              Admin <span className="text-accent-primary ml-2">Control Panel</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">System-wide configuration and user management.</p>
          </div>
          <button 
            onClick={() => setShowAnnouncementModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Total Users" count={users.length} icon={Users} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Active Courses" count={courses.length} icon={BookOpen} color="text-purple-600" bg="bg-purple-50" />
          <StatCard title="Hostel Bookings" count={hostelBookings.length} icon={Home} color="text-indigo-600" bg="bg-indigo-50" />
          <StatCard title="Pending Withdrawals" count={withdrawals.length} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* User Management */}
          <AdminCard title="User Access" icon={UserCheck} badge={`${users.length} Users`}>
            <div className="overflow-x-auto">
              <table className="min-w-[500px] w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-6 sm:px-8 py-4">User</th>
                    <th className="px-6 sm:px-8 py-4">Current Role</th>
                    <th className="px-6 sm:px-8 py-4 text-right">Actions</th>
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
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          {booking.roomNumber === "TBD" ? (
                            <button 
                              onClick={() => setSelectedBooking(booking)}
                              className="text-accent-primary hover:underline flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" /> Allot Room
                            </button>
                          ) : (
                            `Room: ${booking.roomNumber}`
                          )}
                        </p>
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* Course Curriculum Management */}
          <AdminCard title="Course Syllabus Management" icon={FileText} badge={`${courses.length} Courses`}>
            <div className="space-y-6">
              {/* Serverless Warning */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Deployment Note</p>
                  <p className="text-[10px] font-medium text-amber-700 leading-relaxed">
                    Direct file uploads are only supported in local development. For production (Vercel), please provide an external URL (Google Drive, Dropbox, etc.) to ensure the syllabus is always accessible.
                  </p>
                </div>
              </div>

              {courses.map((course) => (
                <div key={course.id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-accent-primary/30 transition-all">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl bg-white shadow-sm", course.color)}>
                          <course.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{course.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                            {course.curriculumPdf ? (
                              <span className="text-emerald-600">Syllabus: {course.curriculumPdf.split('/').pop()}</span>
                            ) : "No Syllabus Found"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {course.curriculumPdf && (
                          <a 
                            href={course.curriculumPdf} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 bg-white text-slate-400 hover:text-accent-primary rounded-xl border border-slate-200 shadow-sm transition-all"
                            title="View Current Syllabus"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button 
                          onClick={() => setEditingCourseUrl(editingCourseUrl?.id === course.id ? null : { id: course.id, url: course.curriculumPdf || "" })}
                          className={cn(
                            "p-2.5 rounded-xl border transition-all shadow-sm active:scale-95",
                            editingCourseUrl?.id === course.id ? "bg-accent-primary text-white border-accent-primary" : "bg-white text-slate-400 border-slate-200 hover:text-accent-primary"
                          )}
                          title="Edit Syllabus URL"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        <label className="relative cursor-pointer">
                          <input 
                            type="file" 
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(course.id, file);
                            }}
                          />
                          <div className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm active:scale-95",
                            uploadingCourseId === course.id 
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                              : "bg-slate-900 text-white hover:bg-accent-primary"
                          )}>
                            {uploadingCourseId === course.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">Upload File</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {editingCourseUrl?.id === course.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-2 flex gap-3"
                      >
                        <input 
                          type="url" 
                          placeholder="https://drive.google.com/file/..."
                          value={editingCourseUrl!.url}
                          onChange={(e) => setEditingCourseUrl({ ...editingCourseUrl!, url: e.target.value })}
                          className="flex-grow px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none transition-all"
                        />
                        <button 
                          onClick={() => handleUpdateSyllabusUrl(course.id, editingCourseUrl!.url)}
                          className="px-6 py-2.5 bg-accent-primary text-white rounded-xl font-black text-xs hover:bg-accent-secondary transition-all active:scale-95"
                        >
                          Save Link
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Feature Flags */}
          <AdminCard title="Module Controls" icon={Flag}>
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
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* Withdrawal Requests */}
          <AdminCard title="Withdrawals" icon={DollarSign} badge={`${withdrawals.length} Pending`}>
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
          <AdminCard title="Recent Referrals" icon={Gift}>
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

