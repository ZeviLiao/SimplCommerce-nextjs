import { and, eq, sql } from "drizzle-orm";
import { Eye, FolderTree, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { categories, products } from "@/db/schema/catalog";

export default async function AdminDashboardPage() {
	// Fetch statistics
	const [totalProducts, publishedProducts, totalCategories, publishedCategories] =
		await Promise.all([
			db
				.select({ count: sql<number>`count(*)` })
				.from(products)
				.where(eq(products.isDeleted, false))
				.then((res) => Number(res[0]?.count ?? 0)),
			db
				.select({ count: sql<number>`count(*)` })
				.from(products)
				.where(and(eq(products.isDeleted, false), eq(products.isPublished, true)))
				.then((res) => Number(res[0]?.count ?? 0)),
			db
				.select({ count: sql<number>`count(*)` })
				.from(categories)
				.where(eq(categories.isDeleted, false))
				.then((res) => Number(res[0]?.count ?? 0)),
			db
				.select({ count: sql<number>`count(*)` })
				.from(categories)
				.where(and(eq(categories.isDeleted, false), eq(categories.isPublished, true)))
				.then((res) => Number(res[0]?.count ?? 0)),
		]);

	// Fetch recent products
	const recentProducts = await db.query.products.findMany({
		where: eq(products.isDeleted, false),
		orderBy: (products, { desc }) => [desc(products.createdAt)],
		limit: 5,
		columns: {
			id: true,
			name: true,
			isPublished: true,
			createdAt: true,
		},
	});

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground mt-2">Welcome to admin panel</p>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Products</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalProducts}</div>
						<p className="text-xs text-muted-foreground mt-1">{publishedProducts} published</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Categories</CardTitle>
						<FolderTree className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCategories}</div>
						<p className="text-xs text-muted-foreground mt-1">{publishedCategories} published</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Published Products</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{publishedProducts}</div>
						<p className="text-xs text-muted-foreground mt-1">
							{totalProducts > 0
								? `${Math.round((publishedProducts / totalProducts) * 100)}% publish rate`
								: "0% publish rate"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Orderable Products</CardTitle>
						<ShoppingCart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{
								recentProducts.filter((p) =>
									db.query.products
										.findFirst({ where: eq(products.id, p.id) })
										.then((product) => product?.isAllowToOrder),
								).length
							}
						</div>
						<p className="text-xs text-muted-foreground mt-1">Can add to cart</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-4">
					<Button asChild>
						<Link href="/admin/products/create">Add Product</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/admin/categories/create">Add Category</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/admin/products">Manage Products</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/admin/categories">Manage Categories</Link>
					</Button>
				</CardContent>
			</Card>

			{/* Recent Products */}
			<Card>
				<CardHeader>
					<CardTitle>Latest Products</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{recentProducts.length === 0 ? (
							<p className="text-sm text-muted-foreground">No products found</p>
						) : (
							recentProducts.map((product) => (
								<div key={product.id} className="flex items-center justify-between">
									<div>
										<p className="font-medium">{product.name}</p>
										<p className="text-sm text-muted-foreground">
											{new Date(product.createdAt).toLocaleDateString("zh-TW")}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<span
											className={`text-xs px-2 py-1 rounded ${
												product.isPublished
													? "bg-green-100 text-green-700"
													: "bg-gray-100 text-gray-700"
											}`}
										>
											{product.isPublished ? "Published" : "Draft"}
										</span>
										<Button asChild variant="ghost" size="sm">
											<Link href={`/admin/products/${product.id}`}>Edit</Link>
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
