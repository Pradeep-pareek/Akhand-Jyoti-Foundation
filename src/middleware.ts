import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    console.log("Middleware executed for path:", request.nextUrl.pathname);
    const token = request.cookies.get("token");
    const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
    const isAdminApi = request.nextUrl.pathname.startsWith("/api/admin");

    if (!token && request.nextUrl.pathname === "/admin/login") {
        return NextResponse.next()
    }

    // Block admin pages + admin APIs

    console.log("Unauthorized access attempt to:", request.nextUrl.pathname);
    if (!token && (isAdminPage || isAdminApi)) {
        console.log("Unauthorized access attempt to:", request.nextUrl.pathname);
        // API request
        if (isAdminApi) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Page request
        return NextResponse.redirect(
            new URL("/admin/login", request.url)
        );
    }

    // Prevent login access after login
    if (token && request.nextUrl.pathname === "/admin/login") {
        return NextResponse.redirect(
            new URL("/admin/donations", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*",
    ],
};