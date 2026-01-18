import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getAdminProducts } from "@/actions/admin/products";
import { ProductsTable } from "@/components/admin/products/products-table";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; search?: string }>;
}) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const search = params.search || "";
	const { data: products, total } = await getAdminProducts(page, 20, search);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
					<p className="text-muted-foreground">
						Manage your product catalog. Total: {total} products.
					</p>
				</div>
				<Button asChild>
					<Link href="/admin/products/create">
						<PlusCircle className="mr-2 h-4 w-4" />
						Add Product
					</Link>
				</Button>
			</div>

			<ProductsTable products={products} searchQuery={search} />
		</div>
	);
}
