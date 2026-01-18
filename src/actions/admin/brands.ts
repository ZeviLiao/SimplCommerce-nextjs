"use server";

import { count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { brands } from "@/db/schema";

export async function getAdminBrands(page = 1, pageSize = 20) {
	try {
		const totalResult = await db.select({ value: count() }).from(brands);
		const total = totalResult[0].value;

		const data = await db.query.brands.findMany({
			limit: pageSize,
			offset: (page - 1) * pageSize,
			orderBy: [desc(brands.name)],
		});

		return {
			data,
			total,
			pageCount: Math.ceil(total / pageSize),
		};
	} catch (error) {
		console.error("Failed to fetch admin brands:", error);
		throw new Error("Failed to fetch brands");
	}
}

export async function getBrand(id: string) {
	try {
		const brand = await db.query.brands.findFirst({
			where: eq(brands.id, id),
		});
		return brand;
	} catch (error) {
		console.error("Failed to fetch brand:", error);
		return undefined;
	}
}

export type BrandState = {
	errors?: {
		[key: string]: string[];
	};
	message?: string | null;
};

export async function createBrand(_prevState: BrandState, formData: FormData) {
	const rawData = Object.fromEntries(formData.entries());

	const data = {
		name: rawData.name as string,
		slug: rawData.slug as string,
		description: (rawData.description as string) || null,
		isPublished: rawData.isPublished === "on",
	};

	if (!data.name || !data.slug) {
		return {
			errors: {
				name: data.name ? [] : ["Name is required"],
				slug: data.slug ? [] : ["Slug is required"],
			},
			message: "欄位驗證失敗，請檢查輸入內容。",
		};
	}

	try {
		await db.insert(brands).values(data);
	} catch (error) {
		console.error("Create brand error:", error);
		return {
			message: "建立品牌失敗，資料庫錯誤。",
		};
	}

	revalidatePath("/admin/brands");
	redirect("/admin/brands");
}

export async function updateBrand(id: string, _prevState: BrandState, formData: FormData) {
	const rawData = Object.fromEntries(formData.entries());

	const data = {
		name: rawData.name as string,
		slug: rawData.slug as string,
		description: (rawData.description as string) || null,
		isPublished: rawData.isPublished === "on",
	};

	if (!data.name || !data.slug) {
		return {
			errors: {
				name: data.name ? [] : ["Name is required"],
				slug: data.slug ? [] : ["Slug is required"],
			},
			message: "欄位驗證失敗，請檢查輸入內容。",
		};
	}

	try {
		await db.update(brands).set(data).where(eq(brands.id, id));
	} catch (error) {
		console.error("Update brand error:", error);
		return {
			message: "更新品牌失敗，資料庫錯誤。",
		};
	}

	revalidatePath("/admin/brands");
	redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
	try {
		await db.delete(brands).where(eq(brands.id, id));
		revalidatePath("/admin/brands");
	} catch (error) {
		console.error("Delete brand error:", error);
		throw new Error("Failed to delete brand");
	}
}
