import { headers } from "next/headers";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type AuthSession, auth } from "@/lib/auth";

export default async function AccountPage() {
	const session = (await auth.api.getSession({ headers: await headers() })) as AuthSession | null;

	if (!session?.user) {
		return null;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Welcome back, {session.user.name}!</CardTitle>
					<CardDescription>Here's an overview of your account</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
							<p className="text-base">{session.user.email}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</p>
							<p className="text-base capitalize">{session.user.role || "customer"}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-2">
				<Link href="/account/orders">
					<Card className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
						<CardHeader>
							<CardTitle className="text-lg">Orders</CardTitle>
							<CardDescription>View and track your orders</CardDescription>
						</CardHeader>
					</Card>
				</Link>

				<Link href="/account/addresses">
					<Card className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
						<CardHeader>
							<CardTitle className="text-lg">Addresses</CardTitle>
							<CardDescription>Manage your shipping addresses</CardDescription>
						</CardHeader>
					</Card>
				</Link>

				<Link href="/account/wishlist">
					<Card className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
						<CardHeader>
							<CardTitle className="text-lg">Wishlist</CardTitle>
							<CardDescription>View your saved items</CardDescription>
						</CardHeader>
					</Card>
				</Link>

				<Link href="/account/profile">
					<Card className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
						<CardHeader>
							<CardTitle className="text-lg">Profile Settings</CardTitle>
							<CardDescription>Update your personal information</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			</div>
		</div>
	);
}
