import { ArrowLeft, Package, User } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/actions/admin/orders";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { UpdateOrderStatusDialog } from "@/components/admin/orders/update-order-status-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
	title: "Order Details - Admin",
	description: "View order details",
};

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function OrderDetailPage({ params }: PageProps) {
	const { id } = await params;
	const [order, session] = await Promise.all([
		getOrderById(id),
		auth.api.getSession({ headers: await headers() }),
	]);

	if (!order) {
		notFound();
	}

	if (!session?.user?.id) {
		notFound();
	}

	const shippingAddress = order.shippingAddress as any;
	const _billingAddress = order.billingAddress as any;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/admin/orders">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
						<p className="text-muted-foreground">
							Placed on {new Date(order.createdAt).toLocaleString()}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<OrderStatusBadge status={order.status} size="lg" />
					<UpdateOrderStatusDialog
						orderId={order.id}
						currentStatus={order.status}
						userId={session.user.id}
					/>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Main Content */}
				<div className="md:col-span-2 space-y-6">
					{/* Order Items */}
					<Card>
						<CardHeader>
							<CardTitle>Order Items</CardTitle>
							<CardDescription>{order.items.length} items in this order</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Product</TableHead>
										<TableHead className="text-right">Price</TableHead>
										<TableHead className="text-center">Quantity</TableHead>
										<TableHead className="text-right">Subtotal</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{order.items.map((item) => (
										<TableRow key={item.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													{item.product.thumbnailImageUrl && (
														<img
															src={item.product.thumbnailImageUrl}
															alt={item.productName}
															className="h-12 w-12 object-cover rounded"
														/>
													)}
													<div>
														<div className="font-medium">{item.productName}</div>
														{item.productSku && (
															<div className="text-sm text-muted-foreground">
																SKU: {item.productSku}
															</div>
														)}
													</div>
												</div>
											</TableCell>
											<TableCell className="text-right">
												${Number(item.productPrice).toFixed(2)}
											</TableCell>
											<TableCell className="text-center">{item.quantity}</TableCell>
											<TableCell className="text-right font-medium">
												${(Number(item.productPrice) * item.quantity).toFixed(2)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
								<TableFooter>
									<TableRow>
										<TableCell colSpan={3}>Subtotal</TableCell>
										<TableCell className="text-right">
											${Number(order.subtotal).toFixed(2)}
										</TableCell>
									</TableRow>
									{Number(order.discountAmount) > 0 && (
										<TableRow>
											<TableCell colSpan={3}>Discount</TableCell>
											<TableCell className="text-right text-destructive">
												-${Number(order.discountAmount).toFixed(2)}
											</TableCell>
										</TableRow>
									)}
									<TableRow>
										<TableCell colSpan={3}>Shipping</TableCell>
										<TableCell className="text-right">
											${Number(order.shippingFeeAmount).toFixed(2)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell colSpan={3}>Tax</TableCell>
										<TableCell className="text-right">
											${Number(order.taxAmount).toFixed(2)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell colSpan={3} className="font-bold text-lg">
											Total
										</TableCell>
										<TableCell className="text-right font-bold text-lg">
											${Number(order.orderTotal).toFixed(2)}
										</TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						</CardContent>
					</Card>

					{/* Order History */}
					{order.history.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Order History</CardTitle>
								<CardDescription>Status changes and notes</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{order.history.map((entry) => (
										<div key={entry.id} className="flex gap-4">
											<div className="flex flex-col items-center">
												<div className="h-2 w-2 rounded-full bg-primary" />
												<div className="w-px flex-1 bg-border" />
											</div>
											<div className="flex-1 pb-4">
												<div className="flex items-center gap-2 mb-1">
													{entry.oldStatus && (
														<OrderStatusBadge status={entry.oldStatus} size="sm" />
													)}
													{entry.oldStatus && <span>→</span>}
													<OrderStatusBadge status={entry.newStatus} size="sm" />
												</div>
												{entry.note && (
													<p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
												)}
												<p className="text-xs text-muted-foreground mt-2">
													{new Date(entry.createdAt).toLocaleString()}
													{entry.createdBy && ` by ${entry.createdBy.name}`}
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
					{/* Customer Info */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="h-4 w-4" />
								Customer
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div>
								<div className="font-medium">{order.customer.name}</div>
								<div className="text-sm text-muted-foreground">{order.customer.email}</div>
								{order.customer.phone && (
									<div className="text-sm text-muted-foreground">{order.customer.phone}</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Shipping Address */}
					{shippingAddress && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Package className="h-4 w-4" />
									Shipping Address
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm space-y-1">
									<div>{shippingAddress.contactName}</div>
									<div>{shippingAddress.addressLine1}</div>
									{shippingAddress.addressLine2 && <div>{shippingAddress.addressLine2}</div>}
									<div>
										{shippingAddress.city}, {shippingAddress.stateOrProvince}{" "}
										{shippingAddress.zipCode}
									</div>
									<div>{shippingAddress.country}</div>
									{shippingAddress.phone && <div>Phone: {shippingAddress.phone}</div>}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Payment Info */}
					<Card>
						<CardHeader>
							<CardTitle>Payment</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div>
								<div className="text-sm text-muted-foreground">Payment Method</div>
								<div className="font-medium">{order.paymentMethod || "N/A"}</div>
							</div>
							{order.payments.length > 0 && (
								<div>
									<div className="text-sm text-muted-foreground">Payment Status</div>
									<div className="font-medium capitalize">{order.payments[0].status}</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Shipping Info */}
					{order.shipments.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Shipping</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								{order.shipments.map((shipment) => (
									<div key={shipment.id}>
										<div className="text-sm text-muted-foreground">Tracking Number</div>
										<div className="font-medium">{shipment.trackingNumber || "Not available"}</div>
										<div className="text-sm text-muted-foreground mt-2">Status</div>
										<div className="font-medium capitalize">{shipment.status}</div>
									</div>
								))}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
