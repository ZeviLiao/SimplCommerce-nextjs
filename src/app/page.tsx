import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { getLatestProducts } from "@/lib/data/catalog";

export default async function HomePage() {
	const latestProducts = await getLatestProducts();

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="bg-muted py-12 md:py-24 lg:py-32">
					<div className="container flex flex-col items-center text-center space-y-4">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							Welcome to SimplCommerce
						</h1>
						<p className="max-w-[700px] text-muted-foreground md:text-xl">
							Built with Next.js 16, React 19, and shadcn/ui.
						</p>
						<div className="space-x-4">
							<Button asChild size="lg">
								<Link href="/products">Shop Now</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Latest Products */}
				<section className="container py-12 space-y-8">
					<h2 className="text-2xl font-bold tracking-tight">Latest Products</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{latestProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
