"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getWishlistItems() {
	const session = await auth();
	if (!session?.user?.id) return [];

	const items = await db.query.wishlistItems.findMany({
		where: eq(wishlistItems.userId, session.user.id),
		with: {
			product: true,
		},
	});

	return items;
}

export async function addToWishlist(productId: string) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" };
		}

		// Check if already in wishlist
		const existing = await db.query.wishlistItems.findFirst({
			where: and(eq(wishlistItems.userId, session.user.id), eq(wishlistItems.productId, productId)),
		});

		if (existing) {
			return { success: false, error: "Product already in wishlist" };
		}

		await db.insert(wishlistItems).values({
			userId: session.user.id,
			productId,
		});

		revalidatePath("/account/wishlist");
		return { success: true };
	} catch (error) {
		console.error("Add to wishlist error:", error);
		return { success: false, error: "Failed to add to wishlist" };
	}
}

export async function removeFromWishlist(productId: string) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" };
		}

		await db
			.delete(wishlistItems)
			.where(
				and(eq(wishlistItems.userId, session.user.id), eq(wishlistItems.productId, productId)),
			);

		revalidatePath("/account/wishlist");
		return { success: true };
	} catch (error) {
		console.error("Remove from wishlist error:", error);
		return { success: false, error: "Failed to remove from wishlist" };
	}
}
