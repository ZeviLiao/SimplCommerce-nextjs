"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/admin", label: "Dashboard" },
	{ href: "/admin/products", label: "Products" },
	{ href: "/admin/categories", label: "Categories" },
	{ href: "/admin/orders", label: "Orders" },
	{ href: "/admin/users", label: "Users" },
];

export function AdminNav() {
	const pathname = usePathname();

	return (
		<nav className="flex gap-6 text-sm font-medium">
			{navItems.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						"transition-colors hover:text-primary",
						pathname === item.href ? "text-foreground" : "text-muted-foreground",
					)}
				>
					{item.label}
				</Link>
			))}
		</nav>
	);
}
