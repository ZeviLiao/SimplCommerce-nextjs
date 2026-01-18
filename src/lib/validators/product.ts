import { z } from "zod";

export const productSchema = z.object({
	name: z.string().min(1, "商品名稱為必填"),
	slug: z.string().min(1, "Slug 為必填"),
	sku: z.string().optional(),
	gtin: z.string().optional(),
	shortDescription: z.string().optional(),
	description: z.string().optional(),
	specification: z.string().optional(),
	price: z.coerce
		.string()
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, "價格不能為負數"),
	oldPrice: z.coerce.string().optional(),
	specialPrice: z.coerce.string().optional(),
	specialPriceStart: z.coerce.date().optional(),
	specialPriceEnd: z.coerce.date().optional(),
	stockQuantity: z.coerce.number().int().min(0, "庫存不能為負數").default(0),
	displayOrder: z.coerce.number().int().default(0),
	isPublished: z.boolean().default(false),
	isAllowToOrder: z.boolean().default(true),
	isVisibleIndividually: z.boolean().default(true),
	thumbnailImageUrl: z.string().optional(),
	brandId: z.string().optional(),
	taxClassId: z.string().optional(),
	categoryIds: z.array(z.string()).default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;
