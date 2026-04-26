import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addDays, startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    // Basic security check (optional, but recommended to use a secret token)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    const sevenDaysFromNow = addDays(today, 7);

    // Find bookings with rent due within 7 days
    const upcomingRents = await (prisma.hostelBooking as any).findMany({
      where: {
        isCheckedIn: true,
        rentDueDate: {
          lte: sevenDaysFromNow,
          gte: today,
        },
      },
      include: {
        user: true,
      },
    });

    const notifications = [];

    for (const booking of upcomingRents) {
      // Check if we already sent a reminder today to avoid spamming
      const existingNotification = await (prisma.notification as any).findFirst({
        where: {
          userId: booking.userId,
          title: "Rent Payment Reminder",
          createdAt: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
      });

      if (!existingNotification) {
        const dueDateStr = booking.rentDueDate?.toLocaleDateString() || "soon";
        const newNotification = await (prisma.notification as any).create({
          data: {
            userId: booking.userId,
            title: "Rent Payment Reminder",
            message: `Your hostel rent is due on ${dueDateStr}. Please ensure payment is made on time to avoid any issues.`,
          },
        });
        notifications.push(newNotification);
      }
    }

    return NextResponse.json({
      message: `Processed ${upcomingRents.length} upcoming rents. Created ${notifications.length} new notifications.`,
      notificationsCreated: notifications.length,
    });
  } catch (error: any) {
    console.error("Rent reminder cron error:", error);
    return NextResponse.json(
      { message: "An error occurred during rent reminder processing" },
      { status: 500 }
    );
  }
}
