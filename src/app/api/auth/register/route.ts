import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import crypto from "crypto";

function generateCode(length = 8) {
  return crypto.randomBytes(length).toString("hex").slice(0, length).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const { email, password, name, referralCode: usedReferralCode } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a unique referral code for the new user
    const newReferralCode = generateCode(8);

    // Check if a referral code was used
    let referrer = null;
    if (usedReferralCode && usedReferralCode.trim() !== "") {
      try {
        referrer = await (prisma.user as any).findUnique({
          where: { referralCode: usedReferralCode.trim() },
        });

        // Self-referral prevention
        if (referrer && referrer.email === email) {
          return NextResponse.json(
            { message: "You cannot refer yourself" },
            { status: 400 }
          );
        }
      } catch (err) {
        console.error("Error looking up referrer:", err);
        // Don't fail the whole registration if referrer lookup fails, 
        // just proceed without a referrer
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        referralCode: newReferralCode,
        referredByCode: referrer ? usedReferralCode.trim() : null,
        profile: {
          create: {},
        },
        wallet: {
          create: {
            balance: 0,
          },
        },
        // Automatically give ₹1000 coupon to every new user
        coupons: {
          create: {
            code: `WELCOME-${generateCode(6)}`,
            amount: 1000,
          },
        } as any,
      } as any,
    });

    // If there's a referrer, create a Referral record
    if (referrer) {
      try {
        await (prisma as any).referral.create({
          data: {
            referrerId: referrer.id,
            referredUserId: user.id,
            status: "REGISTERED",
          },
        });
      } catch (err) {
        console.error("Error creating referral record:", err);
      }
    }

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Full Registration error details:", {
      message: errorMsg,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    return NextResponse.json(
      { message: errorMsg || "An error occurred during registration" },
      { status: 500 }
    );
  }
}
