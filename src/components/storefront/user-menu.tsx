"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { logoutUser } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
	user: User;
}

export function UserMenu({ user }: UserMenuProps) {
	const router = useRouter();

	async function handleLogout() {
		await logoutUser();
		router.push("/");
		router.refresh();
	}

	const initials =
		user.name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase() ||
		user.email?.[0].toUpperCase() ||
		"U";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none">
				<Avatar className="h-8 w-8">
					<AvatarImage src={user.image || undefined} alt={user.name || "User"} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.name}</p>
						<p className="text-xs leading-none text-gray-500">{user.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/account">My Account</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/account/orders">Orders</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/account/wishlist">Wishlist</Link>
				</DropdownMenuItem>
				{(user as User & { role?: string }).role === "admin" && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/admin">Admin Panel</Link>
						</DropdownMenuItem>
					</>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleLogout}
					className="cursor-pointer text-red-600 focus:text-red-600"
				>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
