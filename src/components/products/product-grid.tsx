import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface Product {
	id: string;
	name: string;
	slug: string;
	shortDescription: string | null;
	price: string;
	oldPrice: string | null;
	specialPrice: string | null;
	thumbnailImageUrl: string | null;
	isFeatured: boolean;
	reviewsCount: number;
	ratingAverage: string | null;
	brand: {
		id: string;
		name: string;
		slug: string;
	} | null;
}

interface ProductGridProps {
	products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{products.map((product) => (
				<Link
					key={product.id}
					href={`/products/${product.slug}`}
					className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
				>
					<div className="relative aspect-square bg-muted">
						{product.thumbnailImageUrl ? (
							<Image
								src={product.thumbnailImageUrl}
								alt={product.name}
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-300"
							/>
						) : (
							<div className="flex items-center justify-center h-full text-muted-foreground">
								No Image
							</div>
						)}
						{product.isFeatured && (
							<span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
								Featured
							</span>
						)}
						{product.specialPrice && (
							<span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
								Sale
							</span>
						)}
					</div>

					<div className="p-4">
						{product.brand && (
							<p className="text-sm text-muted-foreground mb-1">{product.brand.name}</p>
						)}
						<h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
							{product.name}
						</h3>

						<div className="flex items-center gap-2 mb-2">
							{product.reviewsCount > 0 && (
								<div className="flex items-center gap-1 text-sm">
									<span className="text-yellow-500">★</span>
									<span>{Number(product.ratingAverage).toFixed(1)}</span>
									<span className="text-muted-foreground">({product.reviewsCount})</span>
								</div>
							)}
						</div>

						<div className="flex items-center gap-2">
							<span className="text-lg font-bold">
								{formatCurrency(Number(product.specialPrice || product.price))}
							</span>
							{(product.specialPrice || product.oldPrice) && (
								<span className="text-sm text-muted-foreground line-through">
									{formatCurrency(Number(product.oldPrice || product.price))}
								</span>
							)}
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
