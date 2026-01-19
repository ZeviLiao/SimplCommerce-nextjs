import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
	status: string;
	size?: "sm" | "md" | "lg";
}

const statusConfig = {
	new: {
		label: "New",
		variant: "default" as const,
	},
	pending_payment: {
		label: "Pending Payment",
		variant: "secondary" as const,
	},
	processing: {
		label: "Processing",
		variant: "default" as const,
	},
	shipped: {
		label: "Shipped",
		variant: "default" as const,
	},
	delivered: {
		label: "Delivered",
		variant: "default" as const,
	},
	completed: {
		label: "Completed",
		variant: "default" as const,
	},
	cancelled: {
		label: "Cancelled",
		variant: "destructive" as const,
	},
	refunded: {
		label: "Refunded",
		variant: "secondary" as const,
	},
};

export function OrderStatusBadge({ status, size = "md" }: OrderStatusBadgeProps) {
	const config = statusConfig[status as keyof typeof statusConfig] || {
		label: status,
		variant: "default" as const,
	};

	const sizeClasses = {
		sm: "text-xs px-2 py-0.5",
		md: "text-sm px-2.5 py-0.5",
		lg: "text-base px-3 py-1",
	};

	return (
		<Badge variant={config.variant} className={sizeClasses[size]}>
			{config.label}
		</Badge>
	);
}
