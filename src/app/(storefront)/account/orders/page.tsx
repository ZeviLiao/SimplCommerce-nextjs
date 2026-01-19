import { format } from "date-fns";
import { Package } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/actions/orders";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type AuthSession, auth } from "@/lib/auth";

export const metadata = {
	title: "My Orders",
	description: "View your order history",
};

export default async function OrdersPage() {
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as AuthSession | null;

	if (!session?.user) {
		redirect("/login");
	}

	const result = await getUserOrders();

	if (!result.success || !result.orders) {
		return (
			<div className="container max-w-4xl py-8">
				<h1 className="text-3xl font-bold mb-6">My Orders</h1>
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						Failed to load orders. Please try again later.
					</CardContent>
				</Card>
			</div>
		);
	}

	const orders = result.orders;

	return (
		<div className="container max-w-4xl py-8">
			<h1 className="text-3xl font-bold mb-6">My Orders</h1>

			{orders.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center">
						<Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
						<h2 className="text-xl font-semibold mb-2">No orders yet</h2>
						<p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
						<Button asChild>
							<Link href="/products">Start Shopping</Link>
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{orders.map((order) => (
						<Card key={order.id}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
										<CardDescription>
											Placed on {format(new Date(order.createdAt), "PPP")}
										</CardDescription>
									</div>
									<OrderStatusBadge status={order.status} />
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{/* Order Items Preview */}
									<div className="space-y-2">
										{order.items.slice(0, 3).map((item) => (
											<div key={item.id} className="flex items-center gap-4">
												<div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
													{item.product.thumbnailImageUrl && (
														<Image
															src={item.product.thumbnailImageUrl}
															alt={item.productName}
															fill
															className="object-cover rounded"
														/>
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="font-medium truncate">{item.productName}</p>
													<p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
												</div>
												<p className="font-semibold">${item.productPrice}</p>
											</div>
										))}
										{order.items.length > 3 && (
											<p className="text-sm text-muted-foreground">
												+ {order.items.length - 3} more item(s)
											</p>
										)}
									</div>

									<Separator />

									{/* Order Summary */}
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-muted-foreground">Total Amount</p>
											<p className="text-2xl font-bold">${order.orderTotal}</p>
										</div>
										<Button asChild variant="outline">
											<Link href={`/account/orders/${order.id}`}>View Details</Link>
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
