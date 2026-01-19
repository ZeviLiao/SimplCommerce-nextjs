"use server";

import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { orderHistory, orders } from "@/db/schema";
import { type AuthSession, auth } from "@/lib/auth";

/**
 * Get all orders for the current user
 */
export async function getUserOrders() {
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as AuthSession | null;

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	try {
		const userOrders = await db.query.orders.findMany({
			where: eq(orders.customerId, session.user.id),
			orderBy: [desc(orders.createdAt)],
			with: {
				items: {
					with: {
						product: {
							columns: {
								id: true,
								name: true,
								slug: true,
								thumbnailImageUrl: true,
							},
						},
					},
				},
			},
		});

		return { success: true, orders: userOrders };
	} catch (error) {
		console.error("Error fetching user orders:", error);
		return { success: false, error: "Failed to fetch orders" };
	}
}

/**
 * Get a specific order by ID
 */
export async function getOrderById(orderId: string) {
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as AuthSession | null;

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	try {
		const order = await db.query.orders.findFirst({
			where: eq(orders.id, orderId),
			with: {
				items: {
					with: {
						product: {
							columns: {
								id: true,
								name: true,
								slug: true,
								thumbnailImageUrl: true,
							},
						},
					},
				},
				history: {
					orderBy: [desc(orderHistory.createdAt)],
					with: {
						createdBy: {
							columns: {
								name: true,
								email: true,
							},
						},
					},
				},
				customer: {
					columns: {
						name: true,
						email: true,
						phone: true,
					},
				},
			},
		});

		if (!order) {
			return { success: false, error: "Order not found" };
		}

		// Verify the order belongs to the current user (unless admin/vendor)
		if (
			order.customerId !== session.user.id &&
			session.user.role !== "admin" &&
			session.user.role !== "vendor"
		) {
			return { success: false, error: "Unauthorized" };
		}

		return { success: true, order };
	} catch (error) {
		console.error("Error fetching order:", error);
		return { success: false, error: "Failed to fetch order" };
	}
}

/**
 * Cancel an order (only if status is 'new' or 'pending_payment')
 */
export async function cancelOrder(orderId: string) {
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as AuthSession | null;

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	try {
		const order = await db.query.orders.findFirst({
			where: eq(orders.id, orderId),
		});

		if (!order) {
			return { success: false, error: "Order not found" };
		}

		if (order.customerId !== session.user.id) {
			return { success: false, error: "Unauthorized" };
		}

		if (order.status !== "new" && order.status !== "pending_payment") {
			return {
				success: false,
				error: "Only new or pending payment orders can be cancelled",
			};
		}

		// Update order status to cancelled
		await db
			.update(orders)
			.set({
				status: "cancelled",
				updatedAt: new Date(),
				updatedById: session.user.id,
			})
			.where(eq(orders.id, orderId));

		// Add order history record
		await db.insert(orderHistory).values({
			orderId,
			oldStatus: order.status,
			newStatus: "cancelled",
			note: "Order cancelled by customer",
			createdById: session.user.id,
		});

		return { success: true, message: "Order cancelled successfully" };
	} catch (error) {
		console.error("Error cancelling order:", error);
		return { success: false, error: "Failed to cancel order" };
	}
}
