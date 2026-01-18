"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { addresses, userAddresses } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function createAddress(formData: FormData) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user?.id) {
		return { error: "Unauthorized" };
	}

	const contactName = formData.get("contactName") as string;
	const phone = formData.get("phone") as string;
	const addressLine1 = formData.get("addressLine1") as string;
	const addressLine2 = formData.get("addressLine2") as string;
	const city = formData.get("city") as string;
	const zipCode = formData.get("zipCode") as string;
	const countryId = formData.get("countryId") as string;
	const addressType = formData.get("addressType") as string;
	const isDefault = formData.get("isDefault") === "on";

	if (!contactName || !addressLine1 || !countryId || !addressType) {
		return { error: "Required fields are missing" };
	}

	try {
		// Create address
		const [newAddress] = await db
			.insert(addresses)
			.values({
				contactName,
				phone: phone || null,
				addressLine1,
				addressLine2: addressLine2 || null,
				city: city || null,
				zipCode: zipCode || null,
				countryId,
			})
			.returning();

		// Link to user
		await db.insert(userAddresses).values({
			userId: session.user.id,
			addressId: newAddress.id,
			addressType,
			isDefault,
		});

		revalidatePath("/account/addresses");

		return { success: true };
	} catch (error) {
		console.error("Create address error:", error);
		return { error: "Failed to create address" };
	}
}

export async function updateAddress(addressId: string, formData: FormData) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user?.id) {
		return { error: "Unauthorized" };
	}

	const contactName = formData.get("contactName") as string;
	const phone = formData.get("phone") as string;
	const addressLine1 = formData.get("addressLine1") as string;
	const addressLine2 = formData.get("addressLine2") as string;
	const city = formData.get("city") as string;
	const zipCode = formData.get("zipCode") as string;
	const isDefault = formData.get("isDefault") === "on";

	if (!contactName || !addressLine1) {
		return { error: "Required fields are missing" };
	}

	try {
		// Verify ownership
		const userAddress = await db.query.userAddresses.findFirst({
			where: and(eq(userAddresses.userId, session.user.id), eq(userAddresses.addressId, addressId)),
		});

		if (!userAddress) {
			return { error: "Address not found" };
		}

		// Update address
		await db
			.update(addresses)
			.set({
				contactName,
				phone: phone || null,
				addressLine1,
				addressLine2: addressLine2 || null,
				city: city || null,
				zipCode: zipCode || null,
				updatedAt: new Date(),
			})
			.where(eq(addresses.id, addressId));

		// Update default status
		await db
			.update(userAddresses)
			.set({ isDefault })
			.where(
				and(eq(userAddresses.userId, session.user.id), eq(userAddresses.addressId, addressId)),
			);

		revalidatePath("/account/addresses");

		return { success: true };
	} catch (error) {
		console.error("Update address error:", error);
		return { error: "Failed to update address" };
	}
}

export async function deleteAddress(addressId: string) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user?.id) {
		return { error: "Unauthorized" };
	}

	try {
		// Verify ownership
		const userAddress = await db.query.userAddresses.findFirst({
			where: and(eq(userAddresses.userId, session.user.id), eq(userAddresses.addressId, addressId)),
		});

		if (!userAddress) {
			return { error: "Address not found" };
		}

		// Delete user-address link
		await db
			.delete(userAddresses)
			.where(
				and(eq(userAddresses.userId, session.user.id), eq(userAddresses.addressId, addressId)),
			);

		// Delete address
		await db.delete(addresses).where(eq(addresses.id, addressId));

		revalidatePath("/account/addresses");

		return { success: true };
	} catch (error) {
		console.error("Delete address error:", error);
		return { error: "Failed to delete address" };
	}
}
