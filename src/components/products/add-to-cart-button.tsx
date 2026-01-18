"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

interface AddToCartButtonProps {
	productId: string;
	productName: string;
	isInStock: boolean;
}

export function AddToCartButton({ productId, productName, isInStock }: AddToCartButtonProps) {
	const [quantity, setQuantity] = useState(1);
	const [isAdding, setIsAdding] = useState(false);
	const addItem = useCartStore((state) => state.addItem);

	const handleAddToCart = async () => {
		if (!isInStock) return;

		setIsAdding(true);
		try {
			// TODO: Implement actual add to cart logic with server action
			await addItem(productId, quantity);
			// Show success message
			alert(`Added ${quantity} ${productName} to cart`);
		} catch (error) {
			console.error("Failed to add to cart:", error);
			alert("Failed to add to cart");
		} finally {
			setIsAdding(false);
		}
	};

	const decreaseQuantity = () => {
		setQuantity((prev) => Math.max(1, prev - 1));
	};

	const increaseQuantity = () => {
		setQuantity((prev) => prev + 1);
	};

	return (
		<div className="flex items-center gap-4">
			{/* Quantity Selector */}
			<div className="flex items-center border rounded-lg">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={decreaseQuantity}
					disabled={quantity <= 1 || !isInStock}
				>
					<Minus className="h-4 w-4" />
				</Button>
				<span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={increaseQuantity}
					disabled={!isInStock}
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>

			{/* Add to Cart Button */}
			<Button
				onClick={handleAddToCart}
				disabled={!isInStock || isAdding}
				className="flex-1"
				size="lg"
			>
				<ShoppingCart className="h-5 w-5 mr-2" />
				{isAdding ? "Adding..." : "Add to Cart"}
			</Button>
		</div>
	);
}
