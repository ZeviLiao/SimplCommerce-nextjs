"use server";

import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";

export async function getProducts(params?: {
	search?: string;
	categoryIds?: string[];
	brandIds?: string[];
	limit?: number;
	offset?: number;
}) {
	const { search, categoryIds, brandIds, limit = 12, offset = 0 } = params || {};

	// Build conditions array
	const conditions = [eq(schema.products.isPublished, true)];

	if (search) {
		conditions.push(ilike(schema.products.name, `%${search}%`));
	}

	if (brandIds && brandIds.length > 0) {
		conditions.push(inArray(schema.products.brandId, brandIds));
	}

	// If category filter is applied, we need to join with productCategories
	if (categoryIds && categoryIds.length > 0) {
		const productIdsInCategories = db
			.select({ productId: schema.productCategories.productId })
			.from(schema.productCategories)
			.where(inArray(schema.productCategories.categoryId, categoryIds));

		conditions.push(inArray(schema.products.id, productIdsInCategories));
	}

	const products = await db
		.select({
			id: schema.products.id,
			name: schema.products.name,
			slug: schema.products.slug,
			shortDescription: schema.products.shortDescription,
			price: schema.products.price,
			oldPrice: schema.products.oldPrice,
			specialPrice: schema.products.specialPrice,
			thumbnailImageUrl: schema.products.thumbnailImageUrl,
			isFeatured: schema.products.isFeatured,
			reviewsCount: schema.products.reviewsCount,
			ratingAverage: schema.products.ratingAverage,
			brand: {
				id: schema.brands.id,
				name: schema.brands.name,
				slug: schema.brands.slug,
			},
		})
		.from(schema.products)
		.leftJoin(schema.brands, eq(schema.products.brandId, schema.brands.id))
		.where(and(...conditions))
		.orderBy(desc(schema.products.isFeatured), desc(schema.products.createdAt))
		.limit(limit)
		.offset(offset);

	return products;
}

export async function getProductBySlug(slug: string) {
	const product = await db.query.products.findFirst({
		where: and(eq(schema.products.slug, slug), eq(schema.products.isPublished, true)),
		with: {
			brand: true,
			productCategories: {
				with: {
					category: true,
				},
			},
			media: {
				orderBy: (media, { asc }) => [asc(media.displayOrder)],
			},
		},
	});

	return product;
}

export async function getFeaturedProducts(limit = 8) {
	const products = await db.query.products.findMany({
		where: and(eq(schema.products.isPublished, true), eq(schema.products.isFeatured, true)),
		with: {
			brand: true,
		},
		limit,
		orderBy: (products, { desc }) => [desc(products.createdAt)],
	});

	return products;
}

export async function getCategories() {
	const categories = await db.query.categories.findMany({
		where: eq(schema.categories.isPublished, true),
		orderBy: (categories, { asc }) => [asc(categories.displayOrder), asc(categories.name)],
		with: {
			children: {
				where: eq(schema.categories.isPublished, true),
				orderBy: (categories, { asc }) => [asc(categories.displayOrder)],
			},
		},
	});

	return categories.filter((cat) => !cat.parentId);
}

export async function getCategoriesWithCount() {
	// Get all categories with product counts
	const categoryCounts = await db
		.select({
			categoryId: schema.productCategories.categoryId,
			count: sql<number>`COUNT(DISTINCT ${schema.productCategories.productId})`,
		})
		.from(schema.productCategories)
		.innerJoin(schema.products, eq(schema.productCategories.productId, schema.products.id))
		.where(
			and(eq(schema.products.isPublished, true), eq(schema.products.isVisibleIndividually, true)),
		)
		.groupBy(schema.productCategories.categoryId);

	const countMap = new Map(categoryCounts.map((c) => [c.categoryId, c.count]));

	// Get all published categories
	const allCategories = await db.query.categories.findMany({
		where: eq(schema.categories.isPublished, true),
		orderBy: (categories, { asc }) => [asc(categories.displayOrder), asc(categories.name)],
	});

	// Build parent categories with children
	const parentCategories = allCategories
		.filter((cat) => !cat.parentId)
		.map((parent) => ({
			...parent,
			count: countMap.get(parent.id) || 0,
			children: allCategories
				.filter((cat) => cat.parentId === parent.id)
				.map((child) => ({
					...child,
					count: countMap.get(child.id) || 0,
				})),
		}));

	return parentCategories;
}

