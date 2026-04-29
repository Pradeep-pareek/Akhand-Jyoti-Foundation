import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    console.log("Middleware executed for path:", request.nextUrl.pathname);
    const token = request.cookies.get('token')
    if (!token && request.nextUrl.pathname === '/admin/login') {
        return NextResponse.next()
    }
    if (!token && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (token && request.nextUrl.pathname === '/admin/login') {
        return NextResponse.redirect(new URL("/admin/gallery", request.url));
    }
}

// Config to specify which paths the middleware should run on
export const config = {
    matcher: '/admin/:path*',
}
