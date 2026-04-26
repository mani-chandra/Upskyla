import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { enrollmentId, lessonId } = await req.json();

    if (!enrollmentId || !lessonId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 1. Get enrollment and verify it belongs to the user
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            lessons: true
          }
        }
      }
    });

    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
    }

    // 2. Update completedLessons
    let completedLessons = (enrollment as any).completedLessons as string[];
    if (!Array.isArray(completedLessons)) {
      completedLessons = [];
    }

    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    // 3. Calculate progress
    const totalLessons = enrollment.course.lessons.length;
    const completedCount = completedLessons.length;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const completed = progress === 100;

    // 4. Update enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        completedLessons,
        progress,
        completed
      } as any
    });

    return NextResponse.json({
      message: "Lesson completed successfully",
      progress: updatedEnrollment.progress,
      completed: updatedEnrollment.completed,
      completedLessons: (updatedEnrollment as any).completedLessons
    });
  } catch (error) {
    console.error("Complete lesson error:", error);
    return NextResponse.json(
      { message: "An error occurred updating progress" },
      { status: 500 }
    );
  }
}
