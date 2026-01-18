"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
	id: string;
	name: string;
	slug: string;
	count: number;
	children?: Category[];
}

interface Brand {
	id: string;
	name: string;
	slug: string;
}

interface ProductFiltersProps {
	categories: Category[];
	brands: Brand[];
	selectedCategoryId?: string;
	selectedBrandId?: string;
	searchQuery?: string;
}

export function ProductFilters({
	categories,
	brands,
	selectedCategoryId,
	selectedBrandId,
	searchQuery,
}: ProductFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const search = formData.get("search") as string;

		const params = new URLSearchParams(searchParams);
		if (search) {
			params.set("search", search);
		} else {
			params.delete("search");
		}
		params.delete("page");
		router.push(`/products?${params.toString()}`);
	};

	const handleCategoryChange = (categoryId: string) => {
		const params = new URLSearchParams(searchParams);
		if (categoryId === selectedCategoryId) {
			params.delete("categoryId");
		} else {
			params.set("categoryId", categoryId);
		}
		params.delete("page");
		router.push(`/products?${params.toString()}`);
	};

	const handleBrandChange = (brandId: string) => {
		const params = new URLSearchParams(searchParams);
		if (brandId === selectedBrandId) {
			params.delete("brandId");
		} else {
			params.set("brandId", brandId);
		}
		params.delete("page");
		router.push(`/products?${params.toString()}`);
	};

	const clearFilters = () => {
		router.push("/products");
	};

	const hasFilters = selectedCategoryId || selectedBrandId || searchQuery;

	return (
		<div className="space-y-6">
			{/* Search */}
			<div>
				<Label htmlFor="search" className="text-base font-semibold mb-3 block">
					Search
				</Label>
				<form onSubmit={handleSearch} className="flex gap-2">
					<Input
						id="search"
						name="search"
						type="search"
						placeholder="Search products..."
						defaultValue={searchQuery}
					/>
					<Button type="submit" size="icon">
						<Search className="h-4 w-4" />
					</Button>
				</form>
			</div>

			{/* Clear Filters */}
			{hasFilters && (
				<Button variant="outline" onClick={clearFilters} className="w-full">
					<X className="h-4 w-4 mr-2" />
					Clear Filters
				</Button>
			)}

			{/* Categories */}
			<div>
				<Label className="text-base font-semibold mb-3 block">Categories</Label>
				<div className="space-y-2">
					{categories.map((category) => (
						<div key={category.id}>
							<button
								type="button"
								onClick={() => handleCategoryChange(category.id)}
								className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors ${
									selectedCategoryId === category.id
										? "bg-primary text-primary-foreground hover:bg-primary/90"
										: ""
								}`}
							>
								{category.name} {category.count > 0 && `(${category.count})`}
							</button>
							{category.children && category.children.length > 0 && (
								<div className="ml-4 mt-1 space-y-1">
									{category.children.map((child) => (
										<button
											key={child.id}
											type="button"
											onClick={() => handleCategoryChange(child.id)}
											className={`w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors ${
												selectedCategoryId === child.id
													? "bg-primary text-primary-foreground hover:bg-primary/90"
													: ""
											}`}
										>
											{child.name} {child.count > 0 && `(${child.count})`}
										</button>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Brands */}
			<div>
				<Label className="text-base font-semibold mb-3 block">Brands</Label>
				<div className="space-y-2">
					{brands.map((brand) => (
						<button
							key={brand.id}
							type="button"
							onClick={() => handleBrandChange(brand.id)}
							className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors ${
								selectedBrandId === brand.id
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: ""
							}`}
						>
							{brand.name}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
