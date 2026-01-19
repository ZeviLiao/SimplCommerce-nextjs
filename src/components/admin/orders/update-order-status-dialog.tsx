"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/admin/orders";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ORDER_STATUSES = [
	{ value: "new", label: "New" },
	{ value: "pending_payment", label: "Pending Payment" },
	{ value: "processing", label: "Processing" },
	{ value: "shipped", label: "Shipped" },
	{ value: "delivered", label: "Delivered" },
	{ value: "completed", label: "Completed" },
	{ value: "cancelled", label: "Cancelled" },
	{ value: "refunded", label: "Refunded" },
];

interface UpdateOrderStatusDialogProps {
	orderId: string;
	currentStatus: string;
	userId: string;
}

export function UpdateOrderStatusDialog({
	orderId,
	currentStatus,
	userId,
}: UpdateOrderStatusDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [newStatus, setNewStatus] = useState(currentStatus);
	const [note, setNote] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newStatus === currentStatus) {
			toast.error("Please select a different status");
			return;
		}

		setIsLoading(true);

		try {
			await updateOrderStatus({
				orderId,
				newStatus,
				note: note.trim() || undefined,
				userId,
			});

			toast.success("Order status updated successfully");
			setOpen(false);
			setNote("");
			router.refresh();
		} catch (error) {
			console.error("Failed to update order status:", error);
			toast.error("Failed to update order status");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					Update Status
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Update Order Status</DialogTitle>
						<DialogDescription>
							Change the status of this order and optionally add a note.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="status">New Status</Label>
							<Select value={newStatus} onValueChange={setNewStatus}>
								<SelectTrigger id="status">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									{ORDER_STATUSES.map((status) => (
										<SelectItem key={status.value} value={status.value}>
											{status.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="note">Note (Optional)</Label>
							<Textarea
								id="note"
								placeholder="Add a note about this status change..."
								value={note}
								onChange={(e) => setNote(e.target.value)}
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Update Status
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
