import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";

export async function getHomepageCategories() {
	try {
		return await db
			.select()
			.from(categories)
			.where(
				and(
					eq(categories.isPublished, true),
					eq(categories.isDeleted, false),
					isNull(categories.parentId),
				),
			);
	} catch (error) {
		console.error("Failed to fetch homepage categories:", error);
		return [];
	}
}

export async function getLatestProducts() {
	try {
		return await db
			.select()
			.from(products)
			.where(and(eq(products.isPublished, true), eq(products.isDeleted, false)))
			.orderBy(desc(products.createdAt))
			.limit(8);
	} catch (error) {
		console.error("Failed to fetch latest products:", error);
		return [];
	}
}

export async function getProductBySlug(slug: string) {
	try {
		return await db.query.products.findFirst({
			where: and(
				eq(products.slug, slug),
				eq(products.isPublished, true),
				eq(products.isDeleted, false),
			),
		});
	} catch (error) {
		console.error("Failed to fetch product by slug:", error);
		return null;
	}
}
