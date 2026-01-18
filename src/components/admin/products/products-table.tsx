"use client";

import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	deleteProduct,
	toggleProductFeatured,
	toggleProductPublish,
} from "@/actions/admin/products";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface Product {
	id: string;
	name: string;
	slug: string;
	sku: string | null;
	price: string;
	specialPrice: string | null;
	stockQuantity: number;
	isPublished: boolean;
	isFeatured: boolean;
	createdAt: Date;
	brand: {
		id: string;
		name: string;
	} | null;
}

interface ProductsTableProps {
	products: Product[];
	searchQuery?: string;
}

export function ProductsTable({ products, searchQuery }: ProductsTableProps) {
	const router = useRouter();
	const [search, setSearch] = useState(searchQuery || "");
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (search) {
			params.set("search", search);
		}
		router.push(`/admin/products?${params.toString()}`);
	};

	const handleDelete = async (id: string, name: string) => {
		if (!confirm(`Are you sure you want to delete "${name}"?`)) {
			return;
		}

		setIsDeleting(id);
		try {
			await deleteProduct(id);
			router.refresh();
		} catch (error) {
			console.error("Failed to delete product:", error);
			alert("Failed to delete product");
		} finally {
			setIsDeleting(null);
		}
	};

	const handleTogglePublish = async (id: string) => {
		try {
			await toggleProductPublish(id);
			router.refresh();
		} catch (error) {
			console.error("Failed to toggle publish:", error);
			alert("Failed to update product");
		}
	};

	const handleToggleFeatured = async (id: string) => {
		try {
			await toggleProductFeatured(id);
			router.refresh();
		} catch (error) {
			console.error("Failed to toggle featured:", error);
			alert("Failed to update product");
		}
	};

	return (
		<div className="space-y-4">
			<form onSubmit={handleSearch} className="flex gap-2">
				<Input
					type="search"
					placeholder="Search products..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="max-w-sm"
				/>
				<Button type="submit">Search</Button>
			</form>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>SKU</TableHead>
							<TableHead>Brand</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Stock</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center text-muted-foreground">
									No products found
								</TableCell>
							</TableRow>
						) : (
							products.map((product) => (
								<TableRow key={product.id}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											{product.name}
											{product.isFeatured && (
												<span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
													Featured
												</span>
											)}
										</div>
									</TableCell>
									<TableCell>{product.sku || "-"}</TableCell>
									<TableCell>{product.brand?.name || "-"}</TableCell>
									<TableCell>
										<div className="flex flex-col">
											<span>{formatCurrency(Number(product.specialPrice || product.price))}</span>
											{product.specialPrice && (
												<span className="text-xs text-muted-foreground line-through">
													{formatCurrency(Number(product.price))}
												</span>
											)}
										</div>
									</TableCell>
									<TableCell>
										{product.stockQuantity > 0 ? (
											<span className="text-green-600">{product.stockQuantity}</span>
										) : (
											<span className="text-red-600">Out of stock</span>
										)}
									</TableCell>
									<TableCell>
										<button
											type="button"
											onClick={() => handleTogglePublish(product.id)}
											className={`text-xs px-2 py-1 rounded ${
												product.isPublished
													? "bg-green-100 text-green-700"
													: "bg-gray-100 text-gray-700"
											}`}
										>
											{product.isPublished ? "Published" : "Draft"}
										</button>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem asChild>
													<Link href={`/products/${product.slug}`} target="_blank">
														<Eye className="h-4 w-4 mr-2" />
														View
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href={`/admin/products/${product.id}`}>
														<Edit className="h-4 w-4 mr-2" />
														Edit
													</Link>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={() => handleToggleFeatured(product.id)}>
													{product.isFeatured ? "Unfeature" : "Feature"}
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => handleDelete(product.id, product.name)}
													disabled={isDeleting === product.id}
													className="text-red-600"
												>
													<Trash className="h-4 w-4 mr-2" />
													{isDeleting === product.id ? "Deleting..." : "Delete"}
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
