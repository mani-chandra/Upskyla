import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const flags = await prisma.featureFlag.findMany();
    return NextResponse.json(flags);
  } catch (error) {
    console.error("Feature flags error:", error);
    return NextResponse.json(
      { message: "An error occurred fetching feature flags" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { name, isEnabled, description } = await req.json();

    const flag = await prisma.featureFlag.upsert({
      where: { name },
      update: { isEnabled, description },
      create: { name, isEnabled, description },
    });

    return NextResponse.json(flag);
  } catch (error) {
    console.error("Feature flag update error:", error);
    return NextResponse.json(
      { message: "An error occurred updating feature flag" },
      { status: 500 }
    );
  }
}
