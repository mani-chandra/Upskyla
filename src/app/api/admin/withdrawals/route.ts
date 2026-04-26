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

    const transactions = await prisma.walletTransaction.findMany({
      where: { 
        type: "DEBIT", 
        status: "PENDING" 
      },
      include: {
        user: { 
          select: { 
            name: true, 
            email: true 
          } 
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Fetched ${transactions.length} pending withdrawals`);
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

    const body = await req.json();
    const tId = body.transactionId;
    const newStatus = body.status;

    if (!tId || !newStatus || !["APPROVED", "WITHDRAWN", "CANCELLED"].includes(newStatus)) {
      return NextResponse.json({ message: "Invalid status or missing transaction ID" }, { status: 400 });
    }

    const updatedTransaction = await prisma.$transaction(async (tx) => {
      const transaction = await tx.walletTransaction.findUnique({
        where: { id: tId },
      });

      if (!transaction) throw new Error("Transaction not found");
      if (transaction.status !== "PENDING") throw new Error("Transaction already processed");

      // Update the transaction status
      const updated = await tx.walletTransaction.update({
        where: { id: tId },
        data: { status: newStatus },
      });

      // If cancelled, return funds to wallet
      if (newStatus === "CANCELLED") {
        await tx.wallet.update({
          where: { userId: transaction.userId },
          data: { balance: { increment: transaction.amount } },
        });
      }

      return updated;
    });

    return NextResponse.json({
      message: `Transaction ${newStatus.toLowerCase()} successfully`,
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Admin withdrawal update error:", error);
    return NextResponse.json(
      { message: "An error occurred updating withdrawal" },
      { status: 500 }
    );
  }
}
