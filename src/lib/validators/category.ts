import { z } from "zod";

export const categorySchema = z.object({
	name: z.string().min(1, "分類名稱為必填"),
	slug: z.string().min(1, "Slug 為必填"),
	description: z.string().optional(),
	displayOrder: z.coerce.number().int().default(0),
	isPublished: z.boolean().default(false),
	includeInMenu: z.boolean().default(true),
	imageUrl: z.string().optional(),
	parentId: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
