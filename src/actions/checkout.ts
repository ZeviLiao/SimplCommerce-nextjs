"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { addresses, cartItems, orderItems, orders, userAddresses } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getCartItemsForCheckout() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user?.id) return [];

	const items = await db.query.cartItems.findMany({
		where: eq(cartItems.userId, session.user.id),
		with: {
			product: true,
		},
	});

	return items;
}

export async function getUserAddresses() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user?.id) return [];

	const userAddrs = await db.query.userAddresses.findMany({
		where: eq(userAddresses.userId, session.user.id),
		with: {
			address: {
				with: {
					district: true,
					stateOrProvince: true,
					country: true,
				},
			},
		},
	});

	return userAddrs;
}

export async function createOrder(data: {
	shippingAddressId: string;
	billingAddressId: string;
	shippingMethod: string;
	paymentMethod: string;
	orderNote?: string;
}) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" };
		}

		// Get cart items
		const items = await db.query.cartItems.findMany({
			where: eq(cartItems.userId, session.user.id),
			with: {
				product: true,
			},
		});

		if (!items || items.length === 0) {
			return { success: false, error: "Cart is empty" };
		}

		// Calculate totals
		const subtotal = items.reduce((sum, item) => {
			const price = Number(item.product.specialPrice || item.product.price);
			return sum + price * item.quantity;
		}, 0);

		const shippingFee = 0; // TODO: Calculate based on shipping method
		const taxAmount = 0; // TODO: Calculate tax
		const discountAmount = 0; // TODO: Apply coupon if exists
		const orderTotal = subtotal + shippingFee + taxAmount - discountAmount;

		// Get addresses
		const shippingAddr = await db.query.addresses.findFirst({
			where: eq(addresses.id, data.shippingAddressId),
		});

		const billingAddr = await db.query.addresses.findFirst({
			where: eq(addresses.id, data.billingAddressId),
		});

		if (!shippingAddr || !billingAddr) {
			return { success: false, error: "Invalid address" };
		}

		// Create order
		const orderNumber = `ORD-${Date.now()}`;
		const [order] = await db
			.insert(orders)
			.values({
				orderNumber,
				customerId: session.user.id,
				vendorId: null,
				status: "pending_payment",
				orderNote: data.orderNote || "",
				subtotal: subtotal.toString(),
				subtotalWithDiscount: (subtotal - discountAmount).toString(),
				discountAmount: discountAmount.toString(),
				taxAmount: taxAmount.toString(),
				shippingFeeAmount: shippingFee.toString(),
				orderTotal: orderTotal.toString(),
				paymentMethod: data.paymentMethod,
				paymentFeeAmount: "0",
				shippingMethod: data.shippingMethod,
				shippingAddress: shippingAddr,
				billingAddress: billingAddr,
				couponCode: null,
				couponRuleName: null,
			})
			.returning();

		// Create order items
		const orderItemsData = items.map((item) => ({
			orderId: order.id,
			productId: item.productId,
			productName: item.product.name,
			productPrice: item.product.specialPrice || item.product.price,
			quantity: item.quantity,
			discountAmount: "0",
			taxAmount: "0",
			taxPercent: "0",
		}));

		await db.insert(orderItems).values(orderItemsData);

		// Clear cart
		await db.delete(cartItems).where(eq(cartItems.userId, session.user.id));

		revalidatePath("/cart");
		revalidatePath("/account/orders");

		return { success: true, orderId: order.id };
	} catch (error) {
		console.error("Create order error:", error);
		return { success: false, error: "Failed to create order" };
	}
}
