import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./src/lib/auth";

const protectedRoutes = ["/dashboard", "/admin", "/hostel", "/courses", "/consultancy", "/taxi", "/jobs"];
const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session &&
    !req.nextUrl.pathname.startsWith("/dashboard") &&
    req.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Admin role check
  if (path.startsWith("/admin") && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
