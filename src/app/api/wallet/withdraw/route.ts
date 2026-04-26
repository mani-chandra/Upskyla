import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { amount, bankDetails } = await req.json();

    if (!amount || amount < 750) {
      return NextResponse.json(
        { message: "Minimum withdrawal amount is ₹750" },
        { status: 400 }
      );
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Check current wallet balance and bank details
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || wallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // If bank details are provided, update them
      if (bankDetails) {
        await tx.wallet.update({
          where: { userId },
          data: {
            accountNumber: bankDetails.accountNumber,
            accountType: bankDetails.accountType,
            ifscCode: bankDetails.ifscCode,
          },
        });
      } else if (!wallet.accountNumber || !wallet.ifscCode) {
        // If no bank details in DB and none provided in request
        throw new Error("Bank details are required for withdrawal");
      }

      // 2. Create a PENDING DEBIT transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          userId,
          amount,
          type: "DEBIT",
          status: "PENDING",
          description: "Withdrawal Request"
        },
      });

      // 3. Deduct from wallet balance immediately (locked until approved/rejected)
      // Or we can deduct when approved. But usually it's better to deduct immediately 
      // and restore if rejected to prevent double withdrawal.
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: amount },
        },
      });

      return transaction;
    });

    return NextResponse.json({
      message: "Withdrawal request submitted successfully",
      transaction: result,
    });
  } catch (error: any) {
    console.error("Withdrawal request error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred processing withdrawal" },
      { status: 500 }
    );
  }
}
