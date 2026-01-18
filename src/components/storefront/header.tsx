import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { CartButton } from "@/components/storefront/cart-button";
import { Button } from "@/components/ui/button";
import { getHomepageCategories } from "@/lib/data/catalog";

export async function Header() {
	const categories = await getHomepageCategories();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				<Link href="/" className="flex items-center gap-2 font-bold text-xl">
					<ShoppingBag className="h-6 w-6" />
					<span>SimplCommerce</span>
				</Link>
				<nav className="hidden md:flex gap-6 text-sm font-medium">
					<Link href="/products" className="transition-colors hover:text-primary">
						Products
					</Link>
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/categories/${category.slug}`}
							className="transition-colors hover:text-primary"
						>
							{category.name}
						</Link>
					))}
				</nav>
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/admin/products">Admin</Link>
					</Button>
					<CartButton />
				</div>
			</div>
		</header>
	);
}
