import { Eye, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getOrderStats, getOrders, getOrdersCount } from "@/actions/admin/orders";
import { OrderSearch } from "@/components/admin/orders/order-search";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
	title: "Orders - Admin",
	description: "Manage orders",
};

interface PageProps {
	searchParams: Promise<{
		status?: string;
		search?: string;
		page?: string;
	}>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const limit = 20;
	const offset = (page - 1) * limit;
	const status = params.status || "all";

	const [orders, totalCount, stats] = await Promise.all([
		getOrders({
			status,
			search: params.search,
			limit,
			offset,
		}),
		getOrdersCount({
			status,
			search: params.search,
		}),
		getOrderStats(),
	]);

	const totalPages = Math.ceil(totalCount / limit);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Orders</h1>
				<p className="text-muted-foreground">Manage and track customer orders</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalOrders}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Today&apos;s Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.todayOrders}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.pendingOrders}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardHeader>
					<CardTitle>Search and Filter</CardTitle>
					<CardDescription>Search orders and filter by status</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<OrderSearch />
					<div className="flex gap-4">
						<Select defaultValue={status}>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Orders</SelectItem>
								<SelectItem value="new">New</SelectItem>
								<SelectItem value="pending_payment">Pending Payment</SelectItem>
								<SelectItem value="processing">Processing</SelectItem>
								<SelectItem value="shipped">Shipped</SelectItem>
								<SelectItem value="delivered">Delivered</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
								<SelectItem value="refunded">Refunded</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Orders Table */}
			<Card>
				<CardHeader>
					<CardTitle>Orders</CardTitle>
					<CardDescription>
						Showing {orders.length} of {totalCount} orders
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order Number</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Total</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center text-muted-foreground">
										No orders found
									</TableCell>
								</TableRow>
							) : (
								orders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-medium">{order.orderNumber}</TableCell>
										<TableCell>
											<div>
												<div className="font-medium">{order.customer.name}</div>
												<div className="text-sm text-muted-foreground">{order.customer.email}</div>
											</div>
										</TableCell>
										<TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
										<TableCell>
											<OrderStatusBadge status={order.status} size="sm" />
										</TableCell>
										<TableCell className="text-right font-medium">
											${Number(order.orderTotal).toFixed(2)}
										</TableCell>
										<TableCell className="text-right">
											<Button variant="ghost" size="sm" asChild>
												<Link href={`/admin/orders/${order.id}`}>
													<Eye className="h-4 w-4" />
												</Link>
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between mt-4">
							<p className="text-sm text-muted-foreground">
								Page {page} of {totalPages}
							</p>
							<div className="flex gap-2">
								{page > 1 && (
									<Button variant="outline" size="sm" asChild>
										<Link
											href={`/admin/orders?page=${page - 1}${status !== "all" ? `&status=${status}` : ""}`}
										>
											Previous
										</Link>
									</Button>
								)}
								{page < totalPages && (
									<Button variant="outline" size="sm" asChild>
										<Link
											href={`/admin/orders?page=${page + 1}${status !== "all" ? `&status=${status}` : ""}`}
										>
											Next
										</Link>
									</Button>
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
