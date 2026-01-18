import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const accountNavigation = [
	{ name: "Overview", href: "/account" },
	{ name: "Profile", href: "/account/profile" },
	{ name: "Addresses", href: "/account/addresses" },
	{ name: "Change Password", href: "/account/change-password" },
	{ name: "Orders", href: "/account/orders" },
	{ name: "Wishlist", href: "/account/wishlist" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">My Account</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Manage your account settings and preferences
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
				<aside className="md:col-span-1">
					<nav className="space-y-1">
						{accountNavigation.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
							>
								{item.name}
							</Link>
						))}
					</nav>
				</aside>

				<main className="md:col-span-3">{children}</main>
			</div>
		</div>
	);
}
