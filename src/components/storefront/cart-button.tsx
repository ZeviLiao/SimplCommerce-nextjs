"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

export function CartButton() {
	const getTotalItems = useCartStore((state) => state.getTotalItems);
	const totalItems = getTotalItems();

	return (
		<Button asChild>
			<Link href="/cart">
				<ShoppingCart className="mr-2 h-4 w-4" />
				Cart ({totalItems})
			</Link>
		</Button>
	);
}
