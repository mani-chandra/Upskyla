import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
        data.status = "CONFIRMED";
      }

      const booking = await tx.hostelBooking.update({
        where: { id: bookingId },
        data,
        include: { user: true },
      });

      // 2. Check if both conditions are met to trigger referral reward
      if (booking.isCheckedIn && booking.firstRentPaid) {
        // Find the referral record for this student
        const referral = await tx.referral.findUnique({
          where: { referredUserId: booking.userId },
        });

        // If referral exists and is not already rewarded
        if (referral && referral.status !== "REWARD_CREDITED") {
          // Update referral status
          await tx.referral.update({
            where: { id: referral.id },
            data: { status: "ELIGIBLE_FOR_WITHDRAWAL" },
          });

          // Credit the referrer's wallet
          const rewardAmount = 750;
          
          // Upsert wallet (just in case)
          const wallet = await tx.wallet.upsert({
            where: { userId: referral.referrerId },
            create: { userId: referral.referrerId, balance: rewardAmount },
            update: { balance: { increment: rewardAmount } },
          });

          // Create wallet transaction
          await tx.walletTransaction.create({
            data: {
              userId: referral.referrerId,
              amount: rewardAmount,
              type: "CREDIT",
              status: "APPROVED",
              referralId: referral.id,
            },
          });

          // Mark referral as credited
          await tx.referral.update({
            where: { id: referral.id },
            data: { status: "REWARD_CREDITED" },
          });
        }
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
