import { Badge } from "@/components/ui/badge";

type OrderStatus =
	| "new"
	| "pending_payment"
	| "processing"
	| "shipped"
	| "delivered"
	| "completed"
	| "cancelled"
	| "refunded";

interface OrderStatusBadgeProps {
	status: OrderStatus;
}

const statusConfig: Record<
	OrderStatus,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	new: { label: "New", variant: "default" },
	pending_payment: { label: "Pending Payment", variant: "secondary" },
	processing: { label: "Processing", variant: "default" },
	shipped: { label: "Shipped", variant: "default" },
	delivered: { label: "Delivered", variant: "default" },
	completed: { label: "Completed", variant: "default" },
	cancelled: { label: "Cancelled", variant: "destructive" },
	refunded: { label: "Refunded", variant: "outline" },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
	const config = statusConfig[status] || {
		label: status,
		variant: "outline" as const,
	};

	return <Badge variant={config.variant}>{config.label}</Badge>;
}
