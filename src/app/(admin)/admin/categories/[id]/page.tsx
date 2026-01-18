import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { db } from "@/db";
import { categories } from "@/db/schema/catalog";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditCategoryPage({ params }: PageProps) {
	const { id } = await params;

	// Fetch the category
	const category = await db.query.categories.findFirst({
		where: eq(categories.id, id),
	});

	if (!category || category.isDeleted) {
		notFound();
	}

	// Fetch available parent categories (exclude the current category and its descendants)
	const allCategories = await db.query.categories.findMany({
		where: eq(categories.isDeleted, false),
		orderBy: (categories, { asc }) => [asc(categories.name)],
	});

	// Filter out the current category and any descendants to prevent circular references
	const availableParents = allCategories.filter((cat) => {
		// Can't be its own parent
		if (cat.id === id) return false;
		// Can't select a child as parent (simplified - only checks direct children)
		if (cat.parentId === id) return false;
		return true;
	});

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Edit Category</h1>
				<p className="text-muted-foreground mt-2">Modify category information</p>
			</div>

			<CategoryForm initialData={category} availableParents={availableParents} />
		</div>
	);
}
