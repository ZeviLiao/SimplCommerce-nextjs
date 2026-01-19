"use server";

import { and, asc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { shippingProviders } from "@/db/schema/orders";

export async function getShippingProviders(params?: {
	search?: string;
	isEnabled?: boolean;
	limit?: number;
	offset?: number;
}) {
	const conditions = [];

	if (params?.search) {
		conditions.push(
			or(
				ilike(shippingProviders.name, `%${params.search}%`),
				ilike(shippingProviders.code, `%${params.search}%`),
			),
		);
	}

	if (params?.isEnabled !== undefined) {
		conditions.push(eq(shippingProviders.isEnabled, params.isEnabled));
	}

	const providers = await db.query.shippingProviders.findMany({
		where: conditions.length > 0 ? and(...conditions) : undefined,
		orderBy: [asc(shippingProviders.displayOrder), asc(shippingProviders.name)],
		limit: params?.limit,
		offset: params?.offset,
	});

	return providers;
}

export async function getShippingProviderById(id: string) {
	const provider = await db.query.shippingProviders.findFirst({
		where: eq(shippingProviders.id, id),
	});

	return provider;
}

export async function getShippingProvidersCount(params?: { search?: string; isEnabled?: boolean }) {
	const conditions = [];

	if (params?.search) {
		conditions.push(
			or(
				ilike(shippingProviders.name, `%${params.search}%`),
				ilike(shippingProviders.code, `%${params.search}%`),
			),
		);
	}

	if (params?.isEnabled !== undefined) {
		conditions.push(eq(shippingProviders.isEnabled, params.isEnabled));
	}

	const result = await db
		.select({ count: db.$count(shippingProviders.id) })
		.from(shippingProviders)
		.where(conditions.length > 0 ? and(...conditions) : undefined);

	return result[0]?.count || 0;
}

export async function createShippingProvider(data: {
	name: string;
	code: string;
	description?: string;
	isEnabled?: boolean;
	configData?: Record<string, any>;
	displayOrder?: number;
}) {
	const [provider] = await db
		.insert(shippingProviders)
		.values({
			name: data.name,
			code: data.code,
			description: data.description,
			isEnabled: data.isEnabled ?? true,
			configData: data.configData,
			displayOrder: data.displayOrder ?? 0,
		})
		.returning();

	revalidatePath("/admin/shipping-providers");
	return provider;
}

export async function updateShippingProvider(
	id: string,
	data: {
		name?: string;
		code?: string;
		description?: string;
		isEnabled?: boolean;
		configData?: Record<string, any>;
		displayOrder?: number;
	},
) {
	const [provider] = await db
		.update(shippingProviders)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(eq(shippingProviders.id, id))
		.returning();

	revalidatePath("/admin/shipping-providers");
	revalidatePath(`/admin/shipping-providers/${id}`);
	return provider;
}

export async function deleteShippingProvider(id: string) {
	await db.delete(shippingProviders).where(eq(shippingProviders.id, id));

	revalidatePath("/admin/shipping-providers");
}

export async function getEnabledShippingProviders() {
	const providers = await db.query.shippingProviders.findMany({
		where: eq(shippingProviders.isEnabled, true),
		orderBy: [asc(shippingProviders.displayOrder), asc(shippingProviders.name)],
	});

	return providers;
}
