"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteCategory } from "@/actions/admin/categories";
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

export function DeleteCategoryButton({ id }: { id: string }) {
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
					<AlertDialogTitle>確定要刪除此分類嗎？</AlertDialogTitle>
					<AlertDialogDescription>此操作將會把分類標記為已刪除。</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>取消</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => startTransition(() => deleteCategory(id))}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						刪除
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
