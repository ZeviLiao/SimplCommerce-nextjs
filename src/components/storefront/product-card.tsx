"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { products } from "@/db/schema";
import { useCartStore } from "@/stores/cart-store";

interface ProductCardProps {
	product: typeof products.$inferSelect;
}

export function ProductCard({ product }: ProductCardProps) {
	const addItem = useCartStore((state) => state.addItem);

	const handleAddToCart = async () => {
		await addItem(product.id, 1);
	};

	return (
		<Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-lg">
			<CardHeader className="p-0">
				<div className="relative aspect-square w-full bg-muted">
					{product.thumbnailImageUrl ? (
						<Image
							src={product.thumbnailImageUrl}
							alt={product.name}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					) : (
						<div className="flex h-full items-center justify-center text-muted-foreground">
							No Image
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="flex-1 p-4">
				<Link href={`/products/${product.slug}`} className="hover:underline">
					<h3 className="font-semibold line-clamp-2">{product.name}</h3>
				</Link>
				<p className="mt-2 text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</p>
			</CardContent>
			<CardFooter className="p-4 pt-0">
				<Button
					className="w-full"
					disabled={!product.isAllowToOrder || product.stockQuantity <= 0}
					onClick={handleAddToCart}
				>
					<ShoppingCart className="mr-2 h-4 w-4" />
					{product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
				</Button>
			</CardFooter>
		</Card>
	);
}
