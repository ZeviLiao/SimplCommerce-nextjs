"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signIn, signOut } from "@/lib/auth";

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
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email.toLowerCase()),
		});

		if (existingUser) {
			return { error: "User with this email already exists" };
		}

		// Hash password
		const hashedPassword = await hash(password, 10);

		// Create user
		await db.insert(users).values({
			name,
			email: email.toLowerCase(),
			password: hashedPassword,
			role: "customer",
		});

		// Auto sign in after registration
		await signIn("credentials", {
			email: email.toLowerCase(),
			password,
			redirect: false,
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
		await signIn("credentials", {
			email: email.toLowerCase(),
			password,
			redirect: false,
		});

		return { success: true };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid email or password" };
				default:
					return { error: "Something went wrong" };
			}
		}
		throw error;
	}
}

export async function logoutUser() {
	await signOut({ redirect: false });
}
