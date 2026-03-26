import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.walletTransaction.findMany({
      where: { type: "DEBIT", status: "PENDING" },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Admin withdrawals error:", error);
    return NextResponse.json(
      { message: "An error occurred fetching withdrawals" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { transactionId, status } = await req.json(); // status: APPROVED or REJECTED

    if (!["APPROVED", "WITHDRAWN", "CANCELLED"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const transaction = await prisma.walletTransaction.update({
      where: { id: transactionId },
      data: { status },
    });

    return NextResponse.json({
      message: `Transaction ${status.toLowerCase()} successfully`,
      transaction,
    });
  } catch (error) {
    console.error("Admin withdrawal update error:", error);
    return NextResponse.json(
      { message: "An error occurred updating withdrawal" },
      { status: 500 }
    );
  }
}
