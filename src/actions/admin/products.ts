"use server";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { productCategories, products } from "@/db/schema";
import { productSchema } from "@/lib/validators/product";

export interface AdminProductsResponse {
	data: (typeof products.$inferSelect)[];
	total: number;
	pageCount: number;
}

export async function getAdminProducts(page = 1, pageSize = 10, _search?: string) {
	try {
		// 取得總數
		const totalResult = await db
			.select({ value: count() })
			.from(products)
			.where(eq(products.isDeleted, false));
		const total = totalResult[0].value;

		// 取得分頁資料 with brand relation
		const data = await db.query.products.findMany({
			where: eq(products.isDeleted, false),
			limit: pageSize,
			offset: (page - 1) * pageSize,
			orderBy: [desc(products.createdAt)],
			with: {
				brand: true,
			},
		});

		return {
			data,
			total,
			pageCount: Math.ceil(total / pageSize),
		};
	} catch (error) {
		console.error("Failed to fetch admin products:", error);
		throw new Error("Failed to fetch products");
	}
}

export async function getProduct(id: string) {
	try {
		const product = await db.query.products.findFirst({
			where: eq(products.id, id),
			with: {
				productCategories: {
					with: {
						category: true,
					},
				},
			},
		});
		return product;
	} catch (error) {
		console.error("Failed to fetch product:", error);
		return undefined;
	}
}

export type ProductState = {
	errors?: {
		[key: string]: string[];
	};
	message?: string | null;
};

// 簡單的檔案上傳處理
async function uploadFile(file: File): Promise<string | null> {
	if (!file || file.size === 0) return null;

	const buffer = Buffer.from(await file.arrayBuffer());
	const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
	const uploadDir = join(cwd(), "public", "uploads");

	try {
		await mkdir(uploadDir, { recursive: true });
		await writeFile(join(uploadDir, filename), buffer);
		return `/uploads/${filename}`;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw new Error("File upload failed");
	}
}

export async function createProduct(_prevState: ProductState, formData: FormData) {
	// 將 FormData 轉換為物件，處理 Checkbox 的特殊情況
	const rawData = Object.fromEntries(formData.entries());
	const thumbnailImage = formData.get("thumbnailImage") as File;

	let thumbnailImageUrl = "";
	if (thumbnailImage && thumbnailImage.size > 0) {
		thumbnailImageUrl = (await uploadFile(thumbnailImage)) || "";
	}

	const data = {
		...rawData,
		isPublished: rawData.isPublished === "on",
		isAllowToOrder: rawData.isAllowToOrder === "on",
		isVisibleIndividually: rawData.isVisibleIndividually === "on",
		thumbnailImageUrl,
		categoryIds: formData.getAll("categoryIds").map(String),
	};

	const validatedFields = productSchema.safeParse(data);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "欄位驗證失敗，請檢查輸入內容。",
		};
	}

	try {
		const [newProduct] = await db
			.insert(products)
			.values({
				...validatedFields.data,
				createdAt: new Date(),
				updatedAt: new Date(),
				isDeleted: false,
			})
			.returning();

		// 處理分類關聯
		if (validatedFields.data.categoryIds.length > 0) {
			await db.insert(productCategories).values(
				validatedFields.data.categoryIds.map((categoryId) => ({
					productId: newProduct.id,
					categoryId,
				})),
			);
		}
	} catch (error) {
		console.error("Create product error:", error);
		return {
			message: "建立商品失敗，資料庫錯誤。",
		};
	}

	revalidatePath("/admin/products");
	redirect("/admin/products");
}

export async function deleteProduct(id: string) {
	try {
		await db
			.update(products)
			.set({ isDeleted: true, updatedAt: new Date() })
			.where(eq(products.id, id));
		revalidatePath("/admin/products");
	} catch (error) {
		console.error("Delete product error:", error);
		throw new Error("Failed to delete product");
	}
}

export async function updateProduct(id: string, _prevState: ProductState, formData: FormData) {
	const rawData = Object.fromEntries(formData.entries());
	const thumbnailImage = formData.get("thumbnailImage") as File;

	// 處理圖片：如果有上傳新圖則使用新圖，否則保留舊圖 (從 hidden input 或不更新)
	let thumbnailImageUrl = rawData.existingThumbnailImageUrl as string;
	if (thumbnailImage && thumbnailImage.size > 0) {
		const uploadedUrl = await uploadFile(thumbnailImage);
		if (uploadedUrl) {
			thumbnailImageUrl = uploadedUrl;
		}
	}

	const data = {
		...rawData,
		isPublished: rawData.isPublished === "on",
		isAllowToOrder: rawData.isAllowToOrder === "on",
		isVisibleIndividually: rawData.isVisibleIndividually === "on",
		thumbnailImageUrl,
		categoryIds: formData.getAll("categoryIds").map(String),
	};

	const validatedFields = productSchema.safeParse(data);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "欄位驗證失敗，請檢查輸入內容。",
		};
	}

	try {
		await db
			.update(products)
			.set({ ...validatedFields.data, updatedAt: new Date() })
			.where(eq(products.id, id));

		// 更新分類關聯：先刪除舊的，再新增新的
		await db.delete(productCategories).where(eq(productCategories.productId, id));

		if (validatedFields.data.categoryIds.length > 0) {
			await db.insert(productCategories).values(
				validatedFields.data.categoryIds.map((categoryId) => ({
					productId: id,
					categoryId,
				})),
			);
		}
	} catch (error) {
		console.error("Update product error:", error);
		return {
			message: "更新商品失敗，資料庫錯誤。",
		};
	}

	revalidatePath("/admin/products");
	redirect("/admin/products");
}

export async function toggleProductPublish(id: string) {
	try {
		const product = await db.query.products.findFirst({
			where: eq(products.id, id),
		});

		if (!product) {
			throw new Error("Product not found");
		}

		await db
			.update(products)
			.set({ isPublished: !product.isPublished, updatedAt: new Date() })
			.where(eq(products.id, id));

		revalidatePath("/admin/products");
	} catch (error) {
		console.error("Toggle product publish error:", error);
		throw new Error("Failed to toggle product publish status");
	}
}

export async function toggleProductFeatured(id: string) {
	try {
		const product = await db.query.products.findFirst({
			where: eq(products.id, id),
		});

		if (!product) {
			throw new Error("Product not found");
		}

		await db
			.update(products)
			.set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
			.where(eq(products.id, id));

		revalidatePath("/admin/products");
	} catch (error) {
		console.error("Toggle product featured error:", error);
		throw new Error("Failed to toggle product featured status");
	}
}
