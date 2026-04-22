import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Mocking the update of curriculumPdf in the project.
// In a real scenario, this would update a database.
// Since we are using static data for courses, we'll simulate the success.

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;

    if (!file || !courseId) {
      return NextResponse.json(
        { message: "Missing file or courseId" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a path to save the file
    const uploadDir = path.join(process.cwd(), "public", "docs", "curriculum");
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    const fileName = `${courseId}-${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicPath = `/docs/curriculum/${fileName}`;

    // Here you would typically update your database with the new publicPath for the course curriculumPdf field.
    // For this prototype, we'll return the path so the UI can reflect the "upload".
    
    return NextResponse.json({ 
      message: "File uploaded successfully",
      path: publicPath 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload file" },
      { status: 500 }
    );
  }
}
