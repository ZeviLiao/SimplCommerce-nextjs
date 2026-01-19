"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cancelOrder } from "@/actions/orders";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CancelOrderButtonProps {
	orderId: string;
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const handleCancel = async () => {
		setIsLoading(true);
		try {
			const result = await cancelOrder(orderId);

			if (result.success) {
				toast({
					title: "Order cancelled",
					description: result.message || "Your order has been cancelled successfully.",
				});
				router.refresh();
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to cancel order",
					variant: "destructive",
				});
			}
		} catch (_error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="sm" disabled={isLoading}>
					<X className="w-4 h-4 mr-2" />
					Cancel Order
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Cancel Order</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to cancel this order? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>No, keep order</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleCancel}
						disabled={isLoading}
						className="bg-destructive hover:bg-destructive/90"
					>
						{isLoading ? "Cancelling..." : "Yes, cancel order"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
