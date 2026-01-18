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

interface CategoryProductFiltersProps {
	categorySlug: string;
	priceRange: {
		min: number;
		max: number;
	};
	brands: Array<{
		id: string;
		name: string;
		slug: string;
		count: number;
	}>;
	currentFilters: {
		minPrice?: number;
		maxPrice?: number;
		brands: string[];
	};
}

export function CategoryProductFilters({
	categorySlug,
	priceRange,
	brands,
	currentFilters,
}: CategoryProductFiltersProps) {
	const router = useRouter();
	const [minPrice, setMinPrice] = useState(currentFilters.minPrice?.toString() || "");
	const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice?.toString() || "");

	const handleBrandChange = (brandSlug: string, checked: boolean) => {
		const params = new URLSearchParams(window.location.search);
		const currentBrands = params.get("brand")?.split(",").filter(Boolean) || [];

		let newBrands: string[];
		if (checked) {
			newBrands = [...currentBrands, brandSlug];
		} else {
			newBrands = currentBrands.filter((b) => b !== brandSlug);
		}

		if (newBrands.length > 0) {
			params.set("brand", newBrands.join(","));
		} else {
			params.delete("brand");
		}
		params.delete("page");

		router.push(`/categories/${categorySlug}?${params.toString()}`, { scroll: false });
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
		router.push(`/categories/${categorySlug}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Filter by</h3>

			{/* Brand Filter */}
			{brands.length > 0 && (
				<Card>
					<Accordion type="single" collapsible defaultValue="brand">
						<AccordionItem value="brand" className="border-none">
							<CardHeader className="p-4 pb-0">
								<AccordionTrigger className="hover:no-underline py-2">
									<h5 className="text-sm font-medium">Brand</h5>
								</AccordionTrigger>
							</CardHeader>
							<AccordionContent>
								<CardContent className="px-4 pb-4">
									<ul className="space-y-2">
										{brands.map((brand) => (
											<li key={brand.id}>
												<label className="flex items-center space-x-2 cursor-pointer">
													<Checkbox
														checked={currentFilters.brands.includes(brand.slug)}
														onCheckedChange={(checked) =>
															handleBrandChange(brand.slug, checked as boolean)
														}
													/>
													<span className="text-sm">
														{brand.name}{" "}
														<small className="text-muted-foreground">({brand.count})</small>
													</span>
												</label>
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
