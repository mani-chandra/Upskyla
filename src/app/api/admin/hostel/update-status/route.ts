import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { processReferralReward } from "@/lib/referral-utils";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, field, value, roomNumber } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ message: "Booking ID is required" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if booking exists
      const existing = await tx.hostelBooking.findUnique({
        where: { id: bookingId }
      });

      if (!existing) {
        throw new Error("Booking not found");
      }

      // 2. Prepare update data
      const data: any = {};
      if (field) {
        data[field] = value;
      }
      if (roomNumber) {
        data.roomNumber = roomNumber;
        data.status = "APPROVED";
      }

      const booking = await tx.hostelBooking.update({
        where: { id: bookingId },
        data,
        include: { user: true },
      });

      // 2. Check if conditions are met to trigger referral reward
      // The user wants it to trigger as soon as first rent is paid
      if (booking.firstRentPaid) {
        await processReferralReward(tx, booking.userId);
      }

      return booking;
    });

    return NextResponse.json({
      message: "Status updated and reward processed if eligible",
      booking: result,
    });
  } catch (error: any) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
