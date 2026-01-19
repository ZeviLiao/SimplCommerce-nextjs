"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchResultsProps {
	searchQuery?: string;
	totalCount: number;
	currentPage: number;
	totalPages: number;
}

export function SearchResults({
	searchQuery,
	totalCount,
	currentPage,
	totalPages,
}: SearchResultsProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		router.push(`/search?${params.toString()}`);
	};

	if (!searchQuery) {
		return null;
	}

	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-4">
				<p className="text-sm text-muted-foreground">
					Found <span className="font-semibold text-foreground">{totalCount}</span>{" "}
					{totalCount === 1 ? "product" : "products"}
				</p>
				{totalPages > 1 && (
					<p className="text-sm text-muted-foreground">
						Page {currentPage} of {totalPages}
					</p>
				)}
			</div>

			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => handlePageChange(currentPage - 1)}
								className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
							/>
						</PaginationItem>

						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
							// Show first page, last page, current page, and pages around current page
							if (
								page === 1 ||
								page === totalPages ||
								(page >= currentPage - 1 && page <= currentPage + 1)
							) {
								return (
									<PaginationItem key={page}>
										<PaginationLink
											onClick={() => handlePageChange(page)}
											isActive={page === currentPage}
											className="cursor-pointer"
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								);
							}

							// Show ellipsis
							if (page === currentPage - 2 || page === currentPage + 2) {
								return (
									<PaginationItem key={page}>
										<PaginationEllipsis />
									</PaginationItem>
								);
							}

							return null;
						})}

						<PaginationItem>
							<PaginationNext
								onClick={() => handlePageChange(currentPage + 1)}
								className={
									currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
