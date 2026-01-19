"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteShippingProvider } from "@/actions/admin/shipping-providers";
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

interface DeleteShippingProviderDialogProps {
	providerId: string;
	providerName: string;
}

export function DeleteShippingProviderDialog({
	providerId,
	providerName,
}: DeleteShippingProviderDialogProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const handleDelete = async () => {
		setIsLoading(true);

		try {
			await deleteShippingProvider(providerId);
			toast.success("Shipping provider deleted successfully");
			setOpen(false);
			router.refresh();
		} catch (error) {
			console.error("Failed to delete shipping provider:", error);
			toast.error("Failed to delete shipping provider");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Trash2 className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Shipping Provider</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete <strong>{providerName}</strong>? This action cannot be
						undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
