import { eq } from "drizzle-orm";
import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/db";
import { categories } from "@/db/schema/catalog";

export default async function CreateProductPage() {
	// Fetch categories, brands, and tax classes for the form dropdowns
	const [allCategories, allBrands, allTaxClasses] = await Promise.all([
		db.query.categories.findMany({
			where: eq(categories.isDeleted, false),
			orderBy: (categories, { asc }) => [asc(categories.name)],
		}),
		db.query.brands.findMany({
			orderBy: (brands, { asc }) => [asc(brands.name)],
		}),
		db.query.taxClasses.findMany({
			orderBy: (taxClasses, { asc }) => [asc(taxClasses.name)],
		}),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Add Product</h1>
				<p className="text-muted-foreground mt-2">Create a new product</p>
			</div>

			<ProductForm categories={allCategories} brands={allBrands} taxClasses={allTaxClasses} />
		</div>
	);
}
