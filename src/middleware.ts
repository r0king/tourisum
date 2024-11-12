import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Protect admin routes
    if (path.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    // Protect guide routes
    if (path.startsWith("/guide")) {
      if (token?.role !== "guide" && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    // Protect user dashboard routes
    if (path.startsWith("/user/dashboard")) {
      if (!token || (token.role !== "user" && token.role !== "admin" && token.role !== "guide")) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    // Handle pending guides
    if (token?.role === "pending_guide") {
      if (!path.startsWith("/apply-as-guide")) {
        return NextResponse.redirect(new URL("/apply-as-guide", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Configure protected routes
export const config = {
  matcher: ["/admin/:path*", "/guide/:path*", "/user/dashboard/:path*", "/apply-as-guide/:path*"],
}