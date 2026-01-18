"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImage {
	url: string;
	alt: string;
}

interface ProductImageGalleryProps {
	images: ProductImage[];
	fallbackImage: string;
	productName: string;
}

export function ProductImageGallery({
	images,
	fallbackImage,
	productName,
}: ProductImageGalleryProps) {
	const allImages = images.length > 0 ? images : [{ url: fallbackImage, alt: productName }];
	const [selectedIndex, setSelectedIndex] = useState(0);

	if (allImages.length === 0 || !allImages[0].url) {
		return (
			<div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
				<span className="text-muted-foreground">No Image Available</span>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
				<Image
					src={allImages[selectedIndex].url}
					alt={allImages[selectedIndex].alt}
					fill
					className="object-cover"
					priority
				/>
			</div>

			{/* Thumbnail Images */}
			{allImages.length > 1 && (
				<div className="grid grid-cols-4 gap-4">
					{allImages.map((image, index) => (
						<button
							key={index}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={`relative aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
								selectedIndex === index
									? "border-primary"
									: "border-transparent hover:border-muted-foreground"
							}`}
						>
							<Image src={image.url} alt={image.alt} fill className="object-cover" />
						</button>
					))}
				</div>
			)}
		</div>
	);
}
