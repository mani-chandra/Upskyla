import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await (prisma.user as any).findUnique({
      where: { id: session.user.id },
      include: {
        hostelBooking: {
          include: {
            payment: true,
          },
        },
        coupons: {
          where: { isUsed: false },
        },
        wallet: true,
        referralsMade: {
          include: {
            referredUser: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const responseData = {
      hostelBooking: user.hostelBooking || null,
      coupons: user.coupons || [],
      wallet: user.wallet || null,
      referralCode: user.referralCode || "",
      referrals: user.referralsMade || [],
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Hostel status error:", error);
    return NextResponse.json(
      { message: "An error occurred fetching hostel status" },
      { status: 500 }
    );
  }
}
