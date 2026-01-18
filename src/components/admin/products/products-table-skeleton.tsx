import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function ProductsTableSkeleton() {
	return (
		<div className="space-y-4">
			<div className="h-10 w-full max-w-sm bg-muted animate-pulse rounded" />

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
						{Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<div className="h-4 w-40 bg-muted animate-pulse rounded" />
								</TableCell>
								<TableCell>
									<div className="h-4 w-20 bg-muted animate-pulse rounded" />
								</TableCell>
								<TableCell>
									<div className="h-4 w-24 bg-muted animate-pulse rounded" />
								</TableCell>
								<TableCell>
									<div className="h-4 w-16 bg-muted animate-pulse rounded" />
								</TableCell>
								<TableCell>
									<div className="h-4 w-12 bg-muted animate-pulse rounded" />
								</TableCell>
								<TableCell>
									<div className="h-6 w-20 bg-muted animate-pulse rounded" />
								</TableCell>
								<TableCell>
									<div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
