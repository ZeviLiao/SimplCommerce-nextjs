"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
	const session = await auth();

	if (!session?.user?.id) {
		return { error: "Unauthorized" };
	}

	const name = formData.get("name") as string;
	const phone = formData.get("phone") as string;

	if (!name) {
		return { error: "Name is required" };
	}

	try {
		await db
			.update(users)
			.set({
				name,
				phone: phone || null,
				updatedAt: new Date(),
			})
			.where(eq(users.id, session.user.id));

		revalidatePath("/account");
		revalidatePath("/account/profile");

		return { success: true };
	} catch (error) {
		console.error("Update profile error:", error);
		return { error: "Failed to update profile" };
	}
}

export async function changePassword(formData: FormData) {
	const session = await auth();

	if (!session?.user?.id) {
		return { error: "Unauthorized" };
	}

	const currentPassword = formData.get("currentPassword") as string;
	const newPassword = formData.get("newPassword") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	if (!currentPassword || !newPassword || !confirmPassword) {
		return { error: "All fields are required" };
	}

	if (newPassword !== confirmPassword) {
		return { error: "New passwords do not match" };
	}

	if (newPassword.length < 8) {
		return { error: "Password must be at least 8 characters" };
	}

	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, session.user.id),
		});

		if (!user || !user.password) {
			return { error: "User not found" };
		}

		const bcrypt = await import("bcryptjs");
		const isValid = await bcrypt.compare(currentPassword, user.password);

		if (!isValid) {
			return { error: "Current password is incorrect" };
		}

		const hashedPassword = await hash(newPassword, 10);

		await db
			.update(users)
			.set({
				password: hashedPassword,
				updatedAt: new Date(),
			})
			.where(eq(users.id, session.user.id));

		return { success: true };
	} catch (error) {
		console.error("Change password error:", error);
		return { error: "Failed to change password" };
	}
}
