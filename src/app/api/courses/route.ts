import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { courses as hardcodedCourses } from "@/lib/courses-data";

export async function GET() {
  try {
    const dbCourses = await prisma.course.findMany();

    const mergedCourses = hardcodedCourses.map(course => {
      const dbCourse = dbCourses.find(db => db.id === course.id);
      if (dbCourse) {
        return {
          ...course,
          curriculumPdf: dbCourse.curriculumPdf || course.curriculumPdf
        };
      }
      return course;
    });

    return NextResponse.json(mergedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(hardcodedCourses);
  }
}
