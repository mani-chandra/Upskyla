import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "MODERATOR") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const moderatorId = session.user.id;

    // Fetch the moderator from DB to get their actual referral code and wallet
    const moderator = await prisma.user.findUnique({
      where: { id: moderatorId },
      select: { 
        referralCode: true,
        wallet: {
          select: { balance: true }
        }
      }
    });

    // Get all referrals made by this moderator
    const referrals = await (prisma as any).referral.findMany({
      where: { referrerId: moderatorId },
      include: {
        referredUser: {
          include: {
            payments: {
              where: { status: "captured" } // Razorpay successful payments are 'captured'
            },
            enrollments: true,
            hostelBooking: true,
          }
        }
      }
    });

    let totalRevenue = 0;
    let courseEnrollments = 0;
    let hostelBookings = 0;

    referrals.forEach((ref: any) => {
      // Sum up all completed payments from this referred user
      const userRevenue = ref.referredUser.payments.reduce((acc: number, p: any) => acc + p.amount, 0);
      totalRevenue += userRevenue;

      // Count services
      if (ref.referredUser.enrollments.length > 0) courseEnrollments += ref.referredUser.enrollments.length;
      if (ref.referredUser.hostelBooking) hostelBookings += 1;
    });

    const stats = {
      totalReferred: referrals.length,
      totalRevenue,
      courseEnrollments,
      hostelBookings,
      referralCode: moderator?.referralCode || "NOT_FOUND",
      walletBalance: moderator?.wallet?.balance || 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Moderator stats error:", error);
    return NextResponse.json(
      { message: "An error occurred fetching stats" },
      { status: 500 }
    );
  }
}