export async function getBrands() {
	const brands = await db.query.brands.findMany({
		where: eq(schema.brands.isPublished, true),
		orderBy: (brands, { asc }) => [asc(brands.name)],
	});

	return brands;
}

export async function getCategoryBySlug(slug: string) {
	const category = await db.query.categories.findFirst({
		where: and(eq(schema.categories.slug, slug), eq(schema.categories.isPublished, true)),
		with: {
			children: {
				where: eq(schema.categories.isPublished, true),
			},
			parent: true,
		},
	});

	return category;
}

export async function getBrandBySlug(slug: string) {
	const brand = await db.query.brands.findFirst({
		where: and(eq(schema.brands.slug, slug), eq(schema.brands.isPublished, true)),
	});

	return brand;
}

export async function getProductsByBrand(params: {
	brandId: string;
	minPrice?: number;
	maxPrice?: number;
	categoryIds?: string[];
	sort?: "price-asc" | "price-desc";
	limit?: number;
	offset?: number;
}) {
	const {
		brandId,
		minPrice,
		maxPrice,
		categoryIds,
		sort = "price-asc",
		limit = 10,
		offset = 0,
	} = params;

	// Base query - products of this brand that are published and visible individually
	let query = db
		.select({
			id: schema.products.id,
			name: schema.products.name,
			slug: schema.products.slug,
			shortDescription: schema.products.shortDescription,
			price: schema.products.price,
			oldPrice: schema.products.oldPrice,
			specialPrice: schema.products.specialPrice,
			thumbnailImageUrl: schema.products.thumbnailImageUrl,
			reviewsCount: schema.products.reviewsCount,
			ratingAverage: schema.products.ratingAverage,
		})
		.from(schema.products)
		.where(
			and(
				eq(schema.products.brandId, brandId),
				eq(schema.products.isPublished, true),
				eq(schema.products.isVisibleIndividually, true),
			),
		)
		.$dynamic();

	// Price filter
	if (minPrice !== undefined) {
		query = query.where(sql`${schema.products.price} >= ${minPrice}`);
	}
	if (maxPrice !== undefined) {
		query = query.where(sql`${schema.products.price} <= ${maxPrice}`);
	}

	// Category filter
	if (categoryIds && categoryIds.length > 0) {
		const productIdsInCategories = db
			.select({ productId: schema.productCategories.productId })
			.from(schema.productCategories)
			.where(inArray(schema.productCategories.categoryId, categoryIds));

		query = query.where(inArray(schema.products.id, productIdsInCategories));
	}

	// Sorting
	if (sort === "price-desc") {
		query = query.orderBy(desc(schema.products.price));
	} else {
		query = query.orderBy(asc(schema.products.price));
	}

	const products = await query.limit(limit).offset(offset);

	return products;
}

export async function getProductsByBrandStats(brandId: string) {
	// Get price range
	const priceStats = await db
		.select({
			minPrice: sql<number>`MIN(${schema.products.price})`,
			maxPrice: sql<number>`MAX(${schema.products.price})`,
			totalCount: sql<number>`COUNT(*)`,
		})
		.from(schema.products)
		.where(
			and(
				eq(schema.products.brandId, brandId),
				eq(schema.products.isPublished, true),
				eq(schema.products.isVisibleIndividually, true),
			),
		);

	// Get categories with product counts
	const categoriesWithCount = await db
		.select({
			id: schema.categories.id,
			name: schema.categories.name,
			slug: schema.categories.slug,
			parentId: schema.categories.parentId,
			count: sql<number>`COUNT(DISTINCT ${schema.productCategories.productId})`,
		})
		.from(schema.categories)
		.innerJoin(
			schema.productCategories,
			eq(schema.categories.id, schema.productCategories.categoryId),
		)
		.innerJoin(schema.products, eq(schema.productCategories.productId, schema.products.id))
		.where(
			and(
				eq(schema.products.brandId, brandId),
				eq(schema.products.isPublished, true),
				eq(schema.products.isVisibleIndividually, true),
				eq(schema.categories.isPublished, true),
			),
		)
		.groupBy(
			schema.categories.id,
			schema.categories.name,
			schema.categories.slug,
			schema.categories.parentId,
		);

	return {
		priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, totalCount: 0 },
		categories: categoriesWithCount,
	};
}

