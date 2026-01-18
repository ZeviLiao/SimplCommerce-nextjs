import Link from "next/link";
import { notFound } from "next/navigation";
import {
	getCategoryBySlug,
	getProductsByCategory,
	getProductsByCategoryStats,
} from "@/actions/products";
import { CategoryProductFilters } from "@/components/products/category-product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface PageProps {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{
		page?: string;
		minPrice?: string;
		maxPrice?: string;
		brand?: string;
		sort?: "price-asc" | "price-desc";
	}>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
	const { slug } = await params;
	const category = await getCategoryBySlug(slug);

	if (!category) {
		notFound();
	}

	const search = await searchParams;
	const page = Number(search.page) || 1;
	const minPrice = search.minPrice ? Number(search.minPrice) : undefined;
	const maxPrice = search.maxPrice ? Number(search.maxPrice) : undefined;
	const brands = search.brand ? search.brand.split(",") : undefined;
	const sort = search.sort || "price-asc";
	const pageSize = 12;

	const [products, stats] = await Promise.all([
		getProductsByCategory({
			categoryId: category.id,
			minPrice,
			maxPrice,
			brandIds: brands,
			sort,
			limit: pageSize,
			offset: (page - 1) * pageSize,
		}),
		getProductsByCategoryStats(category.id),
	]);

	const totalPages = Math.ceil(stats.priceRange.totalCount / pageSize);

	return (
		<div className="container py-8">
			<div className="gap-6 md:grid md:grid-cols-12">
				{/* Left Sidebar - Filters (col-md-3) */}
				<aside className="md:col-span-3 mb-6 md:mb-0 md:pr-4">
					<CategoryProductFilters
						categorySlug={slug}
						priceRange={{
							min: Number(stats.priceRange.minPrice) || 0,
							max: Number(stats.priceRange.maxPrice) || 0,
						}}
						brands={stats.brands}
						currentFilters={{
							minPrice,
							maxPrice,
							brands: brands || [],
						}}
					/>
				</aside>

				{/* Right Content - Products (col-md-9) */}
				<div className="md:col-span-9">
					{/* Header Row */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
						{/* Left: Category Name and Result Count */}
						<div>
							<h2 className="text-2xl font-bold">{category.name}</h2>
							<small className="text-muted-foreground">{stats.priceRange.totalCount} results</small>
						</div>

						{/* Right: Sort Options */}
						<div className="flex items-center gap-2">
							<label className="text-sm font-medium">Sort by:</label>
							<Select
								value={sort}
								onValueChange={(value) => {
									const params = new URLSearchParams(search);
									if (value === "price-asc") {
										params.delete("sort");
									} else {
										params.set("sort", value);
									}
									params.delete("page");
									window.location.href = `/categories/${slug}?${params.toString()}`;
								}}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="price-asc">Price: Low to High</SelectItem>
									<SelectItem value="price-desc">Price: High to Low</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Products Grid */}
					{products.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground">No products found</p>
						</div>
					) : (
						<>
							<ProductGrid products={products} />

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex justify-end mt-8">
									<div className="flex gap-1">
										{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
											const params = new URLSearchParams(search);
											params.set("page", p.toString());
											const url = `/categories/${slug}?${params.toString()}`;

											return (
												<Link
													key={p}
													href={url}
													className={`px-3 py-2 rounded ${
														p === page
															? "bg-primary text-primary-foreground"
															: "bg-muted hover:bg-muted/80"
													}`}
												>
													{p}
												</Link>
											);
										})}
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
