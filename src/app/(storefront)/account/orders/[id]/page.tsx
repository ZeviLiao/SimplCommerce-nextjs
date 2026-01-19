import { format } from "date-fns";
import { ArrowLeft, CreditCard, MapPin, Truck } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrderById } from "@/actions/orders";
import { CancelOrderButton } from "@/components/orders/cancel-order-button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type AuthSession, auth } from "@/lib/auth";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return {
		title: `Order Details - ${id}`,
		description: "View your order details",
	};
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as AuthSession | null;

	if (!session?.user) {
		redirect("/login");
	}

	const result = await getOrderById(id);

	if (!result.success || !result.order) {
		return (
			<div className="container max-w-5xl py-8">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/account/orders">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Orders
					</Link>
				</Button>
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						{result.error || "Order not found"}
					</CardContent>
				</Card>
			</div>
		);
	}

	const order = result.order;
	const shippingAddress = order.shippingAddress as {
		contactName?: string;
		phone?: string;
		addressLine1?: string;
		addressLine2?: string;
		city?: string;
		stateOrProvince?: string;
		zipCode?: string;
		country?: string;
	} | null;
	const billingAddress = order.billingAddress as {
		contactName?: string;
		phone?: string;
		addressLine1?: string;
		addressLine2?: string;
		city?: string;
		stateOrProvince?: string;
		zipCode?: string;
		country?: string;
	} | null;

	return (
		<div className="container max-w-5xl py-8">
			<Button variant="ghost" asChild className="mb-4">
				<Link href="/account/orders">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Orders
				</Link>
			</Button>

			{/* Order Header */}
			<Card className="mb-6">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="text-2xl">Order #{order.orderNumber}</CardTitle>
							<CardDescription>
								Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<OrderStatusBadge status={order.status} />
							{(order.status === "new" || order.status === "pending_payment") && (
								<CancelOrderButton orderId={order.id} />
							)}
						</div>
					</div>
				</CardHeader>
			</Card>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Order Items */}
					<Card>
						<CardHeader>
							<CardTitle>Order Items</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{order.items.map((item) => (
									<div key={item.id}>
										<div className="flex gap-4">
											<div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded">
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
												<Link
													href={`/products/${item.product.slug}`}
													className="font-medium hover:underline"
												>
													{item.productName}
												</Link>
												{item.productSku && (
													<p className="text-sm text-muted-foreground">SKU: {item.productSku}</p>
												)}
												{item.optionCombination ? (
													<p className="text-sm text-muted-foreground">
														Options: {String(JSON.stringify(item.optionCombination))}
													</p>
												) : null}
												<p className="text-sm mt-1">
													${item.productPrice} × {item.quantity}
												</p>
											</div>
											<div className="text-right">
												<p className="font-semibold">
													${(Number(item.productPrice) * item.quantity).toFixed(2)}
												</p>
												{Number(item.discountAmount) > 0 && (
													<p className="text-sm text-green-600">-${item.discountAmount}</p>
												)}
											</div>
										</div>
										<Separator className="mt-4" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Order History */}
					{order.history && order.history.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Order History</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{order.history.map((history) => (
										<div key={history.id} className="flex gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<OrderStatusBadge status={history.newStatus} />
													{history.oldStatus && (
														<>
															<span className="text-muted-foreground">from</span>
															<OrderStatusBadge status={history.oldStatus} />
														</>
													)}
												</div>
												{history.note && (
													<p className="text-sm text-muted-foreground mt-1">{history.note}</p>
												)}
												<p className="text-xs text-muted-foreground mt-1">
													{format(new Date(history.createdAt), "PPP 'at' p")}
													{history.createdBy && ` by ${history.createdBy.name}`}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Order Summary */}
					<Card>
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Subtotal</span>
								<span>${order.subtotal}</span>
							</div>
							{Number(order.discountAmount) > 0 && (
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Discount</span>
									<span className="text-green-600">-${order.discountAmount}</span>
								</div>
							)}
							{order.couponCode && (
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Coupon</span>
									<span className="font-mono text-xs">{order.couponCode}</span>
								</div>
							)}
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Shipping</span>
								<span>${order.shippingFeeAmount}</span>
							</div>
							{Number(order.taxAmount) > 0 && (
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Tax</span>
									<span>${order.taxAmount}</span>
								</div>
							)}
							{Number(order.paymentFeeAmount) > 0 && (
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Payment Fee</span>
									<span>${order.paymentFeeAmount}</span>
								</div>
							)}
							<Separator />
							<div className="flex justify-between font-bold text-lg">
								<span>Total</span>
								<span>${order.orderTotal}</span>
							</div>
						</CardContent>
					</Card>

					{/* Shipping Address */}
					{shippingAddress && (
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Truck className="w-4 h-4" />
									<CardTitle className="text-base">Shipping Address</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="text-sm space-y-1">
								<p className="font-medium">{shippingAddress.contactName}</p>
								{shippingAddress.phone && <p>{shippingAddress.phone}</p>}
								<p>{shippingAddress.addressLine1}</p>
								{shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
								<p>
									{shippingAddress.city}, {shippingAddress.stateOrProvince}{" "}
									{shippingAddress.zipCode}
								</p>
								<p>{shippingAddress.country}</p>
							</CardContent>
						</Card>
					)}

					{/* Billing Address */}
					{billingAddress && (
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4" />
									<CardTitle className="text-base">Billing Address</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="text-sm space-y-1">
								<p className="font-medium">{billingAddress.contactName}</p>
								{billingAddress.phone && <p>{billingAddress.phone}</p>}
								<p>{billingAddress.addressLine1}</p>
								{billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
								<p>
									{billingAddress.city}, {billingAddress.stateOrProvince} {billingAddress.zipCode}
								</p>
								<p>{billingAddress.country}</p>
							</CardContent>
						</Card>
					)}

					{/* Payment & Shipping Method */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<CreditCard className="w-4 h-4" />
								<CardTitle className="text-base">Payment & Shipping</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="text-sm space-y-2">
							{order.paymentMethod && (
								<div>
									<p className="text-muted-foreground">Payment Method</p>
									<p className="font-medium">{order.paymentMethod}</p>
								</div>
							)}
							{order.shippingMethod && (
								<div>
									<p className="text-muted-foreground">Shipping Method</p>
									<p className="font-medium">{order.shippingMethod}</p>
								</div>
							)}
							{order.orderNote && (
								<div>
									<p className="text-muted-foreground">Order Note</p>
									<p className="font-medium">{order.orderNote}</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
