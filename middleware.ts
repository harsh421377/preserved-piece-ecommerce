import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const { nextUrl } = req

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isAdminLoginRoute = nextUrl.pathname === "/admin/login"

  if (isAdminRoute) {
    if (isAdminLoginRoute) {
      if (isLoggedIn && role === "admin") {
        return Response.redirect(new URL("/admin", nextUrl))
      }
      return
    }
    if (!isLoggedIn || role !== "admin") {
      const loginUrl = new URL("/admin/login", nextUrl)
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search)
      return Response.redirect(loginUrl)
    }
  }
})

export const config = {
  matcher: ["/admin/:path*"],
}
