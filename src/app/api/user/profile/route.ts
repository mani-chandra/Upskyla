import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { login } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, image } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        image: image || null,
      },
    });

    // Update session with new user info
    const sessionUser = {
      ...session.user,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
    };

    await login(sessionUser);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: sessionUser,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred during profile update" },
      { status: 500 }
    );
  }
}
