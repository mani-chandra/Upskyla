import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, content, module = "GLOBAL" } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: { title, content, module },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ message: "Failed to create announcement" }, { status: 500 });
  }
}
