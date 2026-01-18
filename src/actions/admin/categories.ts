"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { categorySchema } from "@/lib/validators/category";

export interface AdminCategoriesResponse {
	data: (typeof categories.$inferSelect)[];
	total: number;
}

export async function getAdminCategories(): Promise<AdminCategoriesResponse> {
	try {
		const data = await db
			.select()
			.from(categories)
			.where(eq(categories.isDeleted, false))
			.orderBy(desc(categories.createdAt));

		return {
			data,
			total: data.length,
		};
	} catch (error) {
		console.error("Failed to fetch admin categories:", error);
		throw new Error("Failed to fetch categories");
	}
}

export async function getCategory(id: string) {
	try {
		const category = await db.query.categories.findFirst({
			where: eq(categories.id, id),
		});
		return category;
	} catch (error) {
		console.error("Failed to fetch category:", error);
		return undefined;
	}
}

export type CategoryState = {
	errors?: {
		[key: string]: string[];
	};
	message?: string | null;
};

export async function createCategory(_prevState: CategoryState, formData: FormData) {
	const rawData = Object.fromEntries(formData.entries());
	const data = {
		...rawData,
		isPublished: rawData.isPublished === "on",
		parentId: rawData.parentId ? String(rawData.parentId) : undefined,
	};

	const validatedFields = categorySchema.safeParse(data);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "欄位驗證失敗，請檢查輸入內容。",
		};
	}

	try {
		await db.insert(categories).values({
			...validatedFields.data,
			createdAt: new Date(),
			updatedAt: new Date(),
			isDeleted: false,
		});
	} catch (error) {
		console.error("Create category error:", error);
		return { message: "建立分類失敗，資料庫錯誤。" };
	}

	revalidatePath("/admin/categories");
	redirect("/admin/categories");
}

export async function updateCategory(id: string, _prevState: CategoryState, formData: FormData) {
	const rawData = Object.fromEntries(formData.entries());
	const data = {
		...rawData,
		isPublished: rawData.isPublished === "on",
		parentId: rawData.parentId ? String(rawData.parentId) : undefined,
	};

	const validatedFields = categorySchema.safeParse(data);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "欄位驗證失敗，請檢查輸入內容。",
		};
	}

	try {
		await db
			.update(categories)
			.set({ ...validatedFields.data, updatedAt: new Date() })
			.where(eq(categories.id, id));
	} catch (error) {
		console.error("Update category error:", error);
		return { message: "更新分類失敗，資料庫錯誤。" };
	}

	revalidatePath("/admin/categories");
	redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
	try {
		await db
			.update(categories)
			.set({ isDeleted: true, updatedAt: new Date() })
			.where(eq(categories.id, id));
		revalidatePath("/admin/categories");
	} catch (error) {
		console.error("Delete category error:", error);
		throw new Error("Failed to delete category");
	}
}
