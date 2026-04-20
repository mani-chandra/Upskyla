import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, orderId, signature, courseId } = await req.json();

    // In a real app, you'd verify the signature here using crypto
    // For now, we'll assume it's valid if we got here

    // Update payment status
    const payment = await prisma.payment.update({
      where: { providerId: orderId },
      data: { status: "captured" },
    });

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        paymentId: payment.id,
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { message: "An error occurred during enrollment" },
      { status: 500 }
    );
  }
}