export async function getProductsByCategory(params: {
	categoryId: string;
	minPrice?: number;
	maxPrice?: number;
	brandIds?: string[];
	sort?: "price-asc" | "price-desc";
	limit?: number;
	offset?: number;
}) {
	const {
		categoryId,
		minPrice,
		maxPrice,
		brandIds,
		sort = "price-asc",
		limit = 10,
		offset = 0,
	} = params;

	// Get all descendant category IDs (including the category itself)
	const allCategoryIds = await db
		.select({ id: schema.categories.id })
		.from(schema.categories)
		.where(or(eq(schema.categories.id, categoryId), eq(schema.categories.parentId, categoryId)));

	const categoryIds = allCategoryIds.map((c) => c.id);

	// Get product IDs in these categories
	const productIdsInCategories = db
		.select({ productId: schema.productCategories.productId })
		.from(schema.productCategories)
		.where(inArray(schema.productCategories.categoryId, categoryIds));

	// Base query
	let query = db
		.select({
			id: schema.products.id,
			name: schema.products.name,
			slug: schema.products.slug,
			shortDescription: schema.products.shortDescription,
			price: schema.products.price,
			oldPrice: schema.products.oldPrice,
			specialPrice: schema.products.specialPrice,
			thumbnailImageUrl: schema.products.thumbnailImageUrl,
			reviewsCount: schema.products.reviewsCount,
			ratingAverage: schema.products.ratingAverage,
		})
		.from(schema.products)
		.where(
			and(
				inArray(schema.products.id, productIdsInCategories),
				eq(schema.products.isPublished, true),
				eq(schema.products.isVisibleIndividually, true),
			),
		)
		.$dynamic();

	// Price filter
	if (minPrice !== undefined) {
		query = query.where(sql`${schema.products.price} >= ${minPrice}`);
	}
	if (maxPrice !== undefined) {
		query = query.where(sql`${schema.products.price} <= ${maxPrice}`);
	}

	// Brand filter
	if (brandIds && brandIds.length > 0) {
		query = query.where(inArray(schema.products.brandId, brandIds));
	}

	// Sorting
	if (sort === "price-desc") {
		query = query.orderBy(desc(schema.products.price));
	} else {
		query = query.orderBy(asc(schema.products.price));
	}

	const products = await query.limit(limit).offset(offset);

	return products;
}

export async function getProductsByCategoryStats(categoryId: string) {
	// Get all descendant category IDs
	const allCategoryIds = await db
		.select({ id: schema.categories.id })
		.from(schema.categories)
		.where(or(eq(schema.categories.id, categoryId), eq(schema.categories.parentId, categoryId)));

	const categoryIds = allCategoryIds.map((c) => c.id);

	// Get product IDs in these categories
	const productIdsInCategories = db
		.select({ productId: schema.productCategories.productId })
		.from(schema.productCategories)
		.where(inArray(schema.productCategories.categoryId, categoryIds));

	// Get price range
	const priceStats = await db
		.select({
			minPrice: sql<number>`MIN(${schema.products.price})`,
			maxPrice: sql<number>`MAX(${schema.products.price})`,
			totalCount: sql<number>`COUNT(*)`,
		})
		.from(schema.products)
		.where(
			and(
				inArray(schema.products.id, productIdsInCategories),
				eq(schema.products.isPublished, true),
				eq(schema.products.isVisibleIndividually, true),
			),
		);

	// Get brands with product counts
	const brandsWithCount = await db
		.select({
			id: schema.brands.id,
			name: schema.brands.name,
			slug: schema.brands.slug,
			count: sql<number>`COUNT(DISTINCT ${schema.products.id})`,
		})
		.from(schema.brands)
		.innerJoin(schema.products, eq(schema.brands.id, schema.products.brandId))
		.innerJoin(schema.productCategories, eq(schema.products.id, schema.productCategories.productId))
		.where(
			and(
				inArray(schema.productCategories.categoryId, categoryIds),
				eq(schema.products.isPublished, true),
				eq(schema.products.isVisibleIndividually, true),
				eq(schema.brands.isPublished, true),
			),
		)
		.groupBy(schema.brands.id, schema.brands.name, schema.brands.slug);

	return {
		priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, totalCount: 0 },
		brands: brandsWithCount,
	};
}
