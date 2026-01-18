"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
	selectedCategoryIds?: string[];
	selectedBrandIds?: string[];
	searchQuery?: string;
}

export function ProductFilters({
	categories,
	brands,
	selectedCategoryIds = [],
	selectedBrandIds = [],
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
		router.push(`/products?${params.toString()}`, { scroll: false });
	};

	const handleParentCategoryChange = (category: Category, checked: boolean) => {
		const params = new URLSearchParams(searchParams);
		let categories = selectedCategoryIds;

		if (checked) {
			// Add parent category
			categories = [...categories, category.id];
			// If has children, add all children
			if (category.children && category.children.length > 0) {
				const childIds = category.children.map((c) => c.id);
				categories = [...categories, ...childIds];
			}
		} else {
			// Remove parent category
			categories = categories.filter((id) => id !== category.id);
			// If has children, remove all children
			if (category.children && category.children.length > 0) {
				const childIds = category.children.map((c) => c.id);
				categories = categories.filter((id) => !childIds.includes(id));
			}
		}

		// Remove duplicates
		categories = [...new Set(categories)];

		if (categories.length > 0) {
			params.set("category", categories.join(","));
		} else {
			params.delete("category");
		}
		params.delete("page");
		router.push(`/products?${params.toString()}`, { scroll: false });
	};

	const handleChildCategoryChange = (
		parentCategory: Category,
		childId: string,
		checked: boolean,
	) => {
		const params = new URLSearchParams(searchParams);
		let categories = selectedCategoryIds;

		if (checked) {
			// Add child
			categories = [...categories, childId];
			// Check if all children are now selected
			const allChildrenSelected = parentCategory.children?.every((c) => categories.includes(c.id));
			// If all children selected, also select parent
			if (allChildrenSelected) {
				categories = [...categories, parentCategory.id];
			}
		} else {
			// Remove child
			categories = categories.filter((id) => id !== childId);
			// Also remove parent if it was selected
			categories = categories.filter((id) => id !== parentCategory.id);
		}

		// Remove duplicates
		categories = [...new Set(categories)];

		if (categories.length > 0) {
			params.set("category", categories.join(","));
		} else {
			params.delete("category");
		}
		params.delete("page");
		router.push(`/products?${params.toString()}`, { scroll: false });
	};

	const getParentCheckboxState = (category: Category): boolean | "indeterminate" => {
		if (!category.children || category.children.length === 0) {
			return selectedCategoryIds.includes(category.id);
		}

		const childIds = category.children.map((c) => c.id);
		const selectedChildrenCount = childIds.filter((id) => selectedCategoryIds.includes(id)).length;

		if (selectedChildrenCount === 0) {
			return false;
		}
		if (selectedChildrenCount === childIds.length) {
			return true;
		}
		return "indeterminate";
	};

	const handleBrandChange = (brandId: string, checked: boolean) => {
		const params = new URLSearchParams(searchParams);
		let brands = selectedBrandIds;

		if (checked) {
			brands = [...brands, brandId];
		} else {
			brands = brands.filter((id) => id !== brandId);
		}

		if (brands.length > 0) {
			params.set("brand", brands.join(","));
		} else {
			params.delete("brand");
		}
		params.delete("page");
		router.push(`/products?${params.toString()}`, { scroll: false });
	};

	const clearFilters = () => {
		router.push("/products");
	};

	const hasFilters = selectedCategoryIds.length > 0 || selectedBrandIds.length > 0 || searchQuery;

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
							<label className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-md hover:bg-muted transition-colors">
								<Checkbox
									checked={getParentCheckboxState(category)}
									onCheckedChange={(checked) =>
										handleParentCategoryChange(category, checked as boolean)
									}
								/>
								<span className="text-sm flex-1">
									{category.name} {category.count > 0 && `(${category.count})`}
								</span>
							</label>
							{category.children && category.children.length > 0 && (
								<div className="ml-6 mt-1 space-y-1">
									{category.children.map((child) => (
										<label
											key={child.id}
											className="flex items-center space-x-2 cursor-pointer px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
										>
											<Checkbox
												checked={selectedCategoryIds.includes(child.id)}
												onCheckedChange={(checked) =>
													handleChildCategoryChange(category, child.id, checked as boolean)
												}
											/>
											<span className="text-sm flex-1">
												{child.name} {child.count > 0 && `(${child.count})`}
											</span>
										</label>
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
						<label
							key={brand.id}
							className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-md hover:bg-muted transition-colors"
						>
							<Checkbox
								checked={selectedBrandIds.includes(brand.id)}
								onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
							/>
							<span className="text-sm flex-1">{brand.name}</span>
						</label>
					))}
				</div>
			</div>
		</div>
	);
}
