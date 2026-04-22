import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Invalid content type. Expected multipart/form-data" },
        { status: 400 }
      );
    }

    let formData;
    try {
      formData = await req.formData();
    } catch (e: any) {
      return NextResponse.json(
        { message: `Failed to parse form data: ${e.message}` },
        { status: 400 }
      );
    }

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
    
    return NextResponse.json({ 
      message: "File uploaded successfully",
      path: publicPath 
    });
  } catch (error: any) {
    console.error("Upload error details:", error);
    return NextResponse.json(
      { message: `Failed to upload file: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
