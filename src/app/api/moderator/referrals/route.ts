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

    const referrals = await (prisma as any).referral.findMany({
      where: { referrerId: moderatorId },
      include: {
        referredUser: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            payments: {
              where: { status: "captured" }, // Razorpay successful payments are 'captured'
              select: {
                amount: true,
                type: true,
                createdAt: true
              }
            },
            walletTransactions: {
              where: { 
                type: "CREDIT",
                status: "APPROVED"
              },
              select: {
                amount: true,
                referralId: true
              }
            },
            enrollments: {
              include: {
                course: {
                  select: {
                    title: true
                  }
                }
              }
            },
            hostelBooking: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedReferrals = referrals.map((ref: any) => {
      const user = ref.referredUser;
      
      // Calculate total amount paid by the referred student
      const totalPaid = user.payments.reduce((acc: number, p: any) => acc + p.amount, 0);
      
      // Calculate reward earned for this specific referral
      // We look at the referred user's wallet transactions that match this referral ID
      const rewardEarned = user.walletTransactions
        .filter((wt: any) => wt.referralId === ref.id)
        .reduce((acc: number, wt: any) => acc + wt.amount, 0);
      
      // Determine services
      const services = [];
      if (user.enrollments.length > 0) {
        user.enrollments.forEach((e: any) => services.push(`Course: ${e.course.title}`));
      }
      if (user.hostelBooking) {
        services.push("Hostel Booking");
      }

      return {
        id: ref.id,
        studentName: user.name || "Anonymous",
        studentEmail: user.email,
        totalPaid,
        rewardEarned,
        services,
        joinedAt: user.createdAt,
        status: ref.status
      };
    });

    return NextResponse.json(formattedReferrals);
  } catch (error) {
    console.error("Moderator referrals error:", error);
    return NextResponse.json(
      { message: "An error occurred fetching referrals" },
      { status: 500 }
    );
  }
}
