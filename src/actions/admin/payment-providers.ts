"use server";

import { and, asc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { paymentProviders } from "@/db/schema/orders";

export async function getPaymentProviders(params?: {
	search?: string;
	isEnabled?: boolean;
	limit?: number;
	offset?: number;
}) {
	const conditions = [];

	if (params?.search) {
		conditions.push(
			or(
				ilike(paymentProviders.name, `%${params.search}%`),
				ilike(paymentProviders.code, `%${params.search}%`),
			),
		);
	}

	if (params?.isEnabled !== undefined) {
		conditions.push(eq(paymentProviders.isEnabled, params.isEnabled));
	}

	const providers = await db.query.paymentProviders.findMany({
		where: conditions.length > 0 ? and(...conditions) : undefined,
		orderBy: [asc(paymentProviders.displayOrder), asc(paymentProviders.name)],
		limit: params?.limit,
		offset: params?.offset,
	});

	return providers;
}

export async function getPaymentProviderById(id: string) {
	const provider = await db.query.paymentProviders.findFirst({
		where: eq(paymentProviders.id, id),
	});

	return provider;
}

export async function getPaymentProvidersCount(params?: { search?: string; isEnabled?: boolean }) {
	const conditions = [];

	if (params?.search) {
		conditions.push(
			or(
				ilike(paymentProviders.name, `%${params.search}%`),
				ilike(paymentProviders.code, `%${params.search}%`),
			),
		);
	}

	if (params?.isEnabled !== undefined) {
		conditions.push(eq(paymentProviders.isEnabled, params.isEnabled));
	}

	const result = await db
		.select({ count: db.$count(paymentProviders.id) })
		.from(paymentProviders)
		.where(conditions.length > 0 ? and(...conditions) : undefined);

	return result[0]?.count || 0;
}

export async function createPaymentProvider(data: {
	name: string;
	code: string;
	description?: string;
	isEnabled?: boolean;
	configData?: Record<string, any>;
	displayOrder?: number;
}) {
	const [provider] = await db
		.insert(paymentProviders)
		.values({
			name: data.name,
			code: data.code,
			description: data.description,
			isEnabled: data.isEnabled ?? true,
			configData: data.configData,
			displayOrder: data.displayOrder ?? 0,
		})
		.returning();

	revalidatePath("/admin/payment-providers");
	return provider;
}

export async function updatePaymentProvider(
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
		.update(paymentProviders)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(eq(paymentProviders.id, id))
		.returning();

	revalidatePath("/admin/payment-providers");
	revalidatePath(`/admin/payment-providers/${id}`);
	return provider;
}

export async function deletePaymentProvider(id: string) {
	await db.delete(paymentProviders).where(eq(paymentProviders.id, id));

	revalidatePath("/admin/payment-providers");
}

export async function getEnabledPaymentProviders() {
	const providers = await db.query.paymentProviders.findMany({
		where: eq(paymentProviders.isEnabled, true),
		orderBy: [asc(paymentProviders.displayOrder), asc(paymentProviders.name)],
	});

	return providers;
}
