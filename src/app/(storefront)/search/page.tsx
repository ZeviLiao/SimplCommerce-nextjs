import { Suspense } from "react";
import {
	getBrands,
	getCategoriesWithCount,
	getProducts,
	getProductsCount,
} from "@/actions/products";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { SearchResults } from "@/components/search/search-results";

interface PageProps {
	searchParams: Promise<{
		q?: string;
		category?: string;
		brand?: string;
		page?: string;
	}>;
}

export default async function SearchPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const limit = 12;
	const offset = (page - 1) * limit;
	const searchQuery = params.q;

	// Parse multi-select filters
	const categoryIds = params.category ? params.category.split(",") : undefined;
	const brandIds = params.brand ? params.brand.split(",") : undefined;

	const [products, totalCount, categories, brands] = await Promise.all([
		getProducts({
			search: searchQuery,
			categoryIds,
			brandIds,
			limit,
			offset,
		}),
		getProductsCount({
			search: searchQuery,
			categoryIds,
			brandIds,
		}),
		getCategoriesWithCount(),
		getBrands(),
	]);

	const totalPages = Math.ceil(totalCount / limit);

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Search Results</h1>
				{searchQuery ? (
					<p className="text-muted-foreground">Showing results for &quot;{searchQuery}&quot;</p>
				) : (
					<p className="text-muted-foreground">Enter a search term to find products</p>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<aside className="lg:col-span-1">
					<ProductFilters
						categories={categories}
						brands={brands}
						selectedCategoryIds={categoryIds}
						selectedBrandIds={brandIds}
						searchQuery={searchQuery}
						isSearchPage
					/>
				</aside>

				<main className="lg:col-span-3">
					<SearchResults
						searchQuery={searchQuery}
						totalCount={totalCount}
						currentPage={page}
						totalPages={totalPages}
					/>

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

					{products.length === 0 && searchQuery && (
						<div className="text-center py-12">
							<p className="text-lg font-medium mb-2">No products found</p>
							<p className="text-muted-foreground">
								Try adjusting your search or filters to find what you&apos;re looking for
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
