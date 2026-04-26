import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: "asc" }
            }
          }
        }
      },
      orderBy: { enrolledAt: "desc" }
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Student courses error:", error);
    return NextResponse.json(
      { message: "An error occurred fetching your courses" },
      { status: 500 }
    );
  }
}
