import { auth } from "@/lib/auth";

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	const isAdminRoute = nextUrl.pathname.startsWith("/admin");
	const isAuthRoute =
		nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
	const isApiRoute = nextUrl.pathname.startsWith("/api");

	// Allow API routes
	if (isApiRoute) {
		return;
	}

	// Redirect to home if logged in and trying to access auth routes
	if (isAuthRoute && isLoggedIn) {
		return Response.redirect(new URL("/", nextUrl));
	}

	// Protect admin routes
	if (isAdminRoute) {
		if (!isLoggedIn) {
			return Response.redirect(new URL("/login", nextUrl));
		}

		const userRole = req.auth?.user?.role;
		if (userRole !== "admin" && userRole !== "vendor") {
			return Response.redirect(new URL("/", nextUrl));
		}
	}

	return;
});

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
