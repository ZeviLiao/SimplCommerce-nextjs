"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
	const session = await auth.api.getSession({ headers: await headers() });

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
			.update(userTable)
			.set({
				name,
				phone: phone || null,
				updatedAt: new Date(),
			})
			.where(eq(userTable.id, session.user.id));

		revalidatePath("/account");
		revalidatePath("/account/profile");

		return { success: true };
	} catch (error) {
		console.error("Update profile error:", error);
		return { error: "Failed to update profile" };
	}
}

export async function changePassword(formData: FormData) {
	const session = await auth.api.getSession({ headers: await headers() });

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
			error: "Failed to change password. Please check your current password.",
		};
	}
}
