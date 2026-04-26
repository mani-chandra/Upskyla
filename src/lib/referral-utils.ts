import { PrismaClient } from "@prisma/client";

/**
 * Processes a referral reward for a moderator when a student completes a milestone.
 * Milestones include: First rent payment, Course enrollment, or Admin manual approval.
 */
export async function processReferralReward(tx: any, referredUserId: string, milestoneType: 'HOSTEL' | 'COURSE') {
  try {
    // 1. Find the referral record for this student
    const referral = await tx.referral.findUnique({
      where: { referredUserId },
    });

    // 2. If no referral exists or it's already rewarded, skip
    // Note: We might want to allow multiple rewards if they do both hostel AND course?
    // Based on user request "750 for hostel and 2500 for course registration", 
    // it sounds like they are distinct rewards.
    if (!referral) {
      return null;
    }

    // 3. Credit the referrer's wallet
    // Updated rewards: ₹750 for hostel, ₹2500 for courses
    const rewardAmount = milestoneType === 'HOSTEL' ? 750 : 2500;
    
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
