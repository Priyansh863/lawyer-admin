import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log("Admin Request pathname:", pathname);

    // Skip middleware for API routes and static files
    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Retrieve the token using NextAuth
    const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET || 'your-admin-secret-key-here'
    });
    console.log("Admin Token:", token);

    // Allow access to login and signup pages without authentication
    if (!token) {
        if(pathname.startsWith("/login") || pathname.startsWith("/signup")) {
            console.log("Allowing access to /login or /signup without authentication");
            return NextResponse.next();
        }
        console.log("Redirecting to /login as admin is not authenticated");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // // Check if user has admin role
    // if (token && (token as any).role !== 'admin' && (token as any).account_type !== 'admin') {
    //     console.log("User is not admin, redirecting to login");
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    // Redirect root ("/") to "/dashboard" if authenticated admin
    if (pathname === "/") {
        const userRole = (token as any).role || (token as any).account_type;
        if (token) {
            console.log("Redirecting to /dashboard as admin is authenticated");
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } else {
            console.log("Redirecting to /login as user is not authenticated admin");
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Allow the request to proceed for authenticated admins
    console.log("Allowing the admin request to proceed");
    return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
    matcher: [
        "/", 
        "/dashboard/:path*",
        "/users/:path*",
        "/cases/:path*",
        "/analytics/:path*",
        "/settings/:path*",
        "/reports/:path*"
    ], // Adjust paths as needed for admin panel
};
