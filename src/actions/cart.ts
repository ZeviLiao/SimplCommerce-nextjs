"use server";

import { inArray } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";

export async function getCartItems(productIds: string[]) {
	if (productIds.length === 0) {
		return [];
	}

	const products = await db.query.products.findMany({
		where: inArray(schema.products.id, productIds),
		columns: {
			id: true,
			name: true,
			slug: true,
			price: true,
			oldPrice: true,
			specialPrice: true,
			thumbnailImageUrl: true,
			stockQuantity: true,
			stockTrackingEnabled: true,
			isAllowToOrder: true,
			isPublished: true,
		},
	});

	return products;
}
