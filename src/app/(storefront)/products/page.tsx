import { Suspense } from "react";
import { getBrands, getCategoriesWithCount, getProducts } from "@/actions/products";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";

interface PageProps {
	searchParams: Promise<{
		search?: string;
		categoryId?: string;
		brandId?: string;
		page?: string;
	}>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const limit = 12;
	const offset = (page - 1) * limit;

	const [products, categories, brands] = await Promise.all([
		getProducts({
			search: params.search,
			categoryId: params.categoryId,
			brandId: params.brandId,
			limit,
			offset,
		}),
		getCategoriesWithCount(),
		getBrands(),
	]);

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Products</h1>
				<p className="text-muted-foreground">Browse our collection of quality products</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<aside className="lg:col-span-1">
					<ProductFilters
						categories={categories}
						brands={brands}
						selectedCategoryId={params.categoryId}
						selectedBrandId={params.brandId}
						searchQuery={params.search}
					/>
				</aside>

				<main className="lg:col-span-3">
					<Suspense
						fallback={
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{Array.from({ length: 6 }).map((_, i) => (
									<div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
								))}
							</div>
						}
					>
						<ProductGrid products={products} />
					</Suspense>

					{products.length === 0 && (
						<div className="text-center py-12">
							<p className="text-muted-foreground">No products found</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
