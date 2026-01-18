import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { formatCurrency } from "@/lib/utils";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function ProductDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const product = await getProductBySlug(slug);

	if (!product) {
		notFound();
	}

	const displayPrice = Number(product.specialPrice || product.price);
	const hasDiscount = product.specialPrice || product.oldPrice;
	const originalPrice = Number(product.oldPrice || product.price);

	return (
		<div className="container py-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				{/* Product Images */}
				<div>
					<ProductImageGallery
						images={
							// product.media?.map((m) => ({
							// 	url: m.mediaUrl,
							// 	alt: product.name,
							// })) || []
							[]
						}
						fallbackImage={product.thumbnailImageUrl || ""}
						productName={product.name}
					/>
				</div>

				{/* Product Info */}
				<div className="space-y-6">
					{/* Brand */}
					{product.brand && <p className="text-sm text-muted-foreground">{product.brand.name}</p>}

					{/* Title */}
					<div>
						<h1 className="text-3xl font-bold mb-2">{product.name}</h1>
						{product.isFeatured && (
							<span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
								Featured
							</span>
						)}
					</div>

					{/* Rating */}
					{product.reviewsCount > 0 && (
						<div className="flex items-center gap-2">
							<div className="flex items-center">
								{Array.from({ length: 5 }).map((_, i) => (
									<span
										key={i}
										className={`text-lg ${
											i < Math.round(Number(product.ratingAverage))
												? "text-yellow-500"
												: "text-gray-300"
										}`}
									>
										★
									</span>
								))}
							</div>
							<span className="text-sm text-muted-foreground">
								{Number(product.ratingAverage).toFixed(1)} ({product.reviewsCount} reviews)
							</span>
						</div>
					)}

					{/* Price */}
					<div className="flex items-center gap-4">
						<span className="text-4xl font-bold">{formatCurrency(displayPrice)}</span>
						{hasDiscount && (
							<>
								<span className="text-xl text-muted-foreground line-through">
									{formatCurrency(originalPrice)}
								</span>
								<span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
									Save {Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
								</span>
							</>
						)}
					</div>

					{/* Short Description */}
					{product.shortDescription && (
						<div
							className="prose prose-sm"
							dangerouslySetInnerHTML={{ __html: product.shortDescription }}
						/>
					)}

					{/* Stock Status */}
					<div className="flex items-center gap-2">
						{product.stockTrackingEnabled ? (
							product.stockQuantity > 0 ? (
								<>
									<span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
									<span className="text-sm">In Stock ({product.stockQuantity} available)</span>
								</>
							) : (
								<>
									<span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
									<span className="text-sm">Out of Stock</span>
								</>
							)
						) : (
							<>
								<span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
								<span className="text-sm">Available</span>
							</>
						)}
					</div>

					{/* Add to Cart */}
					{product.isAllowToOrder && (
						<AddToCartButton
							productId={product.id}
							productName={product.name}
							isInStock={!product.stockTrackingEnabled || product.stockQuantity > 0}
						/>
					)}

					{/* SKU */}
					{product.sku && <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>}

					{/* Categories */}
					{product.productCategories && product.productCategories.length > 0 && (
						<div>
							<h3 className="font-semibold mb-2">Categories:</h3>
							<div className="flex flex-wrap gap-2">
								{product.productCategories.map((pc) => (
									<span
										key={pc.categoryId}
										className="inline-block bg-muted px-3 py-1 rounded text-sm"
									>
										{pc.category?.name}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Full Description */}
			{product.description && (
				<div className="mt-12">
					<h2 className="text-2xl font-bold mb-4">Product Description</h2>
					<div
						className="prose prose-lg max-w-none"
						dangerouslySetInnerHTML={{ __html: product.description }}
					/>
				</div>
			)}
		</div>
	);
}
