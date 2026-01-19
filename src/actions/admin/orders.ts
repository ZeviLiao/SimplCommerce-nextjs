"use server";

import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";

// Get orders list with filters and pagination
export async function getOrders(params?: {
	status?: string;
	search?: string;
	limit?: number;
	offset?: number;
}) {
	const { status, search, limit = 20, offset = 0 } = params || {};

	// Build conditions
	const conditions = [];

	if (status && status !== "all") {
		conditions.push(eq(schema.orders.status, status as any));
	}

	if (search) {
		conditions.push(
			or(
				ilike(schema.orders.orderNumber, `%${search}%`),
				// We'll need to search in customer name through relation
			),
		);
	}

	// Get orders with customer info
	const orders = await db.query.orders.findMany({
		where: conditions.length > 0 ? and(...conditions) : undefined,
		with: {
			customer: {
				columns: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
		orderBy: [desc(schema.orders.createdAt)],
		limit,
		offset,
	});

	return orders;
}

// Get total orders count for pagination
export async function getOrdersCount(params?: { status?: string; search?: string }) {
	const { status, search } = params || {};

	const conditions = [];

	if (status && status !== "all") {
		conditions.push(eq(schema.orders.status, status as any));
	}

	if (search) {
		conditions.push(ilike(schema.orders.orderNumber, `%${search}%`));
	}

	const result = await db
		.select({ count: count() })
		.from(schema.orders)
		.where(conditions.length > 0 ? and(...conditions) : undefined);

	return result[0]?.count || 0;
}

// Get single order by ID with full details
export async function getOrderById(orderId: string) {
	const order = await db.query.orders.findFirst({
		where: eq(schema.orders.id, orderId),
		with: {
			customer: {
				columns: {
					id: true,
					name: true,
					email: true,
					phone: true,
				},
			},
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
			payments: {
				orderBy: [desc(schema.payments.createdAt)],
			},
			shipments: {
				orderBy: [desc(schema.shipments.createdAt)],
			},
			history: {
				with: {
					createdBy: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
				orderBy: [desc(schema.orderHistory.createdAt)],
			},
		},
	});

	return order;
}

// Update order status
export async function updateOrderStatus(params: {
	orderId: string;
	newStatus: string;
	note?: string;
	userId: string;
}) {
	const { orderId, newStatus, note, userId } = params;

	// Get current order
	const order = await db.query.orders.findFirst({
		where: eq(schema.orders.id, orderId),
		columns: {
			status: true,
		},
	});

	if (!order) {
		return { success: false, error: "Order not found" };
	}

	// Update order status
	await db
		.update(schema.orders)
		.set({
			status: newStatus as any,
			updatedAt: new Date(),
			updatedById: userId,
		})
		.where(eq(schema.orders.id, orderId));

	// Create order history record
	await db.insert(schema.orderHistory).values({
		orderId,
		oldStatus: order.status,
		newStatus: newStatus as any,
		note: note || null,
		createdById: userId,
	});

	return { success: true };
}

// Get order statistics
export async function getOrderStats() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Get today's orders count
	const todayOrdersResult = await db
		.select({ count: count() })
		.from(schema.orders)
		.where(sql`${schema.orders.createdAt} >= ${today}`);

	// Get today's revenue
	const todayRevenueResult = await db
		.select({
			total: sql<string>`COALESCE(SUM(${schema.orders.orderTotal}), 0)`,
		})
		.from(schema.orders)
		.where(sql`${schema.orders.createdAt} >= ${today}`);

	// Get pending orders count
	const pendingOrdersResult = await db
		.select({ count: count() })
		.from(schema.orders)
		.where(
			or(
				eq(schema.orders.status, "new"),
				eq(schema.orders.status, "pending_payment"),
				eq(schema.orders.status, "processing"),
			),
		);

	// Get total orders count
	const totalOrdersResult = await db.select({ count: count() }).from(schema.orders);

	return {
		todayOrders: todayOrdersResult[0]?.count || 0,
		todayRevenue: Number.parseFloat(todayRevenueResult[0]?.total || "0"),
		pendingOrders: pendingOrdersResult[0]?.count || 0,
		totalOrders: totalOrdersResult[0]?.count || 0,
	};
}
