import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/db";
import { categories, products } from "@/db/schema/catalog";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditProductPage({ params }: PageProps) {
	const { id } = await params;

	// Fetch the product with all relations
	const product = await db.query.products.findFirst({
		where: eq(products.id, id),
		with: {
			productCategories: {
				with: {
					category: true,
				},
			},
			brand: true,
		},
	});

	if (!product || product.isDeleted) {
		notFound();
	}

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
				<h1 className="text-3xl font-bold">Edit Product</h1>
				<p className="text-muted-foreground mt-2">Modify product information</p>
			</div>

			<ProductForm
				initialData={product}
				categories={allCategories}
				brands={allBrands}
				taxClasses={allTaxClasses}
			/>
		</div>
	);
}
