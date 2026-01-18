"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBrand } from "@/actions/admin/brands";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface Brand {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	isPublished: boolean;
}

interface BrandsTableProps {
	brands: Brand[];
}

export function BrandsTable({ brands }: BrandsTableProps) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const handleDelete = async (id: string, name: string) => {
		if (!confirm(`確定要刪除品牌「${name}」嗎？`)) {
			return;
		}

		setIsDeleting(id);
		try {
			await deleteBrand(id);
			router.refresh();
		} catch (error) {
			console.error("Failed to delete brand:", error);
			alert("刪除品牌失敗");
		} finally {
			setIsDeleting(null);
		}
	};

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>名稱</TableHead>
						<TableHead>Slug</TableHead>
						<TableHead>描述</TableHead>
						<TableHead>狀態</TableHead>
						<TableHead className="text-right">操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{brands.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center text-muted-foreground">
								尚無品牌資料
							</TableCell>
						</TableRow>
					) : (
						brands.map((brand) => (
							<TableRow key={brand.id}>
								<TableCell className="font-medium">{brand.name}</TableCell>
								<TableCell>{brand.slug}</TableCell>
								<TableCell>
									{brand.description ? (
										<span className="line-clamp-1">{brand.description}</span>
									) : (
										<span className="text-muted-foreground">-</span>
									)}
								</TableCell>
								<TableCell>
									<span
										className={`text-xs px-2 py-1 rounded ${
											brand.isPublished
												? "bg-green-100 text-green-700"
												: "bg-gray-100 text-gray-700"
										}`}
									>
										{brand.isPublished ? "已發布" : "草稿"}
									</span>
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>操作</DropdownMenuLabel>
											<DropdownMenuItem asChild>
												<Link href={`/admin/brands/${brand.id}`}>
													<Edit className="h-4 w-4 mr-2" />
													編輯
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => handleDelete(brand.id, brand.name)}
												disabled={isDeleting === brand.id}
												className="text-red-600"
											>
												<Trash className="h-4 w-4 mr-2" />
												{isDeleting === brand.id ? "刪除中..." : "刪除"}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
