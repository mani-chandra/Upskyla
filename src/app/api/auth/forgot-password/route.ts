import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "node:crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, don't reveal if user exists or not
      return NextResponse.json(
        { message: "If an account exists with this email, a reset link will be sent." },
        { status: 200 }
      );
    }

    // Generate token and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    // IMPORTANT: Integrate an email provider here (e.g., Resend, SendGrid, etc.)
    // For now, we'll log it in development and simulate success
    console.log("------------------------------------------");
    console.log(`PASSWORD RESET REQUEST FOR: ${email}`);
    console.log(`RESET URL: ${resetUrl}`);
    console.log("------------------------------------------");

    return NextResponse.json(
      { 
        message: "Reset link sent! Please check your email.",
        // We include the URL in the response ONLY for development purposes
        // In production, this should ONLY be sent via email
        ...(process.env.NODE_ENV === "development" ? { debugUrl: resetUrl } : {})
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "An internal error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
