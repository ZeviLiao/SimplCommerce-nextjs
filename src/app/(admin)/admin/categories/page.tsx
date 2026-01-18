import { asc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { categories } from "@/db/schema/catalog";

export default async function CategoriesPage() {
	const allCategories = await db.query.categories.findMany({
		where: eq(categories.isDeleted, false),
		orderBy: [asc(categories.displayOrder), asc(categories.name)],
		with: {
			parent: true,
		},
	});

	// Separate top-level and child categories
	const topLevelCategories = allCategories.filter((cat) => !cat.parentId);
	const childCategories = allCategories.filter((cat) => cat.parentId);

	// Create a map for quick lookup of children
	const childrenMap = new Map<string, typeof allCategories>();
	for (const cat of childCategories) {
		const parentId = cat.parentId!;
		if (!childrenMap.has(parentId)) {
			childrenMap.set(parentId, []);
		}
		childrenMap.get(parentId)!.push(cat);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Category Management</h1>
					<p className="text-muted-foreground mt-2">Manage product categories</p>
				</div>
				<Button asChild>
					<Link href="/admin/categories/create">
						<Plus className="mr-2 h-4 w-4" />
						Add Category
					</Link>
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead>Parent</TableHead>
							<TableHead>Order</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{topLevelCategories.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
									No categories found
								</TableCell>
							</TableRow>
						) : (
							topLevelCategories.map((category) => (
								<>
									<TableRow key={category.id}>
										<TableCell className="font-medium">{category.name}</TableCell>
										<TableCell className="font-mono text-sm">{category.slug}</TableCell>
										<TableCell>
											<span className="text-muted-foreground">-</span>
										</TableCell>
										<TableCell>{category.displayOrder}</TableCell>
										<TableCell>
											{category.isPublished ? (
												<Badge variant="default">Published</Badge>
											) : (
												<Badge variant="secondary">Draft</Badge>
											)}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<Button variant="outline" size="sm" asChild>
													<Link href={`/admin/categories/${category.id}`}>Edit</Link>
												</Button>
												<DeleteCategoryButton id={category.id} />
											</div>
										</TableCell>
									</TableRow>
									{childrenMap.get(category.id)?.map((child) => (
										<TableRow key={child.id} className="bg-muted/50">
											<TableCell className="pl-8">
												<span className="text-muted-foreground mr-2">└─</span>
												{child.name}
											</TableCell>
											<TableCell className="font-mono text-sm">{child.slug}</TableCell>
											<TableCell>{category.name}</TableCell>
											<TableCell>{child.displayOrder}</TableCell>
											<TableCell>
												{child.isPublished ? (
													<Badge variant="default">Published</Badge>
												) : (
													<Badge variant="secondary">Draft</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-2">
													<Button variant="outline" size="sm" asChild>
														<Link href={`/admin/categories/${child.id}`}>Edit</Link>
													</Button>
													<DeleteCategoryButton id={child.id} />
												</div>
											</TableCell>
										</TableRow>
									))}
								</>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
