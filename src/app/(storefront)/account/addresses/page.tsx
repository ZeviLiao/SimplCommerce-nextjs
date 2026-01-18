import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function AddressesPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user?.id) {
		return null;
	}

	const addresses = await db.query.userAddresses.findMany({
		where: eq(userAddresses.userId, session.user.id),
		with: {
			address: {
				with: {
					country: true,
				},
			},
		},
	});

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">My Addresses</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Manage your shipping and billing addresses
					</p>
				</div>
				<Link href="/account/addresses/new">
					<Button>Add Address</Button>
				</Link>
			</div>

			{addresses.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-600 dark:text-gray-400">No addresses found</p>
						<Link href="/account/addresses/new">
							<Button className="mt-4">Add Your First Address</Button>
						</Link>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{addresses.map((ua) => (
						<Card key={ua.addressId}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="text-lg">{ua.address.contactName}</CardTitle>
										<CardDescription className="capitalize">{ua.addressType}</CardDescription>
									</div>
									{ua.isDefault && (
										<span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
											Default
										</span>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-1 text-sm">
									<p>{ua.address.addressLine1}</p>
									{ua.address.addressLine2 && <p>{ua.address.addressLine2}</p>}
									{ua.address.city && ua.address.zipCode && (
										<p>
											{ua.address.city}, {ua.address.zipCode}
										</p>
									)}
									<p>{ua.address.country?.name}</p>
									{ua.address.phone && <p className="mt-2">Phone: {ua.address.phone}</p>}
								</div>
								<div className="mt-4 flex gap-2">
									<Link href={`/account/addresses/${ua.addressId}/edit`}>
										<Button variant="outline" size="sm">
											Edit
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
