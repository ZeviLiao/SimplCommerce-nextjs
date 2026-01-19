import { Edit, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
	getShippingProviders,
	getShippingProvidersCount,
} from "@/actions/admin/shipping-providers";
import { DeleteShippingProviderDialog } from "@/components/admin/shipping-providers/delete-shipping-provider-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
	title: "Shipping Providers - Admin",
	description: "Manage shipping providers",
};

interface PageProps {
	searchParams: Promise<{
		search?: string;
		page?: string;
	}>;
}

export default async function ShippingProvidersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const limit = 20;
	const offset = (page - 1) * limit;

	const [providers, totalCount] = await Promise.all([
		getShippingProviders({
			search: params.search,
			limit,
			offset,
		}),
		getShippingProvidersCount({
			search: params.search,
		}),
	]);

	const totalPages = Math.ceil(totalCount / limit);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Shipping Providers</h1>
					<p className="text-muted-foreground">Manage shipping methods and configurations</p>
				</div>
				<Button asChild>
					<Link href="/admin/shipping-providers/create">
						<Plus className="mr-2 h-4 w-4" />
						Add Provider
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Shipping Providers</CardTitle>
					<CardDescription>
						Showing {providers.length} of {totalCount} providers
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Code</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Display Order</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{providers.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center text-muted-foreground">
										No shipping providers found
									</TableCell>
								</TableRow>
							) : (
								providers.map((provider) => (
									<TableRow key={provider.id}>
										<TableCell className="font-medium">{provider.name}</TableCell>
										<TableCell>
											<code className="text-xs bg-muted px-1.5 py-0.5 rounded">
												{provider.code}
											</code>
										</TableCell>
										<TableCell className="max-w-md truncate">
											{provider.description || "-"}
										</TableCell>
										<TableCell>
											{provider.isEnabled ? (
												<Badge variant="default">Enabled</Badge>
											) : (
												<Badge variant="secondary">Disabled</Badge>
											)}
										</TableCell>
										<TableCell>{provider.displayOrder}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button variant="ghost" size="sm" asChild>
													<Link href={`/admin/shipping-providers/${provider.id}`}>
														<Edit className="h-4 w-4" />
													</Link>
												</Button>
												<DeleteShippingProviderDialog
													providerId={provider.id}
													providerName={provider.name}
												/>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>

					{totalPages > 1 && (
						<div className="flex items-center justify-between mt-4">
							<p className="text-sm text-muted-foreground">
								Page {page} of {totalPages}
							</p>
							<div className="flex gap-2">
								{page > 1 && (
									<Button variant="outline" size="sm" asChild>
										<Link href={`/admin/shipping-providers?page=${page - 1}`}>Previous</Link>
									</Button>
								)}
								{page < totalPages && (
									<Button variant="outline" size="sm" asChild>
										<Link href={`/admin/shipping-providers?page=${page + 1}`}>Next</Link>
									</Button>
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
