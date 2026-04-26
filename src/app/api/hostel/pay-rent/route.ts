import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { addMonths } from "date-fns";
import { processReferralReward } from "@/lib/referral-utils";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, orderId, signature } = await req.json();

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generated_signature !== signature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    // 2. Start Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find the payment record created earlier
      const payment = await tx.payment.findUnique({
        where: { providerId: orderId },
      });

      if (!payment) {
        throw new Error("Payment record not found");
      }

      // Update payment status
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: { status: "captured" },
      });

      // Find user's hostel booking
      const booking = await tx.hostelBooking.findUnique({
        where: { userId: session.user.id }
      });

      if (!booking) {
        throw new Error("Hostel booking not found");
      }

      // Update Hostel Booking with first rent payment info
      const updatedBooking = await tx.hostelBooking.update({
        where: { id: booking.id },
        data: {
          firstRentPaid: true,
          lastRentPaidAt: new Date(),
          // Next rent due date is exactly 1 month from now
          rentDueDate: addMonths(new Date(), 1),
          payments: {
            connect: { id: updatedPayment.id }
          }
        },
      });

      // Process referral reward if applicable
      await processReferralReward(tx, session.user.id);

      return { booking: updatedBooking };
    });

    return NextResponse.json({
      message: "Rent payment successful",
      booking: result.booking,
    });
  } catch (error: any) {
    console.error("Rent payment error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred during rent payment" },
      { status: 500 }
    );
  }
}
