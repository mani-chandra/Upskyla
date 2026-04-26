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
              where: { status: "COMPLETED" },
              select: {
                amount: true,
                type: true,
                createdAt: true
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
      const totalPaid = user.payments.reduce((acc: number, p: any) => acc + p.amount, 0);
      
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
