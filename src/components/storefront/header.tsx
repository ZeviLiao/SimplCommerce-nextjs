import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "./user-menu";

export async function Header() {
	const session = await auth();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-6">
					<Link href="/" className="text-xl font-bold">
						SimplCommerce
					</Link>

					<nav className="hidden md:flex items-center gap-4">
						<Link href="/products" className="text-sm font-medium hover:underline">
							Products
						</Link>
						<Link href="/categories" className="text-sm font-medium hover:underline">
							Categories
						</Link>
					</nav>
				</div>

				<div className="flex items-center gap-4">
					{session?.user ? (
						<>
							<Link href="/cart" className="text-sm font-medium hover:underline">
								Cart
							</Link>
							<UserMenu user={session.user} />
						</>
					) : (
						<>
							<Link href="/login" className="text-sm font-medium hover:underline">
								Sign in
							</Link>
							<Link
								href="/register"
								className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
							>
								Sign up
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
