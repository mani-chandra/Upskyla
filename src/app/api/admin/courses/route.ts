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

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { curriculumPdf }
    });

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error("Course update error:", error);
    return NextResponse.json(
      { message: `Failed to update course: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
