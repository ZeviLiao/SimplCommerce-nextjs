"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function registerUser(formData: FormData) {
	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!name || !email || !password) {
		return { error: "All fields are required" };
	}

	if (password.length < 8) {
		return { error: "Password must be at least 8 characters" };
	}

	try {
		// Check if user already exists
		const existingUser = await db.query.user.findFirst({
			where: eq(user.email, email.toLowerCase()),
		});

		if (existingUser) {
			return { error: "User with this email already exists" };
		}

		// Register user with Better Auth
		await auth.api.signUpEmail({
			body: {
				email: email.toLowerCase(),
				password,
				name,
			},
			headers: await headers(),
		});

		return { success: true };
	} catch (error) {
		console.error("Registration error:", error);
		return { error: "Failed to create account" };
	}
}

export async function loginUser(formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		return { error: "Email and password are required" };
	}

	try {
		await auth.api.signInEmail({
			body: {
				email: email.toLowerCase(),
				password,
			},
			headers: await headers(),
		});

		return { success: true };
	} catch (error) {
		console.error("Login error:", error);
		return { error: "Invalid email or password" };
	}
}

export async function logoutUser() {
	await auth.api.signOut({
		headers: await headers(),
	});
}

export async function changePassword(currentPassword: string, newPassword: string) {
	try {
		await auth.api.changePassword({
			body: {
				newPassword,
				currentPassword,
				revokeOtherSessions: false,
			},
			headers: await headers(),
		});

		return { success: true };
	} catch (error) {
		console.error("Change password error:", error);
		return {
			success: false,
			error: "Failed to change password. Please check your current password.",
		};
	}
}
