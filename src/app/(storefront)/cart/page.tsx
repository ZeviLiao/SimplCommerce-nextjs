"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/stores/cart-store";

interface ProductDetails {
	id: string;
	name: string;
	slug: string;
	price: string;
	oldPrice: string | null;
	specialPrice: string | null;
	thumbnailImageUrl: string | null;
	stockQuantity: number;
	stockTrackingEnabled: boolean;
	isAllowToOrder: boolean;
	isPublished: boolean;
}

export default function CartPage() {
	const { items, updateQuantity, removeItem } = useCartStore();
	const [products, setProducts] = useState<ProductDetails[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadProducts() {
			if (items.length === 0) {
				setProducts([]);
				setLoading(false);
				return;
			}

			try {
				const response = await fetch("/api/cart/items", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ productIds: items.map((i) => i.productId) }),
				});

				if (response.ok) {
					const data = await response.json();
					setProducts(data);
				}
			} catch (error) {
				console.error("Failed to load cart items:", error);
			} finally {
				setLoading(false);
			}
		}

		loadProducts();
	}, [items]);

	const getCartItemWithProduct = (productId: string) => {
		const cartItem = items.find((i) => i.productId === productId);
		const product = products.find((p) => p.id === productId);
		return { cartItem, product };
	};

	const calculateItemTotal = (product: ProductDetails, quantity: number) => {
		const price = Number(product.specialPrice || product.price);
		return price * quantity;
	};

	const subtotal = items.reduce((sum, item) => {
		const product = products.find((p) => p.id === item.productId);
		if (!product) return sum;
		return sum + calculateItemTotal(product, item.quantity);
	}, 0);

	if (loading) {
		return (
			<div className="container py-8">
				<div className="text-center">Loading cart...</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="container py-8">
				<h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
				<div className="text-center py-12">
					<p className="text-muted-foreground mb-4">There are no items in this cart.</p>
					<Button asChild>
						<Link href="/">Go to shopping</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

			<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
				{/* Cart Items - col-md-8 */}
				<div className="md:col-span-8">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead colSpan={2}>Product</TableHead>
								<TableHead className="text-right">Price</TableHead>
								<TableHead className="text-center">Quantity</TableHead>
								<TableHead></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((item) => {
								const { product } = getCartItemWithProduct(item.productId);
								if (!product) return null;

								const displayPrice = Number(product.specialPrice || product.price);
								const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
								const hasDiscount = product.specialPrice || oldPrice;

								const hasStockIssue =
									product.stockTrackingEnabled && product.stockQuantity < item.quantity;

								return (
									<TableRow key={item.productId}>
										<TableCell className="w-24">
											{product.thumbnailImageUrl ? (
												<Image
													src={product.thumbnailImageUrl}
													alt={product.name}
													width={80}
													height={80}
													className="object-cover rounded"
												/>
											) : (
												<div className="w-20 h-20 bg-muted rounded flex items-center justify-center text-xs">
													No Image
												</div>
											)}
										</TableCell>
										<TableCell>
											<Link
												href={`/products/${product.slug}`}
												className="font-medium hover:underline"
											>
												{product.name}
											</Link>
											{!product.isAllowToOrder && (
												<div className="text-xs text-destructive mt-1">Not available any more</div>
											)}
											{hasStockIssue && (
												<div className="text-xs text-destructive mt-1">
													Not enough stock. Available: {product.stockQuantity}
												</div>
											)}
										</TableCell>
										<TableCell className="text-right">
											<div className="font-bold">${displayPrice.toFixed(2)}</div>
											{hasDiscount && oldPrice && (
												<div className="text-sm text-muted-foreground line-through">
													${oldPrice.toFixed(2)}
												</div>
											)}
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-2">
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8"
													onClick={() =>
														updateQuantity(item.productId, Math.max(1, item.quantity - 1))
													}
												>
													<Minus className="h-4 w-4" />
												</Button>
												<Input
													type="number"
													value={item.quantity}
													onChange={(e) => {
														const val = parseInt(e.target.value, 10) || 1;
														updateQuantity(item.productId, Math.max(1, val));
													}}
													className="w-16 text-center"
													min="1"
												/>
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8"
													onClick={() => updateQuantity(item.productId, item.quantity + 1)}
												>
													<Plus className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => removeItem(item.productId)}
											>
												<X className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>

				{/* Order Summary - col-md-4 */}
				<div className="md:col-span-4">
					<Card>
						<CardHeader>
							<CardTitle>Order summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between font-bold text-lg">
								<span>Order Total</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<Button className="w-full" size="lg" asChild>
								<Link href="/checkout">Process to Checkout</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
