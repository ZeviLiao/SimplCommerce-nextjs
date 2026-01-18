"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface BrandProductFiltersProps {
	brandSlug: string;
	priceRange: {
		min: number;
		max: number;
	};
	categories: Array<{
		id: string;
		name: string;
		slug: string;
		parentId: string | null;
		count: number;
	}>;
	currentFilters: {
		minPrice?: number;
		maxPrice?: number;
		categories: string[];
	};
}

export function BrandProductFilters({
	brandSlug,
	priceRange,
	categories,
	currentFilters,
}: BrandProductFiltersProps) {
	const router = useRouter();
	const [minPrice, setMinPrice] = useState(currentFilters.minPrice?.toString() || "");
	const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice?.toString() || "");

	// Group categories by parent
	const rootCategories = categories.filter((c) => !c.parentId);
	const childrenMap = categories.reduce(
		(acc, cat) => {
			if (cat.parentId) {
				if (!acc[cat.parentId]) acc[cat.parentId] = [];
				acc[cat.parentId].push(cat);
			}
			return acc;
		},
		{} as Record<string, typeof categories>,
	);

	const handleCategoryChange = (categorySlug: string, checked: boolean) => {
		const params = new URLSearchParams(window.location.search);
		const currentCategories = params.get("category")?.split(",").filter(Boolean) || [];

		let newCategories: string[];
		if (checked) {
			newCategories = [...currentCategories, categorySlug];
		} else {
			newCategories = currentCategories.filter((c) => c !== categorySlug);
		}

		if (newCategories.length > 0) {
			params.set("category", newCategories.join(","));
		} else {
			params.delete("category");
		}
		params.delete("page");

		router.push(`/brands/${brandSlug}?${params.toString()}`, { scroll: false });
	};

	const handlePriceChange = () => {
		const params = new URLSearchParams(window.location.search);

		if (minPrice) {
			params.set("minPrice", minPrice);
		} else {
			params.delete("minPrice");
		}

		if (maxPrice) {
			params.set("maxPrice", maxPrice);
		} else {
			params.delete("maxPrice");
		}

		params.delete("page");
		router.push(`/brands/${brandSlug}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Filter by</h3>

			{/* Category Filter */}
			{categories.length > 0 && (
				<Card>
					<Accordion type="single" collapsible defaultValue="category">
						<AccordionItem value="category" className="border-none">
							<CardHeader className="p-4 pb-0">
								<AccordionTrigger className="hover:no-underline py-2">
									<h5 className="text-sm font-medium">Category</h5>
								</AccordionTrigger>
							</CardHeader>
							<AccordionContent>
								<CardContent className="px-4 pb-4">
									<ul className="space-y-2">
										{rootCategories.map((category) => (
											<li key={category.id}>
												<label className="flex items-center space-x-2 cursor-pointer">
													<Checkbox
														checked={currentFilters.categories.includes(category.slug)}
														onCheckedChange={(checked) =>
															handleCategoryChange(category.slug, checked as boolean)
														}
													/>
													<span className="text-sm">
														{category.name}{" "}
														<small className="text-muted-foreground">({category.count})</small>
													</span>
												</label>

												{/* Child categories */}
												{childrenMap[category.id] && (
													<ul className="ml-6 mt-1 space-y-1">
														{childrenMap[category.id].map((child) => (
															<li key={child.id}>
																<label className="flex items-center space-x-2 cursor-pointer">
																	<Checkbox
																		checked={currentFilters.categories.includes(child.slug)}
																		onCheckedChange={(checked) =>
																			handleCategoryChange(child.slug, checked as boolean)
																		}
																	/>
																	<span className="text-sm">
																		{child.name}{" "}
																		<small className="text-muted-foreground">({child.count})</small>
																	</span>
																</label>
															</li>
														))}
													</ul>
												)}
											</li>
										))}
									</ul>
								</CardContent>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</Card>
			)}

			{/* Price Filter */}
			{priceRange.max !== priceRange.min && (
				<Card className="mt-4">
					<Accordion type="single" collapsible defaultValue="price">
						<AccordionItem value="price" className="border-none">
							<CardHeader className="p-4 pb-0">
								<AccordionTrigger className="hover:no-underline py-2">
									<h5 className="text-sm font-medium">Price</h5>
								</AccordionTrigger>
							</CardHeader>
							<AccordionContent>
								<CardContent className="px-4 pb-4 space-y-2">
									<div className="flex items-center gap-2">
										<input
											type="number"
											placeholder={`${priceRange.min.toFixed(0)}`}
											value={minPrice}
											onChange={(e) => setMinPrice(e.target.value)}
											onBlur={handlePriceChange}
											onKeyDown={(e) => {
												if (e.key === "Enter") handlePriceChange();
											}}
											className="w-full px-3 py-1 border rounded text-sm"
											min={priceRange.min}
											max={priceRange.max}
										/>
										<span className="text-muted-foreground">-</span>
										<input
											type="number"
											placeholder={`${priceRange.max.toFixed(0)}`}
											value={maxPrice}
											onChange={(e) => setMaxPrice(e.target.value)}
											onBlur={handlePriceChange}
											onKeyDown={(e) => {
												if (e.key === "Enter") handlePriceChange();
											}}
											className="w-full px-3 py-1 border rounded text-sm"
											min={priceRange.min}
											max={priceRange.max}
										/>
									</div>
									<div className="text-xs text-muted-foreground">
										<span id="minPrice">${priceRange.min.toFixed(0)}</span>
										{" - "}
										<span id="maxPrice">${priceRange.max.toFixed(0)}</span>
									</div>
								</CardContent>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</Card>
			)}
		</div>
	);
}
