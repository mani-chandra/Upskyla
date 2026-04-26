import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const enrollmentId = params.id;
    const userId = session.user.id;

    const enrollment = await prisma.enrollment.findFirst({
      where: { 
        id: enrollmentId,
        userId: userId
      },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: "asc" }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Student course error:", error);
    return NextResponse.json(
      { message: "An error occurred fetching the course" },
      { status: 500 }
    );
  }
}
