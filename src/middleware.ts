import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { type AuthSession, auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
	const { nextUrl } = request;

	const isAdminRoute = nextUrl.pathname.startsWith("/admin");
	const isAuthRoute =
		nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
	const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

	// Allow API auth routes
	if (isApiAuthRoute) {
		return NextResponse.next();
	}

	// Get session
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as AuthSession | null;

	const isLoggedIn = !!session;

	// Redirect to home if logged in and trying to access auth routes
	if (isAuthRoute && isLoggedIn) {
		return NextResponse.redirect(new URL("/", nextUrl));
	}

	// Protect admin routes
	if (isAdminRoute) {
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL("/login", nextUrl));
		}

		const userRole = session.user.role;
		if (userRole !== "admin" && userRole !== "vendor") {
			return NextResponse.redirect(new URL("/", nextUrl));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
