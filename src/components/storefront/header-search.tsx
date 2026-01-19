"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeaderSearch() {
	const router = useRouter();
	const [search, setSearch] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (search.trim()) {
			router.push(`/search?q=${encodeURIComponent(search.trim())}`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="relative w-full max-w-md">
			<Input
				type="search"
				placeholder="Search products..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="pr-10"
			/>
			<Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
				<Search className="h-4 w-4" />
				<span className="sr-only">Search</span>
			</Button>
		</form>
	);
}
