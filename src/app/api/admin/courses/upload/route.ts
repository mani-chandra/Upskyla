import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds
// Next.js 14+ uses this to configure the route
export const config = {
  api: {
    bodyParser: false, // Disabling body parser to handle formData manually if needed, 
    // but in App Router POST handlers we usually use req.formData() which handles it.
  },
};

export async function POST(req: Request) {
  try {
    console.log("Upload request received");
    
    // Check if it's actually form data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      console.error("Invalid content type:", contentType);
      return NextResponse.json(
        { message: "Invalid content type. Expected multipart/form-data" },
        { status: 400 }
      );
    }

    let formData;
    try {
      formData = await req.formData();
    } catch (e: any) {
      console.error("Error parsing form data:", e);
      return NextResponse.json(
        { message: `Failed to parse form data: ${e.message}` },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;

    console.log("File info:", { name: file?.name, type: file?.type, size: file?.size, courseId });

    if (!file || !courseId) {
      console.error("Missing file or courseId");
      return NextResponse.json(
        { message: "Missing file or courseId" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a path to save the file
    const uploadDir = path.join(process.cwd(), "public", "docs", "curriculum");
    console.log("Target upload directory:", uploadDir);
    
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log("Directory created/verified successfully");
    } catch (err) {
      console.error("Directory creation error:", err);
      // Continue anyway, it might be a permissions issue with mkdir but directory might exist
    }

    const fileName = `${courseId}-${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);
    console.log("Saving file to:", filePath);

    await writeFile(filePath, buffer);
    console.log("File written successfully");

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
