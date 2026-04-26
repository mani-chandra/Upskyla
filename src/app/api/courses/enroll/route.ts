import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import crypto from "crypto";
import { processReferralReward } from "@/lib/referral-utils";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, orderId, signature, courseId } = await req.json();

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
      // Find and update payment status
      const payment = await tx.payment.update({
        where: { providerId: orderId },
        data: { 
          status: "captured",
          type: "COURSE_ENROLLMENT"
        } as any,
      });

      // Create enrollment
      const enrollment = await tx.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: courseId,
        },
      });

      // Connect payment to enrollment
      await tx.payment.update({
        where: { id: payment.id },
        data: { 
          enrollment: {
            connect: { id: enrollment.id }
          }
        }
      });

      // Process referral reward if applicable
      await processReferralReward(tx, session.user.id, 'COURSE');

      return enrollment;
    });

    return NextResponse.json({ success: true, enrollment: result });
  } catch (error: any) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred during enrollment" },
      { status: 500 }
    );
  }
}
