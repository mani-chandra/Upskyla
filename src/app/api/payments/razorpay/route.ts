import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency = "INR", type = "OTHER" } = await req.json();

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save payment record to database
    await prisma.payment.create({
      data: {
        amount,
        currency,
        providerId: order.id,
        status: "created",
        type: type,
        userId: session.user.id,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay error:", error);
    return NextResponse.json(
      { message: "An error occurred creating payment order" },
      { status: 500 }
    );
  }
}


// A49, A50, A45, A03