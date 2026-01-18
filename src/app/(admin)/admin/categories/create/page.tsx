import { eq } from "drizzle-orm";
import { CategoryForm } from "@/components/admin/category-form";
import { db } from "@/db";
import { categories } from "@/db/schema/catalog";

export default async function CreateCategoryPage() {
	// Fetch available parent categories (top-level only to keep it simple)
	const availableParents = await db.query.categories.findMany({
		where: eq(categories.isDeleted, false),
		orderBy: (categories, { asc }) => [asc(categories.name)],
	});

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Add Category</h1>
				<p className="text-muted-foreground mt-2">Create a new product category</p>
			</div>

			<CategoryForm availableParents={availableParents} />
		</div>
	);
}
