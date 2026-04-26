import { PrismaClient } from "@prisma/client";

/**
 * Processes a referral reward for a moderator when a student completes a milestone.
 * Milestones include: First rent payment, Course enrollment, or Admin manual approval.
 */
export async function processReferralReward(tx: any, referredUserId: string) {
  try {
    // 1. Find the referral record for this student
    const referral = await tx.referral.findUnique({
      where: { referredUserId },
    });

    // 2. If no referral exists or it's already rewarded, skip
    if (!referral || referral.status === "REWARD_CREDITED" || referral.status === "ELIGIBLE_FOR_WITHDRAWAL") {
      return null;
    }

    // 3. Credit the referrer's wallet
    // Default reward amount is ₹750 as per existing admin logic
    const rewardAmount = 750;
    
    // 4. Upsert wallet for the referrer
    await tx.wallet.upsert({
      where: { userId: referral.referrerId },
      create: { userId: referral.referrerId, balance: rewardAmount },
      update: { balance: { increment: rewardAmount } },
    });

    // 5. Create wallet transaction record
    await tx.walletTransaction.create({
      data: {
        userId: referral.referrerId,
        amount: rewardAmount,
        type: "CREDIT",
        status: "APPROVED",
        referralId: referral.id,
      },
    });

    // 6. Update referral status to successful (REWARD_CREDITED)
    const updatedReferral = await tx.referral.update({
      where: { id: referral.id },
      data: { status: "REWARD_CREDITED" },
    });

    return updatedReferral;
  } catch (error) {
    console.error("Error processing referral reward:", error);
    // We don't want to crash the main transaction if referral reward fails
    return null;
  }
}
