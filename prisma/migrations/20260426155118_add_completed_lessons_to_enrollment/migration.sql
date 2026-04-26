/*
  Warnings:

  - You are about to drop the column `paymentId` on the `ConsultationBooking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `checkIn` on the `HostelBooking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `HostelBooking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `TaxiBooking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[consultationId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[enrollmentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[taxiId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `approxCheckIn` to the `HostelBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('HOSTEL_ADVANCE', 'HOSTEL_RENT', 'COURSE_ENROLLMENT', 'CONSULTATION', 'TAXI_BOOKING', 'OTHER');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'ACTIVE';

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MODERATOR';

-- AlterEnum
ALTER TYPE "WalletTransactionStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "ConsultationBooking" DROP CONSTRAINT "ConsultationBooking_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "HostelBooking" DROP CONSTRAINT "HostelBooking_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "TaxiBooking" DROP CONSTRAINT "TaxiBooking_paymentId_fkey";

-- DropIndex
DROP INDEX "ConsultationBooking_paymentId_key";

-- DropIndex
DROP INDEX "Enrollment_paymentId_key";

-- DropIndex
DROP INDEX "HostelBooking_paymentId_key";

-- DropIndex
DROP INDEX "TaxiBooking_paymentId_key";

-- AlterTable
ALTER TABLE "ConsultationBooking" DROP COLUMN "paymentId";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "curriculumPdf" TEXT;

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "paymentId",
ADD COLUMN     "completedLessons" JSONB DEFAULT '[]';

-- AlterTable
ALTER TABLE "HostelBooking" DROP COLUMN "checkIn",
DROP COLUMN "paymentId",
ADD COLUMN     "actualCheckIn" TIMESTAMP(3),
ADD COLUMN     "advancePaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approxCheckIn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastRentPaidAt" TIMESTAMP(3),
ADD COLUMN     "rentDueDate" TIMESTAMP(3),
ALTER COLUMN "roomNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "consultationId" TEXT,
ADD COLUMN     "enrollmentId" TEXT,
ADD COLUMN     "hostelId" TEXT,
ADD COLUMN     "taxiId" TEXT,
ADD COLUMN     "type" "PaymentType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaxiBooking" DROP COLUMN "paymentId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "accountType" TEXT,
ADD COLUMN     "ifscCode" TEXT;

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_consultationId_key" ON "Payment"("consultationId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_enrollmentId_key" ON "Payment"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_taxiId_key" ON "Payment"("taxiId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "ConsultationBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "HostelBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_taxiId_fkey" FOREIGN KEY ("taxiId") REFERENCES "TaxiBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
