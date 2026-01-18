"use client";

import { ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { removeFromWishlist } from "@/actions/wishlist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/stores/cart-store";

type WishlistItem = {
	userId: string;
	productId: string;
	createdAt: Date;
	product: {
		id: string;
		name: string;
		slug: string;
		price: string;
		specialPrice: string | null;
		oldPrice: string | null;
		thumbnailImageUrl: string | null;
		isAllowToOrder: boolean;
	};
};

interface WishlistContentProps {
	items: WishlistItem[];
}

export function WishlistContent({ items: initialItems }: WishlistContentProps) {
	const [items, setItems] = useState(initialItems);
	const [loading, setLoading] = useState<string | null>(null);
	const addItem = useCartStore((state) => state.addItem);

	const handleRemove = async (productId: string) => {
		setLoading(productId);
		const result = await removeFromWishlist(productId);

		if (result.success) {
			setItems(items.filter((item) => item.productId !== productId));
		}
		setLoading(null);
	};

	const handleAddToCart = async (productId: string) => {
		await addItem(productId, 1);
	};

	if (items.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
				<Button asChild>
					<Link href="/products">Browse Products</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{items.map((item) => {
				const product = item.product;
				const displayPrice = Number(product.specialPrice || product.price);
				const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;

				return (
					<Card key={item.productId}>
						<CardContent className="p-4">
							<div className="relative">
								<Link href={`/products/${product.slug}`}>
									{product.thumbnailImageUrl ? (
										<Image
											src={product.thumbnailImageUrl}
											alt={product.name}
											width={300}
											height={300}
											className="w-full h-48 object-cover rounded-md mb-4"
										/>
									) : (
										<div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
											<span className="text-muted-foreground">No Image</span>
										</div>
									)}
								</Link>
								<Button
									variant="ghost"
									size="icon"
									className="absolute top-2 right-2 bg-white/90 hover:bg-white"
									onClick={() => handleRemove(product.id)}
									disabled={loading === product.id}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>

							<Link
								href={`/products/${product.slug}`}
								className="font-medium hover:underline block mb-2"
							>
								{product.name}
							</Link>

							<div className="mb-4">
								<span className="text-lg font-bold">${displayPrice.toFixed(2)}</span>
								{oldPrice && (
									<span className="text-sm text-muted-foreground line-through ml-2">
										${oldPrice.toFixed(2)}
									</span>
								)}
							</div>

							<Button
								className="w-full"
								onClick={() => handleAddToCart(product.id)}
								disabled={!product.isAllowToOrder}
							>
								<ShoppingCart className="mr-2 h-4 w-4" />
								Add to Cart
							</Button>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
