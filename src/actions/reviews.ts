"use server";

import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { orderItems, products, replies, reviews } from "@/db/schema";
import { type AuthSession, auth } from "@/lib/auth";

/**
 * Get reviews for a product with rating statistics
 */
export async function getProductReviews(productId: string, page = 1, pageSize = 10) {
	try {
		// Get approved reviews with replies
		const productReviews = await db.query.reviews.findMany({
			where: and(eq(reviews.productId, productId), eq(reviews.status, "approved")),
			orderBy: [desc(reviews.createdAt)],
			limit: pageSize,
			offset: (page - 1) * pageSize,
			with: {
				replies: {
					where: eq(replies.status, "approved"),
					orderBy: [desc(replies.createdAt)],
					with: {
						user: {
							columns: {
								name: true,
								role: true,
							},
						},
					},
				},
			},
		});

		// Get total count
		const allReviews = await db.query.reviews.findMany({
			where: and(eq(reviews.productId, productId), eq(reviews.status, "approved")),
			columns: {
				id: true,
				rating: true,
			},
		});

		const totalReviews = allReviews.length;

		// Calculate rating statistics
		const ratingCounts = {
			1: allReviews.filter((r) => r.rating === 1).length,
			2: allReviews.filter((r) => r.rating === 2).length,
			3: allReviews.filter((r) => r.rating === 3).length,
			4: allReviews.filter((r) => r.rating === 4).length,
			5: allReviews.filter((r) => r.rating === 5).length,
		};

		// Calculate average rating
		let averageRating = 0;
		if (totalReviews > 0) {
			const sum =
				1 * ratingCounts[1] +
				2 * ratingCounts[2] +
				3 * ratingCounts[3] +
				4 * ratingCounts[4] +
				5 * ratingCounts[5];
			averageRating = sum / totalReviews;
		}

		return {
			success: true,
			reviews: productReviews,
			totalReviews,
			averageRating: Number(averageRating.toFixed(1)),
			ratingCounts,
			currentPage: page,
			totalPages: Math.ceil(totalReviews / pageSize),
		};
	} catch (error) {
		console.error("Error fetching product reviews:", error);
		return {
			success: false,
			error: "Failed to fetch reviews",
			reviews: [],
			totalReviews: 0,
			averageRating: 0,
			ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
			currentPage: page,
			totalPages: 0,
		};
	}
}

/**
 * Check if current user can review a product (must have purchased it)
 */
export async function checkCanReview(productId: string) {
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as AuthSession | null;

	if (!session?.user?.id) {
		return { canReview: false, reason: "not_logged_in" };
	}

	try {
		// Check if user has purchased this product
		const purchasedProduct = await db.query.orderItems.findFirst({
			where: eq(orderItems.productId, productId),
			with: {
				order: {
					columns: {
						customerId: true,
					},
				},
			},
		});

		if (!purchasedProduct || purchasedProduct.order.customerId !== session.user.id) {
			return { canReview: false, reason: "not_purchased" };
		}

		// Check if user has already reviewed this product
		const existingReview = await db.query.reviews.findFirst({
			where: and(eq(reviews.productId, productId), eq(reviews.userId, session.user.id)),
		});

		if (existingReview) {
			return { canReview: false, reason: "already_reviewed" };
		}

		return { canReview: true };
	} catch (error) {
		console.error("Error checking review eligibility:", error);
		return { canReview: false, reason: "error" };
	}
}

/**
 * Create a new product review
 */
export async function createReview(formData: FormData) {
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as AuthSession | null;

	if (!session?.user?.id) {
		return { success: false, error: "You must be logged in to submit a review" };
	}

	try {
		const productId = formData.get("productId") as string;
		const rating = Number.parseInt(formData.get("rating") as string, 10);
		const title = formData.get("title") as string;
		const comment = formData.get("comment") as string;

		// Validate inputs
		if (!productId || !rating || !comment) {
			return { success: false, error: "Missing required fields" };
		}

		if (rating < 1 || rating > 5) {
			return { success: false, error: "Rating must be between 1 and 5" };
		}

		// Check if user can review
		const eligibility = await checkCanReview(productId);
		if (!eligibility.canReview) {
			const messages = {
				not_logged_in: "You must be logged in to submit a review",
				not_purchased: "You can only review products you have purchased",
				already_reviewed: "You have already reviewed this product",
				error: "Unable to verify review eligibility",
			};
			return {
				success: false,
				error: messages[eligibility.reason as keyof typeof messages],
			};
		}

		// Create the review
		const reviewData: {
			userId: string;
			productId: string;
			rating: number;
			title?: string;
			comment: string;
			reviewerName: string;
			status: "pending";
		} = {
			userId: session.user.id,
			productId,
			rating,
			comment,
			reviewerName: session.user.name,
			status: "pending",
		};

		if (title) {
			reviewData.title = title;
		}

		await db.insert(reviews).values(reviewData);

		// Update product rating statistics
		await updateProductRating(productId);

		return {
			success: true,
			message: "Your review has been submitted and is awaiting approval. Thank you!",
		};
	} catch (error) {
		console.error("Error creating review:", error);
		return { success: false, error: "Failed to submit review" };
	}
}

/**
 * Update product rating statistics (called after review creation/approval)
 */
async function updateProductRating(productId: string) {
	try {
		const approvedReviews = await db.query.reviews.findMany({
			where: and(eq(reviews.productId, productId), eq(reviews.status, "approved")),
			columns: {
				rating: true,
			},
		});

		const reviewsCount = approvedReviews.length;
		let ratingAverage: string | null = null;

		if (reviewsCount > 0) {
			const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
			ratingAverage = (sum / reviewsCount).toFixed(2);
		}

		await db
			.update(products)
			.set({
				reviewsCount,
				ratingAverage,
				updatedAt: new Date(),
			})
			.where(eq(products.id, productId));
	} catch (error) {
		console.error("Error updating product rating:", error);
	}
}
