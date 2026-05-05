import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "node:crypto";
import * as brevo from "@getbrevo/brevo";

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

    // Send email using Brevo if API key is available
    if (process.env.BREVO_API_KEY) {
      const apiInstance = new brevo.TransactionalEmailsApi();
      const apiKey = apiInstance.authentications['apiKey'];
      apiKey.apiKey = process.env.BREVO_API_KEY;

      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.sender = { name: "Upskyla", email: "no-reply@yourdomain.com" };
      sendSmtpEmail.to = [{ email: email, name: user.name || "User" }];
      sendSmtpEmail.subject = "Password Reset Request";
      sendSmtpEmail.htmlContent = `
        <html>
          <body>
            <h1>Password Reset Request</h1>
            <p>Hello ${user.name || "User"},</p>
            <p>You requested a password reset for your Upskyla account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best regards,<br>Upskyla Team</p>
          </body>
        </html>
      `;

      try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Reset email sent successfully to:", email);
      } catch (emailError) {
        console.error("Error sending reset email:", emailError);
      }
    } else {
      // Fallback for development without Brevo
      console.log("------------------------------------------");
      console.log(`PASSWORD RESET REQUEST FOR: ${email}`);
      console.log(`RESET URL: ${resetUrl}`);
      console.log("------------------------------------------");
    }

    return NextResponse.json(
      { 
        message: "Reset link sent! Please check your email.",
        ...(process.env.NODE_ENV === "development" && !process.env.BREVO_API_KEY ? { debugUrl: resetUrl } : {})
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
