import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      referralCode: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, role, action, newPassword } = await req.json();

    if (action === "changePassword") {
      if (!newPassword) {
        return NextResponse.json({ message: "New password is required" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ message: "Password updated successfully" });
    }

    if (!["STUDENT", "ADMIN", "STAFF", "MODERATOR"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { message: "An error occurred updating user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.complaintTicket.deleteMany({ where: { userId } }),
      prisma.consultationBooking.deleteMany({ where: { userId } }),
      prisma.coupon.deleteMany({ where: { userId } }),
      prisma.enrollment.deleteMany({ where: { userId } }),
      prisma.examAttempt.deleteMany({ where: { userId } }),
      prisma.gamingBooking.deleteMany({ where: { userId } }),
      prisma.jobApplication.deleteMany({ where: { userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.payment.deleteMany({ where: { userId } }),
      prisma.profile.deleteMany({ where: { userId } }),
      prisma.referral.deleteMany({ where: { OR: [{ referrerId: userId }, { referredUserId: userId }] } }),
      prisma.taxiBooking.deleteMany({ where: { userId } }),
      prisma.theatreBooking.deleteMany({ where: { userId } }),
      prisma.walletTransaction.deleteMany({ where: { userId } }),
      prisma.wallet.deleteMany({ where: { userId } }),
      prisma.hostelBooking.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json(
      { message: "An error occurred deleting user" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { userId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return NextResponse.json(user);
}
