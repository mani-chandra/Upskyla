import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const referrals = await (prisma as any).referral.findMany({
      include: {
        referrer: { select: { name: true, email: true } },
        referredUser: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: referrals.length,
      registered: referrals.filter((r: any) => r.status === "REGISTERED").length,
      advancePaid: referrals.filter((r: any) => r.status === "ADVANCE_PAID").length,
      rewarded: referrals.filter((r: any) => r.status === "REWARD_CREDITED").length,
    };

    return NextResponse.json({ referrals, stats });
  } catch (error) {
    console.error("Admin referrals error:", error);
    return NextResponse.json(
      { message: "An error occurred fetching referrals" },
      { status: 500 }
    );
  }
}
