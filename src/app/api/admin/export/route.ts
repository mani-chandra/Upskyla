import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const [users, hostelBookings, enrollments, payments] = await Promise.all([
      prisma.user.findMany({
        include: { profile: true },
      }),
      prisma.hostelBooking.findMany({
        include: { user: true },
      }),
      prisma.enrollment.findMany({
        include: { user: true, course: true },
      }),
      prisma.payment.findMany({
        include: { user: true },
      }),
    ]);

    const usersData = users.map((u) => ({
      ID: u.id,
      Name: u.name || "N/A",
      Email: u.email,
      Role: u.role,
      "Phone": u.profile?.phone || "N/A",
      "Referral Code": u.referralCode,
      "Created At": u.createdAt.toISOString(),
    }));

    const hostelData = hostelBookings.map((b) => ({
      ID: b.id,
      "Student Name": b.user.name || "N/A",
      "Student Email": b.user.email,
      Status: b.status,
      "Room Number": b.roomNumber || "N/A",
      "Approx Check-In": b.approxCheckIn.toISOString(),
      "Actual Check-In": b.actualCheckIn?.toISOString() || "N/A",
      "Advance Paid": b.advancePaid ? "Yes" : "No",
      "First Rent Paid": b.firstRentPaid ? "Yes" : "No",
      "Checked In": b.isCheckedIn ? "Yes" : "No",
    }));

    const enrollmentData = enrollments.map((e) => ({
      ID: e.id,
      "Student Name": e.user.name || "N/A",
      "Student Email": e.user.email,
      "Course Title": e.course.title,
      Progress: `${e.progress}%`,
      Completed: e.completed ? "Yes" : "No",
      "Enrolled At": e.enrolledAt.toISOString(),
    }));

    const paymentData = payments.map((p) => ({
      ID: p.id,
      "User Name": p.user.name || "N/A",
      "User Email": p.user.email,
      Amount: p.amount,
      Currency: p.currency,
      Provider: p.provider,
      Status: p.status,
      Type: p.type,
      "Created At": p.createdAt.toISOString(),
    }));

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(usersData);
    XLSX.utils.book_append_sheet(wb, ws1, "Users");

    const ws2 = XLSX.utils.json_to_sheet(hostelData);
    XLSX.utils.book_append_sheet(wb, ws2, "Hostel Bookings");

    const ws3 = XLSX.utils.json_to_sheet(enrollmentData);
    XLSX.utils.book_append_sheet(wb, ws3, "Course Enrollments");

    const ws4 = XLSX.utils.json_to_sheet(paymentData);
    XLSX.utils.book_append_sheet(wb, ws4, "Payments");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=upskyla-export-${new Date().toISOString().split('T')[0]}.xlsx`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { message: "Failed to generate export" },
      { status: 500 }
    );
  }
}
