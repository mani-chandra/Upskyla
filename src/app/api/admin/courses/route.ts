import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { courseId, curriculumPdf } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { message: "Missing courseId" },
        { status: 400 }
      );
    }

    await prisma.$executeRaw`UPDATE "Course" SET "curriculumPdf" = ${curriculumPdf || null} WHERE "id" = ${courseId}`;

    const updatedCourse = await prisma.course.findUnique({ where: { id: courseId } });

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error("Course update error:", error);
    return NextResponse.json(
      { message: `Failed to update course: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
