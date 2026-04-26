import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { processReferralReward } from "@/lib/referral-utils";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.hostelBooking.findUnique({
      where: { userId: session.user.id }
    });

    if (!booking) {
      return NextResponse.json({ message: "No booking found" }, { status: 404 });
    }

    if (!(booking as any).advancePaid || !booking.firstRentPaid) {
      return NextResponse.json(
        { message: "Advance and first rent must be paid before check-in" },
        { status: 400 }
      );
    }

    if (!booking.roomNumber) {
      return NextResponse.json(
        { message: "A room must be assigned by the admin before check-in" },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.hostelBooking.update({
      where: { id: booking.id },
      data: {
        isCheckedIn: true,
        actualCheckIn: new Date(),
        status: "ACTIVE"
      } as any
    });

    // Process referral reward if applicable
     await processReferralReward(prisma, session.user.id, 'HOSTEL');

    return NextResponse.json({
      message: "Check-in successful",
      booking: updatedBooking
    });
  } catch (error: any) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred during check-in" },
      { status: 500 }
    );
  }
}
