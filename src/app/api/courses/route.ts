import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { courses as hardcodedCourses } from "@/lib/courses-data";

export async function GET() {
  try {
    // Fetch courses from database to get the latest curriculumPdf paths
    const dbCourses = await prisma.course.findMany();

    // Merge database data with hardcoded data
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
    // Fallback to hardcoded data if database fails
    return NextResponse.json(hardcodedCourses);
  }
}
