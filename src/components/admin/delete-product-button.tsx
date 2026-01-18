"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteProduct } from "@/actions/admin/products";
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

export function DeleteProductButton({ id }: { id: string }) {
	const [isPending, startTransition] = useTransition();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="icon" disabled={isPending}>
					<Trash2 className="h-4 w-4 text-destructive" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>確定要刪除此商品嗎？</AlertDialogTitle>
					<AlertDialogDescription>
						此操作將會把商品標記為已刪除，但不會從資料庫中永久移除。
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>取消</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => startTransition(() => deleteProduct(id))}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						刪除
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
