import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getAdminBrands } from "@/actions/admin/brands";
import { BrandsTable } from "@/components/admin/brands/brands-table";
import { Button } from "@/components/ui/button";

export default async function AdminBrandsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const { data: brands, total } = await getAdminBrands(page, 20);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Brand Management</h1>
					<p className="text-muted-foreground">Manage your brands. Total: {total} brands.</p>
				</div>
				<Button asChild>
					<Link href="/admin/brands/create">
						<PlusCircle className="mr-2 h-4 w-4" />
						Add Brand
					</Link>
				</Button>
			</div>

			<BrandsTable brands={brands} />
		</div>
	);
}
