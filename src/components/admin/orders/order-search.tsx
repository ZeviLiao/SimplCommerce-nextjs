"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OrderSearch() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
	const [isPending, startTransition] = useTransition();

	const handleSearch = (value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value) {
			params.set("search", value);
		} else {
			params.delete("search");
		}
		params.delete("page"); // Reset to first page when searching

		startTransition(() => {
			router.push(`/admin/orders?${params.toString()}`);
		});
	};

	const handleClear = () => {
		setSearchValue("");
		handleSearch("");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSearch(searchValue);
	};

	return (
		<form onSubmit={handleSubmit} className="relative flex items-center gap-2">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search by order number, customer name, or email..."
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					className="pl-9 pr-9"
				/>
				{searchValue && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
						onClick={handleClear}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Button type="submit" disabled={isPending}>
				Search
			</Button>
		</form>
	);
}
