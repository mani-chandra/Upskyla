import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, orderId, signature, couponId } = await req.json();

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

      // Create Hostel Booking
      const booking = await tx.hostelBooking.create({
        data: {
          userId: session.user.id,
          roomNumber: "TBD", // To be decided by admin
          status: "PENDING",
          checkIn: new Date(),
          paymentId: updatedPayment.id,
        },
      });

      // If coupon used, mark it as used
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { isUsed: true },
        });
      }

      // Update Referral status if exists
      const referral = await tx.referral.findUnique({
        where: { referredUserId: session.user.id },
      });

      if (referral) {
        await tx.referral.update({
          where: { id: referral.id },
          data: { status: "ADVANCE_PAID" },
        });
      }

      return { booking, referral };
    });

    return NextResponse.json({
      message: "Booking successful",
      booking: result.booking,
    });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred during booking" },
      { status: 500 }
    );
  }
}
